// Central type definitions for Retail Bandhu
// This file prevents circular dependencies by centralizing all shared types

export type Screen = 
  | 'marketing'
  | 'splash' 
  | 'onboarding' 
  | 'login' 
  | 'store-setup' 
  | 'dashboard' 
  | 'billing' 
  | 'bill-preview'
  | 'inventory' 
  | 'catalog' 
  | 'reports' 
  | 'settings'
  | 'whatsapp'
  | 'subscription'
  | 'bill-template'
  | 'khata'
  | 'expenses'
  | 'notifications'
  | 'sales-history'
  | 'business-insights'
  | 'quick-pos'
  | 'customers'
  | 'barcode-scanner'
  | 'parties'
  | 'gst-settings'
  | 'loyalty-program'
  | 'data-backup'
  | 'reorder-alerts'
  | 'system-health'
  | 'language-switcher'
  | 'printer-setup'
  | 'about-us'
  | 'blog'
  | 'careers'
  | 'contact'
  | 'videos'
  | 'faq'
  | 'admin-panel';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

export interface BillItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface StoreInfo {
  name: string;
  owner: string;
  address: string;
  phone: string;
  logo?: string;
  billColor: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export interface Bill {
  id: string;
  billNo: number;
  customerName: string;
  total: number;
  date: string;
}
