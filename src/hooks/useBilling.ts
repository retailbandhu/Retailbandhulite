/**
 * useBilling Hook
 * Manages billing operations with async support
 * Handles voice commands, product search, and bill generation
 */

import { useState, useCallback } from 'react';
import type { Product, BillItem } from '../types';
import { storage } from '../utils/storage';
import { toast } from 'sonner@2.0.3';

interface UseBillingReturn {
  billItems: BillItem[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  addItem: (item: BillItem) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  applyDiscount: (percentage: number) => void;
  clearBill: () => void;
  searchProducts: (query: string) => Promise<Product[]>;
  saveBill: (customerName: string) => Promise<void>;
  saving: boolean;
}

export function useBilling(): UseBillingReturn {
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [saving, setSaving] = useState(false);

  // Calculate totals
  const totalAmount = billItems.reduce((sum, item) => sum + item.total, 0);
  const finalAmount = totalAmount - (totalAmount * discount) / 100;

  const addItem = useCallback((item: BillItem) => {
    setBillItems(prev => {
      // Check if product already exists
      const existingIndex = prev.findIndex(i => i.productName === item.productName);
      
      if (existingIndex >= 0) {
        // Update existing item quantity
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + item.quantity,
          total: (updated[existingIndex].quantity + item.quantity) * updated[existingIndex].price,
        };
        return updated;
      }
      
      // Add new item
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((index: number) => {
    setBillItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateQuantity = useCallback((index: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(index);
      return;
    }

    setBillItems(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        quantity,
        total: quantity * updated[index].price,
      };
      return updated;
    });
  }, [removeItem]);

  const applyDiscount = useCallback((percentage: number) => {
    const clamped = Math.max(0, Math.min(100, percentage));
    setDiscount(clamped);
  }, []);

  const clearBill = useCallback(() => {
    setBillItems([]);
    setDiscount(0);
  }, []);

  const searchProducts = useCallback(async (query: string): Promise<Product[]> => {
    if (!query || query.length < 2) return [];
    
    try {
      return await storage.searchProductsAsync(query);
    } catch (err) {
      console.error('Product search error:', err);
      // Fallback to sync search
      const products = storage.getProducts();
      return products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  }, []);

  const saveBill = useCallback(async (customerName: string) => {
    if (billItems.length === 0) {
      toast.error('Bill is empty');
      return;
    }

    setSaving(true);
    try {
      const bills = storage.getBills();
      const billNo = bills.length > 0 ? Math.max(...bills.map(b => b.billNo)) + 1 : 1;

      const bill = {
        id: Date.now().toString(),
        billNo,
        customerName: customerName || 'Walk-in Customer',
        items: billItems,
        subtotal: totalAmount,
        discount,
        total: finalAmount,
        date: new Date().toISOString(),
      };

      // Save bill
      storage.addBill(bill);

      // Update stock for each item
      const products = storage.getProducts();
      const updatedProducts = products.map(product => {
        const billItem = billItems.find(item => item.productName === product.name);
        if (billItem) {
          return {
            ...product,
            stock: Math.max(0, product.stock - billItem.quantity),
          };
        }
        return product;
      });
      storage.setProducts(updatedProducts);

      toast.success(`Bill #${billNo} saved successfully!`);
      clearBill();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save bill';
      toast.error(message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [billItems, totalAmount, discount, finalAmount, clearBill]);

  return {
    billItems,
    totalAmount,
    discount,
    finalAmount,
    addItem,
    removeItem,
    updateQuantity,
    applyDiscount,
    clearBill,
    searchProducts,
    saveBill,
    saving,
  };
}