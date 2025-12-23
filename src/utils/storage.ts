// Local Storage utility for data persistence
import type { Product, StoreInfo, BillItem } from '../types';
import { localStorageProvider } from './localStorageProvider';
import { productsApi, customersApi, billsApi, storeApi, isOnline } from './supabaseApi';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalPurchases: number;
  lastVisit: string;
}

export interface Bill {
  id: string;
  billNumber: string;
  items: BillItem[];
  customer?: Customer;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Credit';
  date: string;
  time: string;
}

export interface KhataEntry {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: string;
  billId?: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod: string;
  partyName?: string;
}

export interface Party {
  id: string;
  name: string;
  phone: string;
  type: 'Supplier' | 'Vendor' | 'Service Provider';
  totalPurchases: number;
  pendingAmount: number;
}

// Storage keys
const KEYS = {
  PRODUCTS: 'retail_bandhu_products',
  STORE_INFO: 'retail_bandhu_store_info',
  BILLS: 'retail_bandhu_bills',
  CUSTOMERS: 'retail_bandhu_customers',
  KHATA: 'retail_bandhu_khata',
  EXPENSES: 'retail_bandhu_expenses',
  PARTIES: 'retail_bandhu_parties',
  SETTINGS: 'retail_bandhu_settings',
  ONBOARDING: 'retail_bandhu_onboarding_done',
  LOGIN: 'retail_bandhu_logged_in',
  STORE_SETUP: 'retail_bandhu_store_setup_done',
};

/**
 * Safe localStorage access with error handling
 */
const safeGet = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return defaultValue;
  }
};

const safeSet = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key}:`, error);
  }
};

// Generic storage functions
export const storage = {
  // Products - Synchronous (backward compatible)
  getProducts: (): Product[] => {
    return safeGet<Product[]>(KEYS.PRODUCTS, []);
  },
  setProducts: (products: Product[]) => {
    safeSet(KEYS.PRODUCTS, products);
  },
  
  // Products - Async (new, enhanced)
  async getProductsAsync(): Promise<Product[]> {
    return await localStorageProvider.getProducts();
  },
  async addProductAsync(product: Product): Promise<void> {
    await localStorageProvider.addProduct(product);
  },
  async updateProductAsync(id: string, data: Partial<Product>): Promise<void> {
    await localStorageProvider.updateProduct(id, data);
  },
  async deleteProductAsync(id: string): Promise<void> {
    await localStorageProvider.deleteProduct(id);
  },
  async searchProductsAsync(query: string): Promise<Product[]> {
    return await localStorageProvider.searchProducts(query);
  },
  
  // Get top selling products (based on stock sold or random for demo)
  getTopProducts: (): Product[] => {
    const products = storage.getProducts();
    // For demo: return first 10 products. In production, this would be based on sales data
    return products.slice(0, 10).sort((a, b) => b.price - a.price);
  },

  // Store Info - Synchronous
  getStoreInfo: (): StoreInfo | null => {
    return safeGet<StoreInfo | null>(KEYS.STORE_INFO, null);
  },
  setStoreInfo: (storeInfo: StoreInfo) => {
    safeSet(KEYS.STORE_INFO, storeInfo);
  },
  
  // Store Info - Async
  async getStoreInfoAsync(): Promise<StoreInfo | null> {
    return await localStorageProvider.getStoreInfo();
  },
  async setStoreInfoAsync(info: StoreInfo): Promise<void> {
    await localStorageProvider.setStoreInfo(info);
  },

  // Bills - Synchronous
  getBills: (): Bill[] => {
    return safeGet<Bill[]>(KEYS.BILLS, []);
  },
  setBills: (bills: Bill[]) => {
    safeSet(KEYS.BILLS, bills);
  },
  addBill: (bill: Bill) => {
    const bills = storage.getBills();
    bills.unshift(bill);
    storage.setBills(bills);
  },

  // Customers - Synchronous
  getCustomers: (): Customer[] => {
    return safeGet<Customer[]>(KEYS.CUSTOMERS, []);
  },
  setCustomers: (customers: Customer[]) => {
    safeSet(KEYS.CUSTOMERS, customers);
  },
  addCustomer: (customer: Customer) => {
    const customers = storage.getCustomers();
    customers.push(customer);
    storage.setCustomers(customers);
  },
  updateCustomer: (id: string, updates: Partial<Customer>) => {
    const customers = storage.getCustomers();
    const index = customers.findIndex(c => c.id === id);
    if (index !== -1) {
      customers[index] = { ...customers[index], ...updates };
      storage.setCustomers(customers);
    }
  },
  
  // Customers - Async
  async getCustomersAsync(): Promise<Customer[]> {
    // Convert our Customer type to match the provider's Customer type
    const customers = await localStorageProvider.getCustomers();
    return customers as any; // Type bridging
  },
  async addCustomerAsync(customer: Customer): Promise<void> {
    await localStorageProvider.addCustomer(customer as any);
  },

  // Khata - Synchronous
  getKhataEntries: (): KhataEntry[] => {
    return safeGet<KhataEntry[]>(KEYS.KHATA, []);
  },
  setKhataEntries: (entries: KhataEntry[]) => {
    safeSet(KEYS.KHATA, entries);
  },
  addKhataEntry: (entry: KhataEntry) => {
    const entries = storage.getKhataEntries();
    entries.unshift(entry);
    storage.setKhataEntries(entries);
  },

  // Expenses - Synchronous
  getExpenses: (): Expense[] => {
    return safeGet<Expense[]>(KEYS.EXPENSES, []);
  },
  setExpenses: (expenses: Expense[]) => {
    safeSet(KEYS.EXPENSES, expenses);
  },
  addExpense: (expense: Expense) => {
    const expenses = storage.getExpenses();
    expenses.unshift(expense);
    storage.setExpenses(expenses);
  },
  
  // Expenses - Async
  async getExpensesAsync(): Promise<Expense[]> {
    return await localStorageProvider.getExpenses();
  },
  async addExpenseAsync(expense: Expense): Promise<void> {
    await localStorageProvider.addExpense(expense);
  },

  // Parties - Synchronous
  getParties: (): Party[] => {
    return safeGet<Party[]>(KEYS.PARTIES, []);
  },
  setParties: (parties: Party[]) => {
    safeSet(KEYS.PARTIES, parties);
  },
  addParty: (party: Party) => {
    const parties = storage.getParties();
    parties.push(party);
    storage.setParties(parties);
  },

  // Settings & Auth
  getSettings: (): { language: 'en' | 'hi' } => {
    return safeGet<{ language: 'en' | 'hi' }>(KEYS.SETTINGS, { language: 'en' });
  },
  setSettings: (settings: { language: 'en' | 'hi' }) => {
    safeSet(KEYS.SETTINGS, settings);
  },

  getOnboardingDone: (): boolean => {
    return localStorage.getItem(KEYS.ONBOARDING) === 'true';
  },
  setOnboardingDone: (done: boolean) => {
    localStorage.setItem(KEYS.ONBOARDING, done.toString());
  },

  getLoggedIn: (): boolean => {
    return localStorage.getItem(KEYS.LOGIN) === 'true';
  },
  setLoggedIn: (loggedIn: boolean) => {
    localStorage.setItem(KEYS.LOGIN, loggedIn.toString());
  },

  getStoreSetupDone: (): boolean => {
    return localStorage.getItem(KEYS.STORE_SETUP) === 'true';
  },
  setStoreSetupDone: (done: boolean) => {
    localStorage.setItem(KEYS.STORE_SETUP, done.toString());
  },

  // Clear all data - Enhanced
  clearAll: () => {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  },
  
  // Async version with provider
  async clearAllAsync(): Promise<void> {
    await localStorageProvider.clearAllData();
    storage.clearAll(); // Clear auth/settings too
  },
  
  // Export/Import - Async
  async exportDataAsync(): Promise<any> {
    return await localStorageProvider.exportData();
  },
  
  async importDataAsync(data: any): Promise<void> {
    await localStorageProvider.importData(data);
  },
};

// Export utility functions
export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

export const generateBillNumber = (): string => {
  const bills = storage.getBills();
  const lastBillNumber = bills.length > 0 ? parseInt(bills[0].billNumber.replace('RB', '')) : 0;
  return `RB${String(lastBillNumber + 1).padStart(6, '0')}`;
};