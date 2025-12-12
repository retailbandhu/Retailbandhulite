import { Product, StoreInfo, BillItem } from '../App';
import { api } from './api';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalPurchases: number;
  lastVisit: string;
  loyaltyPoints?: number;
  tier?: string;
}

export interface Bill {
  id: string;
  billNumber: string;
  items: BillItem[];
  customer?: Customer;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Credit';
  date: string;
  time: string;
  gstEnabled?: boolean;
}

export interface KhataEntry {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: string;
  billId?: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod: string;
  partyName?: string;
}

export interface Party {
  id: string;
  name: string;
  phone: string;
  type: 'Supplier' | 'Vendor' | 'Service Provider';
  totalPurchases: number;
  pendingAmount: number;
}

const KEYS = {
  STORE_ID: 'retail_bandhu_store_id',
  SETTINGS: 'retail_bandhu_settings',
  ONBOARDING: 'retail_bandhu_onboarding_done',
  LOGIN: 'retail_bandhu_logged_in',
  STORE_SETUP: 'retail_bandhu_store_setup_done',
  PRODUCTS_CACHE: 'retail_bandhu_products',
  CUSTOMERS_CACHE: 'retail_bandhu_customers',
  BILLS_CACHE: 'retail_bandhu_bills',
  KHATA_CACHE: 'retail_bandhu_khata',
  EXPENSES_CACHE: 'retail_bandhu_expenses',
  PARTIES_CACHE: 'retail_bandhu_parties',
  STORE_INFO_CACHE: 'retail_bandhu_store_info',
};

const getStoreId = (): number | null => {
  const id = localStorage.getItem(KEYS.STORE_ID);
  return id ? parseInt(id) : null;
};

const setStoreId = (id: number) => {
  localStorage.setItem(KEYS.STORE_ID, id.toString());
};

const LOCAL_ID_PREFIX = 'local_';

const isLocalId = (id: string): boolean => id.startsWith(LOCAL_ID_PREFIX);

const generateLocalId = (): string => `${LOCAL_ID_PREFIX}${Date.now()}`;

const mapDbProduct = (p: any): Product => ({
  id: p.id.toString(),
  name: p.name,
  price: parseFloat(p.price),
  stock: p.stock || 0,
  category: p.category || 'General',
  image: p.image || '',
  barcode: p.barcode || '',
  hsnCode: p.hsnCode || '',
  gstRate: p.gstRate ? parseFloat(p.gstRate) : 0,
});

const mapDbCustomer = (c: any): Customer => ({
  id: c.id.toString(),
  name: c.name,
  phone: c.phone || '',
  email: c.email || '',
  address: c.address || '',
  totalPurchases: parseFloat(c.totalPurchases || '0'),
  lastVisit: c.lastVisit ? new Date(c.lastVisit).toISOString() : new Date().toISOString(),
  loyaltyPoints: c.loyaltyPoints || 0,
  tier: c.tier || 'Bronze',
});

const mapDbBill = (b: any): Bill => ({
  id: b.id.toString(),
  billNumber: b.billNumber,
  items: b.items || [],
  subtotal: parseFloat(b.subtotal),
  tax: parseFloat(b.tax || '0'),
  discount: parseFloat(b.discount || '0'),
  total: parseFloat(b.total),
  paymentMethod: b.paymentMethod || 'Cash',
  date: b.createdAt ? new Date(b.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
  time: b.createdAt ? new Date(b.createdAt).toLocaleTimeString() : new Date().toLocaleTimeString(),
  gstEnabled: b.gstEnabled || false,
});

const mapDbKhata = (k: any): KhataEntry => ({
  id: k.id.toString(),
  customerId: k.customerId?.toString() || '',
  customerName: k.customerName,
  amount: parseFloat(k.amount),
  type: k.type as 'credit' | 'debit',
  description: k.description || '',
  date: k.createdAt ? new Date(k.createdAt).toISOString() : new Date().toISOString(),
  billId: k.billId?.toString(),
});

const mapDbExpense = (e: any): Expense => ({
  id: e.id.toString(),
  category: e.category,
  amount: parseFloat(e.amount),
  description: e.description || '',
  date: e.createdAt ? new Date(e.createdAt).toISOString() : new Date().toISOString(),
  paymentMethod: e.paymentMethod || 'Cash',
  partyName: e.partyName,
});

const mapDbParty = (p: any): Party => ({
  id: p.id.toString(),
  name: p.name,
  phone: p.phone || '',
  type: (p.type as Party['type']) || 'Supplier',
  totalPurchases: parseFloat(p.totalPurchases || '0'),
  pendingAmount: parseFloat(p.pendingAmount || '0'),
});

export const storage = {
  getStoreId,
  setStoreId,

  getProducts: (): Product[] => {
    const data = localStorage.getItem(KEYS.PRODUCTS_CACHE);
    return data ? JSON.parse(data) : [];
  },

  setProducts: (products: Product[]) => {
    localStorage.setItem(KEYS.PRODUCTS_CACHE, JSON.stringify(products));
  },

  fetchProducts: async (): Promise<Product[]> => {
    const storeId = getStoreId();
    if (!storeId) return storage.getProducts();
    try {
      const serverProducts = await api.getProducts(storeId) as any[];
      const mapped = serverProducts.map(mapDbProduct);
      const localProducts = storage.getProducts().filter(p => isLocalId(p.id));
      const merged = [...mapped, ...localProducts];
      storage.setProducts(merged);
      return merged;
    } catch {
      return storage.getProducts();
    }
  },

  addProduct: async (product: Omit<Product, 'id'>): Promise<Product | null> => {
    const localProduct = { ...product, id: generateLocalId() } as Product;
    const products = storage.getProducts();
    products.push(localProduct);
    storage.setProducts(products);
    
    const storeId = getStoreId();
    if (storeId) {
      try {
        const created = await api.createProduct(storeId, {
          name: product.name,
          price: product.price.toString(),
          stock: product.stock,
          category: product.category,
          image: product.image,
          barcode: product.barcode,
          hsnCode: product.hsnCode,
          gstRate: product.gstRate?.toString(),
        }) as any;
        const serverProduct = mapDbProduct(created);
        const updatedProducts = storage.getProducts().filter(p => p.id !== localProduct.id);
        updatedProducts.push(serverProduct);
        storage.setProducts(updatedProducts);
        return serverProduct;
      } catch {}
    }
    return localProduct;
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<boolean> => {
    const products = storage.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      storage.setProducts(products);
    }
    const storeId = getStoreId();
    if (!isLocalId(id) && storeId) {
      try {
        await api.updateProduct(storeId, parseInt(id), {
          ...updates,
          price: updates.price?.toString(),
          gstRate: updates.gstRate?.toString(),
        });
      } catch {}
    }
    return true;
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    const products = storage.getProducts().filter(p => p.id !== id);
    storage.setProducts(products);
    const storeId = getStoreId();
    if (!isLocalId(id) && storeId) {
      try {
        await api.deleteProduct(storeId, parseInt(id));
      } catch {}
    }
    return true;
  },

  getTopProducts: (): Product[] => {
    const products = storage.getProducts();
    return products.slice(0, 10).sort((a, b) => b.price - a.price);
  },

  getStoreInfo: (): StoreInfo | null => {
    const data = localStorage.getItem(KEYS.STORE_INFO_CACHE);
    return data ? JSON.parse(data) : null;
  },

  setStoreInfo: (storeInfo: StoreInfo) => {
    localStorage.setItem(KEYS.STORE_INFO_CACHE, JSON.stringify(storeInfo));
  },

  initializeStore: async (storeInfo: StoreInfo): Promise<number | null> => {
    try {
      const created = await api.createStore({
        name: storeInfo.name,
        owner: storeInfo.owner,
        phone: storeInfo.phone,
        address: storeInfo.address,
        gstin: storeInfo.gstin,
      }) as any;
      setStoreId(created.id);
      storage.setStoreInfo({ ...storeInfo, id: created.id.toString() });
      return created.id;
    } catch {
      return null;
    }
  },

  fetchStoreInfo: async (): Promise<StoreInfo | null> => {
    const storeId = getStoreId();
    if (!storeId) return storage.getStoreInfo();
    try {
      const store = await api.getStore(storeId) as any;
      const info: StoreInfo = {
        id: store.id.toString(),
        name: store.name,
        owner: store.owner,
        phone: store.phone || '',
        address: store.address || '',
        gstin: store.gstin || '',
      };
      storage.setStoreInfo(info);
      return info;
    } catch {
      return storage.getStoreInfo();
    }
  },

  getCustomers: (): Customer[] => {
    const data = localStorage.getItem(KEYS.CUSTOMERS_CACHE);
    return data ? JSON.parse(data) : [];
  },

  setCustomers: (customers: Customer[]) => {
    localStorage.setItem(KEYS.CUSTOMERS_CACHE, JSON.stringify(customers));
  },

  fetchCustomers: async (): Promise<Customer[]> => {
    const storeId = getStoreId();
    if (!storeId) return storage.getCustomers();
    try {
      const serverCustomers = await api.getCustomers(storeId) as any[];
      const mapped = serverCustomers.map(mapDbCustomer);
      const localCustomers = storage.getCustomers().filter(c => isLocalId(c.id));
      const merged = [...mapped, ...localCustomers];
      storage.setCustomers(merged);
      return merged;
    } catch {
      return storage.getCustomers();
    }
  },

  addCustomer: async (customer: Omit<Customer, 'id'>): Promise<Customer | null> => {
    const localCustomer = { ...customer, id: generateLocalId() } as Customer;
    const customers = storage.getCustomers();
    customers.push(localCustomer);
    storage.setCustomers(customers);
    
    const storeId = getStoreId();
    if (storeId) {
      try {
        const created = await api.createCustomer(storeId, {
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          address: customer.address,
          totalPurchases: customer.totalPurchases?.toString() || '0',
          loyaltyPoints: customer.loyaltyPoints || 0,
          tier: customer.tier || 'Bronze',
        }) as any;
        const serverCustomer = mapDbCustomer(created);
        const updatedCustomers = storage.getCustomers().filter(c => c.id !== localCustomer.id);
        updatedCustomers.push(serverCustomer);
        storage.setCustomers(updatedCustomers);
        return serverCustomer;
      } catch {}
    }
    return localCustomer;
  },

  updateCustomer: async (id: string, updates: Partial<Customer>): Promise<boolean> => {
    const customers = storage.getCustomers();
    const index = customers.findIndex(c => c.id === id);
    if (index !== -1) {
      customers[index] = { ...customers[index], ...updates };
      storage.setCustomers(customers);
    }
    const storeId = getStoreId();
    if (!isLocalId(id) && storeId) {
      try {
        await api.updateCustomer(storeId, parseInt(id), {
          ...updates,
          totalPurchases: updates.totalPurchases?.toString(),
        });
      } catch {}
    }
    return true;
  },

  getBills: (): Bill[] => {
    const data = localStorage.getItem(KEYS.BILLS_CACHE);
    return data ? JSON.parse(data) : [];
  },

  setBills: (bills: Bill[]) => {
    localStorage.setItem(KEYS.BILLS_CACHE, JSON.stringify(bills));
  },

  fetchBills: async (): Promise<Bill[]> => {
    const storeId = getStoreId();
    if (!storeId) return storage.getBills();
    try {
      const serverBills = await api.getBills(storeId) as any[];
      const mapped = serverBills.map(mapDbBill);
      const localBills = storage.getBills().filter(b => isLocalId(b.id));
      const merged = [...mapped, ...localBills];
      storage.setBills(merged);
      return merged;
    } catch {
      return storage.getBills();
    }
  },

  addBill: async (bill: Omit<Bill, 'id'>): Promise<Bill | null> => {
    const localBill = { ...bill, id: generateLocalId() } as Bill;
    const bills = storage.getBills();
    bills.unshift(localBill);
    storage.setBills(bills);
    
    const storeId = getStoreId();
    if (storeId) {
      try {
        const customerId = bill.customer?.id && !isLocalId(bill.customer.id) ? parseInt(bill.customer.id) : null;
        const created = await api.createBill(storeId, {
          billNumber: bill.billNumber,
          items: bill.items,
          subtotal: bill.subtotal.toString(),
          tax: bill.tax.toString(),
          discount: bill.discount.toString(),
          total: bill.total.toString(),
          paymentMethod: bill.paymentMethod,
          gstEnabled: bill.gstEnabled || false,
          customerId,
        }) as any;
        const serverBill = mapDbBill(created);
        const updatedBills = storage.getBills().filter(b => b.id !== localBill.id);
        updatedBills.unshift(serverBill);
        storage.setBills(updatedBills);
        return serverBill;
      } catch {}
    }
    return localBill;
  },

  getKhataEntries: (): KhataEntry[] => {
    const data = localStorage.getItem(KEYS.KHATA_CACHE);
    return data ? JSON.parse(data) : [];
  },

  setKhataEntries: (entries: KhataEntry[]) => {
    localStorage.setItem(KEYS.KHATA_CACHE, JSON.stringify(entries));
  },

  fetchKhataEntries: async (): Promise<KhataEntry[]> => {
    const storeId = getStoreId();
    if (!storeId) return storage.getKhataEntries();
    try {
      const serverEntries = await api.getKhata(storeId) as any[];
      const mapped = serverEntries.map(mapDbKhata);
      const localEntries = storage.getKhataEntries().filter(k => isLocalId(k.id));
      const merged = [...mapped, ...localEntries];
      storage.setKhataEntries(merged);
      return merged;
    } catch {
      return storage.getKhataEntries();
    }
  },

  addKhataEntry: async (entry: Omit<KhataEntry, 'id'>): Promise<KhataEntry | null> => {
    const localEntry = { ...entry, id: generateLocalId() } as KhataEntry;
    const entries = storage.getKhataEntries();
    entries.unshift(localEntry);
    storage.setKhataEntries(entries);
    
    const storeId = getStoreId();
    if (storeId) {
      try {
        const customerId = entry.customerId && !isLocalId(entry.customerId) ? parseInt(entry.customerId) : null;
        const billId = entry.billId && !isLocalId(entry.billId) ? parseInt(entry.billId) : null;
        const created = await api.createKhataEntry(storeId, {
          customerName: entry.customerName,
          customerId,
          amount: entry.amount.toString(),
          type: entry.type,
          description: entry.description,
          billId,
        }) as any;
        const serverEntry = mapDbKhata(created);
        const updatedEntries = storage.getKhataEntries().filter(k => k.id !== localEntry.id);
        updatedEntries.unshift(serverEntry);
        storage.setKhataEntries(updatedEntries);
        return serverEntry;
      } catch {}
    }
    return localEntry;
  },

  getExpenses: (): Expense[] => {
    const data = localStorage.getItem(KEYS.EXPENSES_CACHE);
    return data ? JSON.parse(data) : [];
  },

  setExpenses: (expenses: Expense[]) => {
    localStorage.setItem(KEYS.EXPENSES_CACHE, JSON.stringify(expenses));
  },

  fetchExpenses: async (): Promise<Expense[]> => {
    const storeId = getStoreId();
    if (!storeId) return storage.getExpenses();
    try {
      const serverExpenses = await api.getExpenses(storeId) as any[];
      const mapped = serverExpenses.map(mapDbExpense);
      const localExpenses = storage.getExpenses().filter(e => isLocalId(e.id));
      const merged = [...mapped, ...localExpenses];
      storage.setExpenses(merged);
      return merged;
    } catch {
      return storage.getExpenses();
    }
  },

  addExpense: async (expense: Omit<Expense, 'id'>): Promise<Expense | null> => {
    const localExpense = { ...expense, id: generateLocalId() } as Expense;
    const expenses = storage.getExpenses();
    expenses.unshift(localExpense);
    storage.setExpenses(expenses);
    
    const storeId = getStoreId();
    if (storeId) {
      try {
        const created = await api.createExpense(storeId, {
          category: expense.category,
          amount: expense.amount.toString(),
          description: expense.description,
          paymentMethod: expense.paymentMethod,
          partyName: expense.partyName,
        }) as any;
        const serverExpense = mapDbExpense(created);
        const updatedExpenses = storage.getExpenses().filter(e => e.id !== localExpense.id);
        updatedExpenses.unshift(serverExpense);
        storage.setExpenses(updatedExpenses);
        return serverExpense;
      } catch {}
    }
    return localExpense;
  },

  getParties: (): Party[] => {
    const data = localStorage.getItem(KEYS.PARTIES_CACHE);
    return data ? JSON.parse(data) : [];
  },

  setParties: (parties: Party[]) => {
    localStorage.setItem(KEYS.PARTIES_CACHE, JSON.stringify(parties));
  },

  fetchParties: async (): Promise<Party[]> => {
    const storeId = getStoreId();
    if (!storeId) return storage.getParties();
    try {
      const serverParties = await api.getParties(storeId) as any[];
      const mapped = serverParties.map(mapDbParty);
      const localParties = storage.getParties().filter(p => isLocalId(p.id));
      const merged = [...mapped, ...localParties];
      storage.setParties(merged);
      return merged;
    } catch {
      return storage.getParties();
    }
  },

  addParty: async (party: Omit<Party, 'id'>): Promise<Party | null> => {
    const localParty = { ...party, id: generateLocalId() } as Party;
    const parties = storage.getParties();
    parties.push(localParty);
    storage.setParties(parties);
    
    const storeId = getStoreId();
    if (storeId) {
      try {
        const created = await api.createParty(storeId, {
          name: party.name,
          phone: party.phone,
          type: party.type,
          totalPurchases: party.totalPurchases?.toString() || '0',
          pendingAmount: party.pendingAmount?.toString() || '0',
        }) as any;
        const serverParty = mapDbParty(created);
        const updatedParties = storage.getParties().filter(p => p.id !== localParty.id);
        updatedParties.push(serverParty);
        storage.setParties(updatedParties);
        return serverParty;
      } catch {}
    }
    return localParty;
  },

  getSettings: (): { language: 'en' | 'hi' } => {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : { language: 'en' };
  },

  setSettings: (settings: { language: 'en' | 'hi' }) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  getOnboardingDone: (): boolean => {
    return localStorage.getItem(KEYS.ONBOARDING) === 'true';
  },

  setOnboardingDone: (done: boolean) => {
    localStorage.setItem(KEYS.ONBOARDING, done.toString());
  },

  getLoggedIn: (): boolean => {
    return localStorage.getItem(KEYS.LOGIN) === 'true';
  },

  setLoggedIn: (loggedIn: boolean) => {
    localStorage.setItem(KEYS.LOGIN, loggedIn.toString());
  },

  getStoreSetupDone: (): boolean => {
    return localStorage.getItem(KEYS.STORE_SETUP) === 'true';
  },

  setStoreSetupDone: (done: boolean) => {
    localStorage.setItem(KEYS.STORE_SETUP, done.toString());
  },

  clearAll: () => {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  },

  syncFromDatabase: async () => {
    await Promise.all([
      storage.fetchProducts(),
      storage.fetchCustomers(),
      storage.fetchBills(),
      storage.fetchKhataEntries(),
      storage.fetchExpenses(),
      storage.fetchParties(),
      storage.fetchStoreInfo(),
    ]);
  },
};

export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

export const generateBillNumber = (): string => {
  const bills = storage.getBills();
  const lastBillNumber = bills.length > 0 ? parseInt(bills[0].billNumber.replace('RB', '')) : 0;
  return `RB${String(lastBillNumber + 1).padStart(6, '0')}`;
};
