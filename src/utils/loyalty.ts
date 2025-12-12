// Loyalty Program System

export interface LoyaltyConfig {
  enabled: boolean;
  pointsPerRupee: number; // e.g., 1 point per 100 rupees
  redeemRate: number; // e.g., 1 rupee per 10 points
  minPurchaseForPoints: number; // minimum purchase amount to earn points
  minPointsToRedeem: number; // minimum points required for redemption
  bonusTiers: BonusTier[];
}

export interface BonusTier {
  name: string;
  minSpend: number;
  bonusMultiplier: number; // e.g., 1.5x points
  color: string;
}

export interface CustomerLoyalty {
  customerId: string;
  customerName: string;
  totalPoints: number;
  lifetimeSpend: number;
  currentTier: string;
  pointsHistory: PointsTransaction[];
}

export interface PointsTransaction {
  id: string;
  date: string;
  type: 'earned' | 'redeemed' | 'bonus' | 'expired';
  points: number;
  description: string;
  orderId?: string;
}

// Default loyalty configuration
export const DEFAULT_LOYALTY_CONFIG: LoyaltyConfig = {
  enabled: true,
  pointsPerRupee: 1, // 1 point per 100 rupees (1/100)
  redeemRate: 0.1, // 1 rupee per 10 points
  minPurchaseForPoints: 50,
  minPointsToRedeem: 100,
  bonusTiers: [
    { name: 'Bronze', minSpend: 0, bonusMultiplier: 1, color: '#CD7F32' },
    { name: 'Silver', minSpend: 10000, bonusMultiplier: 1.25, color: '#C0C0C0' },
    { name: 'Gold', minSpend: 50000, bonusMultiplier: 1.5, color: '#FFD700' },
    { name: 'Platinum', minSpend: 100000, bonusMultiplier: 2, color: '#E5E4E2' }
  ]
};

export function calculatePointsEarned(
  purchaseAmount: number,
  config: LoyaltyConfig,
  currentTier: BonusTier
): number {
  if (!config.enabled || purchaseAmount < config.minPurchaseForPoints) {
    return 0;
  }
  
  const basePoints = (purchaseAmount / 100) * config.pointsPerRupee;
  const bonusPoints = basePoints * currentTier.bonusMultiplier;
  
  return Math.floor(bonusPoints);
}

export function calculateRedemptionValue(
  points: number,
  config: LoyaltyConfig
): number {
  if (points < config.minPointsToRedeem) {
    return 0;
  }
  
  return Math.floor(points * config.redeemRate);
}

export function getCurrentTier(
  lifetimeSpend: number,
  config: LoyaltyConfig
): BonusTier {
  const tiers = [...config.bonusTiers].sort((a, b) => b.minSpend - a.minSpend);
  
  for (const tier of tiers) {
    if (lifetimeSpend >= tier.minSpend) {
      return tier;
    }
  }
  
  return config.bonusTiers[0];
}

export function getNextTier(
  currentTier: BonusTier,
  config: LoyaltyConfig
): { tier: BonusTier; amountNeeded: number } | null {
  const sortedTiers = [...config.bonusTiers].sort((a, b) => a.minSpend - b.minSpend);
  const currentIndex = sortedTiers.findIndex(t => t.name === currentTier.name);
  
  if (currentIndex < 0 || currentIndex >= sortedTiers.length - 1) {
    return null;
  }
  
  const nextTier = sortedTiers[currentIndex + 1];
  return {
    tier: nextTier,
    amountNeeded: nextTier.minSpend - currentTier.minSpend
  };
}

// Storage keys
const LOYALTY_CONFIG_KEY = 'rb_loyalty_config';
const CUSTOMER_LOYALTY_KEY = 'rb_customer_loyalty';

export const loyaltyStorage = {
  getConfig: (): LoyaltyConfig => {
    const saved = localStorage.getItem(LOYALTY_CONFIG_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return DEFAULT_LOYALTY_CONFIG;
  },
  
  setConfig: (config: LoyaltyConfig) => {
    localStorage.setItem(LOYALTY_CONFIG_KEY, JSON.stringify(config));
  },
  
  getCustomerLoyalty: (customerId: string): CustomerLoyalty | null => {
    const allLoyalty = localStorage.getItem(CUSTOMER_LOYALTY_KEY);
    if (!allLoyalty) return null;
    
    const loyalty: CustomerLoyalty[] = JSON.parse(allLoyalty);
    return loyalty.find(l => l.customerId === customerId) || null;
  },
  
  getAllCustomerLoyalty: (): CustomerLoyalty[] => {
    const saved = localStorage.getItem(CUSTOMER_LOYALTY_KEY);
    return saved ? JSON.parse(saved) : [];
  },
  
  updateCustomerLoyalty: (customerLoyalty: CustomerLoyalty) => {
    const all = loyaltyStorage.getAllCustomerLoyalty();
    const index = all.findIndex(l => l.customerId === customerLoyalty.customerId);
    
    if (index >= 0) {
      all[index] = customerLoyalty;
    } else {
      all.push(customerLoyalty);
    }
    
    localStorage.setItem(CUSTOMER_LOYALTY_KEY, JSON.stringify(all));
  },
  
  addPointsTransaction: (
    customerId: string,
    transaction: Omit<PointsTransaction, 'id'>
  ) => {
    const loyalty = loyaltyStorage.getCustomerLoyalty(customerId);
    if (!loyalty) return;
    
    const newTransaction: PointsTransaction = {
      ...transaction,
      id: `pt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    loyalty.pointsHistory.unshift(newTransaction);
    
    // Update total points
    if (transaction.type === 'earned' || transaction.type === 'bonus') {
      loyalty.totalPoints += transaction.points;
    } else if (transaction.type === 'redeemed') {
      loyalty.totalPoints -= transaction.points;
    }
    
    loyaltyStorage.updateCustomerLoyalty(loyalty);
  }
};

// Award points for a purchase
export function awardPointsForPurchase(
  customerId: string,
  customerName: string,
  purchaseAmount: number,
  orderId: string
): number {
  const config = loyaltyStorage.getConfig();
  if (!config.enabled) return 0;
  
  let loyalty = loyaltyStorage.getCustomerLoyalty(customerId);
  
  // Create new loyalty record if doesn't exist
  if (!loyalty) {
    loyalty = {
      customerId,
      customerName,
      totalPoints: 0,
      lifetimeSpend: 0,
      currentTier: DEFAULT_LOYALTY_CONFIG.bonusTiers[0].name,
      pointsHistory: []
    };
  }
  
  // Update lifetime spend
  loyalty.lifetimeSpend += purchaseAmount;
  
  // Calculate tier
  const currentTier = getCurrentTier(loyalty.lifetimeSpend, config);
  loyalty.currentTier = currentTier.name;
  
  // Calculate points
  const pointsEarned = calculatePointsEarned(purchaseAmount, config, currentTier);
  
  if (pointsEarned > 0) {
    loyalty.totalPoints += pointsEarned;
    
    // Add transaction
    loyalty.pointsHistory.unshift({
      id: `pt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
      type: 'earned',
      points: pointsEarned,
      description: `Earned from purchase of ₹${purchaseAmount}`,
      orderId
    });
    
    loyaltyStorage.updateCustomerLoyalty(loyalty);
  }
  
  return pointsEarned;
}

// Redeem points
export function redeemPoints(
  customerId: string,
  pointsToRedeem: number
): { success: boolean; value: number; message: string } {
  const config = loyaltyStorage.getConfig();
  const loyalty = loyaltyStorage.getCustomerLoyalty(customerId);
  
  if (!loyalty) {
    return { success: false, value: 0, message: 'Customer not found' };
  }
  
  if (pointsToRedeem < config.minPointsToRedeem) {
    return { 
      success: false, 
      value: 0, 
      message: `Minimum ${config.minPointsToRedeem} points required` 
    };
  }
  
  if (loyalty.totalPoints < pointsToRedeem) {
    return { 
      success: false, 
      value: 0, 
      message: 'Insufficient points' 
    };
  }
  
  const redemptionValue = calculateRedemptionValue(pointsToRedeem, config);
  
  loyalty.totalPoints -= pointsToRedeem;
  loyalty.pointsHistory.unshift({
    id: `pt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    date: new Date().toISOString(),
    type: 'redeemed',
    points: pointsToRedeem,
    description: `Redeemed for ₹${redemptionValue} discount`
  });
  
  loyaltyStorage.updateCustomerLoyalty(loyalty);
  
  return { 
    success: true, 
    value: redemptionValue, 
    message: `Successfully redeemed ${pointsToRedeem} points for ₹${redemptionValue}` 
  };
}
