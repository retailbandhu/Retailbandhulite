/**
 * useProducts Hook
 * Manages product data with async operations
 * Provides optimistic updates and error handling
 */

import { useState, useEffect } from 'react';
import type { Product } from '../types';
import { storage } from '../utils/storage';
import { toast } from 'sonner@2.0.3';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  searchProducts: (query: string) => Promise<Product[]>;
  refresh: () => Promise<void>;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await storage.getProductsAsync();
      setProducts(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load products';
      setError(message);
      console.error('Load products error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Product) => {
    // Optimistic update
    setProducts(prev => [...prev, product]);

    try {
      await storage.addProductAsync(product);
      toast.success('Product added successfully!');
    } catch (err) {
      // Rollback on error
      setProducts(prev => prev.filter(p => p.id !== product.id));
      const message = err instanceof Error ? err.message : 'Failed to add product';
      toast.error(message);
      throw err;
    }
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    // Save current state for rollback
    const previousProducts = products;
    
    // Optimistic update
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...data } : p))
    );

    try {
      await storage.updateProductAsync(id, data);
      toast.success('Product updated successfully!');
    } catch (err) {
      // Rollback on error
      setProducts(previousProducts);
      const message = err instanceof Error ? err.message : 'Failed to update product';
      toast.error(message);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    // Save current state for rollback
    const previousProducts = products;
    
    // Optimistic delete
    setProducts(prev => prev.filter(p => p.id !== id));

    try {
      await storage.deleteProductAsync(id);
      toast.success('Product deleted successfully!');
    } catch (err) {
      // Restore on error
      setProducts(previousProducts);
      const message = err instanceof Error ? err.message : 'Failed to delete product';
      toast.error(message);
      throw err;
    }
  };

  const searchProducts = async (query: string): Promise<Product[]> => {
    try {
      return await storage.searchProductsAsync(query);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed';
      toast.error(message);
      return [];
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    refresh: loadProducts,
  };
}