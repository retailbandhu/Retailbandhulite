import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c4099df5/admin`;

// Cache for content to avoid excessive API calls
let contentCache: {
  landingPage?: any;
  features?: any[];
  testimonials?: any[];
  pricingPlans?: any[];
  lastFetch?: number;
} = {};

const CACHE_DURATION = 30000; // 30 seconds

/**
 * Fetch landing page content from CMS
 */
export async function getLandingPageContent() {
  const now = Date.now();
  
  // Return cached data if fresh
  if (contentCache.landingPage && contentCache.lastFetch && (now - contentCache.lastFetch < CACHE_DURATION)) {
    return contentCache.landingPage;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/landing-page`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` },
    });
    const data = await response.json();
    
    if (data.success) {
      contentCache.landingPage = data.data;
      contentCache.lastFetch = now;
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching landing page content:', error);
  }
  
  // Return default content if fetch fails
  return getDefaultLandingPageContent();
}

/**
 * Fetch features from CMS
 */
export async function getFeatures() {
  const now = Date.now();
  
  if (contentCache.features && contentCache.lastFetch && (now - contentCache.lastFetch < CACHE_DURATION)) {
    return contentCache.features;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/features`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` },
    });
    const data = await response.json();
    
    if (data.success && data.data.length > 0) {
      contentCache.features = data.data;
      contentCache.lastFetch = now;
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching features:', error);
  }
  
  return getDefaultFeatures();
}

/**
 * Fetch testimonials from CMS
 */
export async function getTestimonials() {
  const now = Date.now();
  
  if (contentCache.testimonials && contentCache.lastFetch && (now - contentCache.lastFetch < CACHE_DURATION)) {
    return contentCache.testimonials;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/testimonials`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` },
    });
    const data = await response.json();
    
    if (data.success && data.data.length > 0) {
      contentCache.testimonials = data.data;
      contentCache.lastFetch = now;
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching testimonials:', error);
  }
  
  return getDefaultTestimonials();
}

/**
 * Fetch pricing plans from CMS
 */
export async function getPricingPlans() {
  const now = Date.now();
  
  if (contentCache.pricingPlans && contentCache.lastFetch && (now - contentCache.lastFetch < CACHE_DURATION)) {
    return contentCache.pricingPlans;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/pricing-plans`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` },
    });
    const data = await response.json();
    
    if (data.success) {
      contentCache.pricingPlans = data.data;
      contentCache.lastFetch = now;
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
  }
  
  return getDefaultPricingPlans();
}

/**
 * Clear content cache (useful after admin updates)
 */
export function clearContentCache() {
  contentCache = {};
}

/**
 * Refresh all content
 */
export async function refreshAllContent() {
  clearContentCache();
  return Promise.all([
    getLandingPageContent(),
    getFeatures(),
    getTestimonials(),
    getPricingPlans(),
  ]);
}

// ============================================
// DEFAULT FALLBACK CONTENT
// ============================================

function getDefaultLandingPageContent() {
  return {
    hero: {
      title: "India's #1 Voice + AI Billing App",
      subtitle: "Apni Dukaan Ko Banao Digital - Sirf Apni Aawaaz Se!",
      cta: "Start Free Trial - अभी शुरू करें",
    },
    stats: {
      users: "50,000+",
      bills: "10 Lakh+",
      savings: "₹50 Cr+",
    },
  };
}

function getDefaultFeatures() {
  return [
    {
      id: '1',
      title: 'Voice Billing (आवाज से बिलिंग)',
      description: 'Just speak the items and quantities - AI creates the bill automatically. No typing needed!',
      icon: 'Mic',
    },
    {
      id: '2',
      title: 'WhatsApp Integration',
      description: 'Share bills, catalogs, and payment reminders directly on WhatsApp with one tap.',
      icon: 'MessageSquare',
    },
    {
      id: '3',
      title: 'Smart Inventory',
      description: 'Real-time stock tracking, low-stock alerts, and automated reorder suggestions.',
      icon: 'Package',
    },
    {
      id: '4',
      title: 'Digital Catalog (डिजिटल कैटलॉग)',
      description: 'Create beautiful product catalogs with photos and share with customers on WhatsApp.',
      icon: 'Grid',
    },
    {
      id: '5',
      title: 'Business Analytics',
      description: 'Daily, weekly, monthly reports with charts. Track sales, profits, and trending items.',
      icon: 'BarChart',
    },
    {
      id: '6',
      title: 'GST & Billing',
      description: 'GST-compliant bills, automatic tax calculations, and professional invoice generation.',
      icon: 'FileText',
    },
  ];
}

function getDefaultTestimonials() {
  return [
    {
      id: '1',
      name: 'Rajesh Kumar',
      business: 'Kumar General Store, Delhi',
      message: 'Voice billing is amazing! I can create bills while helping customers. Saved me so much time!',
      rating: 5,
    },
    {
      id: '2',
      name: 'Priya Sharma',
      business: 'Sharma Kirana, Mumbai',
      message: 'WhatsApp automation has increased my sales by 30%. Customers love the easy catalog sharing.',
      rating: 5,
    },
    {
      id: '3',
      name: 'Amit Patel',
      business: 'Patel Traders, Ahmedabad',
      message: 'The inventory tracking is superb. No more manual register entries. Everything is digital now!',
      rating: 5,
    },
  ];
}

function getDefaultPricingPlans() {
  return [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'Forever',
      features: [
        '50 Bills/month',
        'Basic Reports',
        'WhatsApp Support',
        'Single Device',
        'Cloud Backup',
      ],
      highlighted: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 299,
      period: 'per month',
      features: [
        'Unlimited Bills',
        'Advanced Analytics',
        'Priority Support',
        'Multi-Device Sync',
        'Custom Bill Templates',
        'Inventory Management',
        'GST Compliance',
      ],
      highlighted: true,
    },
    {
      id: 'automation',
      name: 'Automation',
      price: 599,
      period: 'per month',
      features: [
        'Everything in Pro',
        'WhatsApp Automation',
        'Auto Payment Reminders',
        'Bulk Catalog Broadcasting',
        'API Access',
        'Dedicated Account Manager',
        'Custom Integrations',
      ],
      highlighted: false,
    },
  ];
}
