// Local Storage utility for data persistence
import { Product, StoreInfo, BillItem } from '../App';

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

// Generic storage functions
export const storage = {
  // Products
  getProducts: (): Product[] => {
    const data = localStorage.getItem(KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },
  setProducts: (products: Product[]) => {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },
  
  // Get top selling products (based on stock sold or random for demo)
  getTopProducts: (): Product[] => {
    const products = storage.getProducts();
    // For demo: return first 10 products. In production, this would be based on sales data
    return products.slice(0, 10).sort((a, b) => b.price - a.price);
  },

  // Store Info
  getStoreInfo: (): StoreInfo | null => {
    const data = localStorage.getItem(KEYS.STORE_INFO);
    return data ? JSON.parse(data) : null;
  },
  setStoreInfo: (storeInfo: StoreInfo) => {
    localStorage.setItem(KEYS.STORE_INFO, JSON.stringify(storeInfo));
  },

  // Bills
  getBills: (): Bill[] => {
    const data = localStorage.getItem(KEYS.BILLS);
    return data ? JSON.parse(data) : [];
  },
  setBills: (bills: Bill[]) => {
    localStorage.setItem(KEYS.BILLS, JSON.stringify(bills));
  },
  addBill: (bill: Bill) => {
    const bills = storage.getBills();
    bills.unshift(bill);
    storage.setBills(bills);
  },

  // Customers
  getCustomers: (): Customer[] => {
    const data = localStorage.getItem(KEYS.CUSTOMERS);
    return data ? JSON.parse(data) : [];
  },
  setCustomers: (customers: Customer[]) => {
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
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

  // Khata
  getKhataEntries: (): KhataEntry[] => {
    const data = localStorage.getItem(KEYS.KHATA);
    return data ? JSON.parse(data) : [];
  },
  setKhataEntries: (entries: KhataEntry[]) => {
    localStorage.setItem(KEYS.KHATA, JSON.stringify(entries));
  },
  addKhataEntry: (entry: KhataEntry) => {
    const entries = storage.getKhataEntries();
    entries.unshift(entry);
    storage.setKhataEntries(entries);
  },

  // Expenses
  getExpenses: (): Expense[] => {
    const data = localStorage.getItem(KEYS.EXPENSES);
    return data ? JSON.parse(data) : [];
  },
  setExpenses: (expenses: Expense[]) => {
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
  },
  addExpense: (expense: Expense) => {
    const expenses = storage.getExpenses();
    expenses.unshift(expense);
    storage.setExpenses(expenses);
  },

  // Parties
  getParties: (): Party[] => {
    const data = localStorage.getItem(KEYS.PARTIES);
    return data ? JSON.parse(data) : [];
  },
  setParties: (parties: Party[]) => {
    localStorage.setItem(KEYS.PARTIES, JSON.stringify(parties));
  },
  addParty: (party: Party) => {
    const parties = storage.getParties();
    parties.push(party);
    storage.setParties(parties);
  },

  // Settings & Auth
  getSettings: (): { language: 'en' | 'hi' } => {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : { language: 'en' };
  },
  setSettings: (settings: { language: 'en' | 'hi' }) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
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

  // Clear all data
  clearAll: () => {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
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