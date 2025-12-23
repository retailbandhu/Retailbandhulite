# 📋 **PHASE 2 PREVIEW - Async Migration Made Easy**

## **Quick Reference: How to Migrate Components**

This shows exactly how easy it is to migrate from sync → async.

---

## **Example 1: Update Product Loading**

### **BEFORE (Current - Synchronous):**

```typescript
// InventoryScreen.tsx
import { storage } from './utils/storage';

function InventoryScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    // Synchronous - blocks UI
    const savedProducts = storage.getProducts();
    setProducts(savedProducts);
  }, []);
  
  const handleAddProduct = (product: Product) => {
    const updated = [...products, product];
    setProducts(updated);
    storage.setProducts(updated); // Synchronous write
  };
  
  return (
    <div>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
```

### **AFTER (Phase 2 - Asynchronous):**

```typescript
// InventoryScreen.tsx
import { storage } from './utils/storage';

function InventoryScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        // Async - non-blocking, with caching
        const savedProducts = await storage.getProductsAsync();
        setProducts(savedProducts);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);
  
  const handleAddProduct = async (product: Product) => {
    try {
      // Optimistic update
      setProducts(prev => [...prev, product]);
      
      // Async save with error handling
      await storage.addProductAsync(product);
      
      toast.success('Product added!');
    } catch (err) {
      // Rollback on error
      setProducts(prev => prev.filter(p => p.id !== product.id));
      toast.error('Failed to add product');
    }
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <ErrorMessage message={error} retry={() => window.location.reload()} />;
  }
  
  return (
    <div>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
```

### **BENEFITS:**
- ✅ Better error handling
- ✅ Loading states for UX
- ✅ Optimistic updates
- ✅ Rollback on failure
- ✅ Non-blocking UI
- ✅ Ready for cloud sync

---

## **Example 2: Update Dashboard Data**

### **BEFORE:**

```typescript
// Dashboard.tsx
const products = storage.getProducts();
const bills = storage.getBills();
const customers = storage.getCustomers();

// Calculate totals
const totalProducts = products.length;
const todaySales = bills.filter(b => b.date === today).length;
```

### **AFTER:**

```typescript
// Dashboard.tsx
const [dashboardData, setDashboardData] = useState({
  products: [],
  bills: [],
  customers: [],
  loading: true
});

useEffect(() => {
  async function loadDashboard() {
    try {
      // Load all data in parallel for speed
      const [products, bills, customers] = await Promise.all([
        storage.getProductsAsync(),
        storage.getBills(), // Still using sync for now (gradual migration)
        storage.getCustomers()
      ]);
      
      setDashboardData({
        products,
        bills,
        customers,
        loading: false
      });
    } catch (err) {
      console.error('Dashboard load failed:', err);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  }
  loadDashboard();
}, []);

if (dashboardData.loading) {
  return <DashboardSkeleton />;
}

const totalProducts = dashboardData.products.length;
const todaySales = dashboardData.bills.filter(b => b.date === today).length;
```

### **BENEFITS:**
- ✅ Parallel loading (faster)
- ✅ Better UX with skeleton
- ✅ Gradual migration (mix sync/async)
- ✅ Error resilience

---

## **Example 3: Search with Async**

### **BEFORE:**

```typescript
// Search.tsx
const handleSearch = (query: string) => {
  const products = storage.getProducts();
  const results = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase())
  );
  setResults(results);
};
```

### **AFTER:**

```typescript
// Search.tsx
const handleSearch = async (query: string) => {
  try {
    setSearching(true);
    
    // Uses cached data + optimized search
    const results = await storage.searchProductsAsync(query);
    
    setResults(results);
  } catch (err) {
    toast.error('Search failed');
  } finally {
    setSearching(false);
  }
};

// With debouncing for better UX
const debouncedSearch = useDebounce(handleSearch, 300);
```

### **BENEFITS:**
- ✅ Faster search (uses cache)
- ✅ Debouncing prevents spam
- ✅ Better error handling
- ✅ Non-blocking UI

---

## **Example 4: Custom Hook for Data Management**

Create reusable hooks for common patterns:

```typescript
// hooks/useProducts.ts
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await storage.getProductsAsync();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };
  
  const addProduct = async (product: Product) => {
    // Optimistic update
    setProducts(prev => [...prev, product]);
    
    try {
      await storage.addProductAsync(product);
      toast.success('Product added!');
    } catch (err) {
      // Rollback
      setProducts(prev => prev.filter(p => p.id !== product.id));
      toast.error('Failed to add product');
      throw err;
    }
  };
  
  const updateProduct = async (id: string, data: Partial<Product>) => {
    // Optimistic update
    setProducts(prev => 
      prev.map(p => p.id === id ? { ...p, ...data } : p)
    );
    
    try {
      await storage.updateProductAsync(id, data);
      toast.success('Product updated!');
    } catch (err) {
      // Reload on error
      await loadProducts();
      toast.error('Failed to update product');
      throw err;
    }
  };
  
  const deleteProduct = async (id: string) => {
    // Optimistic delete
    const backup = products;
    setProducts(prev => prev.filter(p => p.id !== id));
    
    try {
      await storage.deleteProductAsync(id);
      toast.success('Product deleted!');
    } catch (err) {
      // Restore on error
      setProducts(backup);
      toast.error('Failed to delete product');
      throw err;
    }
  };
  
  useEffect(() => {
    loadProducts();
  }, []);
  
  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refresh: loadProducts
  };
}

// Usage in component:
function InventoryScreen() {
  const { products, loading, error, addProduct, deleteProduct } = useProducts();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <div>
      {products.map(p => (
        <ProductCard 
          key={p.id} 
          product={p}
          onDelete={() => deleteProduct(p.id)}
        />
      ))}
    </div>
  );
}
```

### **BENEFITS:**
- ✅ Reusable logic
- ✅ Consistent error handling
- ✅ Optimistic updates everywhere
- ✅ Clean component code
- ✅ Easy testing

---

## **Example 5: Loading Skeletons**

```typescript
// LoadingSpinner.tsx
export function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 h-32 rounded-lg mb-2" />
          <div className="bg-gray-200 h-4 rounded w-3/4 mb-2" />
          <div className="bg-gray-200 h-4 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

// Usage:
{loading ? <ProductListSkeleton /> : <ProductList products={products} />}
```

---

## **Migration Checklist**

### **For Each Screen:**

- [ ] Add loading state
- [ ] Add error state
- [ ] Replace sync with async methods
- [ ] Add loading skeleton
- [ ] Add error message component
- [ ] Implement optimistic updates
- [ ] Add rollback on errors
- [ ] Add toast notifications
- [ ] Test error scenarios
- [ ] Test offline scenarios

### **Files to Update (Priority Order):**

1. **High Priority (Core Data):**
   - [ ] `/App.tsx` - Initial data loading
   - [ ] `/components/InventoryScreen.tsx` - Product CRUD
   - [ ] `/components/Dashboard.tsx` - Dashboard data
   - [ ] `/components/EnhancedBillingScreen.tsx` - Billing operations

2. **Medium Priority (Features):**
   - [ ] `/components/ReportsScreen.tsx` - Sales data
   - [ ] `/components/CustomerManagement.tsx` - Customer CRUD
   - [ ] `/components/ExpenseTracker.tsx` - Expense CRUD
   - [ ] `/components/KhataManagement.tsx` - Khata operations

3. **Low Priority (Settings):**
   - [ ] `/components/DataBackup.tsx` - Export/Import
   - [ ] `/components/SettingsScreen.tsx` - Settings management

---

## **Testing Plan**

### **1. Unit Tests:**
```typescript
describe('useProducts hook', () => {
  it('loads products on mount', async () => {
    const { result } = renderHook(() => useProducts());
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.products.length).toBeGreaterThan(0);
    });
  });
  
  it('handles add product', async () => {
    const { result } = renderHook(() => useProducts());
    
    await act(async () => {
      await result.current.addProduct({
        id: 'test',
        name: 'Test Product',
        price: 100,
        stock: 10,
        category: 'Test'
      });
    });
    
    expect(result.current.products).toContainEqual(
      expect.objectContaining({ name: 'Test Product' })
    );
  });
});
```

### **2. Integration Tests:**
```typescript
describe('InventoryScreen integration', () => {
  it('loads and displays products', async () => {
    render(<InventoryScreen />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/maggie/i)).toBeInTheDocument();
    });
  });
  
  it('handles add product flow', async () => {
    render(<InventoryScreen />);
    
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    const addButton = screen.getByText(/add product/i);
    fireEvent.click(addButton);
    
    // Fill form and submit
    // ...
    
    await waitFor(() => {
      expect(screen.getByText(/product added/i)).toBeInTheDocument();
    });
  });
});
```

### **3. Error Scenario Tests:**
```typescript
it('handles storage errors gracefully', async () => {
  // Mock storage error
  jest.spyOn(storage, 'getProductsAsync').mockRejectedValue(
    new Error('Storage quota exceeded')
  );
  
  render(<InventoryScreen />);
  
  await waitFor(() => {
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });
});
```

---

## **Estimated Timeline**

### **Per Screen:**
- Reading existing code: 10 min
- Adding loading states: 15 min
- Converting to async: 20 min
- Adding error handling: 15 min
- Testing: 20 min
- **Total per screen:** ~80 min

### **Total for Phase 2:**
- High priority screens (4): ~5 hours
- Medium priority screens (4): ~5 hours
- Low priority screens (2): ~3 hours
- Testing & polish: 2 hours
- **Total:** ~15 hours

### **Recommended Approach:**
- **Week 1:** High priority (5 hours)
- **Week 2:** Medium priority (5 hours)
- **Week 3:** Low priority + testing (5 hours)

---

## **Quick Wins**

Start with these for immediate impact:

### **1. Dashboard (30 min):**
- Add loading skeleton
- Load data async
- Instant improvement

### **2. Inventory Search (30 min):**
- Use searchProductsAsync
- Add debouncing
- Much faster

### **3. Product Add (45 min):**
- Optimistic update
- Error handling
- Better UX

**Total: 2 hours for 3 major improvements!**

---

## **Ready to Start?**

Everything is prepared:
- ✅ Infrastructure ready
- ✅ Methods available
- ✅ Examples provided
- ✅ Testing plan ready

**Just copy the patterns and apply! 🚀**
