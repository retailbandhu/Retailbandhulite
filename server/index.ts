import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import { db } from "./db";
import { stores, products, customers, bills, khataEntries, expenses, parties } from "../shared/schema";
import { eq, desc, and } from "drizzle-orm";
import { setupAuth, isAuthenticated, getUser } from "./replitAuth";

const app = express();

// Middleware to verify user owns the store they're accessing
async function verifyStoreOwnership(req: Request, res: Response, next: NextFunction) {
  try {
    const storeId = parseInt(req.params.storeId || req.params.id);
    if (isNaN(storeId)) {
      return res.status(400).json({ error: "Invalid store ID" });
    }
    
    const userId = (req as any).user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const [store] = await db.select().from(stores).where(
      and(eq(stores.id, storeId), eq(stores.userId, userId))
    );
    
    if (!store) {
      return res.status(403).json({ error: "Access denied: You don't own this store" });
    }
    
    // Attach store to request for use in route handlers
    (req as any).store = store;
    next();
  } catch (error) {
    console.error("Store ownership verification error:", error);
    res.status(500).json({ error: "Authorization check failed" });
  }
}

// Combined middleware for auth + store ownership
const requireStoreAccess = [isAuthenticated, verifyStoreOwnership];

// Middleware to verify ownership of a resource (product, customer, etc.) via its store
async function verifyResourceOwnership(
  resourceTable: any,
  resourceIdParam: string = 'id'
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resourceId = parseInt(req.params[resourceIdParam]);
      if (isNaN(resourceId)) {
        return res.status(400).json({ error: "Invalid resource ID" });
      }
      
      const userId = (req as any).user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      // Get the resource to find its storeId
      const [resource] = await db.select().from(resourceTable).where(eq(resourceTable.id, resourceId));
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }
      
      // Verify the store belongs to the user
      const [store] = await db.select().from(stores).where(
        and(eq(stores.id, resource.storeId), eq(stores.userId, userId))
      );
      
      if (!store) {
        return res.status(403).json({ error: "Access denied: You don't own this resource" });
      }
      
      (req as any).store = store;
      (req as any).resource = resource;
      next();
    } catch (error) {
      console.error("Resource ownership verification error:", error);
      res.status(500).json({ error: "Authorization check failed" });
    }
  };
}

const allowedOrigins = [
  process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : null,
  process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : null,
  'http://localhost:5000',
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }
    const normalizedOrigin = origin.replace(/\/$/, '');
    const isAllowed = allowedOrigins.some(allowed => {
      const normalizedAllowed = allowed.replace(/\/$/, '');
      return normalizedOrigin === normalizedAllowed;
    });
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

function registerRoutes() {
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/my-store", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await getUser(userId);
      
      const existingStores = await db.select().from(stores).where(eq(stores.userId, userId));
      
      if (existingStores.length > 0) {
        res.json(existingStores[0]);
      } else {
        const [newStore] = await db.insert(stores).values({
          userId,
          name: user?.firstName ? `${user.firstName}'s Store` : 'My Kirana Store',
          owner: user?.firstName && user?.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : user?.email || 'Store Owner',
          address: '',
          phone: '',
          billColor: '#1E88E5',
        }).returning();
        res.json(newStore);
      }
    } catch (error) {
      console.error("Error fetching/creating store:", error);
      res.status(500).json({ message: "Failed to fetch store" });
    }
  });

  // Store routes - require authentication and ownership
  app.get("/api/stores/:id", requireStoreAccess, async (req: any, res) => {
    res.json(req.store);
  });

  app.put("/api/stores/:id", requireStoreAccess, async (req: any, res) => {
    try {
      const body = req.body;
      const [store] = await db.update(stores).set(body).where(eq(stores.id, req.store.id)).returning();
      res.json(store);
    } catch (error) {
      console.error('Error updating store:', error);
      res.status(500).json({ error: "Failed to update store" });
    }
  });

  // Product routes - require store ownership
  app.get("/api/stores/:storeId/products", requireStoreAccess, async (req: any, res) => {
    try {
      const result = await db.select().from(products).where(eq(products.storeId, req.store.id));
      res.json(result);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.post("/api/stores/:storeId/products", requireStoreAccess, async (req: any, res) => {
    try {
      const body = req.body;
      if (!body.name || !body.price) {
        return res.status(400).json({ error: "Name and price are required" });
      }
      const [product] = await db.insert(products).values({ ...body, storeId: req.store.id }).returning();
      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/stores/:storeId/products/:id", requireStoreAccess, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid product ID" });
      
      // Verify product belongs to this store
      const [existing] = await db.select().from(products).where(
        and(eq(products.id, id), eq(products.storeId, req.store.id))
      );
      if (!existing) return res.status(404).json({ error: "Product not found" });
      
      const body = req.body;
      const [product] = await db.update(products).set(body).where(eq(products.id, id)).returning();
      res.json(product);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/stores/:storeId/products/:id", requireStoreAccess, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid product ID" });
      
      // Verify product belongs to this store
      const [existing] = await db.select().from(products).where(
        and(eq(products.id, id), eq(products.storeId, req.store.id))
      );
      if (!existing) return res.status(404).json({ error: "Product not found" });
      
      await db.delete(products).where(eq(products.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Customer routes - require store ownership
  app.get("/api/stores/:storeId/customers", requireStoreAccess, async (req: any, res) => {
    try {
      const result = await db.select().from(customers).where(eq(customers.storeId, req.store.id));
      res.json(result);
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  app.post("/api/stores/:storeId/customers", requireStoreAccess, async (req: any, res) => {
    try {
      const body = req.body;
      if (!body.name) {
        return res.status(400).json({ error: "Customer name is required" });
      }
      const [customer] = await db.insert(customers).values({ ...body, storeId: req.store.id }).returning();
      res.status(201).json(customer);
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({ error: "Failed to create customer" });
    }
  });

  app.put("/api/stores/:storeId/customers/:id", requireStoreAccess, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid customer ID" });
      
      const [existing] = await db.select().from(customers).where(
        and(eq(customers.id, id), eq(customers.storeId, req.store.id))
      );
      if (!existing) return res.status(404).json({ error: "Customer not found" });
      
      const body = req.body;
      const [customer] = await db.update(customers).set(body).where(eq(customers.id, id)).returning();
      res.json(customer);
    } catch (error) {
      console.error('Error updating customer:', error);
      res.status(500).json({ error: "Failed to update customer" });
    }
  });

  app.delete("/api/stores/:storeId/customers/:id", requireStoreAccess, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid customer ID" });
      
      const [existing] = await db.select().from(customers).where(
        and(eq(customers.id, id), eq(customers.storeId, req.store.id))
      );
      if (!existing) return res.status(404).json({ error: "Customer not found" });
      
      await db.delete(customers).where(eq(customers.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({ error: "Failed to delete customer" });
    }
  });

  // Bill routes - require store ownership
  app.get("/api/stores/:storeId/bills", requireStoreAccess, async (req: any, res) => {
    try {
      const result = await db.select().from(bills).where(eq(bills.storeId, req.store.id)).orderBy(desc(bills.createdAt));
      res.json(result);
    } catch (error) {
      console.error('Error fetching bills:', error);
      res.status(500).json({ error: "Failed to fetch bills" });
    }
  });

  app.post("/api/stores/:storeId/bills", requireStoreAccess, async (req: any, res) => {
    try {
      const body = req.body;
      if (!body.billNumber || !body.items || !body.subtotal || !body.total) {
        return res.status(400).json({ error: "Bill number, items, subtotal and total are required" });
      }
      const [bill] = await db.insert(bills).values({ ...body, storeId: req.store.id }).returning();
      res.status(201).json(bill);
    } catch (error) {
      console.error('Error creating bill:', error);
      res.status(500).json({ error: "Failed to create bill" });
    }
  });

  // Khata (credit ledger) routes - require store ownership
  app.get("/api/stores/:storeId/khata", requireStoreAccess, async (req: any, res) => {
    try {
      const result = await db.select().from(khataEntries).where(eq(khataEntries.storeId, req.store.id)).orderBy(desc(khataEntries.createdAt));
      res.json(result);
    } catch (error) {
      console.error('Error fetching khata:', error);
      res.status(500).json({ error: "Failed to fetch khata entries" });
    }
  });

  app.post("/api/stores/:storeId/khata", requireStoreAccess, async (req: any, res) => {
    try {
      const body = req.body;
      if (!body.customerName || !body.amount || !body.type) {
        return res.status(400).json({ error: "Customer name, amount and type are required" });
      }
      const [entry] = await db.insert(khataEntries).values({ ...body, storeId: req.store.id }).returning();
      res.status(201).json(entry);
    } catch (error) {
      console.error('Error creating khata entry:', error);
      res.status(500).json({ error: "Failed to create khata entry" });
    }
  });

  // Expense routes - require store ownership
  app.get("/api/stores/:storeId/expenses", requireStoreAccess, async (req: any, res) => {
    try {
      const result = await db.select().from(expenses).where(eq(expenses.storeId, req.store.id)).orderBy(desc(expenses.createdAt));
      res.json(result);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ error: "Failed to fetch expenses" });
    }
  });

  app.post("/api/stores/:storeId/expenses", requireStoreAccess, async (req: any, res) => {
    try {
      const body = req.body;
      if (!body.category || !body.amount) {
        return res.status(400).json({ error: "Category and amount are required" });
      }
      const [expense] = await db.insert(expenses).values({ ...body, storeId: req.store.id }).returning();
      res.status(201).json(expense);
    } catch (error) {
      console.error('Error creating expense:', error);
      res.status(500).json({ error: "Failed to create expense" });
    }
  });

  // Party (supplier) routes - require store ownership
  app.get("/api/stores/:storeId/parties", requireStoreAccess, async (req: any, res) => {
    try {
      const result = await db.select().from(parties).where(eq(parties.storeId, req.store.id));
      res.json(result);
    } catch (error) {
      console.error('Error fetching parties:', error);
      res.status(500).json({ error: "Failed to fetch parties" });
    }
  });

  app.post("/api/stores/:storeId/parties", requireStoreAccess, async (req: any, res) => {
    try {
      const body = req.body;
      if (!body.name) {
        return res.status(400).json({ error: "Party name is required" });
      }
      const [party] = await db.insert(parties).values({ ...body, storeId: req.store.id }).returning();
      res.status(201).json(party);
    } catch (error) {
      console.error('Error creating party:', error);
      res.status(500).json({ error: "Failed to create party" });
    }
  });
}

const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;

async function startServer() {
  await setupAuth(app);
  registerRoutes();
  
  // Serve static files in production
  const buildPath = path.resolve(process.cwd(), "build");
  app.use(express.static(buildPath));
  
  // Handle client-side routing - serve index.html for all non-API routes
  app.use((req, res, next) => {
    if (!req.path.startsWith("/api") && req.method === "GET") {
      res.sendFile(path.join(buildPath, "index.html"), (err) => {
        if (err) next();
      });
    } else {
      next();
    }
  });
  
  app.listen(port, "0.0.0.0", () => {
    console.log(`API Server running on port ${port}`);
  });
}

startServer().catch(console.error);

export default app;
