# 👨‍💻 Retail Bandhu Lite - Developer Guide

## Quick Start

### Understanding the Codebase

This app is built with React + TypeScript and uses a simple, maintainable architecture.

---

## 🏗️ Architecture Overview

### State Management
- **React Hooks** (useState, useEffect)
- **Props drilling** for screen navigation
- **localStorage** for persistence

### Data Flow
```
App.tsx (Root)
    ↓ (manages global state)
    ↓ (products, storeInfo, currentBill)
    ↓
Screen Components (Receive props)
    ↓
utils/storage.ts (Persistence layer)
    ↓
localStorage (Browser storage)
```

---

## 📁 Key Files

### 1. `/App.tsx` - Main Application
**Purpose**: Root component managing app state and navigation

**Key State**:
```typescript
const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
const [products, setProducts] = useState<Product[]>([]);
const [storeInfo, setStoreInfo] = useState<StoreInfo>({...});
const [currentBill, setCurrentBill] = useState<BillItem[]>([]);
```

**Key Functions**:
- `navigateTo(screen)` - Navigate between screens
- `handleOnboardingComplete()` - Complete onboarding
- `handleLoginComplete()` - Complete login
- `handleStoreSetupComplete()` - Save store info
- `renderScreen()` - Render current screen

**How to add a new screen**:
```typescript
// 1. Add screen type
export type Screen = 
  | 'existing-screens'
  | 'your-new-screen';  // Add this

// 2. Add case in renderScreen()
case 'your-new-screen':
  return <YourNewScreen onNavigate={navigateTo} />;

// 3. Navigate from anywhere
onNavigate('your-new-screen');
```

---

### 2. `/utils/storage.ts` - Data Persistence
**Purpose**: Centralized localStorage management

**Key Functions**:
```typescript
// Products
storage.getProducts() → Product[]
storage.setProducts(products)
storage.addProduct(product)

// Customers
storage.getCustomers() → Customer[]
storage.addCustomer(customer)
storage.updateCustomer(id, updates)

// Parties
storage.getParties() → Party[]
storage.addParty(party)

// Expenses
storage.getExpenses() → Expense[]
storage.addExpense(expense)

// Utilities
exportToCSV(data, filename) // Export to CSV
generateBillNumber() → string // Auto bill numbers
```

**Usage Example**:
```typescript
import { storage } from '../utils/storage';

// Save product
const newProduct = { id: '123', name: 'Test', price: 100, stock: 50 };
storage.setProducts([...storage.getProducts(), newProduct]);

// Load on mount
useEffect(() => {
  const products = storage.getProducts();
  setProducts(products);
}, []);
```

---

### 3. Screen Components

All screen components follow this pattern:

```typescript
interface ScreenNameProps {
  onNavigate: (screen: Screen) => void;
  // ... other props
}

export function ScreenName({ onNavigate, ...props }: ScreenNameProps) {
  // Local state
  const [localState, setLocalState] = useState();

  // Load data on mount
  useEffect(() => {
    const data = storage.getSomeData();
    setLocalState(data);
  }, []);

  // Handle actions
  const handleAction = () => {
    // Do something
    storage.setSomeData(newData);
    onNavigate('another-screen');
  };

  return (
    <div>
      {/* UI */}
    </div>
  );
}
```

---

## 🎯 Common Tasks

### Task 1: Add a New Product Category

**Files to modify**:
1. `/utils/storage.ts` - Add category to type
2. `/components/InventoryScreen.tsx` - Add category filter
3. `/components/QuickPOSMode.tsx` - Add category button

**Code**:
```typescript
// In Product interface
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category?: 'Snacks' | 'Beverages' | 'Groceries' | 'NEW_CATEGORY';
  image?: string;
}
```

---

### Task 2: Add a New Field to Store Info

**Files to modify**:
1. `/App.tsx` - Update StoreInfo interface
2. `/components/StoreSetup.tsx` - Add input field
3. `/components/SettingsScreen.tsx` - Display new field

**Code**:
```typescript
// App.tsx
export interface StoreInfo {
  name: string;
  owner: string;
  address: string;
  phone: string;
  logo?: string;
  billColor: string;
  email?: string;  // NEW FIELD
}

// StoreSetup.tsx
<Input
  type="email"
  placeholder="Email"
  value={formData.email}
  onChange={(e) => setFormData({...formData, email: e.target.value})}
/>
```

---

### Task 3: Add a New Dashboard Card

**File**: `/components/Dashboard.tsx`

**Code**:
```typescript
// Add to menuCards array
const menuCards = [
  // ... existing cards
  {
    id: 'new-feature',
    icon: <YourIcon className="w-8 h-8" />,
    title: 'New Feature',
    titleHindi: '🎯 Hindi Title',
    description: 'Feature description',
    gradient: 'from-purple-500 to-purple-700',
    screen: 'new-screen' as Screen
  }
];
```

---

### Task 4: Add Export to a Screen

**Example**: Export customers to CSV

```typescript
import { exportToCSV } from '../utils/storage';

const handleExport = () => {
  const customers = storage.getCustomers();
  const exportData = customers.map(c => ({
    Name: c.name,
    Phone: c.phone,
    'Total Purchases': c.totalPurchases
  }));
  exportToCSV(exportData, 'customers');
};

<Button onClick={handleExport}>
  Export to CSV
</Button>
```

---

### Task 5: Add a Quick Action

**File**: `/components/QuickActionsMenu.tsx`

```typescript
const actions = [
  // ... existing actions
  {
    icon: <YourIcon className="w-5 h-5" />,
    label: 'New Action',
    gradient: 'from-teal-500 to-teal-600',
    onClick: () => {
      onNavigate('your-screen');
      setIsOpen(false);
    }
  }
];
```

---

## 🎨 Styling Guide

### Tailwind Classes Pattern

```tsx
// Container
<div className="min-h-screen bg-gradient-to-br from-[#1E88E5]/5 to-[#FF6F00]/5">

// Header
<div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6 rounded-b-3xl">

// Card
<div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">

// Button Primary
<button className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white px-6 py-3 rounded-xl">

// Button Secondary
<button className="bg-white border border-gray-200 px-6 py-3 rounded-xl hover:bg-gray-50">

// Icon Container
<div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
  <Icon className="w-6 h-6 text-blue-600" />
</div>
```

### Color Palette
```typescript
const colors = {
  primary: '#1E88E5',      // Blue
  secondary: '#FF6F00',    // Orange
  success: '#4CAF50',      // Green
  error: '#F44336',        // Red
  warning: '#FFC107',      // Yellow
  info: '#2196F3',         // Light Blue
};
```

---

## 🧩 Component Patterns

### Pattern 1: List with Search

```typescript
const [searchQuery, setSearchQuery] = useState('');
const [items, setItems] = useState([]);

const filteredItems = items.filter(item =>
  item.name.toLowerCase().includes(searchQuery.toLowerCase())
);

return (
  <>
    <Input
      placeholder="Search..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    {filteredItems.map(item => (
      <ItemCard key={item.id} item={item} />
    ))}
  </>
);
```

### Pattern 2: Add/Edit Modal

```typescript
const [showModal, setShowModal] = useState(false);
const [editingItem, setEditingItem] = useState(null);
const [formData, setFormData] = useState({});

const handleSave = () => {
  if (editingItem) {
    // Update existing
    const updated = items.map(i => 
      i.id === editingItem.id ? {...i, ...formData} : i
    );
    setItems(updated);
  } else {
    // Add new
    const newItem = { id: Date.now().toString(), ...formData };
    setItems([...items, newItem]);
  }
  setShowModal(false);
};

return (
  <>
    <Button onClick={() => setShowModal(true)}>Add Item</Button>
    
    {showModal && (
      <Modal>
        <Input {...} />
        <Button onClick={handleSave}>Save</Button>
      </Modal>
    )}
  </>
);
```

### Pattern 3: Stats Card

```typescript
<div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
  <Icon className="w-5 h-5 text-white mx-auto mb-1" />
  <p className="text-2xl text-white">{value}</p>
  <p className="text-white/80 text-xs">{label}</p>
</div>
```

---

## 📦 Working with Images

### Unsplash Images (used in demo)
```typescript
const imageUrl = 'https://images.unsplash.com/photo-...';
```

### User Uploaded Images
```typescript
const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setFormData({...formData, image: base64});
    };
    reader.readAsDataURL(file);
  }
};
```

---

## 🔍 Debugging Tips

### Check localStorage
```javascript
// In browser console
localStorage.getItem('retail_bandhu_products')
localStorage.getItem('retail_bandhu_store_info')

// Clear all data
localStorage.clear()
```

### React DevTools
- Install React Developer Tools extension
- Inspect component props and state
- Track re-renders

### Common Issues

**Issue**: Data not persisting
```typescript
// Solution: Ensure you're calling storage.set*
useEffect(() => {
  storage.setProducts(products);
}, [products]);
```

**Issue**: Screen not navigating
```typescript
// Solution: Check Screen type and renderScreen case
export type Screen = 'your-screen';  // Add here
case 'your-screen': return <YourScreen />; // Add here
```

---

## 🚀 Performance Tips

### 1. Optimize Re-renders
```typescript
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo(({ data }) => {
  // Component code
});

// Use useMemo for expensive calculations
const total = useMemo(() => 
  items.reduce((sum, item) => sum + item.price, 0),
  [items]
);
```

### 2. Lazy Load Images
```typescript
<img loading="lazy" src={imageUrl} alt="..." />
```

### 3. Debounce Search
```typescript
import { useState, useEffect } from 'react';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

// Usage
const debouncedSearch = useDebounce(searchQuery, 300);
```

---

## 📝 Code Style Guide

### Naming Conventions
- **Components**: PascalCase (`DashboardScreen`, `ProductCard`)
- **Functions**: camelCase (`handleClick`, `fetchData`)
- **Constants**: UPPER_CASE (`MAX_ITEMS`, `API_URL`)
- **Props**: camelCase (`onNavigate`, `productList`)

### File Organization
```
components/
  ScreenName.tsx        # Main screens
  FeatureName.tsx       # Feature components
  ui/
    button.tsx          # Reusable UI components
    card.tsx
    input.tsx
```

### Comment Style
```typescript
// Single line comments for brief explanations

/**
 * Multi-line comments for complex logic
 * or function documentation
 */

// TODO: Future enhancement
// FIXME: Known issue to fix
```

---

## 🧪 Testing Checklist for New Features

- [ ] Component renders without errors
- [ ] Props are properly typed
- [ ] Navigation works correctly
- [ ] Data persists to localStorage
- [ ] Data loads on mount
- [ ] Forms validate input
- [ ] Error states handled
- [ ] Empty states shown
- [ ] Loading states displayed
- [ ] Responsive on mobile
- [ ] Hinglish text appropriate
- [ ] Icons and colors match brand

---

## 📚 Useful Resources

### React + TypeScript
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [React Hooks](https://react.dev/reference/react)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)

### Icons
- [Lucide Icons](https://lucide.dev/)
- Browse all available icons

---

## 🤝 Contributing

### Adding a New Feature

1. **Create the component**
```bash
/components/NewFeature.tsx
```

2. **Add types to App.tsx**
```typescript
export type Screen = ... | 'new-feature';
```

3. **Add to navigation**
```typescript
case 'new-feature':
  return <NewFeature onNavigate={navigateTo} />;
```

4. **Update documentation**
- COMPLETE_FEATURES.md
- SCREEN_TESTING_CHECKLIST.md

5. **Test thoroughly**
- Manual testing
- Data persistence
- Navigation flow

---

## 🎓 Learning Path

### Beginner Tasks
1. Change text/colors on existing screens
2. Add a new dashboard card
3. Add a field to a form
4. Modify a search filter

### Intermediate Tasks
1. Create a new screen
2. Add export functionality
3. Implement new chart
4. Add data validation

### Advanced Tasks
1. Add cloud sync (Firebase/Supabase)
2. Implement real barcode scanning
3. Add payment gateway
4. Multi-language support

---

## 💡 Pro Tips

1. **Use TypeScript** - It catches errors before runtime
2. **Extract Components** - Keep components small and reusable
3. **Use localStorage wisely** - Don't store too much data
4. **Test on Mobile** - Most users will be on mobile devices
5. **Keep it Fast** - Optimize images and minimize re-renders
6. **Follow Patterns** - Use existing patterns for consistency
7. **Document Changes** - Update docs when adding features

---

## 🆘 Getting Help

### Common Questions

**Q: How do I reset all data?**
```javascript
// Browser console
localStorage.clear()
// Then refresh page
```

**Q: How do I change the brand colors?**
```typescript
// Find and replace in all files:
from-[#1E88E5] → from-[#YOUR_COLOR]
to-[#FF6F00] → to-[#YOUR_COLOR]
```

**Q: How do I add a new payment method?**
```typescript
// utils/storage.ts
paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Credit' | 'NEW_METHOD';
```

---

**Happy Coding! 🚀**

Remember: Keep it simple, keep it clean, keep it fast!
