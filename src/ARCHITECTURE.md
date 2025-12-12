# 🏗️ Retail Bandhu Lite - Technical Architecture

## **System Overview**

Retail Bandhu Lite is a production-ready Progressive Web Application (PWA) built with React and TypeScript, designed for offline-first operation with optional cloud sync capabilities.

---

## 📐 **Architecture Principles**

1. **Offline-First**: All features work without internet connectivity
2. **Mobile-First**: Optimized for mobile devices, responsive for desktop
3. **Progressive Enhancement**: Basic features work everywhere, advanced features where supported
4. **Type Safety**: Full TypeScript coverage
5. **Component Modularity**: Reusable, testable components
6. **Data Persistence**: LocalStorage with structured schemas
7. **Performance**: Lazy loading, code splitting ready
8. **Accessibility**: ARIA labels, keyboard navigation

---

## 🎯 **Core Architecture Pattern**

```
┌─────────────────────────────────────────────────┐
│              App.tsx (Router)                   │
│  - Screen state management                      │
│  - Global state (products, store info)          │
│  - Data persistence orchestration               │
└──────────────────┬──────────────────────────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
    ▼              ▼              ▼
┌─────────┐  ┌──────────┐  ┌──────────┐
│ Screens │  │   Utils  │  │    UI    │
│  (33)   │  │  (5)     │  │  (45+)   │
└─────────┘  └──────────┘  └──────────┘
    │              │              │
    └──────────────┴──────────────┘
                   │
                   ▼
         ┌──────────────────┐
         │  LocalStorage    │
         │  - Products      │
         │  - Bills         │
         │  - Customers     │
         │  - Settings      │
         └──────────────────┘
```

---

## 📦 **Component Architecture**

### **1. Screen Components** (33 screens)
Location: `/components/`

Each screen is a self-contained component with:
- Props interface with `onNavigate` callback
- Local state management
- Integration with storage utilities
- Responsive layout

**Example Structure:**
```typescript
interface ScreenProps {
  onNavigate: (screen: Screen) => void;
  // Additional props as needed
}

export function ScreenName({ onNavigate, ...props }: ScreenProps) {
  // Local state
  const [data, setData] = useState([]);
  
  // Effects for data loading
  useEffect(() => {
    const loadedData = storage.getData();
    setData(loadedData);
  }, []);
  
  // Render
  return (
    <div>
      {/* Screen content */}
    </div>
  );
}
```

### **2. UI Components** (45+ components)
Location: `/components/ui/`

Based on Radix UI primitives with custom styling:
- Fully accessible (ARIA compliant)
- Type-safe props
- Tailwind CSS styling
- Consistent design tokens

**Key UI Components:**
- `Button`, `Card`, `Input`, `Dialog`
- `Select`, `Tabs`, `Sheet`, `Popover`
- `Progress`, `Badge`, `Alert`, `Toast`
- Form components, Navigation components

### **3. Utility Modules** (5 utilities)
Location: `/utils/`

#### **storage.ts** - Data Persistence Layer
```typescript
export const storage = {
  // Products
  getProducts: (): Product[] => {...},
  setProducts: (products: Product[]) => {...},
  
  // Bills
  getBills: (): Bill[] => {...},
  addBill: (bill: Bill) => {...},
  
  // Customers
  getCustomers: (): Customer[] => {...},
  updateCustomer: (id: string, data: Partial<Customer>) => {...},
  
  // ... etc
};
```

#### **gst.ts** - GST Calculations
```typescript
export interface GSTConfig {
  gstin: string;
  businessName: string;
  enableGST: boolean;
  defaultGSTRate: number;
  registrationType: 'regular' | 'composition';
}

export function calculateGST(
  products: ProductWithGST[],
  config: GSTConfig,
  isIGST: boolean
): GSTBreakdown {...}
```

#### **loyalty.ts** - Loyalty Program Logic
```typescript
export interface LoyaltyConfig {
  enabled: boolean;
  pointsPerRupee: number;
  redemptionValue: number;
  tiers: LoyaltyTier[];
}

export function awardPointsForPurchase(
  customerId: string,
  amount: number,
  billNumber: string
): number {...}
```

#### **export.ts** - Data Export Utilities
```typescript
export function exportToJSON(data: any): string {...}
export function exportToCSV(data: any[], headers: string[]): string {...}
export function exportToExcel(data: any[], sheetName: string): Blob {...}
```

#### **translations.ts** - Multi-language Support
```typescript
export const translations = {
  en: { /* English */ },
  hi: { /* Hindi */ },
  hinglish: { /* Hinglish */ }
};
```

---

## 🗂️ **Data Layer**

### **Storage Schema**

#### **Products**
```typescript
interface Product {
  id: string;              // Unique identifier
  name: string;            // Product name
  price: number;           // Price in INR
  stock: number;           // Available quantity
  image?: string;          // Product image URL
  category?: string;       // Product category
  hsnCode?: string;        // HSN code for GST
  gstRate?: number;        // GST percentage
  minStockLevel?: number;  // Reorder threshold
}
```

#### **Bills**
```typescript
interface Bill {
  id: string;
  billNumber: string;      // Format: RB[timestamp]
  items: BillItem[];
  customer?: Customer;
  subtotal: number;
  tax: number;             // GST amount
  discount: number;        // Discount percentage
  total: number;           // Final amount
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Credit';
  date: string;            // ISO date string
  time: string;
  gstEnabled: boolean;
  gstBreakdown?: {
    cgst: number;
    sgst: number;
    igst: number;
  };
}
```

#### **Customers**
```typescript
interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalPurchases: number;  // Lifetime value
  lastVisit: string;       // ISO date
  loyaltyPoints?: number;
  tier?: 'Silver' | 'Gold' | 'Platinum';
  khataBalance?: number;   // Credit/debit balance
}
```

#### **Khata Entries**
```typescript
interface KhataEntry {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: string;
  billId?: string;
  settled: boolean;
}
```

#### **Expenses**
```typescript
interface Expense {
  id: string;
  category: string;        // Rent, Utilities, Inventory, etc.
  amount: number;
  description: string;
  date: string;
  paymentMethod: string;
  partyName?: string;      // Vendor/supplier name
}
```

---

## 🔄 **State Management**

### **App-Level State** (App.tsx)
```typescript
// Screen navigation
const [currentScreen, setCurrentScreen] = useState<Screen>('splash');

// Authentication state
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [storeSetup, setStoreSetup] = useState(false);

// Global data
const [storeInfo, setStoreInfo] = useState<StoreInfo>({...});
const [products, setProducts] = useState<Product[]>([...]);
const [currentBill, setCurrentBill] = useState<BillItem[]>([]);

// UI state
const [showAiAssistant, setShowAiAssistant] = useState(false);
```

### **Component-Level State**
Each screen manages its own local state:
```typescript
// Example: BillingScreen
const [selectedCustomer, setSelectedCustomer] = useState('');
const [discount, setDiscount] = useState(0);
const [enableGST, setEnableGST] = useState(false);
const [billItems, setBillItems] = useState<BillItemWithGST[]>([]);
```

### **Data Flow**
1. User interaction → Component state update
2. Component calls storage utility
3. Storage updates LocalStorage
4. Component re-renders with new data
5. State propagates to parent if needed

---

## 🎨 **Styling Architecture**

### **Tailwind CSS v4**
- Utility-first approach
- Custom design tokens in `/styles/globals.css`
- No font size/weight classes (use semantic HTML)
- Responsive design with mobile-first breakpoints

### **Design Tokens**
```css
:root {
  --color-primary: #1E88E5;
  --color-accent: #FF6F00;
  --border-radius-card: 12px;
  --shadow-card: 0 4px 6px rgba(0,0,0,0.1);
}
```

### **Component Styling Pattern**
```typescript
// Consistent class patterns
<Card className="p-4 bg-white rounded-xl shadow-md">
  <Button className="bg-gradient-to-r from-blue-600 to-orange-500">
    Action
  </Button>
</Card>
```

---

## 🔌 **Integration Points**

### **Current: LocalStorage**
- Synchronous operations
- 5-10MB storage limit
- Structured JSON data
- Per-domain isolation

### **Future: Supabase (Ready to Implement)**
```typescript
// Supabase configuration
interface SupabaseConfig {
  url: string;
  anonKey: string;
  tables: {
    products: 'products',
    bills: 'bills',
    customers: 'customers',
    // ... etc
  };
}

// Sync logic (to be implemented)
async function syncToCloud() {
  const localData = storage.getAllData();
  const { data, error } = await supabase
    .from('bills')
    .upsert(localData.bills);
  // Handle conflicts, merge, etc.
}
```

---

## 📱 **PWA Implementation**

### **Service Worker** (`/public/service-worker.js`)
```javascript
// Cache-first strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-bills') {
    event.waitUntil(syncBills());
  }
});
```

### **Web App Manifest** (`/public/manifest.json`)
- App metadata
- Icons (8 sizes: 72px to 512px)
- Display mode: standalone
- Orientation: portrait
- Theme color: #1E88E5

### **Install Prompt** (index.html)
- Detects `beforeinstallprompt` event
- Shows custom install UI
- Tracks installation status

---

## 🚀 **Performance Optimizations**

### **Current**
1. **Lazy Loading**: Ready for React.lazy() implementation
2. **Code Splitting**: Can be added per route
3. **Image Optimization**: Uses Unsplash CDN
4. **Minimal Dependencies**: Only essential libraries
5. **LocalStorage Caching**: Instant data access

### **Recommended Future Optimizations**
```typescript
// 1. Route-based code splitting
const Dashboard = lazy(() => import('./components/Dashboard'));
const BillingScreen = lazy(() => import('./components/EnhancedBillingScreen'));

// 2. Image lazy loading
<img loading="lazy" src={product.image} alt={product.name} />

// 3. Virtual scrolling for long lists
import { VirtualList } from 'react-virtual';

// 4. Debounced search
const debouncedSearch = useMemo(
  () => debounce(handleSearch, 300),
  []
);
```

---

## 🔒 **Security Considerations**

### **Current Implementation**
1. **No External APIs**: All operations local
2. **Client-Side Only**: No server-side vulnerabilities
3. **LocalStorage**: Browser sandboxed
4. **No PII Collection**: Privacy-first

### **When Adding Cloud Sync**
1. **Authentication**: Use Supabase Auth or JWT
2. **Authorization**: Row-level security
3. **Data Encryption**: Encrypt sensitive fields
4. **API Keys**: Use environment variables
5. **HTTPS Only**: Force secure connections

---

## 🧪 **Testing Strategy** (Recommended)

### **Unit Tests**
```typescript
// Utils testing
describe('storage.ts', () => {
  test('should save and retrieve products', () => {
    const products = [{ id: '1', name: 'Test', price: 10, stock: 5 }];
    storage.setProducts(products);
    expect(storage.getProducts()).toEqual(products);
  });
});

// Component testing
describe('BillingScreen', () => {
  test('should add item to bill', () => {
    // Test implementation
  });
});
```

### **Integration Tests**
- Test complete user flows
- Billing → Payment → Receipt
- Product add → Stock update

### **E2E Tests**
- Playwright or Cypress
- Critical user journeys
- PWA installation flow

---

## 📊 **Monitoring & Analytics** (Future)

### **Performance Monitoring**
```typescript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### **Error Tracking**
```typescript
// Sentry integration (optional)
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_DSN",
  environment: process.env.NODE_ENV,
});
```

### **Usage Analytics**
```typescript
// Privacy-respecting analytics
// Only with user consent
interface AnalyticsEvent {
  event: string;
  screen: string;
  timestamp: string;
}
```

---

## 🔧 **Development Workflow**

### **Code Standards**
- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- Component documentation

### **Git Workflow**
```
main
  ├── develop
  │   ├── feature/billing-enhancements
  │   ├── feature/gst-integration
  │   └── bugfix/inventory-issue
  └── hotfix/critical-bug
```

### **Build Process**
```bash
# Development
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 📈 **Scalability Considerations**

### **Data Volume**
- **Current**: Handles ~1000 products, ~10,000 bills
- **Optimization**: IndexedDB for >100MB data
- **Cloud**: Supabase for unlimited storage

### **User Growth**
- **Single User**: Current architecture
- **Multi-User**: Add authentication layer
- **Multi-Store**: Store-level data segregation

### **Feature Expansion**
- Modular architecture allows easy feature addition
- Each feature in separate component/utility
- Minimal coupling between modules

---

## 🎯 **Deployment Options**

### **1. Static Hosting** (Recommended)
- **Netlify**: Drag-and-drop deployment
- **Vercel**: GitHub integration
- **GitHub Pages**: Free hosting
- **Firebase Hosting**: Google integration

### **2. CDN Deployment**
- Cloudflare Pages
- AWS S3 + CloudFront
- Azure Static Web Apps

### **3. Self-Hosted**
- Nginx static files
- Apache server
- Docker container

---

## 🔄 **Update Strategy**

### **App Updates**
1. Service Worker cache versioning
2. Auto-update on app close
3. User notification of new version
4. Offline update queuing

### **Data Migration**
```typescript
// Version-based migrations
interface Migration {
  version: string;
  migrate: (data: any) => any;
}

const migrations: Migration[] = [
  {
    version: '1.1.0',
    migrate: (data) => {
      // Add new fields, transform data
      return { ...data, newField: 'default' };
    }
  }
];
```

---

## 🎓 **Developer Onboarding**

### **Quick Start for New Developers**
1. Clone repository
2. Review this architecture doc
3. Read README.md for feature overview
4. Explore `/components` directory
5. Check `/utils` for business logic
6. Make changes and test locally

### **Key Files to Understand**
1. `/App.tsx` - Main router and state
2. `/utils/storage.ts` - Data layer
3. `/components/EnhancedBillingScreen.tsx` - Complex example
4. `/components/ui/*` - UI component library

---

## 📚 **Additional Resources**

- **React Documentation**: https://react.dev
- **TypeScript Handbook**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com
- **Radix UI**: https://www.radix-ui.com
- **PWA Best Practices**: https://web.dev/progressive-web-apps

---

## 🤝 **Contributing Guidelines**

1. Follow existing code patterns
2. Add TypeScript types for all props/state
3. Write descriptive component names
4. Document complex logic with comments
5. Test on mobile devices
6. Ensure offline functionality

---

**Architecture Version**: 1.0.0  
**Last Updated**: December 2025  
**Maintained by**: Retail Bandhu Team
