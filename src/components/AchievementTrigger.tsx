import { useEffect } from 'react';
import { useAchievements } from './AchievementSystem';

interface AchievementTriggerProps {
  // Track various app events
  isLoggedIn?: boolean;
  storeSetup?: boolean;
  productCount?: number;
  billCount?: number;
  customerCount?: number;
  totalRevenue?: number;
  voiceBillingUsed?: boolean;
  voiceSearchUsed?: boolean;
  darkModeEnabled?: boolean;
  adminUnlocked?: boolean;
  bulkImportUsed?: boolean;
  loyaltyActivated?: boolean;
  lowStockAlertSet?: boolean;
  exportUsed?: boolean;
  keyboardShortcutsUsed?: number;
  consecutiveDays?: number;
  featuresUsed?: number;
}

export function AchievementTrigger(props: AchievementTriggerProps) {
  const { unlockAchievement } = useAchievements();

  // Track first login
  useEffect(() => {
    if (props.isLoggedIn) {
      const firstLoginChecked = localStorage.getItem('achievement-first-login-checked');
      if (!firstLoginChecked) {
        unlockAchievement('first-login');
        localStorage.setItem('achievement-first-login-checked', 'true');
      }
    }
  }, [props.isLoggedIn, unlockAchievement]);

  // Track store setup
  useEffect(() => {
    if (props.storeSetup) {
      unlockAchievement('store-setup');
    }
  }, [props.storeSetup, unlockAchievement]);

  // Track products
  useEffect(() => {
    if (props.productCount !== undefined) {
      if (props.productCount >= 1) {
        unlockAchievement('first-product');
      }
      if (props.productCount >= 10) {
        unlockAchievement('inventory-10', props.productCount);
      }
      if (props.productCount >= 50) {
        unlockAchievement('inventory-50', props.productCount);
      }
    }
  }, [props.productCount, unlockAchievement]);

  // Track bills/sales
  useEffect(() => {
    if (props.billCount !== undefined) {
      if (props.billCount >= 1) {
        unlockAchievement('first-bill');
      }
      if (props.billCount >= 10) {
        unlockAchievement('sales-10', props.billCount);
      }
      if (props.billCount >= 50) {
        unlockAchievement('sales-50', props.billCount);
      }
      if (props.billCount >= 100) {
        unlockAchievement('sales-100', props.billCount);
      }
    }
  }, [props.billCount, unlockAchievement]);

  // Track customers
  useEffect(() => {
    if (props.customerCount !== undefined) {
      if (props.customerCount >= 1) {
        unlockAchievement('first-customer');
      }
      if (props.customerCount >= 10) {
        unlockAchievement('customers-10', props.customerCount);
      }
    }
  }, [props.customerCount, unlockAchievement]);

  // Track revenue
  useEffect(() => {
    if (props.totalRevenue !== undefined && props.totalRevenue >= 100000) {
      unlockAchievement('revenue-milestone', props.totalRevenue);
    }
  }, [props.totalRevenue, unlockAchievement]);

  // Track voice billing
  useEffect(() => {
    if (props.voiceBillingUsed) {
      unlockAchievement('voice-billing-first');
    }
  }, [props.voiceBillingUsed, unlockAchievement]);

  // Track voice search
  useEffect(() => {
    if (props.voiceSearchUsed) {
      unlockAchievement('voice-search');
    }
  }, [props.voiceSearchUsed, unlockAchievement]);

  // Track dark mode
  useEffect(() => {
    if (props.darkModeEnabled) {
      unlockAchievement('dark-mode');
    }
  }, [props.darkModeEnabled, unlockAchievement]);

  // Track admin unlock
  useEffect(() => {
    if (props.adminUnlocked) {
      unlockAchievement('admin-unlocked');
    }
  }, [props.adminUnlocked, unlockAchievement]);

  // Track bulk import
  useEffect(() => {
    if (props.bulkImportUsed) {
      unlockAchievement('bulk-import');
    }
  }, [props.bulkImportUsed, unlockAchievement]);

  // Track loyalty program
  useEffect(() => {
    if (props.loyaltyActivated) {
      unlockAchievement('loyalty-activated');
    }
  }, [props.loyaltyActivated, unlockAchievement]);

  // Track low stock alert
  useEffect(() => {
    if (props.lowStockAlertSet) {
      unlockAchievement('low-stock-alert');
    }
  }, [props.lowStockAlertSet, unlockAchievement]);

  // Track export usage
  useEffect(() => {
    if (props.exportUsed) {
      unlockAchievement('export-report');
    }
  }, [props.exportUsed, unlockAchievement]);

  // Track keyboard shortcuts
  useEffect(() => {
    if (props.keyboardShortcutsUsed !== undefined && props.keyboardShortcutsUsed >= 5) {
      unlockAchievement('keyboard-shortcuts');
    }
  }, [props.keyboardShortcutsUsed, unlockAchievement]);

  // Track consecutive days
  useEffect(() => {
    if (props.consecutiveDays !== undefined && props.consecutiveDays >= 7) {
      unlockAchievement('week-streak', props.consecutiveDays);
    }
  }, [props.consecutiveDays, unlockAchievement]);

  // Track features used
  useEffect(() => {
    if (props.featuresUsed !== undefined && props.featuresUsed >= 20) {
      unlockAchievement('all-features', props.featuresUsed);
    }
  }, [props.featuresUsed, unlockAchievement]);

  return null; // This is a logic-only component
}
