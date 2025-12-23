/**
 * useCustomers Hook
 * Manages customer data with async operations
 */

import { useState, useEffect } from 'react';
import type { Customer } from '../types';
import { storage } from '../utils/storage';
import { toast } from 'sonner@2.0.3';

interface UseCustomersReturn {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  addCustomer: (customer: Customer) => Promise<void>;
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  searchCustomers: (query: string) => Customer[];
  refresh: () => Promise<void>;
}

export function useCustomers(): UseCustomersReturn {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      // Currently sync, but ready for async
      const data = storage.getCustomers();
      setCustomers(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load customers';
      setError(message);
      console.error('Load customers error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customer: Customer) => {
    // Optimistic update
    setCustomers(prev => [...prev, customer]);

    try {
      storage.addCustomer(customer);
      toast.success('Customer added successfully!');
    } catch (err) {
      // Rollback on error
      setCustomers(prev => prev.filter(c => c.id !== customer.id));
      const message = err instanceof Error ? err.message : 'Failed to add customer';
      toast.error(message);
      throw err;
    }
  };

  const updateCustomer = async (id: string, data: Partial<Customer>) => {
    // Save current state for rollback
    const previousCustomers = customers;
    
    // Optimistic update
    setCustomers(prev =>
      prev.map(c => (c.id === id ? { ...c, ...data } : c))
    );

    try {
      const updated = customers.find(c => c.id === id);
      if (updated) {
        storage.updateCustomer({ ...updated, ...data });
        toast.success('Customer updated successfully!');
      }
    } catch (err) {
      // Rollback on error
      setCustomers(previousCustomers);
      const message = err instanceof Error ? err.message : 'Failed to update customer';
      toast.error(message);
      throw err;
    }
  };

  const deleteCustomer = async (id: string) => {
    // Save current state for rollback
    const previousCustomers = customers;
    
    // Optimistic delete
    setCustomers(prev => prev.filter(c => c.id !== id));

    try {
      storage.deleteCustomer(id);
      toast.success('Customer deleted successfully!');
    } catch (err) {
      // Restore on error
      setCustomers(previousCustomers);
      const message = err instanceof Error ? err.message : 'Failed to delete customer';
      toast.error(message);
      throw err;
    }
  };

  const searchCustomers = (query: string): Customer[] => {
    if (!query) return customers;
    
    const lowerQuery = query.toLowerCase();
    return customers.filter(c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.phone.includes(query) ||
      (c.email && c.email.toLowerCase().includes(lowerQuery))
    );
  };

  useEffect(() => {
    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    customers,
    loading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
    refresh: loadCustomers,
  };
}