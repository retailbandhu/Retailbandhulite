// Multi-language support for Hinglish interface

export type Language = 'en' | 'hi' | 'hinglish';

export const translations = {
  // Common
  dashboard: {
    en: 'Dashboard',
    hi: 'डैशबोर्ड',
    hinglish: 'Dashboard'
  },
  billing: {
    en: 'Billing',
    hi: 'बिलिंग',
    hinglish: 'Billing'
  },
  inventory: {
    en: 'Inventory',
    hi: 'इन्वेंटरी',
    hinglish: 'Inventory'
  },
  reports: {
    en: 'Reports',
    hi: 'रिपोर्ट',
    hinglish: 'Reports'
  },
  settings: {
    en: 'Settings',
    hi: 'सेटिंग्स',
    hinglish: 'Settings'
  },
  
  // Dashboard
  todaySales: {
    en: 'Today\'s Sales',
    hi: 'आज की बिक्री',
    hinglish: 'Aaj Ki Sales'
  },
  totalProducts: {
    en: 'Total Products',
    hi: 'कुल उत्पाद',
    hinglish: 'Total Products'
  },
  lowStock: {
    en: 'Low Stock Items',
    hi: 'कम स्टॉक आइटम',
    hinglish: 'Low Stock Items'
  },
  customers: {
    en: 'Customers',
    hi: 'ग्राहक',
    hinglish: 'Customers'
  },
  
  // Billing
  addItem: {
    en: 'Add Item',
    hi: 'आइटम जोड़ें',
    hinglish: 'Item Add Karo'
  },
  generateBill: {
    en: 'Generate Bill',
    hi: 'बिल बनाएं',
    hinglish: 'Bill Banao'
  },
  total: {
    en: 'Total',
    hi: 'कुल',
    hinglish: 'Total'
  },
  discount: {
    en: 'Discount',
    hi: 'छूट',
    hinglish: 'Discount'
  },
  
  // Common Actions
  save: {
    en: 'Save',
    hi: 'सेव करें',
    hinglish: 'Save Karo'
  },
  cancel: {
    en: 'Cancel',
    hi: 'रद्द करें',
    hinglish: 'Cancel'
  },
  delete: {
    en: 'Delete',
    hi: 'मिटाएं',
    hinglish: 'Delete'
  },
  edit: {
    en: 'Edit',
    hi: 'संपादित करें',
    hinglish: 'Edit'
  },
  search: {
    en: 'Search',
    hi: 'खोजें',
    hinglish: 'Search'
  },
  
  // Messages
  welcome: {
    en: 'Welcome',
    hi: 'स्वागत है',
    hinglish: 'Welcome'
  },
  success: {
    en: 'Success',
    hi: 'सफल',
    hinglish: 'Success!'
  },
  error: {
    en: 'Error',
    hi: 'त्रुटि',
    hinglish: 'Error'
  },
  
  // Notifications
  billCreated: {
    en: 'Bill created successfully',
    hi: 'बिल सफलतापूर्वक बनाया गया',
    hinglish: 'Bill ban gaya!'
  },
  itemAdded: {
    en: 'Item added to inventory',
    hi: 'आइटम इन्वेंटरी में जोड़ा गया',
    hinglish: 'Item add ho gaya!'
  },
  stockLow: {
    en: 'Stock is running low',
    hi: 'स्टॉक कम हो रहा है',
    hinglish: 'Stock khatam ho raha hai!'
  },
  
  // GST Related
  gstInvoice: {
    en: 'GST Invoice',
    hi: 'जीएसटी इनवॉइस',
    hinglish: 'GST Invoice'
  },
  gstin: {
    en: 'GSTIN',
    hi: 'जीएसटीआईएन',
    hinglish: 'GSTIN'
  },
  taxAmount: {
    en: 'Tax Amount',
    hi: 'कर राशि',
    hinglish: 'Tax Amount'
  },
  cgst: {
    en: 'CGST',
    hi: 'सीजीएसटी',
    hinglish: 'CGST'
  },
  sgst: {
    en: 'SGST',
    hi: 'एसजीएसटी',
    hinglish: 'SGST'
  },
  igst: {
    en: 'IGST',
    hi: 'आईजीएसटी',
    hinglish: 'IGST'
  },
  
  // Loyalty Program
  loyaltyProgram: {
    en: 'Loyalty Program',
    hi: 'लॉयल्टी प्रोग्राम',
    hinglish: 'Loyalty Program'
  },
  rewardPoints: {
    en: 'Reward Points',
    hi: 'रिवॉर्ड पॉइंट्स',
    hinglish: 'Reward Points'
  },
  redeemPoints: {
    en: 'Redeem Points',
    hi: 'पॉइंट्स रिडीम करें',
    hinglish: 'Points Redeem Karo'
  },
  
  // Backup
  exportData: {
    en: 'Export Data',
    hi: 'डेटा निर्यात करें',
    hinglish: 'Data Export Karo'
  },
  importData: {
    en: 'Import Data',
    hi: 'डेटा आयात करें',
    hinglish: 'Data Import Karo'
  },
  backup: {
    en: 'Backup',
    hi: 'बैकअप',
    hinglish: 'Backup'
  }
};

export function t(key: keyof typeof translations, lang: Language = 'hinglish'): string {
  return translations[key]?.[lang] || translations[key]?.en || key;
}

// Language storage
const LANGUAGE_KEY = 'rb_language';

export const languageStorage = {
  getLanguage: (): Language => {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    return (saved as Language) || 'hinglish';
  },
  setLanguage: (lang: Language) => {
    localStorage.setItem(LANGUAGE_KEY, lang);
  }
};
