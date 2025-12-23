/**
 * LocalStorage Data Provider - Implements IDataProvider using browser localStorage
 */

import type { Product, BillItem, StoreInfo, Customer, Bill } from '../types';
import type { 
  IDataProvider, 
  Expense, 
  Party, 
  KhataEntry, 
  LoyaltyMember 
} from './dataProvider';

class LocalStorageProvider implements IDataProvider {
  private cache: Map<string, any> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Safe localStorage access with error handling
   */
  private safeGet<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  }

  private safeSet(key: string, value: any): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Update cache
      this.cache.set(key, value);
      this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
      return true;
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
      return false;
    }
  }

  private getCached<T>(key: string, defaultValue: T): T {
    const now = Date.now();
    const expiry = this.cacheExpiry.get(key);
    
    if (expiry && expiry > now && this.cache.has(key)) {
      return this.cache.get(key) as T;
    }
    
    const value = this.safeGet(key, defaultValue);
    this.cache.set(key, value);
    this.cacheExpiry.set(key, now + this.CACHE_DURATION);
    return value;
  }

  /**
   * Generic CRUD operations
   */
  private async getItems<T>(key: string): Promise<T[]> {
    return Promise.resolve(this.getCached<T[]>(key, []));
  }

  private async getItem<T>(key: string, id: string): Promise<T | null> {
    const items = await this.getItems<T & { id: string }>(key);
    return items.find(item => item.id === id) || null;
  }

  private async addItem<T extends { id: string }>(key: string, item: T): Promise<void> {
    const items = await this.getItems<T>(key);
    items.push(item);
    this.safeSet(key, items);
  }

  private async updateItem<T extends { id: string }>(
    key: string, 
    id: string, 
    data: Partial<T>
  ): Promise<void> {
    const items = await this.getItems<T>(key);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...data };
      this.safeSet(key, items);
    }
  }

  private async deleteItem(key: string, id: string): Promise<void> {
    const items = await this.getItems<{ id: string }>(key);
    const filtered = items.filter(item => item.id !== id);
    this.safeSet(key, filtered);
  }

  private async searchItems<T extends { name?: string; phone?: string }>(
    key: string, 
    query: string
  ): Promise<T[]> {
    const items = await this.getItems<T>(key);
    const lowerQuery = query.toLowerCase();
    return items.filter(item => 
      (item.name?.toLowerCase().includes(lowerQuery)) ||
      (item.phone?.toLowerCase().includes(lowerQuery))
    );
  }

  // ==================== PRODUCTS ====================
  
  async getProducts(): Promise<Product[]> {
    return this.getItems<Product>('products');
  }

  async getProduct(id: string): Promise<Product | null> {
    return this.getItem<Product>('products', id);
  }

  async addProduct(product: Product): Promise<void> {
    return this.addItem('products', product);
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<void> {
    return this.updateItem('products', id, data);
  }

  async deleteProduct(id: string): Promise<void> {
    return this.deleteItem('products', id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.searchItems<Product>('products', query);
  }

  // ==================== CUSTOMERS ====================
  
  async getCustomers(): Promise<Customer[]> {
    return this.getItems<Customer>('customers');
  }

  async getCustomer(id: string): Promise<Customer | null> {
    return this.getItem<Customer>('customers', id);
  }

  async addCustomer(customer: Customer): Promise<void> {
    return this.addItem('customers', customer);
  }

  async updateCustomer(id: string, data: Partial<Customer>): Promise<void> {
    return this.updateItem('customers', id, data);
  }

  async deleteCustomer(id: string): Promise<void> {
    return this.deleteItem('customers', id);
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    return this.searchItems<Customer>('customers', query);
  }

  // ==================== BILLS ====================
  
  async getBills(): Promise<Bill[]> {
    return this.getItems<Bill>('bills');
  }

  async getBill(id: string): Promise<Bill | null> {
    return this.getItem<Bill>('bills', id);
  }

  async addBill(bill: Bill): Promise<void> {
    return this.addItem('bills', bill);
  }

  async updateBill(id: string, data: Partial<Bill>): Promise<void> {
    return this.updateItem('bills', id, data);
  }

  async deleteBill(id: string): Promise<void> {
    return this.deleteItem('bills', id);
  }

  async getBillsByDateRange(startDate: string, endDate: string): Promise<Bill[]> {
    const bills = await this.getBills();
    return bills.filter(bill => 
      bill.date >= startDate && bill.date <= endDate
    );
  }

  async getBillsByCustomer(customerName: string): Promise<Bill[]> {
    const bills = await this.getBills();
    return bills.filter(bill => 
      bill.customerName.toLowerCase().includes(customerName.toLowerCase())
    );
  }

  // ==================== EXPENSES ====================
  
  async getExpenses(): Promise<Expense[]> {
    return this.getItems<Expense>('expenses');
  }

  async getExpense(id: string): Promise<Expense | null> {
    return this.getItem<Expense>('expenses', id);
  }

  async addExpense(expense: Expense): Promise<void> {
    return this.addItem('expenses', expense);
  }

  async updateExpense(id: string, data: Partial<Expense>): Promise<void> {
    return this.updateItem('expenses', id, data);
  }

  async deleteExpense(id: string): Promise<void> {
    return this.deleteItem('expenses', id);
  }

  async getExpensesByDateRange(startDate: string, endDate: string): Promise<Expense[]> {
    const expenses = await this.getExpenses();
    return expenses.filter(expense => 
      expense.date >= startDate && expense.date <= endDate
    );
  }

  // ==================== PARTIES ====================
  
  async getParties(): Promise<Party[]> {
    return this.getItems<Party>('parties');
  }

  async getParty(id: string): Promise<Party | null> {
    return this.getItem<Party>('parties', id);
  }

  async addParty(party: Party): Promise<void> {
    return this.addItem('parties', party);
  }

  async updateParty(id: string, data: Partial<Party>): Promise<void> {
    return this.updateItem('parties', id, data);
  }

  async deleteParty(id: string): Promise<void> {
    return this.deleteItem('parties', id);
  }

  // ==================== KHATA ENTRIES ====================
  
  async getKhataEntries(): Promise<KhataEntry[]> {
    return this.getItems<KhataEntry>('khataEntries');
  }

  async getKhataEntry(id: string): Promise<KhataEntry | null> {
    return this.getItem<KhataEntry>('khataEntries', id);
  }

  async addKhataEntry(entry: KhataEntry): Promise<void> {
    return this.addItem('khataEntries', entry);
  }

  async updateKhataEntry(id: string, data: Partial<KhataEntry>): Promise<void> {
    return this.updateItem('khataEntries', id, data);
  }

  async deleteKhataEntry(id: string): Promise<void> {
    return this.deleteItem('khataEntries', id);
  }

  async getKhataEntriesByParty(partyId: string): Promise<KhataEntry[]> {
    const entries = await this.getKhataEntries();
    return entries.filter(entry => entry.partyId === partyId);
  }

  // ==================== LOYALTY PROGRAM ====================
  
  async getLoyaltyMembers(): Promise<LoyaltyMember[]> {
    return this.getItems<LoyaltyMember>('loyaltyMembers');
  }

  async getLoyaltyMember(id: string): Promise<LoyaltyMember | null> {
    return this.getItem<LoyaltyMember>('loyaltyMembers', id);
  }

  async addLoyaltyMember(member: LoyaltyMember): Promise<void> {
    return this.addItem('loyaltyMembers', member);
  }

  async updateLoyaltyMember(id: string, data: Partial<LoyaltyMember>): Promise<void> {
    return this.updateItem('loyaltyMembers', id, data);
  }

  async deleteLoyaltyMember(id: string): Promise<void> {
    return this.deleteItem('loyaltyMembers', id);
  }

  // ==================== STORE INFO ====================
  
  async getStoreInfo(): Promise<StoreInfo | null> {
    return Promise.resolve(this.safeGet<StoreInfo | null>('storeInfo', null));
  }

  async setStoreInfo(info: StoreInfo): Promise<void> {
    this.safeSet('storeInfo', info);
  }

  // ==================== UTILITY METHODS ====================
  
  async clearAllData(): Promise<void> {
    const keys = [
      'products',
      'customers',
      'bills',
      'expenses',
      'parties',
      'khataEntries',
      'loyaltyMembers',
      'storeInfo'
    ];
    
    keys.forEach(key => {
      localStorage.removeItem(key);
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
    });
  }

  async exportData(): Promise<any> {
    return {
      products: await this.getProducts(),
      customers: await this.getCustomers(),
      bills: await this.getBills(),
      expenses: await this.getExpenses(),
      parties: await this.getParties(),
      khataEntries: await this.getKhataEntries(),
      loyaltyMembers: await this.getLoyaltyMembers(),
      storeInfo: await this.getStoreInfo(),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
  }

  async importData(data: any): Promise<void> {
    if (data.products) this.safeSet('products', data.products);
    if (data.customers) this.safeSet('customers', data.customers);
    if (data.bills) this.safeSet('bills', data.bills);
    if (data.expenses) this.safeSet('expenses', data.expenses);
    if (data.parties) this.safeSet('parties', data.parties);
    if (data.khataEntries) this.safeSet('khataEntries', data.khataEntries);
    if (data.loyaltyMembers) this.safeSet('loyaltyMembers', data.loyaltyMembers);
    if (data.storeInfo) this.safeSet('storeInfo', data.storeInfo);
  }
}

// Export singleton instance
export const localStorageProvider = new LocalStorageProvider();