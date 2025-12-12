# Retail Bandhu Lite - Voice AI Billing App for Kirana Stores

## Overview
Retail Bandhu Lite is a comprehensive, production-ready Progressive Web App (PWA) designed specifically for small retailers and kirana stores in India. It features voice-enabled billing in Hinglish, complete inventory management, customer relationship management, GST compliance, and WhatsApp integration.

**Target Users:** Kirana store owners, small retailers, and shopkeepers across India who need an easy-to-use digital billing and inventory management solution.

## Current State
- **Status:** Production-ready with 33 fully functional screens
- **Stack:** React 18, TypeScript, Vite, Tailwind CSS, Hono API, PostgreSQL
- **Data:** PostgreSQL database with Drizzle ORM for persistent cloud storage
- **PWA:** Fully offline-capable with service worker
- **Backend:** Hono API server on port 3001
- **Frontend:** Vite dev server on port 5000

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
│   ├── index.ts             # Hono API server
│   └── db.ts                # Database connection
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
- **stores** - Store information and settings
- **products** - Product inventory
- **customers** - Customer data with loyalty points
- **bills** - Sales transactions
- **khata_entries** - Credit/debit ledger
- **expenses** - Business expenses
- **parties** - Suppliers and vendors

## Architecture Decisions
- **LocalStorage First:** All data stored locally for offline-first experience
- **Supabase Ready:** Configuration in place for cloud sync when needed
- **Component Library:** shadcn/ui + Radix for accessible, beautiful UI
- **Mobile-First:** Designed primarily for mobile usage by shopkeepers

## Recent Changes
- Fixed TypeScript/React import configuration
- Configured Vite for Replit environment (port 5000, allowedHosts)
- Set up static deployment configuration

## User Preferences
- Hinglish interface (mix of Hindi and English)
- Simple, touch-friendly design for quick use
- Voice input for faster billing
- WhatsApp integration for customer communication

## Development Notes
- The app uses localStorage for demo/offline functionality
- Supabase credentials are in `src/utils/supabase/info.tsx`
- PWA manifest and service worker in `src/public/`
- All components support both English and Hindi
