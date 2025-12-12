# 🚀 **REPLIT DEPLOYMENT GUIDE - PRODUCTION READY**

## 📋 **COMPLETE DEPLOYMENT CHECKLIST**

---

## 🎯 **PRE-DEPLOYMENT SETUP**

### **1. Create Supabase Database**

1. **Go to Supabase:**
   - Visit: https://supabase.com
   - Create new project
   - Wait for database provisioning

2. **Get Database URL:**
   ```
   Project Settings → Database → Connection String
   
   Copy both:
   - Connection pooling (for production)
   - Direct connection (for migrations)
   ```

3. **Setup Database Schema:**
   ```bash
   # In Replit Shell
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Create Storage Bucket:**
   - Go to Storage → New Bucket
   - Name: `retail-bandhu-files`
   - Public: Yes
   - File size limit: 10MB

---

### **2. Setup External Services**

#### **A. WhatsApp Business API**

1. **Meta Business Suite:**
   - Go to https://business.facebook.com
   - Create business account
   - Add WhatsApp Business API

2. **Get Credentials:**
   ```
   WhatsApp → API Setup:
   - Phone Number ID
   - Access Token (Permanent)
   - Webhook Verify Token (create custom)
   ```

3. **Configure Webhook:**
   ```
   Webhook URL: https://your-app.repl.co/api/v1/whatsapp/webhook
   Verify Token: your-custom-token
   Subscribe to: messages, message_status
   ```

#### **B. Razorpay Payment Gateway**

1. **Create Account:**
   - Go to https://razorpay.com
   - Sign up and complete KYC

2. **Get API Keys:**
   ```
   Dashboard → Settings → API Keys:
   - Test Key ID
   - Test Key Secret
   - Webhook Secret
   ```

3. **Setup Webhook:**
   ```
   Webhook URL: https://your-app.repl.co/api/v1/payments/webhook
   Events: payment.captured, payment.failed, refund.created
   ```

#### **C. Cloudinary (Optional)**

1. **Create Account:**
   - Go to https://cloudinary.com
   - Free tier: 25GB storage

2. **Get Credentials:**
   ```
   Dashboard → Account Details:
   - Cloud Name
   - API Key
   - API Secret
   ```

---

## 🔧 **REPLIT CONFIGURATION**

### **Step 1: Create Replit Project**

1. **New Repl:**
   - Template: Node.js
   - Name: `retail-bandhu-backend`
   - Visibility: Private

2. **Clone Repository (Optional):**
   ```bash
   git clone https://github.com/your-repo/retail-bandhu-backend.git
   cd retail-bandhu-backend
   npm install
   ```

---

### **Step 2: Environment Variables**

**In Replit → Tools → Secrets:**

```bash
# Application
NODE_ENV=production
PORT=3000
API_VERSION=v1
APP_URL=https://retail-bandhu-backend.your-username.repl.co
FRONTEND_URL=https://www.retailbandhu.in

# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# JWT
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret-different-from-jwt
REFRESH_TOKEN_EXPIRES_IN=30d

# WhatsApp
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_ACCESS_TOKEN=your-permanent-access-token
WHATSAPP_VERIFY_TOKEN=your-custom-verify-token

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-secret-key
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
STORAGE_PROVIDER=cloudinary

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

---

### **Step 3: Update package.json**

```json
{
  "name": "retail-bandhu-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate deploy",
    "prisma:studio": "prisma studio",
    "deploy": "npm run prisma:generate && npm run prisma:migrate && npm run build && npm run start"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1",
    "@supabase/supabase-js": "^2.39.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "express-rate-limit": "^7.1.5",
    "morgan": "^1.10.0",
    "winston": "^3.11.0",
    "joi": "^17.11.0",
    "prisma": "^5.7.1",
    "@prisma/client": "^5.7.1",
    "razorpay": "^2.9.2",
    "axios": "^1.6.2",
    "socket.io": "^4.6.0",
    "multer": "^1.4.5-lts.1",
    "cloudinary": "^1.41.0",
    "date-fns": "^3.0.6"
  },
  "devDependencies": {
    "@types/node": "^20.10.5",
    "@types/express": "^4.17.21",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/cors": "^2.8.17",
    "@types/morgan": "^1.9.9",
    "@types/multer": "^1.4.11",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2"
  }
}
```

---

### **Step 4: Configure Replit Files**

**`.replit`**
```toml
run = "npm run start"
modules = ["nodejs-20:v8-20230920-bd784b4"]

[nix]
channel = "stable-23_11"

[deployment]
run = ["sh", "-c", "npm run deploy"]
deploymentTarget = "cloudrun"
build = ["sh", "-c", "npm install && npx prisma generate"]

[env]
NODE_ENV = "production"
```

**`replit.nix`**
```nix
{ pkgs }: {
  deps = [
    pkgs.nodejs-20_x
    pkgs.nodePackages.typescript
    pkgs.nodePackages.ts-node
    pkgs.postgresql
  ];
}
```

---

## 🚀 **DEPLOYMENT STEPS**

### **Step 1: Install Dependencies**

```bash
npm install
```

### **Step 2: Generate Prisma Client**

```bash
npx prisma generate
```

### **Step 3: Run Migrations**

```bash
# Development
npx prisma migrate dev

# Production
npx prisma migrate deploy
```

### **Step 4: Build TypeScript**

```bash
npm run build
```

### **Step 5: Test Locally**

```bash
# Click "Run" in Replit
# Or use:
npm run start
```

### **Step 6: Deploy to Production**

1. **In Replit:**
   - Click "Deploy" button
   - Choose "Autoscale Deployment"
   - Click "Deploy"

2. **Wait for Deployment:**
   - Monitor build logs
   - Check for errors
   - Verify deployment success

3. **Get Production URL:**
   ```
   https://retail-bandhu-backend.your-username.repl.co
   ```

---

## ✅ **POST-DEPLOYMENT VERIFICATION**

### **1. Health Check**

```bash
curl https://your-app.repl.co/health

Expected Response:
{
  "success": true,
  "message": "Retail Bandhu API is running",
  "timestamp": "2024-12-12T...",
  "environment": "production"
}
```

### **2. Test Authentication**

```bash
curl -X POST https://your-app.repl.co/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "9876543210",
    "password": "Test@123",
    "name": "Test User"
  }'
```

### **3. Test Database Connection**

```bash
# In Replit Shell
npx prisma studio

# Should open database viewer
```

### **4. Monitor Logs**

```bash
# In Replit Console
# Watch for:
✅ Server running on port 3000
✅ Database connected
✅ No error messages
```

---

## 🔄 **CONNECT FRONTEND TO BACKEND**

### **Update Frontend Environment Variables**

In your Vercel/Frontend deployment:

```bash
# Add to .env.production
NEXT_PUBLIC_API_URL=https://your-app.repl.co/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

### **Update API Client**

```typescript
// src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 📊 **MONITORING & MAINTENANCE**

### **1. Replit Monitoring**

- **Deployments Tab:** View deployment history
- **Logs Tab:** Monitor real-time logs
- **Analytics:** Track requests and performance

### **2. Database Monitoring**

```bash
# Check database size
npx prisma db pull

# View database stats in Supabase dashboard
```

### **3. Error Tracking**

Add Sentry (Optional):

```bash
npm install @sentry/node

# In src/server.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
});
```

---

## 🔐 **SECURITY CHECKLIST**

- [x] All environment variables set
- [x] JWT secrets are strong (32+ characters)
- [x] Database uses SSL
- [x] CORS configured for production domain only
- [x] Helmet security headers enabled
- [x] Rate limiting active
- [x] Input validation on all endpoints
- [x] File upload size limits
- [x] Webhook signatures verified
- [x] HTTPS enabled (Replit provides this)

---

## 🐛 **TROUBLESHOOTING**

### **Database Connection Fails**

```bash
# Check DATABASE_URL format
# Should use connection pooling for Supabase:
postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:6543/postgres?pgbouncer=true

# Test connection:
npx prisma db push
```

### **Prisma Migration Fails**

```bash
# Reset database (CAUTION: Deletes all data)
npx prisma migrate reset

# Or force push schema
npx prisma db push --force-reset
```

### **WhatsApp Webhook Not Working**

1. Verify webhook URL is HTTPS
2. Check WHATSAPP_VERIFY_TOKEN matches
3. Test webhook manually:
   ```bash
   curl "https://your-app.repl.co/api/v1/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=test"
   ```

### **Payment Webhook Fails**

1. Verify Razorpay webhook secret
2. Check webhook URL is correct
3. Test signature verification locally

---

## 📈 **SCALING CONSIDERATIONS**

### **When to Scale:**

- **Users > 100:** Consider paid Replit plan
- **Requests > 10k/day:** Add Redis caching
- **Database > 1GB:** Upgrade Supabase plan
- **Files > 25GB:** Upgrade Cloudinary or use S3

### **Optimization Tips:**

```typescript
// Add database indexes
// In schema.prisma:
@@index([userId])
@@index([createdAt])
@@index([status])

// Use connection pooling
// Already configured in DATABASE_URL

// Cache frequently accessed data
// Add Redis for session storage

// Optimize queries
// Use select to limit fields
// Use pagination everywhere
```

---

## 🎉 **DEPLOYMENT COMPLETE!**

Your Retail Bandhu Lite backend is now:

✅ **Deployed** on Replit (Production)  
✅ **Database** connected (Supabase PostgreSQL)  
✅ **WhatsApp** integration ready  
✅ **Payments** configured (Razorpay)  
✅ **File Storage** setup (Cloudinary)  
✅ **Security** hardened  
✅ **Monitoring** active  
✅ **API** documented  

**Your API is live at:** `https://your-app.repl.co/api/v1`

---

## 📞 **SUPPORT & NEXT STEPS**

### **Documentation:**
- API Docs: `/API_DOCUMENTATION.md`
- Database Schema: `/REPLIT_FULLSTACK_GUIDE.md`
- WhatsApp Integration: `/WHATSAPP_INTEGRATION.md`

### **Next Steps:**
1. Test all API endpoints
2. Connect frontend to backend
3. Add test data
4. Invite beta users
5. Monitor performance
6. Collect feedback
7. Iterate and improve

---

**Deployment Date:** December 2024  
**Status:** ✅ Production Ready  
**Version:** 1.0.0
