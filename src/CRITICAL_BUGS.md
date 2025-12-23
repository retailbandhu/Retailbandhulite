# 🐛 CRITICAL BUGS & FIXES
## Retail Bandhu Lite - Issue Tracker

---

## 🔴 CRITICAL BUGS (Blocking Release)

### BUG-001: Bill Data Not Synced Between Screens
**Priority:** P0 - CRITICAL  
**Status:** 🔴 OPEN  
**Assignee:** Developer  
**File:** `/components/EnhancedBillingScreen.tsx`

**Description:**
The billing screen maintains two separate state arrays for bill items:
1. `currentBill` from props (passed from App.tsx)
2. `billItems` as local state

When items are added via voice or manual input, they're added to local `billItems` but not synced to `currentBill`. When user navigates to bill preview, the bill appears empty.

**Code Location:**
```typescript
// Line 38-39
const [billItems, setBillItems] = useState<BillItemWithGST[]>([]);
// But currentBill from props is never updated
```

**Steps to Reproduce:**
1. Navigate to billing screen
2. Add items to bill (voice or manual)
3. Items appear in the list
4. Click "Preview Bill"
5. Bill preview is empty

**Impact:**
- Users cannot complete billing flow
- Data loss between screens
- Core functionality broken

**Fix:**
Either:
- Option A: Use only `currentBill` from props and update it via `setCurrentBill`
- Option B: Sync `billItems` to `currentBill` before navigation

**Estimated Effort:** 2 hours

---

### BUG-002: Voice Recognition Not Implemented
**Priority:** P0 - CRITICAL  
**Status:** 🔴 OPEN  
**Assignee:** Developer  
**File:** `/components/VoiceButton.tsx`

**Description:**
The voice button only shows a mock implementation with setTimeout. No actual voice recognition is implemented. This is the core feature advertised in the app name "Voice + AI Billing".

**Code Location:**
```typescript
// Line 16-22
setTimeout(() => {
  const mockInput = "2 Pepsi 20 rupees each";
  if (onVoiceInput) {
    onVoiceInput(mockInput);
  }
  setIsListening(false);
}, 2000);
```

**Impact:**
- Core selling point doesn't work
- False advertising to users
- Cannot be launched in current state

**Fix:**
Implement Web Speech API:
```typescript
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'hi-IN'; // Hindi
recognition.continuous = false;
recognition.interimResults = false;

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  if (onVoiceInput) {
    onVoiceInput(transcript);
  }
};

recognition.start();
```

**Requirements:**
- Support Hindi/Hinglish input
- Parse voice commands (quantity, product name, price)
- Fallback for browsers without Speech API
- Show clear error if microphone access denied

**Estimated Effort:** 8 hours

---

### BUG-003: Dashboard Shows Hardcoded Fake Data
**Priority:** P0 - CRITICAL  
**Status:** 🔴 OPEN  
**Assignee:** Developer  
**File:** `/components/Dashboard.tsx`

**Description:**
Dashboard displays hardcoded sales statistics instead of calculating real data from localStorage. This misleads users about their actual business performance.

**Code Location:**
```typescript
// Line 102-108
<p className="text-white text-xl">₹2,450</p> // Hardcoded
<p className="text-white text-xl">12</p> // Hardcoded

// Line 198
₹1,810 pending // Hardcoded

// Line 209
₹26,150 this month // Hardcoded
```

**Impact:**
- Users see fake sales data
- Cannot trust the app for business insights
- Misleading analytics

**Fix:**
Calculate real stats from storage:
```typescript
const [todaySales, setTodaySales] = useState(0);
const [todayBills, setTodayBills] = useState(0);

useEffect(() => {
  const bills = storage.getBills();
  const today = new Date().toISOString().split('T')[0];
  
  const todaysBills = bills.filter(b => b.date === today);
  const sales = todaysBills.reduce((sum, b) => sum + b.total, 0);
  
  setTodaySales(sales);
  setTodayBills(todaysBills.length);
}, []);
```

**Also Fix:**
- Khata pending amount (calculate from khata entries)
- Monthly expenses (sum expenses for current month)
- Make these reactive to data changes

**Estimated Effort:** 3 hours

---

### BUG-004: Customer Form Doesn't Save Data
**Priority:** P0 - CRITICAL  
**Status:** 🔴 OPEN  
**Assignee:** Developer  
**File:** `/components/CustomerManagement.tsx`

**Description:**
The "Add Customer" form in CustomerManagement screen doesn't actually save customer data to storage. Form inputs exist but aren't wired up to state and storage.

**Impact:**
- Users cannot add customers
- Customer features are non-functional
- Bills cannot be assigned to customers

**Fix:**
1. Wire up form inputs to state
2. Add form validation
3. Call storage.addCustomer() on submit
4. Refresh customer list after adding
5. Show success toast

**Estimated Effort:** 1 hour

---

## 🟡 HIGH PRIORITY BUGS

### BUG-005: Low Stock Count Not Reactive
**Priority:** P1 - HIGH  
**Status:** 🟡 OPEN  
**Assignee:** Developer  
**File:** `/components/Dashboard.tsx`

**Description:**
Low stock count is calculated once on component mount and never updates. When user reduces stock in inventory, dashboard still shows old count.

**Code Location:**
```typescript
// Line 17-20
useEffect(() => {
  const products = storage.getProducts();
  const count = products.filter(p => p.stock <= 10).length;
  setLowStockCount(count);
}, []); // Empty deps - only runs once
```

**Fix:**
- Add products as dependency
- Or pass products as prop from App.tsx
- Recalculate when inventory changes

**Estimated Effort:** 1 hour

---

### BUG-006: No Stock Deduction on Bill Creation
**Priority:** P1 - HIGH  
**Status:** 🟡 OPEN  
**Assignee:** Developer  
**File:** `/components/EnhancedBillingScreen.tsx`

**Description:**
When a bill is created and saved, product stock is not reduced. Inventory remains unchanged, making stock tracking inaccurate.

**Impact:**
- Inventory management doesn't work
- Stock levels are incorrect
- Low stock alerts won't trigger

**Fix:**
When saving bill:
```typescript
billItems.forEach(item => {
  const product = products.find(p => p.name === item.productName);
  if (product) {
    product.stock -= item.quantity;
  }
});
storage.setProducts(products);
```

**Estimated Effort:** 2 hours

---

### BUG-007: No Input Validation Anywhere
**Priority:** P1 - HIGH  
**Status:** 🟡 OPEN  
**Assignee:** Developer  
**Files:** Multiple (all forms)

**Description:**
No validation on any input fields. Users can enter:
- Empty names
- Negative prices
- Non-numeric quantities
- Invalid phone numbers
- Special characters that break JSON

**Examples:**
```typescript
// StoreSetup.tsx - Only checks if fields are truthy
if (storeName && owner && address && phone) {
  // No format validation
}

// InventoryScreen.tsx - No price/stock validation
// Can enter -100 as price
// Can enter "abc" as stock quantity
```

**Fix:**
Add validation for:
- Phone: /^\+?[1-9]\d{1,14}$/
- Price: Must be positive number
- Stock: Must be non-negative integer
- Name: Min 2 chars, max 100 chars
- Quantity: Must be positive integer

Use Zod for schema validation:
```typescript
import { z } from 'zod';

const ProductSchema = z.object({
  name: z.string().min(2).max(100),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
});
```

**Estimated Effort:** 4 hours

---

### BUG-008: Console.log Statements in Production
**Priority:** P1 - HIGH  
**Status:** 🟡 OPEN  
**Assignee:** Developer  
**Files:** Multiple

**Instances:**
- `MarketingHub.tsx:53` - console.log('Try feature:', feature)
- `DataBackup.tsx` - 5 instances of console.error()
- `index.html:212-227` - Service worker console logs

**Impact:**
- Performance overhead
- Exposes internal logic
- Security concern
- Unprofessional

**Fix:**
1. Remove all console statements OR
2. Create logger utility:
```typescript
// utils/logger.ts
const logger = {
  log: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.error(...args);
    }
    // Send to error tracking service in production
  }
};
```

**Estimated Effort:** 1 hour

---

### BUG-009: No Error Boundaries
**Priority:** P1 - HIGH  
**Status:** 🟡 OPEN  
**Assignee:** Developer  
**File:** New file needed

**Description:**
No error boundaries exist. If any component throws an error, the entire app crashes with white screen of death.

**Fix:**
Create ErrorBoundary component:
```typescript
// components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-screen">
          <h1>कुछ गड़बड़ हो गई!</h1>
          <p>App में कोई problem आ गई है।</p>
          <button onClick={() => window.location.reload()}>
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

Wrap App in error boundary:
```typescript
// App.tsx
export default function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
```

**Estimated Effort:** 2 hours

---

## 🟠 MEDIUM PRIORITY BUGS

### BUG-010: Missing ARIA Labels
**Priority:** P2 - MEDIUM  
**Status:** 🟠 OPEN  
**Impact:** Accessibility / WCAG 2.1 AA compliance

**Fix:** Add aria-label to all icon-only buttons

**Estimated Effort:** 2 hours

---

### BUG-011: No Loading States
**Priority:** P2 - MEDIUM  
**Status:** 🟠 OPEN  
**Impact:** UX - instant renders feel janky

**Fix:** Add skeleton loaders for data-heavy screens

**Estimated Effort:** 4 hours

---

### BUG-012: PWA Icons Missing
**Priority:** P2 - MEDIUM  
**Status:** 🟠 OPEN  
**Impact:** Install flow may fail

**Fix:** Generate all icon sizes (72x72 to 512x512)

**Estimated Effort:** 2 hours

---

### BUG-013: Color Contrast Issues
**Priority:** P2 - MEDIUM  
**Status:** 🟠 OPEN  
**Impact:** Accessibility / WCAG 2.1 AA compliance

**Examples:**
- White text on light blue (3.2:1, needs 4.5:1)
- Light text on orange gradient

**Fix:** Adjust colors to meet 4.5:1 contrast ratio

**Estimated Effort:** 2 hours

---

### BUG-014: No Data Migration Strategy
**Priority:** P2 - MEDIUM  
**Status:** 🟠 OPEN  
**Impact:** Future updates will break existing user data

**Fix:** Add version field to all stored data

**Estimated Effort:** 3 hours

---

## 🟢 LOW PRIORITY BUGS

### BUG-015: Large Bundle Size
**Priority:** P3 - LOW  
**Status:** 🟢 OPEN  
**Impact:** Slow initial load

**Fix:** Implement code splitting with React.lazy()

**Estimated Effort:** 4 hours

---

### BUG-016: Images Not Optimized
**Priority:** P3 - LOW  
**Status:** 🟢 OPEN  
**Impact:** Performance

**Fix:** Use responsive images, lazy loading, WebP format

**Estimated Effort:** 3 hours

---

## 📊 BUG SUMMARY

| Priority | Count | Status |
|----------|-------|--------|
| P0 (Critical) | 4 | 🔴 All blocking release |
| P1 (High) | 5 | 🟡 Should fix before v1.0 |
| P2 (Medium) | 5 | 🟠 Fix in v1.1 |
| P3 (Low) | 2 | 🟢 Future enhancement |
| **TOTAL** | **16** | |

---

## 🎯 RECOMMENDED FIX ORDER

### Sprint 1: Critical Fixes (15-20 hours)
1. BUG-001: Bill data sync (2h)
2. BUG-003: Real dashboard stats (3h)
3. BUG-004: Customer form (1h)
4. BUG-009: Error boundaries (2h)
5. BUG-007: Input validation (4h)
6. BUG-008: Remove console logs (1h)
7. BUG-002: Voice recognition OR mark as "Coming Soon" (8h)

### Sprint 2: High Priority (10-12 hours)
8. BUG-005: Reactive low stock (1h)
9. BUG-006: Stock deduction (2h)
10. BUG-010: ARIA labels (2h)
11. BUG-011: Loading states (4h)
12. BUG-012: PWA icons (2h)

### Sprint 3: Polish (8-10 hours)
13. BUG-013: Color contrast (2h)
14. BUG-014: Data migration (3h)
15. BUG-015: Code splitting (4h)
16. BUG-016: Image optimization (3h)

---

## ✅ ACCEPTANCE CRITERIA

### For MVP Launch:
- [ ] BUG-001 FIXED: Bills flow correctly between screens
- [ ] BUG-003 FIXED: Dashboard shows real data
- [ ] BUG-004 FIXED: Customers can be added
- [ ] BUG-009 FIXED: Error boundary catches crashes
- [ ] BUG-007 FIXED: Basic validation on critical forms
- [ ] BUG-008 FIXED: No console logs in production

### For Production (v1.0):
- [ ] All P0 and P1 bugs fixed
- [ ] Voice recognition implemented OR clearly marked as beta
- [ ] Accessibility issues addressed
- [ ] Loading states added
- [ ] PWA icons generated

---

*Last Updated: December 8, 2024*  
*Total Estimated Effort to Clear Critical Bugs: 15-20 hours*
