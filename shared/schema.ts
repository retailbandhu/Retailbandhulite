import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  name: text("name").notNull(),
  owner: text("owner").notNull(),
  address: text("address"),
  phone: text("phone"),
  logo: text("logo"),
  billColor: text("bill_color").default("#1E88E5"),
  gstin: text("gstin"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  category: text("category"),
  image: text("image"),
  barcode: text("barcode"),
  hsnCode: text("hsn_code"),
  gstRate: decimal("gst_rate", { precision: 5, scale: 2 }),
  reorderLevel: integer("reorder_level").default(10),
  createdAt: timestamp("created_at").defaultNow(),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  totalPurchases: decimal("total_purchases", { precision: 12, scale: 2 }).default("0"),
  loyaltyPoints: integer("loyalty_points").default(0),
  tier: text("tier").default("Bronze"),
  lastVisit: timestamp("last_visit"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bills = pgTable("bills", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id, { onDelete: 'cascade' }),
  customerId: integer("customer_id").references(() => customers.id, { onDelete: 'set null' }),
  billNumber: text("bill_number").notNull(),
  items: jsonb("items").notNull(),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 12, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 12, scale: 2 }).default("0"),
  total: decimal("total", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").default("Cash"),
  gstEnabled: boolean("gst_enabled").default(false),
  notes: text("notes"),
  status: text("status").default("completed"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const khataEntries = pgTable("khata_entries", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id, { onDelete: 'cascade' }),
  customerId: integer("customer_id").references(() => customers.id, { onDelete: 'set null' }),
  customerName: text("customer_name").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  type: text("type").notNull(),
  description: text("description"),
  billId: integer("bill_id").references(() => bills.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id, { onDelete: 'cascade' }),
  category: text("category").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  paymentMethod: text("payment_method"),
  partyName: text("party_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const parties = pgTable("parties", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  phone: text("phone"),
  type: text("type").default("Supplier"),
  totalPurchases: decimal("total_purchases", { precision: 12, scale: 2 }).default("0"),
  pendingAmount: decimal("pending_amount", { precision: 12, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const storesRelations = relations(stores, ({ many }) => ({
  products: many(products),
  customers: many(customers),
  bills: many(bills),
  khataEntries: many(khataEntries),
  expenses: many(expenses),
  parties: many(parties),
}));

export const productsRelations = relations(products, ({ one }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  store: one(stores, {
    fields: [customers.storeId],
    references: [stores.id],
  }),
  bills: many(bills),
  khataEntries: many(khataEntries),
}));

export const billsRelations = relations(bills, ({ one }) => ({
  store: one(stores, {
    fields: [bills.storeId],
    references: [stores.id],
  }),
  customer: one(customers, {
    fields: [bills.customerId],
    references: [customers.id],
  }),
}));

export const khataEntriesRelations = relations(khataEntries, ({ one }) => ({
  store: one(stores, {
    fields: [khataEntries.storeId],
    references: [stores.id],
  }),
  customer: one(customers, {
    fields: [khataEntries.customerId],
    references: [customers.id],
  }),
  bill: one(bills, {
    fields: [khataEntries.billId],
    references: [bills.id],
  }),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  store: one(stores, {
    fields: [expenses.storeId],
    references: [stores.id],
  }),
}));

export const partiesRelations = relations(parties, ({ one }) => ({
  store: one(stores, {
    fields: [parties.storeId],
    references: [stores.id],
  }),
}));

export type Store = typeof stores.$inferSelect;
export type InsertStore = typeof stores.$inferInsert;
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;
export type Bill = typeof bills.$inferSelect;
export type InsertBill = typeof bills.$inferInsert;
export type KhataEntry = typeof khataEntries.$inferSelect;
export type InsertKhataEntry = typeof khataEntries.$inferInsert;
export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = typeof expenses.$inferInsert;
export type Party = typeof parties.$inferSelect;
export type InsertParty = typeof parties.$inferInsert;

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  stores: many(stores),
}));

export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
