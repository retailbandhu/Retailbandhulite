/**
 * App Data API Routes
 * Handles all main app data: Products, Bills, Customers, Reports
 * Uses Supabase KV store for data persistence
 */

import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";
import { validateProduct, validateCustomer, validateBill, validateStoreInfo, checkRateLimit } from "./validation.tsx";

export const appRouter = new Hono();

// ============================================
// PRODUCTS API
// ============================================

// Get all products for a store
appRouter.get("/products/:storeId", async (c) => {
  try {
    const storeId = c.req.param("storeId");
    const products = await kv.get(`store:${storeId}:products`);
    return c.json({ success: true, data: products || [] });
  } catch (error) {
    console.error("Error fetching products:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Add a new product
appRouter.post("/products/:storeId", async (c) => {
  try {
    const storeId = c.req.param("storeId");
    const newProduct = await c.req.json();
    
    // Validate product
    const validation = validateProduct(newProduct);
    if (!validation.valid) {
      return c.json({ success: false, error: validation.errors.join(', ') }, 400);
    }
    
    // Get existing products
    const products = await kv.get(`store:${storeId}:products`) || [];
    
    // Add new product (use sanitized data)
    products.push({
      ...validation.sanitized,
      id: validation.sanitized!.id || Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    // Save back
    await kv.set(`store:${storeId}:products`, products);
    
    return c.json({ 
      success: true, 
      message: "Product added successfully",
      data: products[products.length - 1]
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update a product
appRouter.put("/products/:storeId/:productId", async (c) => {
  try {
    const storeId = c.req.param("storeId");
    const productId = c.req.param("productId");
    const updates = await c.req.json();
    
    // Validate product
    const validation = validateProduct(updates);
    if (!validation.valid) {
      return c.json({ success: false, error: validation.errors.join(', ') }, 400);
    }
    
    // Get existing products
    const products = await kv.get(`store:${storeId}:products`) || [];
    
    // Find and update product
    const index = products.findIndex((p: any) => p.id === productId);
    if (index === -1) {
      return c.json({ success: false, error: "Product not found" }, 404);
    }
    
    products[index] = {
      ...products[index],
      ...validation.sanitized,
      updatedAt: new Date().toISOString(),
    };
    
    // Save back
    await kv.set(`store:${storeId}:products`, products);
    
    return c.json({ 
      success: true, 
      message: "Product updated successfully",
      data: products[index]
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete a product
appRouter.delete("/products/:storeId/:productId", async (c) => {
  try {
    const storeId = c.req.param("storeId");
    const productId = c.req.param("productId");
    
    // Get existing products
    const products = await kv.get(`store:${storeId}:products`) || [];
    
    // Filter out deleted product
    const updatedProducts = products.filter((p: any) => p.id !== productId);
    
    if (products.length === updatedProducts.length) {
      return c.json({ success: false, error: "Product not found" }, 404);
    }
    
    // Save back
    await kv.set(`store:${storeId}:products`, updatedProducts);
    
    return c.json({ 
      success: true, 
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// CUSTOMERS API
// ============================================

// Get all customers for a store
appRouter.get("/customers/:storeId", async (c) => {
  try {
    const storeId = c.req.param("storeId");
    const customers = await kv.get(`store:${storeId}:customers`);
    return c.json({ success: true, data: customers || [] });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Add a new customer
appRouter.post("/customers/:storeId", async (c) => {
  try {
    const storeId = c.req.param("storeId");
    const newCustomer = await c.req.json();
    
    // Validate customer
    const validation = validateCustomer(newCustomer);
    if (!validation.valid) {
      return c.json({ success: false, error: validation.errors.join(', ') }, 400);
    }
    
    // Get existing customers
    const customers = await kv.get(`store:${storeId}:customers`) || [];
    
    // Add new customer
    customers.push({
      ...validation.sanitized,
      id: validation.sanitized!.id || Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    // Save back
    await kv.set(`store:${storeId}:customers`, customers);
    
    return c.json({ 
      success: true, 
      message: "Customer added successfully",
      data: customers[customers.length - 1]
    });
  } catch (error) {
    console.error("Error adding customer:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update a customer
appRouter.put("/customers/:storeId/:customerId", async (c) => {
  try {
    const storeId = c.req.param("storeId");
    const customerId = c.req.param("customerId");
    const updates = await c.req.json();
    
    // Validate customer
    const validation = validateCustomer(updates);
    if (!validation.valid) {
      return c.json({ success: false, error: validation.errors.join(', ') }, 400);
    }
    
    // Get existing customers
    const customers = await kv.get(`store:${storeId}:customers`) || [];
    
    // Find and update customer
    const index = customers.findIndex((c: any) => c.id === customerId);
    if (index === -1) {
      return c.json({ success: false, error: "Customer not found" }, 404);
    }
    
    customers[index] = {
      ...customers[index],
      ...validation.sanitized,
      updatedAt: new Date().toISOString(),
    };
    
    // Save back
    await kv.set(`store:${storeId}:customers`, customers);
    
    return c.json({ 
      success: true, 
      message: "Customer updated successfully",
      data: customers[index]
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete a customer
appRouter.delete("/customers/:storeId/:customerId", async (c) => {
  try {
    const storeId = c.req.param("storeId");
    const customerId = c.req.param("customerId");
    
    // Get existing customers
    const customers = await kv.get(`store:${storeId}:customers`) || [];
    
    // Filter out deleted customer
    const updatedCustomers = customers.filter((c: any) => c.id !== customerId);
    
    if (customers.length === updatedCustomers.length) {
      return c.json({ success: false, error: "Customer not found" }, 404);
    }
    
    // Save back
    await kv.set(`store:${storeId}:customers`, updatedCustomers);
    
    return c.json({ 
      success: true, 
      message: "Customer deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// BILLS API
// ============================================

// Get all bills for a store
appRouter.get("/bills/:storeId", async (c) => {
  try {
    const storeId = c.req.param("storeId");
    const bills = await kv.get(`store:${storeId}:bills`);
    return c.json({ success: true, data: bills || [] });
  } catch (error) {
    console.error("Error fetching bills:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Add a new bill
appRouter.post("/bills/:storeId", async (c) => {
  try {
    const storeId = c.req.param("storeId");
    const newBill = await c.req.json();
    
    // Validate bill
    const validation = validateBill(newBill);
    if (!validation.valid) {
      return c.json({ success: false, error: validation.errors.join(', ') }, 400);
    }
    
    // Get existing bills
    const bills = await kv.get(`store:${storeId}:bills`) || [];
    
    // Add new bill (use sanitized data)
    bills.push({
      ...validation.sanitized,
      id: validation.sanitized!.id || Date.now().toString(),
      createdAt: new Date().toISOString(),
    });
    
    // Save back
    await kv.set(`store:${storeId}:bills`, bills);
    
    // Update customer if exists (skip if migrated flag is set)
    if (newBill.customerId && !newBill.migrated) {
      const customers = await kv.get(`store:${storeId}:customers`) || [];
      const customerIndex = customers.findIndex((c: any) => c.id === newBill.customerId);
      if (customerIndex !== -1) {
        customers[customerIndex].totalPurchases = (customers[customerIndex].totalPurchases || 0) + 1;
        customers[customerIndex].totalSpent = (customers[customerIndex].totalSpent || 0) + newBill.total;
        customers[customerIndex].lastVisit = new Date().toISOString().split('T')[0];
        customers[customerIndex].visits = (customers[customerIndex].visits || 0) + 1;
        await kv.set(`store:${storeId}:customers`, customers);
      }
    }
    
    // Update product stock (skip if migrated flag is set)
    if (!newBill.migrated) {
      for (const item of newBill.items) {
        const products = await kv.get(`store:${storeId}:products`) || [];
        const productIndex = products.findIndex((p: any) => p.id === item.id);
        if (productIndex !== -1 && products[productIndex].stock !== undefined) {
          products[productIndex].stock = Math.max(0, products[productIndex].stock - item.quantity);
          await kv.set(`store:${storeId}:products`, products);
        }
      }
    }
    
    return c.json({ 
      success: true, 
      message: "Bill created successfully",
      data: bills[bills.length - 1]
    });
  } catch (error) {
    console.error("Error creating bill:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get bills by date range
appRouter.get("/bills/:storeId/range", async (c) => {
  try {
    const storeId = c.req.param("storeId");
    const startDate = c.req.query("startDate");
    const endDate = c.req.query("endDate");
    
    const bills = await kv.get(`store:${storeId}:bills`) || [];
    
    // Filter by date range if provided
    let filtered = bills;
    if (startDate || endDate) {
      filtered = bills.filter((bill: any) => {
        const billDate = new Date(bill.createdAt || bill.date);
        if (startDate && billDate < new Date(startDate)) return false;
        if (endDate && billDate > new Date(endDate)) return false;
        return true;
      });
    }
    
    return c.json({ success: true, data: filtered });
  } catch (error) {
    console.error("Error fetching bills by range:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// STORE INFO API
// ============================================

// Get store info
appRouter.get("/store/:storeId", async (c) => {
  try {
    const storeId = c.req.param("storeId");
    const storeInfo = await kv.get(`store:${storeId}:info`);
    return c.json({ success: true, data: storeInfo || {} });
  } catch (error) {
    console.error("Error fetching store info:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update store info
appRouter.put("/store/:storeId", async (c) => {
  try {
    const storeId = c.req.param("storeId");
    const updates = await c.req.json();
    
    // Validate store info
    const validation = validateStoreInfo(updates);
    if (!validation.valid) {
      return c.json({ success: false, error: validation.errors.join(', ') }, 400);
    }
    
    // Get existing info
    const storeInfo = await kv.get(`store:${storeId}:info`) || {};
    
    // Update
    const updatedInfo = {
      ...storeInfo,
      ...validation.sanitized,
      updatedAt: new Date().toISOString(),
    };
    
    // Save back
    await kv.set(`store:${storeId}:info`, updatedInfo);
    
    return c.json({ 
      success: true, 
      message: "Store info updated successfully",
      data: updatedInfo
    });
  } catch (error) {
    console.error("Error updating store info:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// REPORTS & ANALYTICS API
// ============================================

// Get dashboard stats
appRouter.get("/analytics/:storeId/dashboard", async (c) => {
  try {
    const storeId = c.req.param("storeId");
    
    // Get all data
    const products = await kv.get(`store:${storeId}:products`) || [];
    const bills = await kv.get(`store:${storeId}:bills`) || [];
    const customers = await kv.get(`store:${storeId}:customers`) || [];
    
    // Calculate stats
    const totalProducts = products.length;
    const totalCustomers = customers.length;
    const totalSales = bills.reduce((sum: number, bill: any) => sum + (bill.total || 0), 0);
    const totalBills = bills.length;
    const lowStockItems = products.filter((p: any) => p.stock !== undefined && p.stock < 10).length;
    
    // Today's sales
    const today = new Date().toISOString().split('T')[0];
    const todayBills = bills.filter((b: any) => {
      const billDate = new Date(b.createdAt || b.date).toISOString().split('T')[0];
      return billDate === today;
    });
    const todaySales = todayBills.reduce((sum: number, bill: any) => sum + (bill.total || 0), 0);
    
    return c.json({ 
      success: true, 
      data: {
        totalProducts,
        totalCustomers,
        totalSales,
        totalBills,
        lowStockItems,
        todaySales,
        todayBills: todayBills.length,
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get sales by period
appRouter.get("/analytics/:storeId/sales", async (c) => {
  try {
    const storeId = c.req.param("storeId");
    const period = c.req.query("period") || "week"; // week, month, year
    
    const bills = await kv.get(`store:${storeId}:bills`) || [];
    
    // Group by date
    const salesByDate: any = {};
    bills.forEach((bill: any) => {
      const date = new Date(bill.createdAt || bill.date).toISOString().split('T')[0];
      if (!salesByDate[date]) {
        salesByDate[date] = { date, sales: 0, count: 0 };
      }
      salesByDate[date].sales += bill.total || 0;
      salesByDate[date].count += 1;
    });
    
    const salesData = Object.values(salesByDate).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    return c.json({ success: true, data: salesData });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get top products
appRouter.get("/analytics/:storeId/top-products", async (c) => {
  try {
    const storeId = c.req.param("storeId");
    const bills = await kv.get(`store:${storeId}:bills`) || [];
    
    // Count product sales
    const productSales: any = {};
    bills.forEach((bill: any) => {
      bill.items?.forEach((item: any) => {
        if (!productSales[item.name]) {
          productSales[item.name] = { name: item.name, qty: 0, revenue: 0 };
        }
        productSales[item.name].qty += item.quantity || 0;
        productSales[item.name].revenue += (item.quantity || 0) * (item.price || 0);
      });
    });
    
    // Sort and get top 5
    const topProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.qty - a.qty)
      .slice(0, 5);
    
    return c.json({ success: true, data: topProducts });
  } catch (error) {
    console.error("Error fetching top products:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// BACKUP & SYNC API
// ============================================

// Get all store data (for backup)
appRouter.get("/backup/:storeId", async (c) => {
  try {
    const storeId = c.req.param("storeId");
    
    const data = {
      products: await kv.get(`store:${storeId}:products`) || [],
      customers: await kv.get(`store:${storeId}:customers`) || [],
      bills: await kv.get(`store:${storeId}:bills`) || [],
      storeInfo: await kv.get(`store:${storeId}:info`) || {},
      backupDate: new Date().toISOString(),
    };
    
    return c.json({ success: true, data });
  } catch (error) {
    console.error("Error creating backup:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Restore store data
appRouter.post("/restore/:storeId", async (c) => {
  try {
    const storeId = c.req.param("storeId");
    const backupData = await c.req.json();
    
    // Restore all data
    if (backupData.products) {
      await kv.set(`store:${storeId}:products`, backupData.products);
    }
    if (backupData.customers) {
      await kv.set(`store:${storeId}:customers`, backupData.customers);
    }
    if (backupData.bills) {
      await kv.set(`store:${storeId}:bills`, backupData.bills);
    }
    if (backupData.storeInfo) {
      await kv.set(`store:${storeId}:info`, backupData.storeInfo);
    }
    
    return c.json({ 
      success: true, 
      message: "Data restored successfully" 
    });
  } catch (error) {
    console.error("Error restoring data:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Default content helpers
function getDefaultLandingContent() {
  return {
    hero: {
      title: "Retail Bandhu Lite",
      subtitle: "Voice + AI Billing App",
      cta: "Get Started Free"
    },
    features: [],
    pricing: []
  };
}