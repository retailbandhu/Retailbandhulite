/**
 * Supabase Data Provider - Implements IDataProvider using Supabase backend
 */

import type { Product, StoreInfo, Customer, Bill } from '../types';
import type { 
  IDataProvider, 
  Expense, 
  Party, 
  KhataEntry, 
  LoyaltyMember 
} from './dataProvider';
import { projectId, publicAnonKey } from './supabase/info';

// Note: You'll need to install @supabase/supabase-js
// For now, we'll create a mock implementation that can be replaced

interface SupabaseClient {
  from(table: string): any;
  auth: any;
}

class SupabaseProvider implements IDataProvider {
  private supabase: SupabaseClient | null = null;
  private userId: string | null = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      // Initialize Supabase client
      // TODO: Replace with actual Supabase client when ready
      // this.supabase = createClient(
      //   `https://${projectId}.supabase.co`,
      //   publicAnonKey
      // );
      
      // Get current user
      // const { data: { user } } = await this.supabase.auth.getUser();
      // this.userId = user?.id || null;
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Supabase:', error);
    }
  }

  private ensureInitialized(): void {
    if (!this.isInitialized || !this.supabase) {
      throw new Error('Supabase not initialized. Please check your configuration.');
    }
  }

  private async query<T>(table: string): Promise<T[]> {
    this.ensureInitialized();
    
    try {
      const { data, error } = await this.supabase!
        .from(table)
        .select('*')
        .eq('user_id', this.userId);
      
      if (error) throw error;
      return data as T[];
    } catch (error) {
      console.error(`Error querying ${table}:`, error);
      return [];
    }
  }

  private async queryOne<T>(table: string, id: string): Promise<T | null> {
    this.ensureInitialized();
    
    try {
      const { data, error } = await this.supabase!
        .from(table)
        .select('*')
        .eq('id', id)
        .eq('user_id', this.userId)
        .single();
      
      if (error) throw error;
      return data as T;
    } catch (error) {
      console.error(`Error querying ${table} by id:`, error);
      return null;
    }
  }

  private async insert<T>(table: string, item: T & { id: string }): Promise<void> {
    this.ensureInitialized();
    
    try {
      const { error } = await this.supabase!
        .from(table)
        .insert([{ ...item, user_id: this.userId }]);
      
      if (error) throw error;
    } catch (error) {
      console.error(`Error inserting into ${table}:`, error);
      throw error;
    }
  }

  private async update<T>(table: string, id: string, data: Partial<T>): Promise<void> {
    this.ensureInitialized();
    
    try {
      const { error } = await this.supabase!
        .from(table)
        .update(data)
        .eq('id', id)
        .eq('user_id', this.userId);
      
      if (error) throw error;
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      throw error;
    }
  }

  private async delete(table: string, id: string): Promise<void> {
    this.ensureInitialized();
    
    try {
      const { error } = await this.supabase!
        .from(table)
        .delete()
        .eq('id', id)
        .eq('user_id', this.userId);
      
      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
      throw error;
    }
  }

  // ==================== PRODUCTS ====================
  
  async getProducts(): Promise<Product[]> {
    return this.query<Product>('products');
  }

  async getProduct(id: string): Promise<Product | null> {
    return this.queryOne<Product>('products', id);
  }

  async addProduct(product: Product): Promise<void> {
    return this.insert('products', product);
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<void> {
    return this.update('products', id, data);
  }

  async deleteProduct(id: string): Promise<void> {
    return this.delete('products', id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    this.ensureInitialized();
    
    try {
      const { data, error } = await this.supabase!
        .from('products')
        .select('*')
        .eq('user_id', this.userId)
        .ilike('name', `%${query}%`);
      
      if (error) throw error;
      return data as Product[];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  // ==================== CUSTOMERS ====================
  
  async getCustomers(): Promise<Customer[]> {
    return this.query<Customer>('customers');
  }

  async getCustomer(id: string): Promise<Customer | null> {
    return this.queryOne<Customer>('customers', id);
  }

  async addCustomer(customer: Customer): Promise<void> {
    return this.insert('customers', customer);
  }

  async updateCustomer(id: string, data: Partial<Customer>): Promise<void> {
    return this.update('customers', id, data);
  }

  async deleteCustomer(id: string): Promise<void> {
    return this.delete('customers', id);
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    this.ensureInitialized();
    
    try {
      const { data, error } = await this.supabase!
        .from('customers')
        .select('*')
        .eq('user_id', this.userId)
        .or(`name.ilike.%${query}%,phone.ilike.%${query}%`);
      
      if (error) throw error;
      return data as Customer[];
    } catch (error) {
      console.error('Error searching customers:', error);
      return [];
    }
  }

  // ==================== BILLS ====================
  
  async getBills(): Promise<Bill[]> {
    return this.query<Bill>('bills');
  }

  async getBill(id: string): Promise<Bill | null> {
    return this.queryOne<Bill>('bills', id);
  }

  async addBill(bill: Bill): Promise<void> {
    return this.insert('bills', bill);
  }

  async updateBill(id: string, data: Partial<Bill>): Promise<void> {
    return this.update('bills', id, data);
  }

  async deleteBill(id: string): Promise<void> {
    return this.delete('bills', id);
  }

  async getBillsByDateRange(startDate: string, endDate: string): Promise<Bill[]> {
    this.ensureInitialized();
    
    try {
      const { data, error } = await this.supabase!
        .from('bills')
        .select('*')
        .eq('user_id', this.userId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as Bill[];
    } catch (error) {
      console.error('Error getting bills by date range:', error);
      return [];
    }
  }

  async getBillsByCustomer(customerName: string): Promise<Bill[]> {
    this.ensureInitialized();
    
    try {
      const { data, error } = await this.supabase!
        .from('bills')
        .select('*')
        .eq('user_id', this.userId)
        .ilike('customer_name', `%${customerName}%`);
      
      if (error) throw error;
      return data as Bill[];
    } catch (error) {
      console.error('Error getting bills by customer:', error);
      return [];
    }
  }

  // ==================== EXPENSES ====================
  
  async getExpenses(): Promise<Expense[]> {
    return this.query<Expense>('expenses');
  }

  async getExpense(id: string): Promise<Expense | null> {
    return this.queryOne<Expense>('expenses', id);
  }

  async addExpense(expense: Expense): Promise<void> {
    return this.insert('expenses', expense);
  }

  async updateExpense(id: string, data: Partial<Expense>): Promise<void> {
    return this.update('expenses', id, data);
  }

  async deleteExpense(id: string): Promise<void> {
    return this.delete('expenses', id);
  }

  async getExpensesByDateRange(startDate: string, endDate: string): Promise<Expense[]> {
    this.ensureInitialized();
    
    try {
      const { data, error } = await this.supabase!
        .from('expenses')
        .select('*')
        .eq('user_id', this.userId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as Expense[];
    } catch (error) {
      console.error('Error getting expenses by date range:', error);
      return [];
    }
  }

  // ==================== PARTIES ====================
  
  async getParties(): Promise<Party[]> {
    return this.query<Party>('parties');
  }

  async getParty(id: string): Promise<Party | null> {
    return this.queryOne<Party>('parties', id);
  }

  async addParty(party: Party): Promise<void> {
    return this.insert('parties', party);
  }

  async updateParty(id: string, data: Partial<Party>): Promise<void> {
    return this.update('parties', id, data);
  }

  async deleteParty(id: string): Promise<void> {
    return this.delete('parties', id);
  }

  // ==================== KHATA ENTRIES ====================
  
  async getKhataEntries(): Promise<KhataEntry[]> {
    return this.query<KhataEntry>('khata_entries');
  }

  async getKhataEntry(id: string): Promise<KhataEntry | null> {
    return this.queryOne<KhataEntry>('khata_entries', id);
  }

  async addKhataEntry(entry: KhataEntry): Promise<void> {
    return this.insert('khata_entries', entry);
  }

  async updateKhataEntry(id: string, data: Partial<KhataEntry>): Promise<void> {
    return this.update('khata_entries', id, data);
  }

  async deleteKhataEntry(id: string): Promise<void> {
    return this.delete('khata_entries', id);
  }

  async getKhataEntriesByParty(partyId: string): Promise<KhataEntry[]> {
    this.ensureInitialized();
    
    try {
      const { data, error } = await this.supabase!
        .from('khata_entries')
        .select('*')
        .eq('user_id', this.userId)
        .eq('party_id', partyId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as KhataEntry[];
    } catch (error) {
      console.error('Error getting khata entries by party:', error);
      return [];
    }
  }

  // ==================== LOYALTY PROGRAM ====================
  
  async getLoyaltyMembers(): Promise<LoyaltyMember[]> {
    return this.query<LoyaltyMember>('loyalty_members');
  }

  async getLoyaltyMember(id: string): Promise<LoyaltyMember | null> {
    return this.queryOne<LoyaltyMember>('loyalty_members', id);
  }

  async addLoyaltyMember(member: LoyaltyMember): Promise<void> {
    return this.insert('loyalty_members', member);
  }

  async updateLoyaltyMember(id: string, data: Partial<LoyaltyMember>): Promise<void> {
    return this.update('loyalty_members', id, data);
  }

  async deleteLoyaltyMember(id: string): Promise<void> {
    return this.delete('loyalty_members', id);
  }

  // ==================== STORE INFO ====================
  
  async getStoreInfo(): Promise<StoreInfo | null> {
    this.ensureInitialized();
    
    try {
      const { data, error } = await this.supabase!
        .from('store_info')
        .select('*')
        .eq('user_id', this.userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      return data as StoreInfo;
    } catch (error) {
      console.error('Error getting store info:', error);
      return null;
    }
  }

  async setStoreInfo(info: StoreInfo): Promise<void> {
    this.ensureInitialized();
    
    try {
      const { error } = await this.supabase!
        .from('store_info')
        .upsert([{ ...info, user_id: this.userId }]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error setting store info:', error);
      throw error;
    }
  }

  // ==================== UTILITY METHODS ====================
  
  async clearAllData(): Promise<void> {
    this.ensureInitialized();
    
    const tables = [
      'products',
      'customers',
      'bills',
      'expenses',
      'parties',
      'khata_entries',
      'loyalty_members',
      'store_info'
    ];
    
    for (const table of tables) {
      try {
        await this.supabase!
          .from(table)
          .delete()
          .eq('user_id', this.userId);
      } catch (error) {
        console.error(`Error clearing ${table}:`, error);
      }
    }
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
      version: '1.0',
      source: 'supabase'
    };
  }

  async importData(data: any): Promise<void> {
    // Import data in batches to avoid overwhelming the database
    const batchSize = 100;
    
    // Helper to import in batches
    const importBatch = async (table: string, items: any[]) => {
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const itemsWithUserId = batch.map(item => ({ ...item, user_id: this.userId }));
        
        try {
          await this.supabase!.from(table).insert(itemsWithUserId);
        } catch (error) {
          console.error(`Error importing batch to ${table}:`, error);
        }
      }
    };
    
    if (data.products?.length) await importBatch('products', data.products);
    if (data.customers?.length) await importBatch('customers', data.customers);
    if (data.bills?.length) await importBatch('bills', data.bills);
    if (data.expenses?.length) await importBatch('expenses', data.expenses);
    if (data.parties?.length) await importBatch('parties', data.parties);
    if (data.khataEntries?.length) await importBatch('khata_entries', data.khataEntries);
    if (data.loyaltyMembers?.length) await importBatch('loyalty_members', data.loyaltyMembers);
    if (data.storeInfo) await this.setStoreInfo(data.storeInfo);
  }
}

// Export singleton instance (will be used when Supabase is enabled)
export const supabaseProvider = new SupabaseProvider();