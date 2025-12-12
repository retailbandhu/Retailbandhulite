/// <reference types="vite/client" />
const API_BASE = (import.meta as any).env?.PROD ? '/api' : 'http://localhost:3001/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

export const api = {
  getStore: (id: number) => fetchApi(`/stores/${id}`),
  
  createStore: (data: any) => fetchApi('/stores', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  updateStore: (id: number, data: any) => fetchApi(`/stores/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  getProducts: (storeId: number) => fetchApi(`/stores/${storeId}/products`),
  
  createProduct: (storeId: number, data: any) => fetchApi(`/stores/${storeId}/products`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  updateProduct: (id: number, data: any) => fetchApi(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  deleteProduct: (id: number) => fetchApi(`/products/${id}`, {
    method: 'DELETE',
  }),
  
  getCustomers: (storeId: number) => fetchApi(`/stores/${storeId}/customers`),
  
  createCustomer: (storeId: number, data: any) => fetchApi(`/stores/${storeId}/customers`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  updateCustomer: (id: number, data: any) => fetchApi(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  deleteCustomer: (id: number) => fetchApi(`/customers/${id}`, {
    method: 'DELETE',
  }),
  
  getBills: (storeId: number) => fetchApi(`/stores/${storeId}/bills`),
  
  createBill: (storeId: number, data: any) => fetchApi(`/stores/${storeId}/bills`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getKhata: (storeId: number) => fetchApi(`/stores/${storeId}/khata`),
  
  createKhataEntry: (storeId: number, data: any) => fetchApi(`/stores/${storeId}/khata`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getExpenses: (storeId: number) => fetchApi(`/stores/${storeId}/expenses`),
  
  createExpense: (storeId: number, data: any) => fetchApi(`/stores/${storeId}/expenses`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getParties: (storeId: number) => fetchApi(`/stores/${storeId}/parties`),
  
  createParty: (storeId: number, data: any) => fetchApi(`/stores/${storeId}/parties`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  healthCheck: () => fetchApi('/health'),
};

export default api;
