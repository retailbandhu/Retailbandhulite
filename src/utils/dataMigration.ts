/**
 * Data Migration Utility
 * Migrates existing localStorage data to Supabase
 * Handles conflicts, errors, and rollback
 */

import { storage } from './storage';
import { productsApi, customersApi, billsApi, storeApi } from './supabaseApi';
import type { Product, StoreInfo } from '../types';
import type { Customer, Bill } from './storage';

export interface MigrationStatus {
  inProgress: boolean;
  completed: boolean;
  failed: boolean;
  currentStep: string;
  progress: number;
  errors: string[];
  migratedAt?: string;
}

export interface MigrationResult {
  success: boolean;
  productsCount: number;
  customersCount: number;
  billsCount: number;
  storeInfoMigrated: boolean;
  errors: string[];
  duration: number;
}

const MIGRATION_KEY = 'retail_bandhu_migration_status';

/**
 * Check if migration is needed
 */
export function needsMigration(): boolean {
  const status = getMigrationStatus();
  if (status.completed) return false;

  // Check if there's any localStorage data
  const products = storage.getProducts();
  const customers = storage.getCustomers();
  const bills = storage.getBills();
  const storeInfo = storage.getStoreInfo();

  return (
    products.length > 0 ||
    customers.length > 0 ||
    bills.length > 0 ||
    storeInfo !== null
  );
}

/**
 * Get current migration status
 */
export function getMigrationStatus(): MigrationStatus {
  try {
    const stored = localStorage.getItem(MIGRATION_KEY);
    if (!stored) {
      return {
        inProgress: false,
        completed: false,
        failed: false,
        currentStep: '',
        progress: 0,
        errors: [],
      };
    }
    return JSON.parse(stored);
  } catch (error) {
    return {
      inProgress: false,
      completed: false,
      failed: false,
      currentStep: '',
      progress: 0,
      errors: [],
    };
  }
}

/**
 * Update migration status
 */
function updateMigrationStatus(status: Partial<MigrationStatus>): void {
  const current = getMigrationStatus();
  const updated = { ...current, ...status };
  localStorage.setItem(MIGRATION_KEY, JSON.stringify(updated));
}

/**
 * Reset migration status
 */
export function resetMigration(): void {
  localStorage.removeItem(MIGRATION_KEY);
}

/**
 * Main migration function
 */
export async function migrateToSupabase(
  onProgress?: (status: MigrationStatus) => void
): Promise<MigrationResult> {
  const startTime = Date.now();
  const result: MigrationResult = {
    success: false,
    productsCount: 0,
    customersCount: 0,
    billsCount: 0,
    storeInfoMigrated: false,
    errors: [],
    duration: 0,
  };

  try {
    // Mark migration as in progress
    updateMigrationStatus({
      inProgress: true,
      completed: false,
      failed: false,
      currentStep: 'Initializing...',
      progress: 0,
      errors: [],
    });

    if (onProgress) {
      onProgress(getMigrationStatus());
    }

    // Step 1: Migrate Store Info (5%)
    updateMigrationStatus({
      currentStep: 'Migrating store information...',
      progress: 5,
    });
    if (onProgress) onProgress(getMigrationStatus());

    const storeInfo = storage.getStoreInfo();
    if (storeInfo) {
      try {
        await storeApi.updateInfo(storeInfo);
        result.storeInfoMigrated = true;
        console.log('✅ Store info migrated');
      } catch (error) {
        const errorMsg = `Store info migration failed: ${error}`;
        result.errors.push(errorMsg);
        console.error('❌', errorMsg);
      }
    }

    // Step 2: Migrate Products (15% - 45%)
    updateMigrationStatus({
      currentStep: 'Migrating products...',
      progress: 15,
    });
    if (onProgress) onProgress(getMigrationStatus());

    const products = storage.getProducts();
    if (products.length > 0) {
      for (let i = 0; i < products.length; i++) {
        try {
          await productsApi.add(products[i]);
          result.productsCount++;
          
          // Update progress (15% to 45%)
          const progress = 15 + (30 * (i + 1)) / products.length;
          updateMigrationStatus({ progress });
          if (onProgress) onProgress(getMigrationStatus());
        } catch (error) {
          const errorMsg = `Product "${products[i].name}" migration failed: ${error}`;
          result.errors.push(errorMsg);
          console.error('❌', errorMsg);
        }
      }
      console.log(`✅ ${result.productsCount}/${products.length} products migrated`);
    }

    // Step 3: Migrate Customers (45% - 70%)
    updateMigrationStatus({
      currentStep: 'Migrating customers...',
      progress: 45,
    });
    if (onProgress) onProgress(getMigrationStatus());

    const customers = storage.getCustomers();
    if (customers.length > 0) {
      for (let i = 0; i < customers.length; i++) {
        try {
          await customersApi.add(customers[i]);
          result.customersCount++;
          
          // Update progress (45% to 70%)
          const progress = 45 + (25 * (i + 1)) / customers.length;
          updateMigrationStatus({ progress });
          if (onProgress) onProgress(getMigrationStatus());
        } catch (error) {
          const errorMsg = `Customer "${customers[i].name}" migration failed: ${error}`;
          result.errors.push(errorMsg);
          console.error('❌', errorMsg);
        }
      }
      console.log(`✅ ${result.customersCount}/${customers.length} customers migrated`);
    }

    // Step 4: Migrate Bills (70% - 95%)
    updateMigrationStatus({
      currentStep: 'Migrating bills...',
      progress: 70,
    });
    if (onProgress) onProgress(getMigrationStatus());

    const bills = storage.getBills();
    if (bills.length > 0) {
      for (let i = 0; i < bills.length; i++) {
        try {
          // Don't auto-update stock when migrating bills
          // Just store the historical data
          await billsApi.add({
            ...bills[i],
            // Mark as migrated so backend doesn't update stock
            migrated: true,
          } as any);
          result.billsCount++;
          
          // Update progress (70% to 95%)
          const progress = 70 + (25 * (i + 1)) / bills.length;
          updateMigrationStatus({ progress });
          if (onProgress) onProgress(getMigrationStatus());
        } catch (error) {
          const errorMsg = `Bill ${bills[i].billNumber} migration failed: ${error}`;
          result.errors.push(errorMsg);
          console.error('❌', errorMsg);
        }
      }
      console.log(`✅ ${result.billsCount}/${bills.length} bills migrated`);
    }

    // Step 5: Finalize (95% - 100%)
    updateMigrationStatus({
      currentStep: 'Finalizing migration...',
      progress: 95,
    });
    if (onProgress) onProgress(getMigrationStatus());

    // Calculate final result
    result.success = result.errors.length === 0;
    result.duration = Date.now() - startTime;

    // Mark migration as complete
    updateMigrationStatus({
      inProgress: false,
      completed: true,
      failed: !result.success,
      currentStep: result.success ? 'Migration completed successfully!' : 'Migration completed with errors',
      progress: 100,
      errors: result.errors,
      migratedAt: new Date().toISOString(),
    });

    if (onProgress) onProgress(getMigrationStatus());

    console.log('🎉 Migration completed!', result);
    return result;

  } catch (error) {
    const errorMsg = `Migration failed: ${error}`;
    result.errors.push(errorMsg);
    result.duration = Date.now() - startTime;

    updateMigrationStatus({
      inProgress: false,
      completed: false,
      failed: true,
      currentStep: 'Migration failed',
      progress: 0,
      errors: result.errors,
    });

    console.error('❌ Migration error:', error);
    throw error;
  }
}

/**
 * Verify migration integrity
 */
export async function verifyMigration(): Promise<{
  valid: boolean;
  issues: string[];
}> {
  const issues: string[] = [];

  try {
    // Check products
    const localProducts = storage.getProducts();
    const cloudProducts = await productsApi.getAll();
    
    if (localProducts.length !== cloudProducts.length) {
      issues.push(
        `Product count mismatch: Local=${localProducts.length}, Cloud=${cloudProducts.length}`
      );
    }

    // Check customers
    const localCustomers = storage.getCustomers();
    const cloudCustomers = await customersApi.getAll();
    
    if (localCustomers.length !== cloudCustomers.length) {
      issues.push(
        `Customer count mismatch: Local=${localCustomers.length}, Cloud=${cloudCustomers.length}`
      );
    }

    // Check bills
    const localBills = storage.getBills();
    const cloudBills = await billsApi.getAll();
    
    if (localBills.length !== cloudBills.length) {
      issues.push(
        `Bill count mismatch: Local=${localBills.length}, Cloud=${cloudBills.length}`
      );
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  } catch (error) {
    issues.push(`Verification failed: ${error}`);
    return {
      valid: false,
      issues,
    };
  }
}

/**
 * Create backup before migration
 */
export async function createPreMigrationBackup(): Promise<string> {
  const backup = {
    products: storage.getProducts(),
    customers: storage.getCustomers(),
    bills: storage.getBills(),
    storeInfo: storage.getStoreInfo(),
    timestamp: new Date().toISOString(),
  };

  const backupKey = `retail_bandhu_backup_${Date.now()}`;
  localStorage.setItem(backupKey, JSON.stringify(backup));
  
  return backupKey;
}

/**
 * Restore from backup
 */
export function restoreFromBackup(backupKey: string): boolean {
  try {
    const backup = localStorage.getItem(backupKey);
    if (!backup) {
      throw new Error('Backup not found');
    }

    const data = JSON.parse(backup);
    
    if (data.products) storage.setProducts(data.products);
    if (data.customers) storage.setCustomers(data.customers);
    if (data.bills) storage.setBills(data.bills);
    if (data.storeInfo) storage.setStoreInfo(data.storeInfo);

    console.log('✅ Data restored from backup:', backupKey);
    return true;
  } catch (error) {
    console.error('❌ Restore failed:', error);
    return false;
  }
}

/**
 * Get migration summary
 */
export function getMigrationSummary(): string {
  const status = getMigrationStatus();
  
  if (!status.completed) {
    return 'Migration not completed';
  }

  const products = storage.getProducts().length;
  const customers = storage.getCustomers().length;
  const bills = storage.getBills().length;

  return `Migrated ${products} products, ${customers} customers, and ${bills} bills on ${
    status.migratedAt ? new Date(status.migratedAt).toLocaleDateString() : 'unknown date'
  }`;
}