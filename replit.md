# Retail Bandhu Lite - Voice AI Billing App for Kirana Stores

## Overview
Retail Bandhu Lite is a comprehensive, production-ready Progressive Web App (PWA) designed specifically for small retailers and kirana stores in India. It features voice-enabled billing in Hinglish, complete inventory management, customer relationship management, GST compliance, and WhatsApp integration.

**Target Users:** Kirana store owners, small retailers, and shopkeepers across India who need an easy-to-use digital billing and inventory management solution.

## Current State
- **Status:** Production-ready with 33 fully functional screens
- **Stack:** React 18, TypeScript, Vite, Tailwind CSS, Express API, PostgreSQL
- **Data:** PostgreSQL database with Drizzle ORM for persistent cloud storage
- **PWA:** Fully offline-capable with service worker
- **Backend:** Express API server on port 3001 with Replit Auth
- **Frontend:** Vite dev server on port 5000
- **Authentication:** Replit OpenID Connect with session management

## Project Structure
```
retail-bandhu-lite/
├── src/
│   ├── components/          # 33+ Screen Components
│   │   ├── ui/              # 45+ Reusable shadcn/ui Components
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── EnhancedBillingScreen.tsx  # Voice billing
│   │   └── ... (30+ more screens)
│   ├── utils/
│   │   ├── storage.ts       # LocalStorage management
│   │   ├── api.ts           # API client for database
│   │   ├── gst.ts           # GST calculations
│   │   ├── loyalty.ts       # Loyalty program logic
│   │   └── translations.ts  # Multi-language support
│   ├── App.tsx              # Main router
│   └── main.tsx             # Entry point
├── server/
│   ├── index.ts             # Express API server
│   ├── db.ts                # Database connection
│   └── replitAuth.ts        # Replit OpenID Connect auth
├── shared/
│   └── schema.ts            # Drizzle database schema
├── drizzle.config.ts        # Drizzle ORM config
├── vite.config.ts           # Vite configuration
└── package.json             # Dependencies
```

## Key Features
1. **Voice Billing** - Speak in Hinglish ("2 Maggi aur 1 Pepsi")
2. **Inventory Management** - Complete stock tracking with reorder alerts
3. **Customer Management** - CRM with purchase history
4. **Khata (Credit Ledger)** - Digital udhari/credit tracking
5. **GST Invoicing** - GSTIN, HSN codes, compliant reports
6. **Loyalty Program** - Points and tier-based rewards
7. **WhatsApp Integration** - Share bills, catalogs, reminders
8. **Reports & Analytics** - Sales trends, profit analysis
9. **Data Backup** - Export to JSON/CSV/Excel
10. **Multi-language** - English, Hindi, Hinglish support

## Running the App
- **Frontend:** `npm run dev` (runs on port 5000)
- **Backend:** `npm run server` (runs on port 3001)
- **Build:** `npm run build` (outputs to /build)
- **Database:** `npm run db:push` (sync schema to PostgreSQL)
- **Deployment:** Static deployment configured

## Database
PostgreSQL database with Drizzle ORM. Tables:
- **users** - User accounts (via Replit Auth)
- **sessions** - Session storage for authentication
- **stores** - Store information and settings (linked to users)
- **products** - Product inventory
- **customers** - Customer data with loyalty points
- **bills** - Sales transactions
- **khata_entries** - Credit/debit ledger
- **expenses** - Business expenses
- **parties** - Suppliers and vendors

## Architecture Decisions
- **Offline-First with Cloud Sync:** Optimistic UI updates with PostgreSQL backend
- **Hybrid Storage:** Local cache for instant feedback, API sync when online
- **Local ID Prefix:** Records created offline use 'local_' prefix until synced
- **Component Library:** shadcn/ui + Radix for accessible, beautiful UI
- **Mobile-First:** Designed primarily for mobile usage by shopkeepers

## Recent Changes
- Migrated from Hono to Express for better auth middleware support
- Added Replit OpenID Connect authentication
- Added users and sessions tables for multi-user support
- Linked stores to user accounts for data isolation
- Integrated PostgreSQL database with Drizzle ORM
- Implemented offline-first storage with optimistic updates
- Added proper foreign key constraints and cascade deletes
- Fixed TypeScript/React import configuration
- Configured Vite for Replit environment (port 5000, allowedHosts)
- Added Vite proxy for /api requests to backend on port 3001
- Implemented secure CORS with origin allowlist
- Required SESSION_SECRET environment variable for security

## User Preferences
- Hinglish interface (mix of Hindi and English)
- Simple, touch-friendly design for quick use
- Voice input for faster billing
- WhatsApp integration for customer communication

## Development Notes
- Storage layer provides optimistic updates for instant UI feedback
- API failures fallback to local-only records (preserved on sync)
- Database schema uses NOT NULL on foreign keys with cascade deletes
- PWA manifest and service worker in `src/public/`
- All components support both English and Hindi

## API Endpoints
**Authentication:**
- `GET /api/login` - Initiate Replit Auth login
- `GET /api/callback` - OAuth callback handler
- `GET /api/logout` - End session and logout
- `GET /api/auth/user` - Get current authenticated user

**Data APIs:**
- `GET/POST /api/stores/:storeId/products` - Product management
- `GET/POST /api/stores/:storeId/customers` - Customer management
- `GET/POST /api/stores/:storeId/bills` - Bill creation
- `GET/POST /api/stores/:storeId/khata` - Credit ledger
- `GET/POST /api/stores/:storeId/expenses` - Expense tracking
- `GET/POST /api/stores/:storeId/parties` - Supplier management
- `GET /api/health` - API health check
