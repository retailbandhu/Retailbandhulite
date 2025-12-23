/**
 * Data Provider Interface - Abstraction for data storage
 */

import { Product, BillItem, StoreInfo, Customer, Bill } from '../types';

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod: string;
}

export interface Party {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  balance: number;
  type: 'supplier' | 'customer';
  createdAt: string;
}

export interface KhataEntry {
  id: string;
  partyId: string;
  partyName: string;
  amount: number;
  type: 'debit' | 'credit';
  description: string;
  date: string;
}

export interface LoyaltyMember {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  joinedAt: string;
  lastVisit: string;
}

/**
 * Data Provider Interface
 * All data operations go through this interface
 */
export interface IDataProvider {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | null>;
  addProduct(product: Product): Promise<void>;
  updateProduct(id: string, data: Partial<Product>): Promise<void>;
  deleteProduct(id: string): Promise<void>;
  searchProducts(query: string): Promise<Product[]>;

  // Customers
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | null>;
  addCustomer(customer: Customer): Promise<void>;
  updateCustomer(id: string, data: Partial<Customer>): Promise<void>;
  deleteCustomer(id: string): Promise<void>;
  searchCustomers(query: string): Promise<Customer[]>;

  // Bills
  getBills(): Promise<Bill[]>;
  getBill(id: string): Promise<Bill | null>;
  addBill(bill: Bill): Promise<void>;
  updateBill(id: string, data: Partial<Bill>): Promise<void>;
  deleteBill(id: string): Promise<void>;
  getBillsByDateRange(startDate: string, endDate: string): Promise<Bill[]>;
  getBillsByCustomer(customerId: string): Promise<Bill[]>;

  // Expenses
  getExpenses(): Promise<Expense[]>;
  getExpense(id: string): Promise<Expense | null>;
  addExpense(expense: Expense): Promise<void>;
  updateExpense(id: string, data: Partial<Expense>): Promise<void>;
  deleteExpense(id: string): Promise<void>;
  getExpensesByDateRange(startDate: string, endDate: string): Promise<Expense[]>;

  // Parties (Suppliers/Customers for Khata)
  getParties(): Promise<Party[]>;
  getParty(id: string): Promise<Party | null>;
  addParty(party: Party): Promise<void>;
  updateParty(id: string, data: Partial<Party>): Promise<void>;
  deleteParty(id: string): Promise<void>;

  // Khata Entries
  getKhataEntries(): Promise<KhataEntry[]>;
  getKhataEntry(id: string): Promise<KhataEntry | null>;
  addKhataEntry(entry: KhataEntry): Promise<void>;
  updateKhataEntry(id: string, data: Partial<KhataEntry>): Promise<void>;
  deleteKhataEntry(id: string): Promise<void>;
  getKhataEntriesByParty(partyId: string): Promise<KhataEntry[]>;

  // Loyalty Program
  getLoyaltyMembers(): Promise<LoyaltyMember[]>;
  getLoyaltyMember(id: string): Promise<LoyaltyMember | null>;
  addLoyaltyMember(member: LoyaltyMember): Promise<void>;
  updateLoyaltyMember(id: string, data: Partial<LoyaltyMember>): Promise<void>;
  deleteLoyaltyMember(id: string): Promise<void>;

  // Store Info
  getStoreInfo(): Promise<StoreInfo | null>;
  setStoreInfo(info: StoreInfo): Promise<void>;

  // Utility methods
  clearAllData(): Promise<void>;
  exportData(): Promise<any>;
  importData(data: any): Promise<void>;
}

/**
 * Query filters for advanced searching
 */
export interface QueryFilters {
  search?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Pagination result
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Sync status for offline/online sync
 */
export interface SyncStatus {
  isOnline: boolean;
  lastSync: string | null;
  pendingChanges: number;
  isSyncing: boolean;
}