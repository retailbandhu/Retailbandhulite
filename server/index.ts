import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { db } from "./db";
import { stores, products, customers, bills, khataEntries, expenses, parties } from "../shared/schema";
import { eq, desc } from "drizzle-orm";

const app = new Hono();

app.use("/*", cors());

app.onError((err, c) => {
  console.error('API Error:', err);
  return c.json({ error: err.message || 'Internal server error' }, 500);
});

app.get("/api/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

app.get("/api/stores/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.json({ error: "Invalid store ID" }, 400);
    const [store] = await db.select().from(stores).where(eq(stores.id, id));
    if (!store) return c.json({ error: "Store not found" }, 404);
    return c.json(store);
  } catch (error) {
    console.error('Error fetching store:', error);
    return c.json({ error: "Failed to fetch store" }, 500);
  }
});

app.post("/api/stores", async (c) => {
  try {
    const body = await c.req.json();
    if (!body.name || !body.owner) {
      return c.json({ error: "Name and owner are required" }, 400);
    }
    const [store] = await db.insert(stores).values(body).returning();
    return c.json(store, 201);
  } catch (error) {
    console.error('Error creating store:', error);
    return c.json({ error: "Failed to create store" }, 500);
  }
});

app.put("/api/stores/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.json({ error: "Invalid store ID" }, 400);
    const body = await c.req.json();
    const [store] = await db.update(stores).set(body).where(eq(stores.id, id)).returning();
    if (!store) return c.json({ error: "Store not found" }, 404);
    return c.json(store);
  } catch (error) {
    console.error('Error updating store:', error);
    return c.json({ error: "Failed to update store" }, 500);
  }
});

app.get("/api/stores/:storeId/products", async (c) => {
  try {
    const storeId = parseInt(c.req.param("storeId"));
    if (isNaN(storeId)) return c.json({ error: "Invalid store ID" }, 400);
    const result = await db.select().from(products).where(eq(products.storeId, storeId));
    return c.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    return c.json({ error: "Failed to fetch products" }, 500);
  }
});

app.post("/api/stores/:storeId/products", async (c) => {
  try {
    const storeId = parseInt(c.req.param("storeId"));
    if (isNaN(storeId)) return c.json({ error: "Invalid store ID" }, 400);
    const body = await c.req.json();
    if (!body.name || !body.price) {
      return c.json({ error: "Name and price are required" }, 400);
    }
    const [product] = await db.insert(products).values({ ...body, storeId }).returning();
    return c.json(product, 201);
  } catch (error) {
    console.error('Error creating product:', error);
    return c.json({ error: "Failed to create product" }, 500);
  }
});

app.put("/api/products/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.json({ error: "Invalid product ID" }, 400);
    const body = await c.req.json();
    const [product] = await db.update(products).set(body).where(eq(products.id, id)).returning();
    if (!product) return c.json({ error: "Product not found" }, 404);
    return c.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return c.json({ error: "Failed to update product" }, 500);
  }
});

app.delete("/api/products/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.json({ error: "Invalid product ID" }, 400);
    await db.delete(products).where(eq(products.id, id));
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return c.json({ error: "Failed to delete product" }, 500);
  }
});

app.get("/api/stores/:storeId/customers", async (c) => {
  try {
    const storeId = parseInt(c.req.param("storeId"));
    if (isNaN(storeId)) return c.json({ error: "Invalid store ID" }, 400);
    const result = await db.select().from(customers).where(eq(customers.storeId, storeId));
    return c.json(result);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return c.json({ error: "Failed to fetch customers" }, 500);
  }
});

app.post("/api/stores/:storeId/customers", async (c) => {
  try {
    const storeId = parseInt(c.req.param("storeId"));
    if (isNaN(storeId)) return c.json({ error: "Invalid store ID" }, 400);
    const body = await c.req.json();
    if (!body.name) {
      return c.json({ error: "Customer name is required" }, 400);
    }
    const [customer] = await db.insert(customers).values({ ...body, storeId }).returning();
    return c.json(customer, 201);
  } catch (error) {
    console.error('Error creating customer:', error);
    return c.json({ error: "Failed to create customer" }, 500);
  }
});

app.put("/api/customers/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.json({ error: "Invalid customer ID" }, 400);
    const body = await c.req.json();
    const [customer] = await db.update(customers).set(body).where(eq(customers.id, id)).returning();
    if (!customer) return c.json({ error: "Customer not found" }, 404);
    return c.json(customer);
  } catch (error) {
    console.error('Error updating customer:', error);
    return c.json({ error: "Failed to update customer" }, 500);
  }
});

app.delete("/api/customers/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.json({ error: "Invalid customer ID" }, 400);
    await db.delete(customers).where(eq(customers.id, id));
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return c.json({ error: "Failed to delete customer" }, 500);
  }
});

app.get("/api/stores/:storeId/bills", async (c) => {
  try {
    const storeId = parseInt(c.req.param("storeId"));
    if (isNaN(storeId)) return c.json({ error: "Invalid store ID" }, 400);
    const result = await db.select().from(bills).where(eq(bills.storeId, storeId)).orderBy(desc(bills.createdAt));
    return c.json(result);
  } catch (error) {
    console.error('Error fetching bills:', error);
    return c.json({ error: "Failed to fetch bills" }, 500);
  }
});

app.post("/api/stores/:storeId/bills", async (c) => {
  try {
    const storeId = parseInt(c.req.param("storeId"));
    if (isNaN(storeId)) return c.json({ error: "Invalid store ID" }, 400);
    const body = await c.req.json();
    if (!body.billNumber || !body.items || !body.subtotal || !body.total) {
      return c.json({ error: "Bill number, items, subtotal and total are required" }, 400);
    }
    const [bill] = await db.insert(bills).values({ ...body, storeId }).returning();
    return c.json(bill, 201);
  } catch (error) {
    console.error('Error creating bill:', error);
    return c.json({ error: "Failed to create bill" }, 500);
  }
});

app.get("/api/stores/:storeId/khata", async (c) => {
  try {
    const storeId = parseInt(c.req.param("storeId"));
    if (isNaN(storeId)) return c.json({ error: "Invalid store ID" }, 400);
    const result = await db.select().from(khataEntries).where(eq(khataEntries.storeId, storeId)).orderBy(desc(khataEntries.createdAt));
    return c.json(result);
  } catch (error) {
    console.error('Error fetching khata:', error);
    return c.json({ error: "Failed to fetch khata entries" }, 500);
  }
});

app.post("/api/stores/:storeId/khata", async (c) => {
  try {
    const storeId = parseInt(c.req.param("storeId"));
    if (isNaN(storeId)) return c.json({ error: "Invalid store ID" }, 400);
    const body = await c.req.json();
    if (!body.customerName || !body.amount || !body.type) {
      return c.json({ error: "Customer name, amount and type are required" }, 400);
    }
    const [entry] = await db.insert(khataEntries).values({ ...body, storeId }).returning();
    return c.json(entry, 201);
  } catch (error) {
    console.error('Error creating khata entry:', error);
    return c.json({ error: "Failed to create khata entry" }, 500);
  }
});

app.get("/api/stores/:storeId/expenses", async (c) => {
  try {
    const storeId = parseInt(c.req.param("storeId"));
    if (isNaN(storeId)) return c.json({ error: "Invalid store ID" }, 400);
    const result = await db.select().from(expenses).where(eq(expenses.storeId, storeId)).orderBy(desc(expenses.createdAt));
    return c.json(result);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return c.json({ error: "Failed to fetch expenses" }, 500);
  }
});

app.post("/api/stores/:storeId/expenses", async (c) => {
  try {
    const storeId = parseInt(c.req.param("storeId"));
    if (isNaN(storeId)) return c.json({ error: "Invalid store ID" }, 400);
    const body = await c.req.json();
    if (!body.category || !body.amount) {
      return c.json({ error: "Category and amount are required" }, 400);
    }
    const [expense] = await db.insert(expenses).values({ ...body, storeId }).returning();
    return c.json(expense, 201);
  } catch (error) {
    console.error('Error creating expense:', error);
    return c.json({ error: "Failed to create expense" }, 500);
  }
});

app.get("/api/stores/:storeId/parties", async (c) => {
  try {
    const storeId = parseInt(c.req.param("storeId"));
    if (isNaN(storeId)) return c.json({ error: "Invalid store ID" }, 400);
    const result = await db.select().from(parties).where(eq(parties.storeId, storeId));
    return c.json(result);
  } catch (error) {
    console.error('Error fetching parties:', error);
    return c.json({ error: "Failed to fetch parties" }, 500);
  }
});

app.post("/api/stores/:storeId/parties", async (c) => {
  try {
    const storeId = parseInt(c.req.param("storeId"));
    if (isNaN(storeId)) return c.json({ error: "Invalid store ID" }, 400);
    const body = await c.req.json();
    if (!body.name) {
      return c.json({ error: "Party name is required" }, 400);
    }
    const [party] = await db.insert(parties).values({ ...body, storeId }).returning();
    return c.json(party, 201);
  } catch (error) {
    console.error('Error creating party:', error);
    return c.json({ error: "Failed to create party" }, 500);
  }
});

const port = 3001;
console.log(`API Server running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;
