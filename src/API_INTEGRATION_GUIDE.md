# 🔌 API Integration Guide - Retail Bandhu Lite
## Backend Integration & API Documentation

---

## 📋 OVERVIEW

This guide covers how to integrate backend APIs with Retail Bandhu Lite, including:
- Supabase setup (recommended)
- Custom REST API integration
- WhatsApp Business API
- Payment Gateway integration
- Voice recognition API
- SMS Gateway integration

---

## 🎯 CURRENT STATE: FRONTEND-ONLY

**Current Implementation:**
- ✅ All data stored in `localStorage`
- ✅ Fully functional without backend
- ✅ No server required
- ✅ Works offline

**Ready for Backend:**
- ✅ Storage abstraction layer (`/utils/storage.ts`)
- ✅ API utility functions ready
- ✅ Error handling in place
- ✅ Loading states implemented

---

## 🗄️ SUPABASE INTEGRATION (Recommended)

### **Why Supabase?**
- ✅ PostgreSQL database
- ✅ Built-in authentication
- ✅ Real-time subscriptions
- ✅ Row Level Security (RLS)
- ✅ Auto-generated REST API
- ✅ File storage
- ✅ Edge functions

### **Step 1: Supabase Setup**

1. **Create Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Copy Project URL and Anon Key

2. **Install Dependencies:**
```bash
npm install @supabase/supabase-js
```

3. **Create Supabase Client:**

Create `/utils/supabase/client.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### **Step 2: Database Schema**

Run these SQL commands in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(15) UNIQUE NOT NULL,
  name VARCHAR(255),
  store_name VARCHAR(255),
  store_address TEXT,
  gstin VARCHAR(15),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  category VARCHAR(100),
  hsn_code VARCHAR(10),
  gst_rate INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(15),
  email VARCHAR(255),
  address TEXT,
  loyalty_points INTEGER DEFAULT 0,
  lifetime_spend DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bills table
CREATE TABLE bills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  bill_number VARCHAR(50) UNIQUE NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bill items table
CREATE TABLE bill_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  gst_rate INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Khata entries table
CREATE TABLE khata_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'credit' or 'payment'
  description TEXT,
  bill_id UUID REFERENCES bills(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expenses table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  payment_method VARCHAR(20),
  party_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_bills_user_id ON bills(user_id);
CREATE INDEX idx_bills_created_at ON bills(created_at);
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_khata_user_id ON khata_entries(user_id);
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
```

### **Step 3: Row Level Security (RLS)**

Protect user data with RLS policies:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE khata_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Products policies
CREATE POLICY "Users can view own products" ON products
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own products" ON products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products" ON products
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own products" ON products
  FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for other tables
-- (Repeat pattern for customers, bills, khata_entries, expenses)
```

### **Step 4: Update Storage Utility**

Modify `/utils/storage.ts` to use Supabase:

```typescript
import { supabase } from './supabase/client';
import type { Product, Bill, Customer } from '../App';

// Feature flag to enable/disable backend
const USE_BACKEND = !!import.meta.env.VITE_SUPABASE_URL;

export const storage = {
  // Products
  async getProducts(): Promise<Product[]> {
    if (!USE_BACKEND) {
      return JSON.parse(localStorage.getItem('products') || '[]');
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    return data || [];
  },

  async setProducts(products: Product[]): Promise<void> {
    if (!USE_BACKEND) {
      localStorage.setItem('products', JSON.stringify(products));
      return;
    }
    
    // Batch upsert to Supabase
    const { error } = await supabase
      .from('products')
      .upsert(products);
    
    if (error) {
      console.error('Error saving products:', error);
      throw error;
    }
  },

  async addProduct(product: Product): Promise<void> {
    if (!USE_BACKEND) {
      const products = this.getProducts();
      products.push(product);
      this.setProducts(products);
      return;
    }
    
    const { error } = await supabase
      .from('products')
      .insert([product]);
    
    if (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    if (!USE_BACKEND) {
      const products = this.getProducts();
      const index = products.findIndex(p => p.id === id);
      if (index !== -1) {
        products[index] = { ...products[index], ...updates };
        this.setProducts(products);
      }
      return;
    }
    
    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<void> {
    if (!USE_BACKEND) {
      const products = this.getProducts();
      this.setProducts(products.filter(p => p.id !== id));
      return;
    }
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Repeat similar pattern for Bills, Customers, Khata, Expenses
};
```

### **Step 5: Authentication**

Implement phone authentication:

```typescript
// /utils/auth.ts
import { supabase } from './supabase/client';

export const auth = {
  async sendOTP(phone: string): Promise<boolean> {
    const { error } = await supabase.auth.signInWithOtp({
      phone: phone,
    });
    
    return !error;
  },

  async verifyOTP(phone: string, token: string): Promise<boolean> {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phone,
      token: token,
      type: 'sms',
    });
    
    if (error || !data.user) {
      return false;
    }
    
    // Create user record if first time
    const { error: userError } = await supabase
      .from('users')
      .upsert([{ 
        id: data.user.id, 
        phone: phone,
        created_at: new Date().toISOString()
      }]);
    
    return !userError;
  },

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  },

  async getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },
};
```

---

## 📱 WHATSAPP BUSINESS API

### **Official API (Recommended for Scale)**

1. **Setup:**
   - Apply for WhatsApp Business API
   - Get approved by Meta
   - Setup webhook endpoints

2. **Integration:**

```typescript
// /utils/whatsapp.ts
const WHATSAPP_API_URL = 'https://graph.facebook.com/v17.0';
const PHONE_NUMBER_ID = import.meta.env.VITE_WHATSAPP_PHONE_ID;
const ACCESS_TOKEN = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;

export async function sendWhatsAppMessage(
  to: string,
  message: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message },
        }),
      }
    );
    
    return response.ok;
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return false;
  }
}

export async function sendWhatsAppBill(
  to: string,
  billData: any
): Promise<boolean> {
  const message = `
📃 *Bill from ${billData.storeName}*

Bill No: ${billData.billNumber}
Date: ${billData.date}

${billData.items.map((item: any) => 
  `${item.quantity}x ${item.name} - ₹${item.total}`
).join('\n')}

Subtotal: ₹${billData.subtotal}
Tax: ₹${billData.tax}
Discount: ₹${billData.discount}
*Total: ₹${billData.total}*

Payment: ${billData.paymentMethod}

Thank you for shopping with us! 🙏
  `.trim();
  
  return sendWhatsAppMessage(to, message);
}

export async function sendWhatsAppCatalog(
  to: string,
  products: any[]
): Promise<boolean> {
  const catalog = `
🛍️ *Our Product Catalog*

${products.map((p: any) => 
  `${p.name} - ₹${p.price}\nStock: ${p.stock} units`
).join('\n\n')}

Order karne ke liye reply karein! 📱
  `.trim();
  
  return sendWhatsAppMessage(to, catalog);
}
```

### **Alternative: Twilio WhatsApp**

```typescript
// Using Twilio's WhatsApp API
import twilio from 'twilio';

const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function sendTwilioWhatsApp(
  to: string,
  body: string
): Promise<boolean> {
  try {
    await client.messages.create({
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${to}`,
      body: body,
    });
    return true;
  } catch (error) {
    console.error('Twilio error:', error);
    return false;
  }
}
```

---

## 🎙️ VOICE RECOGNITION API

### **Option 1: Web Speech API (Free, Browser-based)**

Already implemented in `/components/VoiceButton.tsx`:

```typescript
const recognition = new (window as any).webkitSpeechRecognition();
recognition.lang = 'hi-IN'; // Hindi
recognition.continuous = false;
recognition.interimResults = false;

recognition.onresult = (event: any) => {
  const transcript = event.results[0][0].transcript;
  onVoiceInput(transcript);
};

recognition.start();
```

### **Option 2: Google Cloud Speech-to-Text**

```typescript
// /utils/voice/google-speech.ts
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_SPEECH_API_KEY;

export async function transcribeAudio(
  audioBlob: Blob
): Promise<string> {
  const reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onloadend = async () => {
      const base64Audio = (reader.result as string).split(',')[1];
      
      try {
        const response = await fetch(
          `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              config: {
                encoding: 'WEBM_OPUS',
                sampleRateHertz: 48000,
                languageCode: 'hi-IN', // Hindi
                alternativeLanguageCodes: ['en-IN'], // English (India)
                enableAutomaticPunctuation: true,
              },
              audio: {
                content: base64Audio,
              },
            }),
          }
        );
        
        const data = await response.json();
        const transcript = data.results?.[0]?.alternatives?.[0]?.transcript || '';
        resolve(transcript);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.readAsDataURL(audioBlob);
  });
}
```

### **Option 3: AssemblyAI (Affordable, Accurate)**

```typescript
// /utils/voice/assemblyai.ts
const ASSEMBLYAI_API_KEY = import.meta.env.VITE_ASSEMBLYAI_API_KEY;

export async function transcribeWithAssemblyAI(
  audioUrl: string
): Promise<string> {
  // Upload audio
  const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
    method: 'POST',
    headers: {
      authorization: ASSEMBLYAI_API_KEY,
    },
    body: audioUrl,
  });
  
  const { upload_url } = await uploadResponse.json();
  
  // Start transcription
  const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
    method: 'POST',
    headers: {
      authorization: ASSEMBLYAI_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      audio_url: upload_url,
      language_code: 'hi', // Hindi
    }),
  });
  
  const { id } = await transcriptResponse.json();
  
  // Poll for result
  let transcript = '';
  while (true) {
    const pollingResponse = await fetch(
      `https://api.assemblyai.com/v2/transcript/${id}`,
      {
        headers: { authorization: ASSEMBLYAI_API_KEY },
      }
    );
    
    const data = await pollingResponse.json();
    
    if (data.status === 'completed') {
      transcript = data.text;
      break;
    } else if (data.status === 'error') {
      throw new Error('Transcription failed');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return transcript;
}
```

---

## 💳 PAYMENT GATEWAY INTEGRATION

### **Razorpay (Recommended for India)**

```typescript
// /utils/payment/razorpay.ts
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = import.meta.env.VITE_RAZORPAY_KEY_SECRET;

export async function initiateRazorpayPayment(
  amount: number,
  orderId: string,
  customerName: string,
  customerPhone: string
): Promise<boolean> {
  return new Promise((resolve) => {
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      name: 'Retail Bandhu',
      description: `Payment for Order #${orderId}`,
      order_id: orderId,
      prefill: {
        name: customerName,
        contact: customerPhone,
      },
      theme: {
        color: '#1E88E5',
      },
      handler: function (response: any) {
        // Payment successful
        console.log('Payment ID:', response.razorpay_payment_id);
        resolve(true);
      },
      modal: {
        ondismiss: function () {
          // Payment cancelled
          resolve(false);
        },
      },
    };
    
    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  });
}

// Create order on backend
export async function createRazorpayOrder(
  amount: number
): Promise<string> {
  const response = await fetch('/api/payment/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  
  const { order_id } = await response.json();
  return order_id;
}
```

### **PhonePe Integration**

```typescript
// /utils/payment/phonepe.ts
export async function initiatePhonePePayment(
  amount: number,
  orderId: string,
  customerPhone: string
): Promise<boolean> {
  const merchantId = import.meta.env.VITE_PHONEPE_MERCHANT_ID;
  const saltKey = import.meta.env.VITE_PHONEPE_SALT_KEY;
  
  const payload = {
    merchantId: merchantId,
    merchantTransactionId: orderId,
    merchantUserId: customerPhone,
    amount: amount * 100, // Convert to paise
    redirectUrl: `${window.location.origin}/payment/callback`,
    redirectMode: 'REDIRECT',
    callbackUrl: `${window.location.origin}/api/payment/phonepe/callback`,
    paymentInstrument: {
      type: 'PAY_PAGE',
    },
  };
  
  // Generate checksum
  const base64Payload = btoa(JSON.stringify(payload));
  const checksum = await generatePhonePeChecksum(base64Payload, saltKey);
  
  // Redirect to PhonePe
  const url = `https://api.phonepe.com/apis/hermes/pg/v1/pay`;
  window.location.href = `${url}?payload=${base64Payload}&checksum=${checksum}`;
  
  return true;
}
```

---

## 📨 SMS GATEWAY INTEGRATION

### **Twilio SMS**

```typescript
// /utils/sms/twilio.ts
import twilio from 'twilio';

const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function sendSMS(
  to: string,
  message: string
): Promise<boolean> {
  try {
    await client.messages.create({
      body: message,
      from: '+1234567890', // Your Twilio number
      to: to,
    });
    return true;
  } catch (error) {
    console.error('SMS error:', error);
    return false;
  }
}

export async function sendBillSMS(
  to: string,
  billData: any
): Promise<boolean> {
  const message = `
Bill #${billData.billNumber}
Total: ₹${billData.total}
${billData.storeName}
Thank you!
  `.trim();
  
  return sendSMS(to, message);
}
```

### **MSG91 (India)**

```typescript
// /utils/sms/msg91.ts
const MSG91_AUTH_KEY = import.meta.env.VITE_MSG91_AUTH_KEY;
const MSG91_SENDER_ID = import.meta.env.VITE_MSG91_SENDER_ID;

export async function sendMSG91SMS(
  to: string,
  message: string
): Promise<boolean> {
  try {
    const response = await fetch('https://api.msg91.com/api/v5/flow/', {
      method: 'POST',
      headers: {
        'authkey': MSG91_AUTH_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: MSG91_SENDER_ID,
        short_url: '0',
        mobiles: to,
        message: message,
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('MSG91 error:', error);
    return false;
  }
}
```

---

## 🔄 REAL-TIME SYNC

### **Supabase Realtime**

```typescript
// /utils/realtime.ts
import { supabase } from './supabase/client';

export function subscribeToProducts(
  userId: string,
  onUpdate: (products: any[]) => void
) {
  const subscription = supabase
    .channel('products-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'products',
        filter: `user_id=eq.${userId}`,
      },
      async (payload) => {
        // Fetch updated products
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', userId);
        
        onUpdate(data || []);
      }
    )
    .subscribe();
  
  return () => {
    subscription.unsubscribe();
  };
}

// Usage in component:
useEffect(() => {
  const unsubscribe = subscribeToProducts(userId, (products) => {
    setProducts(products);
  });
  
  return unsubscribe;
}, [userId]);
```

---

## 📊 ANALYTICS API

### **Custom Analytics**

```typescript
// /utils/analytics.ts
export async function trackEvent(
  event: string,
  properties?: Record<string, any>
) {
  // Send to your analytics backend
  await fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event,
      properties,
      timestamp: new Date().toISOString(),
    }),
  });
}

// Usage:
trackEvent('bill_created', {
  total: 1500,
  items: 5,
  payment_method: 'upi',
});

trackEvent('product_added', {
  product_name: 'Maggie',
  category: 'Groceries',
});
```

---

## 🔐 SECURITY BEST PRACTICES

### **API Key Management**

```typescript
// Never expose keys in frontend
// Use environment variables
const API_KEY = import.meta.env.VITE_API_KEY;

// For sensitive operations, proxy through your backend
export async function secureAPICall(data: any) {
  // Frontend calls your backend
  const response = await fetch('/api/secure-endpoint', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`,
    },
    body: JSON.stringify(data),
  });
  
  return response.json();
}
```

### **Rate Limiting**

```typescript
// Simple client-side rate limiting
class RateLimiter {
  private calls: number[] = [];
  private limit: number;
  private window: number;
  
  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.window = windowMs;
  }
  
  async throttle<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    this.calls = this.calls.filter(t => now - t < this.window);
    
    if (this.calls.length >= this.limit) {
      throw new Error('Rate limit exceeded');
    }
    
    this.calls.push(now);
    return fn();
  }
}

// Usage:
const limiter = new RateLimiter(10, 60000); // 10 calls per minute
await limiter.throttle(() => apiCall());
```

---

## 🧪 TESTING APIs

### **Mock API Responses**

```typescript
// /utils/api/mock.ts
export const mockAPI = {
  async getProducts() {
    await delay(500);
    return [
      { id: '1', name: 'Maggie', price: 12, stock: 50 },
      { id: '2', name: 'Pepsi', price: 20, stock: 30 },
    ];
  },
  
  async createBill(billData: any) {
    await delay(300);
    return { id: 'bill_123', ...billData };
  },
};

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

---

## 📚 API DOCUMENTATION

Document all your APIs using OpenAPI/Swagger:

```yaml
# /api-docs.yaml
openapi: 3.0.0
info:
  title: Retail Bandhu API
  version: 1.0.0
  
paths:
  /products:
    get:
      summary: Get all products
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Product'
                  
components:
  schemas:
    Product:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        price:
          type: number
        stock:
          type: integer
```

---

## 🎯 MIGRATION STRATEGY

### **Phase 1: Dual Mode**
- Keep localStorage as fallback
- Gradually sync to backend
- Monitor for issues

### **Phase 2: Backend Primary**
- Backend becomes source of truth
- localStorage for offline cache
- Sync on reconnection

### **Phase 3: Full Backend**
- Remove localStorage dependency
- Full cloud sync
- Real-time updates

---

**Your Retail Bandhu Lite is backend-ready!** 🚀

Choose the integrations that fit your needs and follow this guide for seamless implementation.

---

**Document Version:** 1.0  
**Last Updated:** December 11, 2024  
**Maintained by:** Retail Bandhu Team
