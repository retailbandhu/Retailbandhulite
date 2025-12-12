# 🧪 Comprehensive Testing Guide - Retail Bandhu Lite
## Quality Assurance & Testing Documentation

---

## 📋 TESTING OVERVIEW

This guide covers all testing aspects:
- Manual testing procedures
- Automated testing setup
- User acceptance testing (UAT)
- Performance testing
- Security testing
- Accessibility testing
- Cross-browser testing
- Mobile testing

---

## ✅ MANUAL TESTING CHECKLIST

### **1. USER FLOWS - CORE FUNCTIONALITY**

#### **Flow 1: New User Onboarding**
- [ ] Open app in browser
- [ ] See marketing landing page
- [ ] Click "Get Started" button
- [ ] See splash screen with logo animation
- [ ] View 4 onboarding slides
- [ ] Complete onboarding (swipe/next button)
- [ ] Reach login screen
- [ ] Enter phone number
- [ ] Click "Login with OTP"
- [ ] See success message
- [ ] Enter store setup details
  - [ ] Store name
  - [ ] Owner name
  - [ ] Address
  - [ ] Phone number
- [ ] Submit store setup
- [ ] Reach dashboard

**Expected Result:** ✅ User completes onboarding and reaches dashboard

---

#### **Flow 2: Voice Billing (NEW FEATURE)**
- [ ] From dashboard, click "New Bill"
- [ ] See "Voice Billing" section at top
- [ ] Verify BETA badge displayed
- [ ] Verify "Hinglish" badge displayed
- [ ] Click microphone button
- [ ] See "Bandhu sun raha hai..." overlay
- [ ] Speak: "teen maggie aur do pepsi"
- [ ] Wait 2 seconds (mock processing)
- [ ] Verify items added to bill:
  - [ ] 3x Maggie
  - [ ] 2x Pepsi
- [ ] Verify quantities correct
- [ ] Verify prices calculated
- [ ] Verify total updated

**Expected Result:** ✅ Voice recognition adds items correctly

---

#### **Flow 3: Quick Search & Add Product**
- [ ] In billing screen, find "Quick Search Product" below Voice Billing
- [ ] Type "mag" in search box
- [ ] See dropdown with "Maggie" result
- [ ] Click on "Maggie" in dropdown
- [ ] Verify product added to bill
- [ ] Try search for "pepsi"
- [ ] Click "Pepsi" result
- [ ] Verify second item added
- [ ] Check total updates correctly

**Expected Result:** ✅ Search finds products and adds them instantly

---

#### **Flow 4: Fast-Moving Items Quick Add**
- [ ] Scroll to "Fast-Moving Items" section
- [ ] See top 6 products displayed
- [ ] Click "+" button on "Parle-G"
- [ ] Verify item added to bill
- [ ] Click "+" again on same product
- [ ] Verify quantity increased to 2
- [ ] Check total calculation correct

**Expected Result:** ✅ Quick add works perfectly

---

#### **Flow 5: Customer Selection & Loyalty**
- [ ] In billing screen, find "Customer Info" section
- [ ] Click "Select Customer" dropdown
- [ ] Choose "Rahul Verma"
- [ ] Verify mobile auto-filled: 9876543210
- [ ] Verify loyalty points shown: "150 points"
- [ ] Verify loyalty tier badge: "Silver"
- [ ] Add items worth ₹500
- [ ] Complete bill
- [ ] Verify "15 points earned!" message
- [ ] Check customer points updated to 165

**Expected Result:** ✅ Loyalty system works correctly

---

#### **Flow 6: Payment Methods**
- [ ] Add items to bill (total ≥ ₹100)
- [ ] Scroll to "Payment Method" section
- [ ] Click each payment option:
  - [ ] Cash - verify selected with green check
  - [ ] UPI - verify UPI icon shown
  - [ ] Card - verify card icon shown
  - [ ] Khata - verify khata message
- [ ] Select "Khata (Credit)"
- [ ] See warning: "Amount will be added to customer's khata"
- [ ] Complete bill
- [ ] Verify khata entry created

**Expected Result:** ✅ All payment methods work

---

#### **Flow 7: Bill Preview & Sharing**
- [ ] Complete a bill
- [ ] See "Bill Preview" screen
- [ ] Verify bill details:
  - [ ] Store name & logo
  - [ ] Bill number format: RB-YYYYMMDD-XXX
  - [ ] Date and time
  - [ ] Customer name & phone
  - [ ] All items with quantities and prices
  - [ ] Subtotal calculation
  - [ ] Tax (if GST enabled)
  - [ ] Discount (if applied)
  - [ ] Total in bold
  - [ ] Payment method
  - [ ] "Thank you" message in Hinglish
- [ ] Click "Share Bill" button
- [ ] Choose WhatsApp
- [ ] Verify WhatsApp opens with formatted bill text
- [ ] Click "Download PDF" button
- [ ] Verify PDF downloads
- [ ] Click "Print" button
- [ ] See print preview

**Expected Result:** ✅ Bill preview and sharing work perfectly

---

#### **Flow 8: Inventory Management**
- [ ] From dashboard, click "Inventory"
- [ ] See all products listed
- [ ] Click "Low Stock Alert" banner (if shown)
- [ ] Verify low stock products highlighted
- [ ] Click "+" button (top right)
- [ ] Enter new product details:
  - Name: "Britannia Marie"
  - Price: 25
  - Stock: 40
- [ ] Click "Add Product"
- [ ] Verify product appears in list
- [ ] Click edit icon on "Britannia Marie"
- [ ] Change price to 28
- [ ] Click "Save Changes"
- [ ] Verify price updated
- [ ] Click delete icon
- [ ] Confirm deletion
- [ ] Verify product removed

**Expected Result:** ✅ CRUD operations work correctly

---

#### **Flow 9: Voice Add Product in Inventory**
- [ ] In inventory screen, find "Voice se Product Add" card
- [ ] Click microphone button
- [ ] See listening overlay
- [ ] Wait 2 seconds
- [ ] Verify "Cadbury Dairy Milk" added automatically
- [ ] Check default values:
  - Price: ₹45
  - Stock: 30

**Expected Result:** ✅ Voice add simulates correctly

---

#### **Flow 10: Inventory Filters & Export**
- [ ] Click "Filter" button
- [ ] See filter options expand
- [ ] Click "Low Stock (< 20)"
- [ ] Verify only low stock items shown
- [ ] Click "All" to reset
- [ ] Change sort dropdown to "Price"
- [ ] Verify products sorted by price (high to low)
- [ ] Click "Export" button
- [ ] Verify CSV file downloads
- [ ] Open CSV file
- [ ] Check columns: Product Name, Price, Stock
- [ ] Verify all products included

**Expected Result:** ✅ Filters and export work

---

#### **Flow 11: Catalog Creator**
- [ ] From dashboard, click "Catalog"
- [ ] See all products in grid view
- [ ] Click "List" icon to switch to list view
- [ ] Verify layout changes
- [ ] Click "Preview Catalog" button
- [ ] See full catalog with store branding
- [ ] Scroll through catalog
- [ ] Click "Share on WhatsApp"
- [ ] Choose customer
- [ ] Verify WhatsApp opens with catalog
- [ ] Back to catalog screen
- [ ] Click "Download as PDF"
- [ ] Verify PDF downloads with all products
- [ ] Open PDF
- [ ] Check formatting and images

**Expected Result:** ✅ Catalog creation and sharing work

---

#### **Flow 12: Categories in Catalog**
- [ ] In catalog screen, click "Filter by Category"
- [ ] See dropdown with categories:
  - All
  - Groceries
  - Beverages
  - Snacks
  - Personal Care
- [ ] Select "Snacks"
- [ ] Verify only snacks shown (Parle-G, Lays)
- [ ] Select "Beverages"
- [ ] Verify only beverages shown (Pepsi)
- [ ] Select "All" to reset

**Expected Result:** ✅ Category filtering works

---

#### **Flow 13: Reports & Analytics**
- [ ] From dashboard, click "Reports"
- [ ] See today's overview:
  - [ ] Total Sales (₹)
  - [ ] Bills Count
  - [ ] Average Bill Value
- [ ] Click period dropdown
- [ ] Select "Week"
- [ ] Verify data updates
- [ ] See sales chart with 7 days
- [ ] Hover over chart bars
- [ ] Verify tooltip shows exact values
- [ ] Scroll to "Top Products" table
- [ ] Verify columns: Product, Quantity, Revenue, Profit
- [ ] Check "Category Wise Sales" pie chart
- [ ] Click on chart segment
- [ ] See category highlighted
- [ ] Scroll to "Payment Methods" chart
- [ ] Verify distribution shown
- [ ] Click "Download Report" button
- [ ] Choose CSV format
- [ ] Verify file downloads
- [ ] Click "Compare with Last Week"
- [ ] See comparison data with arrows (↑/↓)

**Expected Result:** ✅ All charts and reports display correctly

---

#### **Flow 14: Khata (Credit) Management**
- [ ] From dashboard, click "Khata"
- [ ] See list of customers with credit
- [ ] Verify each customer shows:
  - [ ] Name
  - [ ] Phone number
  - [ ] Total credit amount
  - [ ] Last transaction date
  - [ ] Days since last transaction
- [ ] Click on "Rahul Verma"
- [ ] See transaction history
- [ ] Verify credit and payment entries
- [ ] Click "Collect Payment" button
- [ ] Enter amount: 500
- [ ] Add payment notes
- [ ] Click "Record Payment"
- [ ] Verify credit balance reduced
- [ ] Verify new entry in history
- [ ] Click "Send WhatsApp Reminder"
- [ ] Verify WhatsApp opens with reminder message
- [ ] Back to khata list
- [ ] Click "Bulk Reminders" button
- [ ] Select customers to remind
- [ ] Click "Send Reminders"
- [ ] See success toast

**Expected Result:** ✅ Khata management fully functional

---

#### **Flow 15: Expense Tracker**
- [ ] From settings, click "Expense Tracker"
- [ ] Click "+ Add Expense" button
- [ ] Enter expense details:
  - Category: "Rent"
  - Amount: 10000
  - Description: "Shop rent for December"
  - Payment Method: "Bank Transfer"
- [ ] Click "Add Expense"
- [ ] Verify expense appears in list
- [ ] Check monthly summary updates
- [ ] Click on expense to view details
- [ ] Click edit icon
- [ ] Change amount to 12000
- [ ] Save changes
- [ ] Verify updated
- [ ] Click "Recurring Expense" toggle
- [ ] Set frequency to "Monthly"
- [ ] Save
- [ ] Verify recurring badge shown
- [ ] Click "Export Expenses"
- [ ] Verify CSV downloads

**Expected Result:** ✅ Expense tracking works

---

#### **Flow 16: WhatsApp Automation**
- [ ] From dashboard, click "WhatsApp"
- [ ] See automation options:
  - [ ] Share Bills
  - [ ] Send Catalogs
  - [ ] Payment Reminders
  - [ ] Low Stock Alerts
- [ ] Toggle "Auto-send bills via WhatsApp"
- [ ] See confirmation
- [ ] Toggle "Daily sales summary"
- [ ] Set time: 8:00 PM
- [ ] Save settings
- [ ] Click "Test WhatsApp Message"
- [ ] Enter phone number
- [ ] Click "Send Test"
- [ ] Verify WhatsApp opens
- [ ] Check message format

**Expected Result:** ✅ WhatsApp automation configured

---

#### **Flow 17: Custom Bill Template**
- [ ] From settings, click "Customize Bills"
- [ ] See template preview
- [ ] Upload store logo
- [ ] Verify logo shows in preview
- [ ] Change bill color from blue to orange
- [ ] Verify preview updates
- [ ] Toggle "Show GST Details"
- [ ] See CGST and SGST fields appear
- [ ] Toggle "Terms & Conditions"
- [ ] Add custom terms text
- [ ] Toggle "Show Loyalty Points"
- [ ] Save template
- [ ] Create a test bill
- [ ] Verify new template applied

**Expected Result:** ✅ Bill customization works

---

#### **Flow 18: Settings - All Options**
- [ ] From dashboard, click "Settings"
- [ ] See all settings categories:
  - [ ] Store Details
  - [ ] Notifications
  - [ ] Bill Customization
  - [ ] Printer Setup
  - [ ] Payment Methods
  - [ ] Language
  - [ ] Backup & Restore
  - [ ] GST Settings
  - [ ] Loyalty Program
- [ ] Click each category
- [ ] Verify options load
- [ ] Make sample changes
- [ ] Save each setting
- [ ] Verify changes persist after refresh

**Expected Result:** ✅ All settings accessible and functional

---

#### **Flow 19: Data Backup & Restore**
- [ ] From settings, click "Data Backup"
- [ ] See backup options:
  - [ ] Products (JSON/CSV)
  - [ ] Bills (JSON/CSV)
  - [ ] Customers (JSON/CSV)
  - [ ] All Data (JSON)
- [ ] Click "Backup Products (CSV)"
- [ ] Verify CSV downloads
- [ ] Click "Backup All Data (JSON)"
- [ ] Verify JSON file downloads
- [ ] Open JSON file
- [ ] Verify structure includes:
  - products[]
  - bills[]
  - customers[]
  - khata[]
  - expenses[]
- [ ] Click "Restore from Backup"
- [ ] Upload the JSON file
- [ ] Click "Restore"
- [ ] Verify data restored
- [ ] Check products match

**Expected Result:** ✅ Backup and restore work perfectly

---

#### **Flow 20: Admin Panel Access**
- [ ] Press Ctrl+Shift+A (Cmd+Shift+A on Mac)
- [ ] Verify admin panel opens
- [ ] See admin dashboard with 12 tabs
- [ ] Click each tab:
  1. [ ] Dashboard - metrics and graphs
  2. [ ] Users - user list and monitoring
  3. [ ] Content - CMS for landing page
  4. [ ] Analytics - advanced analytics
  5. [ ] Subscriptions - plan management
  6. [ ] Transactions - payment history
  7. [ ] Support - ticket system
  8. [ ] API Keys - integration management
  9. [ ] Security - security settings
  10. [ ] Bulk Ops - bulk operations
  11. [ ] Announcements - broadcast messages
  12. [ ] Settings - system configuration
- [ ] Verify all features load
- [ ] Click "Back to App"
- [ ] Return to marketing page

**Expected Result:** ✅ Admin panel fully functional with 240+ features

---

### **2. NEGATIVE TESTING**

#### **Invalid Inputs**
- [ ] Try creating bill with no items → Show error
- [ ] Try adding product with empty name → Show error
- [ ] Try adding product with price = 0 → Show error
- [ ] Try adding product with negative stock → Show error
- [ ] Enter invalid phone number format → Show error
- [ ] Enter GST number with wrong format → Show error
- [ ] Try recording payment > credit balance → Show error

**Expected Result:** ✅ All validations work

---

#### **Edge Cases**
- [ ] Add 100 products to inventory → Performance OK?
- [ ] Create bill with 50 items → Scrolling works?
- [ ] Search for non-existent product → "No results" message
- [ ] Generate report with no data → Empty state message
- [ ] Export empty inventory → Empty CSV created
- [ ] Upload corrupted backup file → Error handled gracefully

**Expected Result:** ✅ Edge cases handled properly

---

### **3. UI/UX TESTING**

#### **Visual Consistency**
- [ ] All buttons use brand colors (blue/orange gradient)
- [ ] All cards have rounded corners (border-radius)
- [ ] All shadows are consistent and soft
- [ ] Font sizes appropriate (min 16px for body text)
- [ ] Hindi text uses Noto Sans Devanagari
- [ ] English text uses Inter font
- [ ] Icons from Lucide React library
- [ ] Mascot "Bandhu" appears consistently
- [ ] Hinglish microcopy throughout

**Expected Result:** ✅ Consistent design system

---

#### **Responsive Design**
- [ ] Test on mobile (320px width) → All content fits
- [ ] Test on tablet (768px width) → Layout adjusts
- [ ] Test on desktop (1920px width) → Content centered
- [ ] Rotate phone → Landscape works
- [ ] Bottom navigation visible on mobile
- [ ] Top navigation on desktop
- [ ] Modals stack properly on mobile
- [ ] Forms are single-column on mobile

**Expected Result:** ✅ Fully responsive

---

#### **Accessibility**
- [ ] Tab through interface → Focus visible
- [ ] Screen reader test → Content readable
- [ ] Keyboard shortcuts work (Ctrl+K for search)
- [ ] Color contrast meets WCAG AA standards
- [ ] Form labels properly associated
- [ ] Error messages announced
- [ ] Button labels descriptive
- [ ] Images have alt text

**Expected Result:** ✅ Accessible to all users

---

### **4. PERFORMANCE TESTING**

#### **Page Load Times**
- [ ] Marketing page: < 2 seconds
- [ ] Dashboard: < 1.5 seconds
- [ ] Billing screen: < 1 second
- [ ] Reports with charts: < 2 seconds
- [ ] Admin panel: < 2.5 seconds

**Expected Result:** ✅ Fast load times

---

#### **Large Data Sets**
- [ ] Load 1000 products → Search still fast?
- [ ] Load 500 bills → Reports render quickly?
- [ ] Load 200 customers → Khata list performs well?
- [ ] 100 simultaneous animations → No lag?

**Expected Result:** ✅ Handles large datasets

---

### **5. CROSS-BROWSER TESTING**

| Browser | Version | Desktop | Mobile | Status |
|---------|---------|---------|--------|--------|
| Chrome | 120+ | ✅ | ✅ | |
| Firefox | 121+ | ✅ | ✅ | |
| Safari | 17+ | ✅ | ✅ | |
| Edge | 120+ | ✅ | N/A | |
| Samsung Internet | Latest | N/A | ✅ | |
| Opera | Latest | ✅ | ✅ | |

**Expected Result:** ✅ Works on all modern browsers

---

### **6. MOBILE-SPECIFIC TESTING**

#### **Touch Interactions**
- [ ] Swipe onboarding slides → Works smoothly
- [ ] Pull to refresh → Refreshes data
- [ ] Long press on product → Context menu
- [ ] Pinch to zoom on images → Zooms
- [ ] Scroll momentum → Natural feel
- [ ] Tap targets ≥ 44x44px → Easy to tap

**Expected Result:** ✅ Great mobile UX

---

#### **Native Features**
- [ ] PWA install prompt appears
- [ ] Add to home screen works
- [ ] App launches from home screen
- [ ] Splash screen shows
- [ ] Works offline (cached pages)
- [ ] Share API works (share bills)
- [ ] Camera access (barcode scanner)
- [ ] Microphone access (voice billing)

**Expected Result:** ✅ PWA features work

---

### **7. SECURITY TESTING**

#### **Data Protection**
- [ ] LocalStorage data not directly accessible
- [ ] No sensitive data in plain text
- [ ] No API keys in frontend code
- [ ] No console.log with sensitive info
- [ ] XSS protection via React escaping
- [ ] CSRF protection (if using backend)

**Expected Result:** ✅ Secure implementation

---

#### **Authentication**
- [ ] Can't access dashboard without login
- [ ] Session persists on refresh
- [ ] Logout clears session
- [ ] No unauthorized access to admin panel

**Expected Result:** ✅ Proper auth flow

---

### **8. INTEGRATION TESTING**

#### **Third-Party Services**
- [ ] Unsplash images load correctly
- [ ] Fallback images work if Unsplash fails
- [ ] Toast notifications (Sonner) display
- [ ] Charts (Recharts) render properly
- [ ] Icons (Lucide) load

**Expected Result:** ✅ All integrations work

---

## 🤖 AUTOMATED TESTING SETUP

### **Unit Tests with Vitest**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

Example test file `/tests/components/Dashboard.test.tsx`:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../components/Dashboard';

describe('Dashboard', () => {
  it('renders dashboard title', () => {
    render(<Dashboard onNavigate={() => {}} storeInfo={{
      name: 'Test Store',
      owner: 'Test Owner',
      address: 'Test Address',
      phone: '1234567890',
      billColor: '#1E88E5'
    }} />);
    
    expect(screen.getByText('Test Store')).toBeInTheDocument();
  });

  it('shows low stock alert when products are low', () => {
    render(<Dashboard 
      onNavigate={() => {}} 
      storeInfo={{...}}
      products={[
        { id: '1', name: 'Test', price: 10, stock: 5, category: 'Test' }
      ]}
    />);
    
    expect(screen.getByText(/Low Stock/i)).toBeInTheDocument();
  });
});
```

---

### **E2E Tests with Playwright**

```bash
npm install -D @playwright/test
```

Example test `/e2e/billing-flow.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

test('complete billing flow', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Skip onboarding
  await page.click('text=Skip');
  
  // Login
  await page.fill('input[type="tel"]', '9876543210');
  await page.click('text=Login');
  
  // Navigate to billing
  await page.click('text=New Bill');
  
  // Add product
  await page.fill('input[placeholder*="search"]', 'Maggie');
  await page.click('text=Maggie');
  
  // Verify added
  await expect(page.locator('text=Maggie')).toBeVisible();
  
  // Complete bill
  await page.click('text=Complete Bill');
  
  // Verify bill preview
  await expect(page.locator('text=Bill Preview')).toBeVisible();
});
```

---

## 📊 TEST COVERAGE GOALS

| Component Type | Target Coverage |
|----------------|-----------------|
| Utilities | 90%+ |
| UI Components | 80%+ |
| Pages/Screens | 70%+ |
| Integration | 60%+ |

---

## 🐛 BUG REPORTING TEMPLATE

```markdown
## Bug Report

**Title:** [Brief description]

**Severity:** Critical / High / Medium / Low

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- Device: Desktop
- Screen Size: 1920x1080

**Steps to Reproduce:**
1. Go to billing screen
2. Click voice button
3. Speak "maggie"
4. Observe error

**Expected Behavior:**
Product should be added to bill

**Actual Behavior:**
Error message appears

**Screenshots:**
[Attach screenshots]

**Console Errors:**
```
Error: ...
```

**Additional Context:**
Happens only on mobile devices
```

---

## ✅ TEST SIGN-OFF

### **Release Checklist**

Before marking release as "ready":

- [ ] All manual tests passed
- [ ] All automated tests passing
- [ ] No critical bugs
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] Accessibility audit passed
- [ ] Cross-browser tested
- [ ] Mobile tested on real devices
- [ ] UAT completed with stakeholders
- [ ] Documentation updated

**Tested by:** _____________  
**Date:** _____________  
**Approved by:** _____________  

---

**Your Retail Bandhu Lite is thoroughly tested!** ✅

Use this guide for every release to ensure quality.

---

**Document Version:** 1.0  
**Last Updated:** December 11, 2024  
**Next Review:** After major feature additions
