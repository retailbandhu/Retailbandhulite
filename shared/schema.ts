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

// Admin Feature Flags
export const featureFlags = pgTable("feature_flags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  enabled: boolean("enabled").default(false),
  userPercentage: integer("user_percentage").default(100),
  category: text("category").default("General"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Subscription Plans
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  displayName: text("display_name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("INR"),
  interval: text("interval").default("month"),
  features: jsonb("features").default([]),
  highlighted: boolean("highlighted").default(false),
  active: boolean("active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Subscriptions (links users to plans)
export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  planId: integer("plan_id").references(() => subscriptionPlans.id),
  status: text("status").default("active"),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// App Configuration
export const appConfig = pgTable("app_config", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value"),
  category: text("category").default("general"),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Audit Logs for Admin Actions
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  adminId: varchar("admin_id").references(() => users.id),
  action: text("action").notNull(),
  target: text("target"),
  targetId: text("target_id"),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  status: text("status").default("success"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin Notifications
export const adminNotifications = pgTable("admin_notifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").default("info"),
  targetAudience: text("target_audience").default("all"),
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  status: text("status").default("draft"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Content CMS - Blog Posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content"),
  author: text("author"),
  category: text("category"),
  status: text("status").default("draft"),
  publishDate: timestamp("publish_date"),
  views: integer("views").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Content CMS - Message Templates
export const messageTemplates = pgTable("message_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  content: text("content").notNull(),
  variables: jsonb("variables").default([]),
  active: boolean("active").default(true),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Webhooks Configuration (no secrets stored - just configuration)
export const webhooks = pgTable("webhooks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  events: jsonb("events").default([]),
  active: boolean("active").default(true),
  lastTriggered: timestamp("last_triggered"),
  successCount: integer("success_count").default(0),
  failureCount: integer("failure_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Coupons for Subscriptions
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  discountType: text("discount_type").default("percentage"),
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").default(0),
  validFrom: timestamp("valid_from"),
  validUntil: timestamp("valid_until"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Type exports for new tables
export type FeatureFlag = typeof featureFlags.$inferSelect;
export type InsertFeatureFlag = typeof featureFlags.$inferInsert;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = typeof subscriptionPlans.$inferInsert;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = typeof userSubscriptions.$inferInsert;
export type AppConfig = typeof appConfig.$inferSelect;
export type InsertAppConfig = typeof appConfig.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;
export type AdminNotification = typeof adminNotifications.$inferSelect;
export type InsertAdminNotification = typeof adminNotifications.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;
export type MessageTemplate = typeof messageTemplates.$inferSelect;
export type InsertMessageTemplate = typeof messageTemplates.$inferInsert;
export type Webhook = typeof webhooks.$inferSelect;
export type InsertWebhook = typeof webhooks.$inferInsert;
export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = typeof coupons.$inferInsert;
