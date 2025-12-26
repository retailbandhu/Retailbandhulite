/**
 * Database Integration Manager
 * Ensures all app features are connected to Supabase database
 * Provides migration, sync, and health check capabilities
 */

import { projectId, publicAnonKey } from './supabase/info';
import { dataProvider } from './hybridProvider';
import type { Product, Customer, Bill, StoreInfo } from '../types';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c4099df5`;

interface DatabaseStatus {
  connected: boolean;
  serverHealthy: boolean;
  lastSync: string | null;
  pendingChanges: number;
  features: {
    products: boolean;
    customers: boolean;
    bills: boolean;
    storeInfo: boolean;
    analytics: boolean;
    backup: boolean;
  };
  errors: string[];
}

interface MigrationResult {
  success: boolean;
  migrated: {
    products: number;
    customers: number;
    bills: number;
    storeInfo: boolean;
  };
  errors: string[];
}

class DatabaseIntegrationManager {
  private storeId: string;

  constructor() {
    this.storeId = this.getStoreId();
  }

  /**
   * Get or create store ID
   */
  private getStoreId(): string {
    let storeId = localStorage.getItem('storeId');
    if (!storeId) {
      storeId = `store_${Date.now()}`;
      localStorage.setItem('storeId', storeId);
    }
    return storeId;
  }

  /**
   * Get auth headers
   */
  private getAuthHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    };
  }

  /**
   * Check database connectivity and health
   */
  async checkDatabaseStatus(): Promise<DatabaseStatus> {
    const status: DatabaseStatus = {
      connected: false,
      serverHealthy: false,
      lastSync: localStorage.getItem('lastDatabaseSync'),
      pendingChanges: 0,
      features: {
        products: false,
        customers: false,
        bills: false,
        storeInfo: false,
        analytics: false,
        backup: false,
      },
      errors: [],
    };

    try {
      // Check server health
      const healthResponse = await fetch(`${API_BASE_URL}/health`, {
        headers: this.getAuthHeaders(),
      });

      if (healthResponse.ok) {
        status.serverHealthy = true;
        status.connected = true;
      }
    } catch (error) {
      status.errors.push(`Server health check failed: ${error}`);
      return status;
    }

    // Test each feature endpoint
    const featureTests = [
      { name: 'products', endpoint: `/app/products/${this.storeId}` },
      { name: 'customers', endpoint: `/app/customers/${this.storeId}` },
      { name: 'bills', endpoint: `/app/bills/${this.storeId}` },
      { name: 'storeInfo', endpoint: `/app/store/${this.storeId}` },
      { name: 'analytics', endpoint: `/app/analytics/${this.storeId}/dashboard` },
      { name: 'backup', endpoint: `/app/backup/${this.storeId}` },
    ];

    for (const test of featureTests) {
      try {
        const response = await fetch(`${API_BASE_URL}${test.endpoint}`, {
          headers: this.getAuthHeaders(),
        });

        if (response.ok) {
          status.features[test.name as keyof typeof status.features] = true;
        } else {
          status.errors.push(`${test.name} endpoint failed: ${response.statusText}`);
        }
      } catch (error) {
        status.errors.push(`${test.name} test failed: ${error}`);
      }
    }

    // Get sync status
    const syncStatus = dataProvider.getSyncStatus();
    status.pendingChanges = syncStatus.pendingChanges;

    return status;
  }

  /**
   * Migrate all data from localStorage to database
   */
  async migrateToDatabase(): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      migrated: {
        products: 0,
        customers: 0,
        bills: 0,
        storeInfo: false,
      },
      errors: [],
    };

    try {
      // Get all data from localStorage
      const products = this.getLocalStorageData<Product[]>('retail-bandhu-products') || [];
      const customers = this.getLocalStorageData<Customer[]>('retail-bandhu-customers') || [];
      const bills = this.getLocalStorageData<Bill[]>('retail-bandhu-bills') || [];
      const storeInfo = this.getLocalStorageData<StoreInfo>('retail-bandhu-store-info');

      console.log('🔄 Starting migration to database...');
      console.log(`Found: ${products.length} products, ${customers.length} customers, ${bills.length} bills`);

      // Migrate products
      for (const product of products) {
        try {
          await this.saveProduct(product);
          result.migrated.products++;
        } catch (error) {
          result.errors.push(`Product migration failed (${product.name}): ${error}`);
        }
      }

      // Migrate customers
      for (const customer of customers) {
        try {
          await this.saveCustomer(customer);
          result.migrated.customers++;
        } catch (error) {
          result.errors.push(`Customer migration failed (${customer.name}): ${error}`);
        }
      }

      // Migrate bills
      for (const bill of bills) {
        try {
          // Add migrated flag to prevent stock updates during migration
          await this.saveBill({ ...bill, migrated: true });
          result.migrated.bills++;
        } catch (error) {
          result.errors.push(`Bill migration failed (${bill.id}): ${error}`);
        }
      }

      // Migrate store info
      if (storeInfo) {
        try {
          await this.saveStoreInfo(storeInfo);
          result.migrated.storeInfo = true;
        } catch (error) {
          result.errors.push(`Store info migration failed: ${error}`);
        }
      }

      // Mark migration as complete
      localStorage.setItem('databaseMigrated', 'true');
      localStorage.setItem('lastDatabaseSync', new Date().toISOString());

      result.success = result.errors.length === 0;

      console.log('✅ Migration complete!', result);

      return result;
    } catch (error) {
      result.errors.push(`Migration failed: ${error}`);
      console.error('❌ Migration failed:', error);
      return result;
    }
  }

  /**
   * Enable database sync for all future operations
   */
  enableDatabaseSync(): void {
    dataProvider.setSupabaseEnabled(true);
    localStorage.setItem('useSupabase', 'true');
    console.log('✅ Database sync enabled');
  }

  /**
   * Disable database sync (use only localStorage)
   */
  disableDatabaseSync(): void {
    dataProvider.setSupabaseEnabled(false);
    localStorage.setItem('useSupabase', 'false');
    console.log('⚠️ Database sync disabled - using localStorage only');
  }

  /**
   * Check if migration is needed
   */
  isMigrationNeeded(): boolean {
    const migrated = localStorage.getItem('databaseMigrated');
    if (migrated === 'true') {
      return false;
    }

    // Check if there's any data in localStorage
    const hasProducts = this.getLocalStorageData<Product[]>('retail-bandhu-products')?.length > 0;
    const hasCustomers = this.getLocalStorageData<Customer[]>('retail-bandhu-customers')?.length > 0;
    const hasBills = this.getLocalStorageData<Bill[]>('retail-bandhu-bills')?.length > 0;

    return hasProducts || hasCustomers || hasBills;
  }

  /**
   * Sync all data from database to localStorage (for offline use)
   */
  async syncFromDatabase(): Promise<void> {
    try {
      console.log('📥 Syncing data from database...');

      // Get all data from database
      const [products, customers, bills, storeInfo] = await Promise.all([
        this.getProducts(),
        this.getCustomers(),
        this.getBills(),
        this.getStoreInfo(),
      ]);

      // Save to localStorage
      if (products) localStorage.setItem('retail-bandhu-products', JSON.stringify(products));
      if (customers) localStorage.setItem('retail-bandhu-customers', JSON.stringify(customers));
      if (bills) localStorage.setItem('retail-bandhu-bills', JSON.stringify(bills));
      if (storeInfo) localStorage.setItem('retail-bandhu-store-info', JSON.stringify(storeInfo));

      localStorage.setItem('lastDatabaseSync', new Date().toISOString());

      console.log('✅ Sync from database complete!');
    } catch (error) {
      console.error('❌ Sync from database failed:', error);
      throw error;
    }
  }

  /**
   * Create backup of all data
   */
  async createBackup(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/app/backup/${this.storeId}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Backup failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Backup error:', error);
      throw error;
    }
  }

  /**
   * Restore data from backup
   */
  async restoreBackup(backupData: any): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/app/restore/${this.storeId}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(backupData),
      });

      if (!response.ok) {
        throw new Error(`Restore failed: ${response.statusText}`);
      }

      console.log('✅ Backup restored successfully');
    } catch (error) {
      console.error('Restore error:', error);
      throw error;
    }
  }

  // ============================================
  // PRIVATE HELPER METHODS
  // ============================================

  private getLocalStorageData<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private async saveProduct(product: Product): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/app/products/${this.storeId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error(`Failed to save product: ${response.statusText}`);
    }
  }

  private async saveCustomer(customer: Customer): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/app/customers/${this.storeId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(customer),
    });

    if (!response.ok) {
      throw new Error(`Failed to save customer: ${response.statusText}`);
    }
  }

  private async saveBill(bill: any): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/app/bills/${this.storeId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(bill),
    });

    if (!response.ok) {
      throw new Error(`Failed to save bill: ${response.statusText}`);
    }
  }

  private async saveStoreInfo(storeInfo: StoreInfo): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/app/store/${this.storeId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(storeInfo),
    });

    if (!response.ok) {
      throw new Error(`Failed to save store info: ${response.statusText}`);
    }
  }

  private async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/app/products/${this.storeId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get products: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || [];
  }

  private async getCustomers(): Promise<Customer[]> {
    const response = await fetch(`${API_BASE_URL}/app/customers/${this.storeId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get customers: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || [];
  }

  private async getBills(): Promise<Bill[]> {
    const response = await fetch(`${API_BASE_URL}/app/bills/${this.storeId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get bills: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || [];
  }

  private async getStoreInfo(): Promise<StoreInfo | null> {
    const response = await fetch(`${API_BASE_URL}/app/store/${this.storeId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get store info: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || null;
  }
}

// Export singleton instance
export const databaseManager = new DatabaseIntegrationManager();

// Export utility functions
export async function checkDatabaseConnection(): Promise<boolean> {
  const status = await databaseManager.checkDatabaseStatus();
  return status.connected && status.serverHealthy;
}

export async function runDatabaseHealthCheck(): Promise<DatabaseStatus> {
  return await databaseManager.checkDatabaseStatus();
}

export async function migrateToDatabase(): Promise<MigrationResult> {
  return await databaseManager.migrateToDatabase();
}

export function enableDatabase(): void {
  databaseManager.enableDatabaseSync();
}

export function disableDatabase(): void {
  databaseManager.disableDatabaseSync();
}

export function isDatabaseSyncEnabled(): boolean {
  return localStorage.getItem('useSupabase') === 'true';
}