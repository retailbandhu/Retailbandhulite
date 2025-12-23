/**
 * Supabase API Client
 * Handles all API calls to the Supabase backend
 */

import { projectId, publicAnonKey } from './supabase/info';
import { getAccessToken } from './auth';
import type { Product, Customer, Bill, StoreInfo } from '../types';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c4099df5/app`;

// Get store ID from localStorage or create one
function getStoreId(): string {
  let storeId = localStorage.getItem('storeId');
  if (!storeId) {
    storeId = `store_${Date.now()}`;
    localStorage.setItem('storeId', storeId);
  }
  return storeId;
}

// Get auth headers with access token if available
function getAuthHeaders(): HeadersInit {
  const accessToken = getAccessToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken || publicAnonKey}`,
  };
}

// Generic API call wrapper
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API call failed: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'API call failed');
  }

  return data.data;
}

// ============================================
// PRODUCTS API
// ============================================

export const productsApi = {
  async getAll(): Promise<Product[]> {
    const storeId = getStoreId();
    return apiCall<Product[]>(`/products/${storeId}`);
  },

  async add(product: Product): Promise<Product> {
    const storeId = getStoreId();
    return apiCall<Product>(`/products/${storeId}`, {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const storeId = getStoreId();
    return apiCall<Product>(`/products/${storeId}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    const storeId = getStoreId();
    await apiCall<void>(`/products/${storeId}/${id}`, {
      method: 'DELETE',
    });
  },

  async search(query: string): Promise<Product[]> {
    const products = await this.getAll();
    return products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.barcode?.includes(query)
    );
  },
};

// ============================================
// CUSTOMERS API
// ============================================

export const customersApi = {
  async getAll(): Promise<Customer[]> {
    const storeId = getStoreId();
    return apiCall<Customer[]>(`/customers/${storeId}`);
  },

  async add(customer: Customer): Promise<Customer> {
    const storeId = getStoreId();
    return apiCall<Customer>(`/customers/${storeId}`, {
      method: 'POST',
      body: JSON.stringify(customer),
    });
  },

  async update(id: string, data: Partial<Customer>): Promise<Customer> {
    const storeId = getStoreId();
    return apiCall<Customer>(`/customers/${storeId}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    const storeId = getStoreId();
    await apiCall<void>(`/customers/${storeId}/${id}`, {
      method: 'DELETE',
    });
  },

  async search(query: string): Promise<Customer[]> {
    const customers = await this.getAll();
    return customers.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.phone.includes(query)
    );
  },
};

// ============================================
// BILLS API
// ============================================

export const billsApi = {
  async getAll(): Promise<Bill[]> {
    const storeId = getStoreId();
    return apiCall<Bill[]>(`/bills/${storeId}`);
  },

  async add(bill: Bill): Promise<Bill> {
    const storeId = getStoreId();
    return apiCall<Bill>(`/bills/${storeId}`, {
      method: 'POST',
      body: JSON.stringify(bill),
    });
  },

  async getByDateRange(startDate?: string, endDate?: string): Promise<Bill[]> {
    const storeId = getStoreId();
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return apiCall<Bill[]>(`/bills/${storeId}/range?${params.toString()}`);
  },
};

// ============================================
// STORE INFO API
// ============================================

export const storeApi = {
  async getInfo(): Promise<StoreInfo> {
    const storeId = getStoreId();
    return apiCall<StoreInfo>(`/store/${storeId}`);
  },

  async updateInfo(data: Partial<StoreInfo>): Promise<StoreInfo> {
    const storeId = getStoreId();
    return apiCall<StoreInfo>(`/store/${storeId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// ANALYTICS API
// ============================================

export interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalSales: number;
  totalBills: number;
  lowStockItems: number;
  todaySales: number;
  todayBills: number;
}

export interface SalesData {
  date: string;
  sales: number;
  count: number;
}

export interface TopProduct {
  name: string;
  qty: number;
  revenue: number;
}

export const analyticsApi = {
  async getDashboardStats(): Promise<DashboardStats> {
    const storeId = getStoreId();
    return apiCall<DashboardStats>(`/analytics/${storeId}/dashboard`);
  },

  async getSalesByPeriod(period: 'week' | 'month' | 'year' = 'week'): Promise<SalesData[]> {
    const storeId = getStoreId();
    return apiCall<SalesData[]>(`/analytics/${storeId}/sales?period=${period}`);
  },

  async getTopProducts(): Promise<TopProduct[]> {
    const storeId = getStoreId();
    return apiCall<TopProduct[]>(`/analytics/${storeId}/top-products`);
  },
};

// ============================================
// BACKUP API
// ============================================

export interface BackupData {
  products: Product[];
  customers: Customer[];
  bills: Bill[];
  storeInfo: StoreInfo;
  backupDate: string;
}

export const backupApi = {
  async create(): Promise<BackupData> {
    const storeId = getStoreId();
    return apiCall<BackupData>(`/backup/${storeId}`);
  },

  async restore(data: BackupData): Promise<void> {
    const storeId = getStoreId();
    await apiCall<void>(`/restore/${storeId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// OFFLINE SUPPORT
// ============================================

// Check if online
export function isOnline(): boolean {
  return navigator.onLine;
}

// Queue for offline operations
const offlineQueue: Array<{ fn: () => Promise<any> }> = [];

// Add operation to offline queue
export function queueOfflineOperation(fn: () => Promise<any>): void {
  offlineQueue.push({ fn });
  localStorage.setItem('offlineQueue', JSON.stringify(offlineQueue));
}

// Process offline queue when back online
export async function processOfflineQueue(): Promise<void> {
  if (!isOnline() || offlineQueue.length === 0) return;

  const queue = [...offlineQueue];
  offlineQueue.length = 0;

  for (const { fn } of queue) {
    try {
      await fn();
    } catch (error) {
      console.error('Failed to process offline operation:', error);
      // Re-queue failed operations
      offlineQueue.push({ fn });
    }
  }

  localStorage.setItem('offlineQueue', JSON.stringify(offlineQueue));
}

// Listen for online event
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Back online! Processing queued operations...');
    processOfflineQueue();
  });
}