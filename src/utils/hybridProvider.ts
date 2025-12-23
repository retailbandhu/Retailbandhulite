/**
 * Hybrid Data Provider - Combines localStorage and Supabase
 */

import type { Product, StoreInfo, Customer, Bill } from '../types';
import type { 
  IDataProvider, 
  Expense, 
  Party, 
  KhataEntry, 
  LoyaltyMember,
  SyncStatus 
} from './dataProvider';
import { localStorageProvider } from './localStorageProvider';
import { supabaseProvider } from './supabaseProvider';

interface PendingChange {
  id: string;
  type: 'create' | 'update' | 'delete';
  table: string;
  data: any;
  timestamp: number;
}

class HybridProvider implements IDataProvider {
  private useSupabase: boolean = false;
  private syncQueue: PendingChange[] = [];
  private isSyncing: boolean = false;
  private lastSyncTime: string | null = null;

  constructor() {
    this.loadSyncQueue();
    this.setupOnlineListener();
    
    // Check if Supabase should be used
    const useDB = localStorage.getItem('useSupabase');
    this.useSupabase = useDB === 'true';
  }

  /**
   * Enable or disable Supabase sync
   */
  setSupabaseEnabled(enabled: boolean): void {
    this.useSupabase = enabled;
    localStorage.setItem('useSupabase', enabled.toString());
    
    if (enabled && navigator.onLine) {
      this.syncToCloud();
    }
  }

  /**
   * Get current sync status
   */
  getSyncStatus(): SyncStatus {
    return {
      isOnline: navigator.onLine,
      lastSync: this.lastSyncTime,
      pendingChanges: this.syncQueue.length,
      isSyncing: this.isSyncing
    };
  }

  /**
   * Setup listener for online/offline events
   */
  private setupOnlineListener(): void {
    window.addEventListener('online', () => {
      if (this.useSupabase && this.syncQueue.length > 0) {
        this.syncToCloud();
      }
    });
  }

  /**
   * Load pending changes from localStorage
   */
  private loadSyncQueue(): void {
    try {
      const queue = localStorage.getItem('syncQueue');
      if (queue) {
        this.syncQueue = JSON.parse(queue);
      }
    } catch (error) {
      console.error('Error loading sync queue:', error);
      this.syncQueue = [];
    }
  }

  /**
   * Save pending changes to localStorage
   */
  private saveSyncQueue(): void {
    try {
      localStorage.setItem('syncQueue', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Error saving sync queue:', error);
    }
  }

  /**
   * Add change to sync queue
   */
  private queueChange(type: PendingChange['type'], table: string, data: any): void {
    if (!this.useSupabase) return;
    
    this.syncQueue.push({
      id: crypto.randomUUID(),
      type,
      table,
      data,
      timestamp: Date.now()
    });
    
    this.saveSyncQueue();
    
    // Try to sync if online
    if (navigator.onLine && !this.isSyncing) {
      setTimeout(() => this.syncToCloud(), 1000);
    }
  }

  /**
   * Sync pending changes to Supabase
   */
  private async syncToCloud(): Promise<void> {
    if (!this.useSupabase || this.isSyncing || this.syncQueue.length === 0) {
      return;
    }
    
    this.isSyncing = true;
    
    try {
      // Process queue in order
      const processed: string[] = [];
      
      for (const change of this.syncQueue) {
        try {
          // Execute change on Supabase
          switch (change.type) {
            case 'create':
              await this.executeCreate(change.table, change.data);
              break;
            case 'update':
              await this.executeUpdate(change.table, change.data.id, change.data);
              break;
            case 'delete':
              await this.executeDelete(change.table, change.data.id);
              break;
          }
          
          processed.push(change.id);
        } catch (error) {
          console.error('Error syncing change:', error);
          // Keep this change in queue to retry later
        }
      }
      
      // Remove successfully processed changes
      this.syncQueue = this.syncQueue.filter(c => !processed.includes(c.id));
      this.saveSyncQueue();
      
      this.lastSyncTime = new Date().toISOString();
      localStorage.setItem('lastSyncTime', this.lastSyncTime);
      
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Execute operations on appropriate provider
   */
  private async executeCreate(table: string, data: any): Promise<void> {
    if (this.useSupabase && navigator.onLine) {
      // Use appropriate Supabase method based on table
      // This is simplified - real implementation would use proper typing
      const methods: any = {
        'products': supabaseProvider.addProduct,
        'customers': supabaseProvider.addCustomer,
        'bills': supabaseProvider.addBill,
        'expenses': supabaseProvider.addExpense,
        'parties': supabaseProvider.addParty,
        'khataEntries': supabaseProvider.addKhataEntry,
        'loyaltyMembers': supabaseProvider.addLoyaltyMember
      };
      
      const method = methods[table];
      if (method) {
        await method.call(supabaseProvider, data);
      }
    }
  }

  private async executeUpdate(table: string, id: string, data: any): Promise<void> {
    if (this.useSupabase && navigator.onLine) {
      const methods: any = {
        'products': supabaseProvider.updateProduct,
        'customers': supabaseProvider.updateCustomer,
        'bills': supabaseProvider.updateBill,
        'expenses': supabaseProvider.updateExpense,
        'parties': supabaseProvider.updateParty,
        'khataEntries': supabaseProvider.updateKhataEntry,
        'loyaltyMembers': supabaseProvider.updateLoyaltyMember
      };
      
      const method = methods[table];
      if (method) {
        await method.call(supabaseProvider, id, data);
      }
    }
  }

  private async executeDelete(table: string, id: string): Promise<void> {
    if (this.useSupabase && navigator.onLine) {
      const methods: any = {
        'products': supabaseProvider.deleteProduct,
        'customers': supabaseProvider.deleteCustomer,
        'bills': supabaseProvider.deleteBill,
        'expenses': supabaseProvider.deleteExpense,
        'parties': supabaseProvider.deleteParty,
        'khataEntries': supabaseProvider.deleteKhataEntry,
        'loyaltyMembers': supabaseProvider.deleteLoyaltyMember
      };
      
      const method = methods[table];
      if (method) {
        await method.call(supabaseProvider, id);
      }
    }
  }

  // ==================== PRODUCTS ====================
  
  async getProducts(): Promise<Product[]> {
    // Try Supabase first if online, fallback to localStorage
    if (this.useSupabase && navigator.onLine) {
      try {
        return await supabaseProvider.getProducts();
      } catch (error) {
        console.warn('Supabase failed, using localStorage:', error);
      }
    }
    return localStorageProvider.getProducts();
  }

  async getProduct(id: string): Promise<Product | null> {
    if (this.useSupabase && navigator.onLine) {
      try {
        return await supabaseProvider.getProduct(id);
      } catch (error) {
        console.warn('Supabase failed, using localStorage:', error);
      }
    }
    return localStorageProvider.getProduct(id);
  }

  async addProduct(product: Product): Promise<void> {
    // Always save to localStorage first (optimistic update)
    await localStorageProvider.addProduct(product);
    
    // Queue for sync if Supabase is enabled
    this.queueChange('create', 'products', product);
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<void> {
    await localStorageProvider.updateProduct(id, data);
    this.queueChange('update', 'products', { id, ...data });
  }

  async deleteProduct(id: string): Promise<void> {
    await localStorageProvider.deleteProduct(id);
    this.queueChange('delete', 'products', { id });
  }

  async searchProducts(query: string): Promise<Product[]> {
    if (this.useSupabase && navigator.onLine) {
      try {
        return await supabaseProvider.searchProducts(query);
      } catch (error) {
        console.warn('Supabase failed, using localStorage:', error);
      }
    }
    return localStorageProvider.searchProducts(query);
  }

  // ==================== CUSTOMERS ====================
  
  async getCustomers(): Promise<Customer[]> {
    if (this.useSupabase && navigator.onLine) {
      try {
        return await supabaseProvider.getCustomers();
      } catch (error) {
        console.warn('Supabase failed, using localStorage:', error);
      }
    }
    return localStorageProvider.getCustomers();
  }

  async getCustomer(id: string): Promise<Customer | null> {
    if (this.useSupabase && navigator.onLine) {
      try {
        return await supabaseProvider.getCustomer(id);
      } catch (error) {
        console.warn('Supabase failed, using localStorage:', error);
      }
    }
    return localStorageProvider.getCustomer(id);
  }

  async addCustomer(customer: Customer): Promise<void> {
    await localStorageProvider.addCustomer(customer);
    this.queueChange('create', 'customers', customer);
  }

  async updateCustomer(id: string, data: Partial<Customer>): Promise<void> {
    await localStorageProvider.updateCustomer(id, data);
    this.queueChange('update', 'customers', { id, ...data });
  }

  async deleteCustomer(id: string): Promise<void> {
    await localStorageProvider.deleteCustomer(id);
    this.queueChange('delete', 'customers', { id });
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    if (this.useSupabase && navigator.onLine) {
      try {
        return await supabaseProvider.searchCustomers(query);
      } catch (error) {
        console.warn('Supabase failed, using localStorage:', error);
      }
    }
    return localStorageProvider.searchCustomers(query);
  }

  // ==================== BILLS ====================
  
  async getBills(): Promise<Bill[]> {
    if (this.useSupabase && navigator.onLine) {
      try {
        return await supabaseProvider.getBills();
      } catch (error) {
        console.warn('Supabase failed, using localStorage:', error);
      }
    }
    return localStorageProvider.getBills();
  }

  async getBill(id: string): Promise<Bill | null> {
    if (this.useSupabase && navigator.onLine) {
      try {
        return await supabaseProvider.getBill(id);
      } catch (error) {
        console.warn('Supabase failed, using localStorage:', error);
      }
    }
    return localStorageProvider.getBill(id);
  }

  async addBill(bill: Bill): Promise<void> {
    await localStorageProvider.addBill(bill);
    this.queueChange('create', 'bills', bill);
  }

  async updateBill(id: string, data: Partial<Bill>): Promise<void> {
    await localStorageProvider.updateBill(id, data);
    this.queueChange('update', 'bills', { id, ...data });
  }

  async deleteBill(id: string): Promise<void> {
    await localStorageProvider.deleteBill(id);
    this.queueChange('delete', 'bills', { id });
  }

  async getBillsByDateRange(startDate: string, endDate: string): Promise<Bill[]> {
    if (this.useSupabase && navigator.onLine) {
      try {
        return await supabaseProvider.getBillsByDateRange(startDate, endDate);
      } catch (error) {
        console.warn('Supabase failed, using localStorage:', error);
      }
    }
    return localStorageProvider.getBillsByDateRange(startDate, endDate);
  }

  async getBillsByCustomer(customerName: string): Promise<Bill[]> {
    if (this.useSupabase && navigator.onLine) {
      try {
        return await supabaseProvider.getBillsByCustomer(customerName);
      } catch (error) {
        console.warn('Supabase failed, using localStorage:', error);
      }
    }
    return localStorageProvider.getBillsByCustomer(customerName);
  }

  // ==================== EXPENSES ====================
  
  async getExpenses(): Promise<Expense[]> {
    if (this.useSupabase && navigator.onLine) {
      try {
        return await supabaseProvider.getExpenses();
      } catch (error) {
        console.warn('Supabase failed, using localStorage:', error);
      }
    }
    return localStorageProvider.getExpenses();
  }

  async getExpense(id: string): Promise<Expense | null> {
    if (this.useSupabase && navigator.onLine) {
      try {
        return await supabaseProvider.getExpense(id);
      } catch (error) {
        console.warn('Supabase failed, using localStorage:', error);
      }
    }
    return localStorageProvider.getExpense(id);
  }

  async addExpense(expense: Expense): Promise<void> {
    await localStorageProvider.addExpense(expense);
    this.queueChange('create', 'expenses', expense);
  }

  async updateExpense(id: string, data: Partial<Expense>): Promise<void> {
    await localStorageProvider.updateExpense(id, data);
    this.queueChange('update', 'expenses', { id, ...data });
  }

  async deleteExpense(id: string): Promise<void> {
    await localStorageProvider.deleteExpense(id);
    this.queueChange('delete', 'expenses', { id });
  }

  async getExpensesByDateRange(startDate: string, endDate: string): Promise<Expense[]> {
    if (this.useSupabase && navigator.onLine) {
      try {
        return await supabaseProvider.getExpensesByDateRange(startDate, endDate);
      } catch (error) {
        console.warn('Supabase failed, using localStorage:', error);
      }
    }
    return localStorageProvider.getExpensesByDateRange(startDate, endDate);
  }

  // ==================== PARTIES ====================
  
  async getParties(): Promise<Party[]> {
    if (this.useSupabase && navigator.onLine) {
      try {
        return await supabaseProvider.getParties();
      } catch (error) {
        console.warn('Supabase failed, using localStorage:', error);
      }
    }
    return localStorageProvider.getParties();
  }

  async getParty(id: string): Promise<Party | null> {
    if (this.useSupabase && navigator.onLine) {
      try {
        return await supabaseProvider.getParty(id);
      } catch (error) {
        console.warn('Supabase failed, using localStorage:', error);
      }
    }
    return localStorageProvider.getParty(id);
  }

  async addParty(party: Party): Promise<void> {
    await localStorageProvider.addParty(party);
    this.queueChange('create', 'parties', party);
  }

  async updateParty(id: string, data: Partial<Party>): Promise<void> {
    await localStorageProvider.updateParty(id, data);
    this.queueChange('update', 'parties', { id, ...data });
  }

  async deleteParty(id: string): Promise<void> {
    await localStorageProvider.deleteParty(id);
    this.queueChange('delete', 'parties', { id });
  }

  // ==================== KHATA ENTRIES ====================
  
  async getKhataEntries(): Promise<KhataEntry[]> {
    if (this.useSupabase && navigator.onLine) {
      try {
        return await supabaseProvider.getKhataEntries();
      } catch (error) {
        console.warn('Supabase failed, using localStorage:', error);
      }
    }
    return localStorageProvider.getKhataEntries();
  }

  async getKhataEntry(id: string): Promise<KhataEntry | null> {
    if (this.useSupabase && navigator.onLine) {
      try {
        return await supabaseProvider.getKhataEntry(id);
      } catch (error) {
        console.warn('Supabase failed, using localStorage:', error);
      }
    }
    return localStorageProvider.getKhataEntry(id);
  }

  async addKhataEntry(entry: KhataEntry): Promise<void> {
    await localStorageProvider.addKhataEntry(entry);
    this.queueChange('create', 'khataEntries', entry);
  }

  async updateKhataEntry(id: string, data: Partial<KhataEntry>): Promise<void> {
    await localStorageProvider.updateKhataEntry(id, data);
    this.queueChange('update', 'khataEntries', { id, ...data });
  }

  async deleteKhataEntry(id: string): Promise<void> {
    await localStorageProvider.deleteKhataEntry(id);
    this.queueChange('delete', 'khataEntries', { id });
  }

  async getKhataEntriesByParty(partyId: string): Promise<KhataEntry[]> {
    if (this.useSupabase && navigator.onLine) {
      try {
        return await supabaseProvider.getKhataEntriesByParty(partyId);
      } catch (error) {
        console.warn('Supabase failed, using localStorage:', error);
      }
    }
    return localStorageProvider.getKhataEntriesByParty(partyId);
  }

  // ==================== LOYALTY PROGRAM ====================
  
  async getLoyaltyMembers(): Promise<LoyaltyMember[]> {
    if (this.useSupabase && navigator.onLine) {
      try {
        return await supabaseProvider.getLoyaltyMembers();
      } catch (error) {
        console.warn('Supabase failed, using localStorage:', error);
      }
    }
    return localStorageProvider.getLoyaltyMembers();
  }

  async getLoyaltyMember(id: string): Promise<LoyaltyMember | null> {
    if (this.useSupabase && navigator.onLine) {
      try {
        return await supabaseProvider.getLoyaltyMember(id);
      } catch (error) {
        console.warn('Supabase failed, using localStorage:', error);
      }
    }
    return localStorageProvider.getLoyaltyMember(id);
  }

  async addLoyaltyMember(member: LoyaltyMember): Promise<void> {
    await localStorageProvider.addLoyaltyMember(member);
    this.queueChange('create', 'loyaltyMembers', member);
  }

  async updateLoyaltyMember(id: string, data: Partial<LoyaltyMember>): Promise<void> {
    await localStorageProvider.updateLoyaltyMember(id, data);
    this.queueChange('update', 'loyaltyMembers', { id, ...data });
  }

  async deleteLoyaltyMember(id: string): Promise<void> {
    await localStorageProvider.deleteLoyaltyMember(id);
    this.queueChange('delete', 'loyaltyMembers', { id });
  }

  // ==================== STORE INFO ====================
  
  async getStoreInfo(): Promise<StoreInfo | null> {
    if (this.useSupabase && navigator.onLine) {
      try {
        return await supabaseProvider.getStoreInfo();
      } catch (error) {
        console.warn('Supabase failed, using localStorage:', error);
      }
    }
    return localStorageProvider.getStoreInfo();
  }

  async setStoreInfo(info: StoreInfo): Promise<void> {
    await localStorageProvider.setStoreInfo(info);
    if (this.useSupabase) {
      this.queueChange('update', 'storeInfo', info);
    }
  }

  // ==================== UTILITY METHODS ====================
  
  async clearAllData(): Promise<void> {
    await localStorageProvider.clearAllData();
    if (this.useSupabase && navigator.onLine) {
      try {
        await supabaseProvider.clearAllData();
      } catch (error) {
        console.error('Error clearing Supabase data:', error);
      }
    }
  }

  async exportData(): Promise<any> {
    // Export from localStorage (most up-to-date)
    return localStorageProvider.exportData();
  }

  async importData(data: any): Promise<void> {
    // Import to localStorage first
    await localStorageProvider.importData(data);
    
    // If Supabase is enabled, sync everything
    if (this.useSupabase && navigator.onLine) {
      try {
        await supabaseProvider.importData(data);
      } catch (error) {
        console.error('Error importing to Supabase:', error);
      }
    }
  }
}

// Export singleton instance
export const dataProvider = new HybridProvider();