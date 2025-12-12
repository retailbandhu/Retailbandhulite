import express from "express";
import cors from "cors";
import { db } from "./db";
import { stores, products, customers, bills, khataEntries, expenses, parties, users } from "../shared/schema";
import { eq, desc } from "drizzle-orm";
import { setupAuth, isAuthenticated, getUser } from "./replitAuth";

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

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

app.get("/api/stores/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid store ID" });
    const [store] = await db.select().from(stores).where(eq(stores.id, id));
    if (!store) return res.status(404).json({ error: "Store not found" });
    res.json(store);
  } catch (error) {
    console.error('Error fetching store:', error);
    res.status(500).json({ error: "Failed to fetch store" });
  }
});

app.post("/api/stores", async (req, res) => {
  try {
    const body = req.body;
    if (!body.name || !body.owner) {
      return res.status(400).json({ error: "Name and owner are required" });
    }
    const [store] = await db.insert(stores).values(body).returning();
    res.status(201).json(store);
  } catch (error) {
    console.error('Error creating store:', error);
    res.status(500).json({ error: "Failed to create store" });
  }
});

app.put("/api/stores/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid store ID" });
    const body = req.body;
    const [store] = await db.update(stores).set(body).where(eq(stores.id, id)).returning();
    if (!store) return res.status(404).json({ error: "Store not found" });
    res.json(store);
  } catch (error) {
    console.error('Error updating store:', error);
    res.status(500).json({ error: "Failed to update store" });
  }
});

app.get("/api/stores/:storeId/products", async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    if (isNaN(storeId)) return res.status(400).json({ error: "Invalid store ID" });
    const result = await db.select().from(products).where(eq(products.storeId, storeId));
    res.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.post("/api/stores/:storeId/products", async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    if (isNaN(storeId)) return res.status(400).json({ error: "Invalid store ID" });
    const body = req.body;
    if (!body.name || !body.price) {
      return res.status(400).json({ error: "Name and price are required" });
    }
    const [product] = await db.insert(products).values({ ...body, storeId }).returning();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid product ID" });
    const body = req.body;
    const [product] = await db.update(products).set(body).where(eq(products.id, id)).returning();
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid product ID" });
    await db.delete(products).where(eq(products.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

app.get("/api/stores/:storeId/customers", async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    if (isNaN(storeId)) return res.status(400).json({ error: "Invalid store ID" });
    const result = await db.select().from(customers).where(eq(customers.storeId, storeId));
    res.json(result);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

app.post("/api/stores/:storeId/customers", async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    if (isNaN(storeId)) return res.status(400).json({ error: "Invalid store ID" });
    const body = req.body;
    if (!body.name) {
      return res.status(400).json({ error: "Customer name is required" });
    }
    const [customer] = await db.insert(customers).values({ ...body, storeId }).returning();
    res.status(201).json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: "Failed to create customer" });
  }
});

app.put("/api/customers/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid customer ID" });
    const body = req.body;
    const [customer] = await db.update(customers).set(body).where(eq(customers.id, id)).returning();
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: "Failed to update customer" });
  }
});

app.delete("/api/customers/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid customer ID" });
    await db.delete(customers).where(eq(customers.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: "Failed to delete customer" });
  }
});

app.get("/api/stores/:storeId/bills", async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    if (isNaN(storeId)) return res.status(400).json({ error: "Invalid store ID" });
    const result = await db.select().from(bills).where(eq(bills.storeId, storeId)).orderBy(desc(bills.createdAt));
    res.json(result);
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ error: "Failed to fetch bills" });
  }
});

app.post("/api/stores/:storeId/bills", async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    if (isNaN(storeId)) return res.status(400).json({ error: "Invalid store ID" });
    const body = req.body;
    if (!body.billNumber || !body.items || !body.subtotal || !body.total) {
      return res.status(400).json({ error: "Bill number, items, subtotal and total are required" });
    }
    const [bill] = await db.insert(bills).values({ ...body, storeId }).returning();
    res.status(201).json(bill);
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({ error: "Failed to create bill" });
  }
});

app.get("/api/stores/:storeId/khata", async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    if (isNaN(storeId)) return res.status(400).json({ error: "Invalid store ID" });
    const result = await db.select().from(khataEntries).where(eq(khataEntries.storeId, storeId)).orderBy(desc(khataEntries.createdAt));
    res.json(result);
  } catch (error) {
    console.error('Error fetching khata:', error);
    res.status(500).json({ error: "Failed to fetch khata entries" });
  }
});

app.post("/api/stores/:storeId/khata", async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    if (isNaN(storeId)) return res.status(400).json({ error: "Invalid store ID" });
    const body = req.body;
    if (!body.customerName || !body.amount || !body.type) {
      return res.status(400).json({ error: "Customer name, amount and type are required" });
    }
    const [entry] = await db.insert(khataEntries).values({ ...body, storeId }).returning();
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error creating khata entry:', error);
    res.status(500).json({ error: "Failed to create khata entry" });
  }
});

app.get("/api/stores/:storeId/expenses", async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    if (isNaN(storeId)) return res.status(400).json({ error: "Invalid store ID" });
    const result = await db.select().from(expenses).where(eq(expenses.storeId, storeId)).orderBy(desc(expenses.createdAt));
    res.json(result);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

app.post("/api/stores/:storeId/expenses", async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    if (isNaN(storeId)) return res.status(400).json({ error: "Invalid store ID" });
    const body = req.body;
    if (!body.category || !body.amount) {
      return res.status(400).json({ error: "Category and amount are required" });
    }
    const [expense] = await db.insert(expenses).values({ ...body, storeId }).returning();
    res.status(201).json(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: "Failed to create expense" });
  }
});

app.get("/api/stores/:storeId/parties", async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    if (isNaN(storeId)) return res.status(400).json({ error: "Invalid store ID" });
    const result = await db.select().from(parties).where(eq(parties.storeId, storeId));
    res.json(result);
  } catch (error) {
    console.error('Error fetching parties:', error);
    res.status(500).json({ error: "Failed to fetch parties" });
  }
});

app.post("/api/stores/:storeId/parties", async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    if (isNaN(storeId)) return res.status(400).json({ error: "Invalid store ID" });
    const body = req.body;
    if (!body.name) {
      return res.status(400).json({ error: "Party name is required" });
    }
    const [party] = await db.insert(parties).values({ ...body, storeId }).returning();
    res.status(201).json(party);
  } catch (error) {
    console.error('Error creating party:', error);
    res.status(500).json({ error: "Failed to create party" });
  }
});

const port = 3001;

async function startServer() {
  await setupAuth(app);
  app.listen(port, () => {
    console.log(`API Server running on port ${port}`);
  });
}

startServer().catch(console.error);

export default app;
