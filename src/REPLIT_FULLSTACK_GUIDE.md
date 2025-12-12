# 🚀 **RETAIL BANDHU LITE - FULL-STACK REPLIT IMPLEMENTATION GUIDE**

## 📋 **TABLE OF CONTENTS**

1. [Overview & Architecture](#overview--architecture)
2. [Tech Stack](#tech-stack)
3. [Replit Setup](#replit-setup)
4. [Project Structure](#project-structure)
5. [Database Design](#database-design)
6. [Backend Implementation](#backend-implementation)
7. [API Endpoints](#api-endpoints)
8. [Authentication & Security](#authentication--security)
9. [WhatsApp Integration](#whatsapp-integration)
10. [Payment Integration](#payment-integration)
11. [File Storage](#file-storage)
12. [Deployment Strategy](#deployment-strategy)

---

## 🏗️ **OVERVIEW & ARCHITECTURE**

### **Current State:**
- ✅ Frontend deployed on Vercel
- ✅ Static React app with mock data
- ✅ 240+ features (UI only)
- ❌ No database persistence
- ❌ No real authentication
- ❌ No API integration

### **Target State:**
- ✅ Full-stack app on Replit
- ✅ Node.js/Express backend
- ✅ PostgreSQL database (Supabase)
- ✅ Real authentication (JWT)
- ✅ WhatsApp Business API integration
- ✅ Payment gateway integration
- ✅ Cloud storage for files
- ✅ Real-time features (WebSockets)

### **Architecture Diagram:**

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  React Frontend (Existing - from Figma Make)     │  │
│  │  - Voice Billing Interface                       │  │
│  │  - Admin Dashboard                               │  │
│  │  - Marketing Pages                               │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕ HTTPS/REST API
┌─────────────────────────────────────────────────────────┐
│                    API LAYER (Replit)                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Express.js Server                               │  │
│  │  - REST API Endpoints                            │  │
│  │  - Authentication Middleware                     │  │
│  │  - Request Validation                            │  │
│  │  - Rate Limiting                                 │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                  │
│  ┌────────────┬────────────┬────────────┬────────────┐ │
│  │  Billing   │ Inventory  │  Customer  │  Reports   │ │
│  │  Service   │  Service   │  Service   │  Service   │ │
│  └────────────┴────────────┴────────────┴────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                    DATA LAYER                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database (Supabase)                  │  │
│  │  - Users & Authentication                        │  │
│  │  - Products & Inventory                          │  │
│  │  - Customers & Orders                            │  │
│  │  - Invoices & Payments                           │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                 EXTERNAL SERVICES                       │
│  ┌─────────────┬──────────────┬──────────────────────┐ │
│  │  WhatsApp   │   Payment    │   Cloud Storage      │ │
│  │  Business   │   Gateway    │   (S3/Cloudinary)    │ │
│  │  API        │  (Razorpay)  │                      │ │
│  └─────────────┴──────────────┴──────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ **TECH STACK**

### **Backend:**
```javascript
{
  "runtime": "Node.js 20.x",
  "framework": "Express.js 4.x",
  "language": "TypeScript",
  "api": "RESTful API + WebSockets"
}
```

### **Database:**
```javascript
{
  "primary": "PostgreSQL 15 (Supabase)",
  "orm": "Prisma 5.x",
  "cache": "Redis (Upstash)",
  "storage": "Supabase Storage / Cloudinary"
}
```

### **Authentication:**
```javascript
{
  "strategy": "JWT (JSON Web Tokens)",
  "library": "jsonwebtoken + bcryptjs",
  "sessions": "Redis-based",
  "oauth": "Google OAuth (optional)"
}
```

### **External Services:**
```javascript
{
  "whatsapp": "WhatsApp Business API (Meta)",
  "payments": "Razorpay / Paytm",
  "sms": "Twilio / MSG91",
  "email": "SendGrid / Resend",
  "analytics": "Mixpanel / PostHog"
}
```

### **DevOps:**
```javascript
{
  "hosting": "Replit (Development + Production)",
  "monitoring": "Replit Deployments",
  "logging": "Winston + Replit Logs",
  "ci-cd": "Replit Auto-deploy"
}
```

---

## 🔧 **REPLIT SETUP**

### **Step 1: Create New Replit Project**

1. **Go to:** https://replit.com
2. **Click:** "Create Repl"
3. **Template:** Select "Node.js"
4. **Name:** `retail-bandhu-backend`
5. **Public/Private:** Private (for security)

### **Step 2: Configure Replit**

Create `.replit` file:
```toml
# .replit
run = "npm run dev"
modules = ["nodejs-20:v8-20230920-bd784b4"]

[nix]
channel = "stable-23_11"

[deployment]
run = ["npm", "run", "start"]
deploymentTarget = "cloudrun"
build = ["npm", "install"]

[env]
NODE_ENV = "development"
PORT = "3000"
```

Create `replit.nix`:
```nix
{ pkgs }: {
  deps = [
    pkgs.nodejs-20_x
    pkgs.nodePackages.typescript
    pkgs.nodePackages.nodemon
  ];
}
```

### **Step 3: Initialize Project**

In Replit Shell:
```bash
# Initialize package.json
npm init -y

# Install dependencies
npm install express cors dotenv
npm install @supabase/supabase-js
npm install bcryptjs jsonwebtoken
npm install helmet express-rate-limit
npm install morgan winston
npm install razorpay
npm install multer
npm install socket.io
npm install joi
npm install prisma @prisma/client

# Install dev dependencies
npm install -D typescript @types/node @types/express
npm install -D @types/bcryptjs @types/jsonwebtoken
npm install -D @types/cors @types/morgan
npm install -D nodemon ts-node
npm install -D prisma
```

### **Step 4: Configure package.json**

```json
{
  "name": "retail-bandhu-backend",
  "version": "1.0.0",
  "description": "Backend API for Retail Bandhu Lite",
  "main": "dist/server.js",
  "type": "module",
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["retail", "billing", "pos", "api"],
  "author": "Retail Bandhu Team",
  "license": "MIT"
}
```

### **Step 5: TypeScript Configuration**

Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 📁 **PROJECT STRUCTURE**

```
retail-bandhu-backend/
│
├── src/
│   ├── server.ts                 # Main entry point
│   │
│   ├── config/
│   │   ├── database.ts           # Database configuration
│   │   ├── supabase.ts           # Supabase client
│   │   ├── redis.ts              # Redis configuration
│   │   └── constants.ts          # App constants
│   │
│   ├── middleware/
│   │   ├── auth.ts               # JWT authentication
│   │   ├── validate.ts           # Request validation
│   │   ├── errorHandler.ts      # Error handling
│   │   ├── rateLimiter.ts       # Rate limiting
│   │   └── logger.ts             # Request logging
│   │
│   ├── routes/
│   │   ├── index.ts              # Route aggregator
│   │   ├── auth.routes.ts        # Authentication routes
│   │   ├── billing.routes.ts     # Billing routes
│   │   ├── inventory.routes.ts   # Inventory routes
│   │   ├── customer.routes.ts    # Customer routes
│   │   ├── reports.routes.ts     # Reports routes
│   │   ├── whatsapp.routes.ts    # WhatsApp routes
│   │   └── admin.routes.ts       # Admin routes
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── billing.controller.ts
│   │   ├── inventory.controller.ts
│   │   ├── customer.controller.ts
│   │   ├── reports.controller.ts
│   │   ├── whatsapp.controller.ts
│   │   └── admin.controller.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── billing.service.ts
│   │   ├── inventory.service.ts
│   │   ├── customer.service.ts
│   │   ├── reports.service.ts
│   │   ├── whatsapp.service.ts
│   │   ├── payment.service.ts
│   │   └── storage.service.ts
│   │
│   ├── models/
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Customer.ts
│   │   ├── Invoice.ts
│   │   ├── Payment.ts
│   │   └── Inventory.ts
│   │
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   ├── billing.validator.ts
│   │   ├── inventory.validator.ts
│   │   └── customer.validator.ts
│   │
│   ├── utils/
│   │   ├── jwt.ts                # JWT utilities
│   │   ├── password.ts           # Password hashing
│   │   ├── logger.ts             # Winston logger
│   │   ├── response.ts           # API response formatter
│   │   └── constants.ts          # Constants
│   │
│   └── types/
│       ├── index.ts              # Type definitions
│       ├── express.d.ts          # Express extensions
│       └── api.ts                # API types
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Database migrations
│   └── seed.ts                   # Seed data
│
├── uploads/                      # Temporary file uploads
├── logs/                         # Application logs
│
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── .gitignore
├── .replit                       # Replit configuration
├── replit.nix                    # Nix configuration
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🗄️ **DATABASE DESIGN**

### **Prisma Schema (schema.prisma)**

```prisma
// This is your Prisma schema file

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// USER MANAGEMENT
// ============================================

model User {
  id              String    @id @default(uuid())
  phoneNumber     String    @unique
  email           String?   @unique
  password        String
  name            String
  role            UserRole  @default(RETAILER)
  
  // Store details
  storeName       String?
  storeAddress    String?
  gstin           String?   @unique
  
  // Subscription
  subscriptionPlan SubscriptionPlan @default(FREE)
  subscriptionExpiry DateTime?
  
  // Metadata
  isActive        Boolean   @default(true)
  isVerified      Boolean   @default(false)
  lastLogin       DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  products        Product[]
  customers       Customer[]
  invoices        Invoice[]
  inventoryLogs   InventoryLog[]
  
  @@index([phoneNumber])
  @@index([email])
}

enum UserRole {
  ADMIN
  RETAILER
  STAFF
}

enum SubscriptionPlan {
  FREE
  BASIC
  PREMIUM
  ENTERPRISE
}

// ============================================
// PRODUCT & INVENTORY MANAGEMENT
// ============================================

model Product {
  id              String    @id @default(uuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Basic details
  name            String
  sku             String?   @unique
  barcode         String?   @unique
  category        String?
  subCategory     String?
  
  // Pricing
  purchasePrice   Float
  sellingPrice    Float
  mrp             Float?
  gstRate         Float     @default(0)
  
  // Inventory
  currentStock    Int       @default(0)
  minStockLevel   Int       @default(0)
  unit            String    @default("piece")
  
  // Product details
  description     String?
  imageUrl        String?
  brand           String?
  manufacturer    String?
  
  // Metadata
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  invoiceItems    InvoiceItem[]
  inventoryLogs   InventoryLog[]
  
  @@index([userId])
  @@index([sku])
  @@index([barcode])
  @@index([category])
}

model InventoryLog {
  id              String    @id @default(uuid())
  productId       String
  product         Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type            InventoryType
  quantity        Int
  previousStock   Int
  newStock        Int
  reason          String?
  referenceId     String?   // Invoice ID or Purchase ID
  
  createdAt       DateTime  @default(now())
  
  @@index([productId])
  @@index([userId])
  @@index([createdAt])
}

enum InventoryType {
  SALE
  PURCHASE
  ADJUSTMENT
  RETURN
  DAMAGED
}

// ============================================
// CUSTOMER MANAGEMENT
// ============================================

model Customer {
  id              String    @id @default(uuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Basic details
  name            String
  phoneNumber     String
  email           String?
  
  // Address
  address         String?
  city            String?
  state           String?
  pincode         String?
  
  // Business details
  gstin           String?
  businessName    String?
  
  // Financial
  creditLimit     Float     @default(0)
  currentBalance  Float     @default(0)
  
  // Metadata
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  invoices        Invoice[]
  payments        Payment[]
  
  @@index([userId])
  @@index([phoneNumber])
  @@unique([userId, phoneNumber])
}

// ============================================
// BILLING & INVOICES
// ============================================

model Invoice {
  id              String    @id @default(uuid())
  invoiceNumber   String    @unique
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  customerId      String?
  customer        Customer? @relation(fields: [customerId], references: [id], onDelete: SetNull)
  
  // Invoice details
  invoiceDate     DateTime  @default(now())
  dueDate         DateTime?
  
  // Amounts
  subtotal        Float
  taxAmount       Float
  discountAmount  Float     @default(0)
  totalAmount     Float
  paidAmount      Float     @default(0)
  balanceAmount   Float
  
  // Payment
  paymentStatus   PaymentStatus @default(UNPAID)
  paymentMethod   PaymentMethod?
  
  // GST Details
  cgst            Float     @default(0)
  sgst            Float     @default(0)
  igst            Float     @default(0)
  
  // Metadata
  notes           String?
  status          InvoiceStatus @default(DRAFT)
  pdfUrl          String?
  whatsappSent    Boolean   @default(false)
  whatsappSentAt  DateTime?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  items           InvoiceItem[]
  payments        Payment[]
  
  @@index([userId])
  @@index([customerId])
  @@index([invoiceNumber])
  @@index([invoiceDate])
}

model InvoiceItem {
  id              String    @id @default(uuid())
  invoiceId       String
  invoice         Invoice   @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  productId       String?
  product         Product?  @relation(fields: [productId], references: [id], onDelete: SetNull)
  
  // Item details
  name            String
  quantity        Float
  unit            String    @default("piece")
  price           Float
  gstRate         Float     @default(0)
  
  // Calculated
  subtotal        Float
  taxAmount       Float
  total           Float
  
  createdAt       DateTime  @default(now())
  
  @@index([invoiceId])
  @@index([productId])
}

enum InvoiceStatus {
  DRAFT
  SENT
  PAID
  CANCELLED
}

enum PaymentStatus {
  PAID
  UNPAID
  PARTIAL
  OVERDUE
}

enum PaymentMethod {
  CASH
  UPI
  CARD
  BANK_TRANSFER
  CREDIT
}

// ============================================
// PAYMENTS
// ============================================

model Payment {
  id              String    @id @default(uuid())
  invoiceId       String?
  invoice         Invoice?  @relation(fields: [invoiceId], references: [id], onDelete: SetNull)
  customerId      String?
  customer        Customer? @relation(fields: [customerId], references: [id], onDelete: SetNull)
  
  amount          Float
  paymentMethod   PaymentMethod
  paymentDate     DateTime  @default(now())
  
  // Payment gateway details
  transactionId   String?   @unique
  gatewayResponse Json?
  
  // Metadata
  notes           String?
  receiptUrl      String?
  
  createdAt       DateTime  @default(now())
  
  @@index([invoiceId])
  @@index([customerId])
  @@index([paymentDate])
}

// ============================================
// WHATSAPP MESSAGES
// ============================================

model WhatsAppMessage {
  id              String    @id @default(uuid())
  
  // Recipient
  phoneNumber     String
  name            String?
  
  // Message
  messageType     MessageType
  content         String
  mediaUrl        String?
  
  // Status
  status          MessageStatus @default(PENDING)
  sentAt          DateTime?
  deliveredAt     DateTime?
  readAt          DateTime?
  
  // WhatsApp API response
  messageId       String?   @unique
  errorMessage    String?
  
  // Reference
  invoiceId       String?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([phoneNumber])
  @@index([status])
  @@index([createdAt])
}

enum MessageType {
  TEXT
  TEMPLATE
  INVOICE
  PAYMENT_REMINDER
  PRODUCT_CATALOG
}

enum MessageStatus {
  PENDING
  SENT
  DELIVERED
  READ
  FAILED
}

// ============================================
// ANALYTICS & LOGS
// ============================================

model ActivityLog {
  id              String    @id @default(uuid())
  userId          String?
  
  action          String
  entity          String
  entityId        String?
  details         Json?
  ipAddress       String?
  userAgent       String?
  
  createdAt       DateTime  @default(now())
  
  @@index([userId])
  @@index([createdAt])
}
```

---

## 🔐 **ENVIRONMENT VARIABLES**

Create `.env` file in Replit Secrets:

```bash
# Application
NODE_ENV=development
PORT=3000
API_VERSION=v1
APP_URL=https://retail-bandhu-backend.your-username.repl.co

# Database (Supabase)
DATABASE_URL=postgresql://user:password@db.xxx.supabase.co:5432/postgres
DIRECT_URL=postgresql://user:password@db.xxx.supabase.co:5432/postgres

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=30d

# Redis (Upstash)
REDIS_URL=redis://default:xxx@xxx.upstash.io:6379

# WhatsApp Business API
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_ACCESS_TOKEN=your-access-token
WHATSAPP_VERIFY_TOKEN=your-verify-token

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=your-key-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# Cloud Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# SMS (MSG91 or Twilio)
SMS_API_KEY=your-sms-api-key
SMS_SENDER_ID=RTLBND

# Email (SendGrid or Resend)
EMAIL_API_KEY=your-email-api-key
EMAIL_FROM=noreply@retailbandhu.in

# Frontend URL (CORS)
FRONTEND_URL=https://www.retailbandhu.in

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

---

## 📌 **NEXT STEPS**

This is **Part 1** of the complete guide. I'll create additional detailed files for:

1. ✅ **Backend Implementation** (server.ts, middleware, controllers)
2. ✅ **API Endpoints Documentation** (Complete REST API spec)
3. ✅ **Authentication System** (JWT, sessions, security)
4. ✅ **WhatsApp Integration** (Business API, templates, automation)
5. ✅ **Payment Integration** (Razorpay, webhooks, refunds)
6. ✅ **Deployment Guide** (Replit deployment, monitoring)

**Ready to proceed?** I'll create the implementation files next!
