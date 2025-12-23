# ✅ **RETAIL BANDHU - MANUAL TESTING CHECKLIST**

**Print this page and check off each item as you test!**

---

## 🚀 **SETUP**

**Before you start:**
```
[ ] App is running (npm run dev OR production URL)
[ ] Browser console open (F12)
[ ] Notepad ready for notes
[ ] Mobile device ready (optional)
[ ] Quiet room (for voice testing)
```

---

## ⚡ **5-MINUTE SMOKE TEST** (Must Pass All)

**If ANY of these fail, STOP and fix immediately!**

```
[ ] 1. App loads without errors
[ ] 2. No console errors visible
[ ] 3. Can see landing page
[ ] 4. "Sign Up" button works
[ ] 5. Can create account
[ ] 6. Can login
[ ] 7. Dashboard appears
[ ] 8. Can navigate to Billing
[ ] 9. Can add an item
[ ] 10. Can save bill
```

**Result**: [ ] PASS [ ] FAIL

**If PASS → Continue testing**  
**If FAIL → Fix issues first!**

---

## 🔐 **AUTHENTICATION TESTING** (15 mins)

### **Signup Flow:**
```
[ ] Click "Sign Up" button
[ ] Enter name, mobile, password
[ ] Click "Create Account"
[ ] Account created successfully
[ ] Success toast appears
[ ] Redirected to onboarding/dashboard
```

### **Login Flow:**
```
[ ] Logout first
[ ] Click "Login"
[ ] Enter valid credentials
[ ] Click "Login"
[ ] Successfully logged in
[ ] Redirected to dashboard
```

### **Error Handling:**
```
[ ] Try login with wrong password → Shows error
[ ] Try signup with existing mobile → Shows error
[ ] Try empty fields → Shows validation error
```

**Result**: [ ] PASS [ ] FAIL  
**Notes**: _________________________________

---

## 🎤 **VOICE BILLING TESTING** (20 mins)

### **Setup:**
```
[ ] Navigate to Billing screen
[ ] Microphone button is visible
[ ] Button is large and prominent
```

### **Voice Recognition:**
```
[ ] Click microphone button
[ ] Browser asks for mic permission → Allow
[ ] "Listening..." indicator appears
[ ] Say: "Maggi 2 quantity 12 rupees"
[ ] Item appears in bill
[ ] Quantity shows 2
[ ] Price shows ₹12
```

### **Hindi Voice:**
```
[ ] Click mic button
[ ] Say: "दूध 1 लीटर 50 रुपये"
[ ] Item added with Hindi name
[ ] Quantity correct (1)
[ ] Price correct (₹50)
```

### **Hinglish Voice:**
```
[ ] Click mic button
[ ] Say: "Milk 2 litre 50 rupaye"
[ ] Item added correctly
[ ] Mixed language recognized
```

### **Voice Confirmation (TTS):**
```
[ ] Add item via voice
[ ] Listen for audio confirmation
[ ] Hears: "Added [item], [qty], ₹[price]"
[ ] Voice clear and understandable
```

### **Multiple Items:**
```
[ ] Add 3 different items via voice
[ ] All 3 items appear
[ ] Quantities correct
[ ] Prices correct
[ ] Total calculates correctly
```

**Voice Result**: [ ] PASS [ ] FAIL  
**Recognition Accuracy**: ____%  
**Notes**: _________________________________

---

## 💰 **MANUAL BILLING TESTING** (15 mins)

### **Add Items:**
```
[ ] Click "Add Item" button
[ ] Enter product name
[ ] Enter quantity
[ ] Enter price
[ ] Click "Add"
[ ] Item appears in bill
```

### **Edit & Delete:**
```
[ ] Click + button → Quantity increases
[ ] Click - button → Quantity decreases
[ ] Click delete icon → Item removed
```

### **Discounts:**
```
[ ] Add 3 items
[ ] Enter 10% discount
[ ] Total reduces by 10%
[ ] Enter ₹50 discount
[ ] Total reduces by ₹50
```

### **Customer Selection:**
```
[ ] Click "Select Customer"
[ ] Choose customer from list
[ ] Customer name shows on bill
```

### **Save Bill:**
```
[ ] Click "Save Bill"
[ ] Success toast appears
[ ] Bill saved in system
[ ] Bill ID generated
```

**Billing Result**: [ ] PASS [ ] FAIL  
**Notes**: _________________________________

---

## 📦 **INVENTORY TESTING** (15 mins)

### **Add Product:**
```
[ ] Navigate to Inventory
[ ] Click "Add Product"
[ ] Enter name, price, stock
[ ] Click "Save"
[ ] Product appears in list
```

### **Edit Product:**
```
[ ] Click edit icon
[ ] Change price
[ ] Click "Save"
[ ] Price updated
```

### **Delete Product:**
```
[ ] Click delete icon
[ ] Confirm deletion
[ ] Product removed from list
```

### **Search:**
```
[ ] Type product name in search
[ ] Results filter correctly
[ ] Clears search → All products show
```

### **Low Stock Alert:**
```
[ ] Create product with stock = 2
[ ] Set threshold to 5
[ ] Low stock badge appears
```

**Inventory Result**: [ ] PASS [ ] FAIL  
**Notes**: _________________________________

---

## 👥 **CUSTOMER MANAGEMENT** (10 mins)

### **Add Customer:**
```
[ ] Navigate to Customers
[ ] Click "Add Customer"
[ ] Enter name, mobile, address
[ ] Click "Save"
[ ] Customer added to list
```

### **Edit Customer:**
```
[ ] Click edit icon
[ ] Change mobile number
[ ] Click "Save"
[ ] Customer updated
```

### **View Details:**
```
[ ] Click customer name
[ ] Profile details show
[ ] Purchase history visible
[ ] Credit balance shown (if any)
```

**Customer Result**: [ ] PASS [ ] FAIL  
**Notes**: _________________________________

---

## 📊 **DASHBOARD & REPORTS** (15 mins)

### **Dashboard Widgets:**
```
[ ] View dashboard
[ ] "Today's Sales" shows amount
[ ] "Bills Count" shows number
[ ] "Top Products" widget visible
[ ] "Low Stock" alerts visible
[ ] Charts render correctly
```

### **Reports:**
```
[ ] Navigate to Reports
[ ] Select "Daily Sales"
[ ] Report displays data
[ ] Select "Weekly Sales"
[ ] Data updates
```

### **Export:**
```
[ ] Click "Export CSV"
[ ] File downloads
[ ] Open CSV → Data correct
[ ] Click "Export PDF"
[ ] PDF downloads
```

**Dashboard Result**: [ ] PASS [ ] FAIL  
**Notes**: _________________________________

---

## ⚙️ **SETTINGS TESTING** (10 mins)

### **Store Settings:**
```
[ ] Navigate to Settings
[ ] Edit store name
[ ] Click "Save"
[ ] Name updates everywhere
```

### **GST Settings:**
```
[ ] Toggle "Enable GST"
[ ] Set GST rate (18%)
[ ] Save settings
[ ] GST fields appear on billing
```

### **Voice Settings:**
```
[ ] Toggle "Voice Billing"
[ ] Select language (Hindi)
[ ] Toggle "Voice Confirmation"
[ ] Settings save correctly
```

**Settings Result**: [ ] PASS [ ] FAIL  
**Notes**: _________________________________

---

## 🎯 **ADMIN PANEL TESTING** (20 mins)

### **Access:**
```
[ ] Navigate to /admin
[ ] Admin login screen appears
[ ] Enter admin credentials
[ ] Successfully logged in
```

### **Content CMS:**
```
[ ] Click "Content CMS" tab
[ ] Click "Create Blog Post"
[ ] Modal opens
[ ] Fill form (title, content)
[ ] Click "Save"
[ ] Blog post created
[ ] Appears in list
```

### **Video Tutorials:**
```
[ ] Click "Upload Video"
[ ] Enter video URL and details
[ ] Click "Save"
[ ] Video added to list
```

### **WhatsApp Templates:**
```
[ ] Click "Templates" tab
[ ] Click "New Template"
[ ] Enter message with {{variables}}
[ ] Variables auto-detected
[ ] Click "Save"
[ ] Template created
```

### **Subscriptions:**
```
[ ] Click "Subscriptions" tab
[ ] View subscription list
[ ] Search by mobile
[ ] Results filter correctly
```

### **Export Data:**
```
[ ] Click "Export CSV" (any tab)
[ ] CSV file downloads
[ ] Open file → Data present
```

**Admin Result**: [ ] PASS [ ] FAIL  
**Notes**: _________________________________

---

## 💬 **WHATSAPP AUTOMATION** (10 mins)

### **Create Template:**
```
[ ] Navigate to WhatsApp
[ ] Click "New Template"
[ ] Enter message: "Hi {{name}}, your bill is ₹{{amount}}"
[ ] Variables detected: {{name}}, {{amount}}
[ ] Save template
```

### **Create Automation:**
```
[ ] Click "New Automation"
[ ] Set trigger: "Bill Created"
[ ] Select template
[ ] Save automation
```

### **Test (if possible):**
```
[ ] Create a bill
[ ] Check if WhatsApp message sent
```

**WhatsApp Result**: [ ] PASS [ ] FAIL  
**Notes**: _________________________________

---

## 📱 **MOBILE TESTING** (15 mins)

**Open app on mobile device:**

```
[ ] App loads on mobile
[ ] Layout is responsive
[ ] All text readable
[ ] Buttons touch-friendly
[ ] Navigation menu works
[ ] Can create bill
[ ] Voice button accessible
[ ] No horizontal scroll
[ ] Forms fill easily
[ ] Keyboard doesn't break layout
```

**Mobile Result**: [ ] PASS [ ] FAIL  
**Notes**: _________________________________

---

## 🔌 **OFFLINE MODE TESTING** (10 mins)

```
[ ] App is running
[ ] Turn off WiFi/mobile data
[ ] "Offline" indicator appears
[ ] Navigate between screens → Works
[ ] Add product → Saved locally
[ ] Create bill → Saved locally
[ ] Turn WiFi back on
[ ] Data syncs to server
[ ] No data loss
```

**Offline Result**: [ ] PASS [ ] FAIL  
**Notes**: _________________________________

---

## 📲 **PWA INSTALLATION** (5 mins)

### **On Mobile:**
```
[ ] Open app in browser
[ ] Wait 30 seconds
[ ] "Add to Home Screen" prompt appears
[ ] Click "Install"
[ ] App installs
[ ] Icon appears on home screen
[ ] Open from home screen
[ ] Opens in standalone mode (no browser UI)
```

### **On Desktop:**
```
[ ] Open app in Chrome
[ ] Look for install icon in address bar
[ ] Click install
[ ] App installs
[ ] Opens in app window
```

**PWA Result**: [ ] PASS [ ] FAIL  
**Notes**: _________________________________

---

## 🎨 **VISUAL & UI TESTING** (10 mins)

```
[ ] Logo loads correctly
[ ] Colors match brand (blue #1E88E5, orange #FF6F00)
[ ] No broken images
[ ] Icons render properly
[ ] Charts display correctly
[ ] No overlapping text
[ ] Buttons have proper spacing
[ ] Forms are aligned
[ ] Modals center correctly
[ ] Toasts appear in correct position
```

**Visual Result**: [ ] PASS [ ] FAIL  
**Notes**: _________________________________

---

## 🐛 **ERROR TESTING** (10 mins)

**Intentionally cause errors:**

```
[ ] Try invalid login → Shows error message
[ ] Try duplicate entry → Shows warning
[ ] Leave form empty → Validation works
[ ] Enter invalid mobile → Format check works
[ ] Try weak password → Shows requirements
[ ] Network error → Graceful handling
[ ] Check console → No critical errors
```

**Error Handling Result**: [ ] PASS [ ] FAIL  
**Notes**: _________________________________

---

## 🌐 **CROSS-BROWSER TESTING** (15 mins)

### **Chrome:**
```
[ ] App loads
[ ] Voice works
[ ] All features functional
```

### **Safari (Mac/iPhone):**
```
[ ] App loads
[ ] Voice works
[ ] All features functional
```

### **Firefox:**
```
[ ] App loads
[ ] Voice works
[ ] All features functional
```

**Browser Result**:  
- Chrome: [ ] PASS [ ] FAIL  
- Safari: [ ] PASS [ ] FAIL  
- Firefox: [ ] PASS [ ] FAIL

**Notes**: _________________________________

---

## 📊 **FINAL RESULTS**

### **Test Summary:**

```
Authentication:         [ ] PASS [ ] FAIL
Voice Billing:          [ ] PASS [ ] FAIL
Manual Billing:         [ ] PASS [ ] FAIL
Inventory:              [ ] PASS [ ] FAIL
Customers:              [ ] PASS [ ] FAIL
Dashboard/Reports:      [ ] PASS [ ] FAIL
Settings:               [ ] PASS [ ] FAIL
Admin Panel:            [ ] PASS [ ] FAIL
WhatsApp:               [ ] PASS [ ] FAIL
Mobile:                 [ ] PASS [ ] FAIL
Offline Mode:           [ ] PASS [ ] FAIL
PWA:                    [ ] PASS [ ] FAIL
Visual/UI:              [ ] PASS [ ] FAIL
Error Handling:         [ ] PASS [ ] FAIL
Cross-Browser:          [ ] PASS [ ] FAIL
```

### **Overall Results:**

**Total Tests**: _____ / 15  
**Pass Rate**: _____%

**Critical Bugs Found**: _____  
**Minor Bugs Found**: _____

---

## 🎯 **DEPLOYMENT DECISION**

```
✅ CAN DEPLOY if:
   [ ] 5-minute smoke test PASSED
   [ ] Voice system works (80%+ accuracy)
   [ ] All P0 tests PASSED
   [ ] 95%+ other tests PASSED
   [ ] Zero critical bugs
   [ ] Mobile responsive
   [ ] Offline mode works

⚠️ MAYBE DEPLOY if:
   [ ] 1-2 minor issues found
   [ ] Workarounds documented
   [ ] Fix plan in place

❌ DON'T DEPLOY if:
   [ ] 5-minute smoke test FAILED
   [ ] Voice system broken
   [ ] Critical bugs found
   [ ] Data loss possible
   [ ] App crashes
```

**Final Decision**: [ ] DEPLOY [ ] DON'T DEPLOY [ ] NEEDS FIXES

---

## 📝 **BUGS FOUND**

**List any bugs discovered:**

```
BUG #1:
Priority: [ ] P0 [ ] P1 [ ] P2
Description: _________________________________
Steps to reproduce: _________________________________
___________________________________________________

BUG #2:
Priority: [ ] P0 [ ] P1 [ ] P2
Description: _________________________________
Steps to reproduce: _________________________________
___________________________________________________

BUG #3:
Priority: [ ] P0 [ ] P1 [ ] P2
Description: _________________________________
Steps to reproduce: _________________________________
___________________________________________________
```

---

## ✅ **SIGN-OFF**

**Tested by**: ____________________  
**Date**: ____________________  
**Time spent**: ______ hours  
**Overall result**: [ ] PASS [ ] FAIL  

**Ready for production**: [ ] YES [ ] NO

**Signature**: ____________________

---

**Created by**: Mr. CTO  
**Date**: December 21, 2024  
**Purpose**: Manual testing checklist

**Print this page and check off items as you test! Good luck!** 🚀
