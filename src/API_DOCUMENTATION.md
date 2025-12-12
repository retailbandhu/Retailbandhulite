# 📚 **COMPLETE API DOCUMENTATION**

## 📋 **RETAIL BANDHU LITE - API REFERENCE**

**Base URL:** `https://your-app.repl.co/api/v1`  
**Version:** 1.0.0  
**Authentication:** Bearer Token (JWT)

---

## 🔐 **AUTHENTICATION**

### **Register**
```http
POST /auth/register
Content-Type: application/json

{
  "phoneNumber": "9876543210",
  "password": "SecurePass123",
  "name": "Ramesh Kumar",
  "email": "ramesh@example.com",
  "storeName": "Kumar General Store",
  "gstin": "24XXXXX1234X1ZX"
}

Response 201:
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "phoneNumber": "9876543210",
      "name": "Ramesh Kumar",
      "storeName": "Kumar General Store",
      "role": "RETAILER"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### **Login**
```http
POST /auth/login
Content-Type: application/json

{
  "phoneNumber": "9876543210",
  "password": "SecurePass123"
}

Response 200:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### **Get Profile**
```http
GET /auth/me
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "uuid",
    "phoneNumber": "9876543210",
    "name": "Ramesh Kumar",
    "storeName": "Kumar General Store",
    "subscriptionPlan": "FREE",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 💰 **BILLING**

### **Create Invoice**
```http
POST /billing/invoices
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "customerId": "uuid-optional",
  "items": [
    {
      "productId": "uuid",
      "name": "Product Name",
      "quantity": 2,
      "unit": "piece",
      "price": 100,
      "gstRate": 18
    }
  ],
  "discountAmount": 10,
  "paymentMethod": "CASH",
  "paidAmount": 200,
  "notes": "Thank you for your business"
}

Response 201:
{
  "success": true,
  "message": "Invoice created successfully",
  "data": {
    "id": "uuid",
    "invoiceNumber": "INV-000001",
    "subtotal": 200,
    "taxAmount": 36,
    "totalAmount": 226,
    "paidAmount": 200,
    "balanceAmount": 26,
    "paymentStatus": "PARTIAL",
    "items": [...]
  }
}
```

### **Get Invoices**
```http
GET /billing/invoices?page=1&limit=20&status=PAID&search=INV-001
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "message": "Invoices retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "invoiceNumber": "INV-000001",
      "invoiceDate": "2024-01-15T10:30:00.000Z",
      "totalAmount": 1000,
      "paymentStatus": "PAID",
      "customer": {
        "name": "Customer Name",
        "phoneNumber": "9876543210"
      }
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

### **Get Invoice by ID**
```http
GET /billing/invoices/:id
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "invoiceNumber": "INV-000001",
    "customer": { ... },
    "items": [
      {
        "name": "Product 1",
        "quantity": 2,
        "price": 100,
        "total": 200
      }
    ],
    "subtotal": 200,
    "taxAmount": 36,
    "totalAmount": 236,
    "payments": [...]
  }
}
```

---

## 📦 **INVENTORY**

### **Create Product**
```http
POST /inventory/products
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Tata Salt 1kg",
  "sku": "TS-1KG-001",
  "barcode": "1234567890123",
  "category": "Grocery",
  "purchasePrice": 20,
  "sellingPrice": 25,
  "mrp": 28,
  "gstRate": 5,
  "currentStock": 100,
  "minStockLevel": 10,
  "unit": "piece",
  "imageUrl": "https://..."
}

Response 201:
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "uuid",
    "name": "Tata Salt 1kg",
    "sellingPrice": 25,
    "currentStock": 100,
    "isActive": true
  }
}
```

### **Get Products**
```http
GET /inventory/products?page=1&limit=20&category=Grocery&search=salt
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Tata Salt 1kg",
      "category": "Grocery",
      "sellingPrice": 25,
      "currentStock": 100,
      "minStockLevel": 10
    }
  ],
  "meta": { ... }
}
```

### **Update Product**
```http
PUT /inventory/products/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "sellingPrice": 27,
  "currentStock": 150
}

Response 200:
{
  "success": true,
  "message": "Product updated successfully",
  "data": { ... }
}
```

### **Get Low Stock Products**
```http
GET /inventory/low-stock
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Product Name",
      "currentStock": 5,
      "minStockLevel": 10,
      "stockNeeded": 5
    }
  ]
}
```

---

## 👥 **CUSTOMERS**

### **Create Customer**
```http
POST /customers
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Rajesh Sharma",
  "phoneNumber": "9876543210",
  "email": "rajesh@example.com",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "gstin": "27XXXXX1234X1ZX",
  "creditLimit": 50000
}

Response 201:
{
  "success": true,
  "message": "Customer created successfully",
  "data": {
    "id": "uuid",
    "name": "Rajesh Sharma",
    "phoneNumber": "9876543210",
    "currentBalance": 0,
    "creditLimit": 50000
  }
}
```

### **Get Customers**
```http
GET /customers?page=1&limit=20&search=rajesh&isActive=true
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Rajesh Sharma",
      "phoneNumber": "9876543210",
      "currentBalance": 5000,
      "creditLimit": 50000,
      "_count": {
        "invoices": 25,
        "payments": 20
      }
    }
  ],
  "meta": { ... }
}
```

### **Get Customer Balance**
```http
GET /customers/:id/balance
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "data": {
    "customer": {
      "name": "Rajesh Sharma",
      "currentBalance": 5000,
      "creditLimit": 50000
    },
    "outstandingInvoices": [
      {
        "invoiceNumber": "INV-000123",
        "balanceAmount": 2500,
        "dueDate": "2024-02-01"
      }
    ],
    "creditAvailable": 45000
  }
}
```

---

## 📊 **REPORTS**

### **Get Dashboard**
```http
GET /reports/dashboard
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "data": {
    "today": {
      "sales": 5000,
      "collected": 4500,
      "invoices": 12
    },
    "thisMonth": {
      "sales": 150000,
      "collected": 140000,
      "invoices": 320
    },
    "customers": {
      "total": 150,
      "active": 125
    },
    "inventory": {
      "totalProducts": 250,
      "lowStock": 15
    },
    "financial": {
      "totalOutstanding": 75000,
      "overdueInvoices": 8
    },
    "topPerformers": {
      "products": [...],
      "customers": [...]
    }
  }
}
```

### **Get Sales Report**
```http
GET /reports/sales?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "data": {
    "summary": {
      "totalInvoices": 320,
      "totalSales": 450000,
      "totalPaid": 420000,
      "totalOutstanding": 30000,
      "totalTax": 45000
    },
    "invoices": [...],
    "dateRange": {
      "start": "2024-01-01",
      "end": "2024-01-31"
    }
  }
}
```

### **Get GST Report**
```http
GET /reports/gst?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "data": {
    "summary": {
      "totalTaxableValue": 380000,
      "totalGST": 68400,
      "cgst": 34200,
      "sgst": 34200,
      "igst": 0
    },
    "rateBreakdown": [
      {
        "gstRate": 5,
        "_sum": {
          "subtotal": 100000,
          "taxAmount": 5000
        }
      },
      {
        "gstRate": 18,
        "_sum": {
          "subtotal": 280000,
          "taxAmount": 50400
        }
      }
    ]
  }
}
```

---

## 💬 **WHATSAPP**

### **Send Message**
```http
POST /whatsapp/send-message
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "phoneNumber": "9876543210",
  "message": "Hello! Your order is ready for delivery."
}

Response 200:
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "messageId": "wamid.xxx",
    "recordId": "uuid"
  }
}
```

### **Send Invoice**
```http
POST /whatsapp/send-invoice
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "invoiceId": "uuid"
}

Response 200:
{
  "success": true,
  "message": "Invoice sent successfully",
  "data": {
    "messageId": "wamid.xxx"
  }
}
```

### **Send Payment Reminder**
```http
POST /whatsapp/send-payment-reminder
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "invoiceId": "uuid"
}

Response 200:
{
  "success": true,
  "message": "Payment reminder sent successfully"
}
```

---

## 💳 **PAYMENTS**

### **Create Payment Order**
```http
POST /payments/create-order
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "invoiceId": "uuid",
  "amount": 1000
}

Response 201:
{
  "success": true,
  "data": {
    "orderId": "order_xxx",
    "amount": 100000,
    "currency": "INR",
    "razorpayKeyId": "rzp_xxx"
  }
}
```

### **Verify Payment**
```http
POST /payments/verify
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}

Response 200:
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "paymentId": "pay_xxx",
    "status": "success"
  }
}
```

---

## 📤 **FILE UPLOAD**

### **Upload Product Image**
```http
POST /upload/product-image
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

FormData:
- image: (file)
- productId: "uuid"

Response 201:
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "fileName": "product-image.jpg"
  }
}
```

---

## ⚠️ **ERROR RESPONSES**

### **400 Bad Request**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "phoneNumber",
      "message": "Please provide a valid Indian phone number"
    }
  ]
}
```

### **401 Unauthorized**
```json
{
  "success": false,
  "message": "Authentication required. Please provide a valid token."
}
```

### **403 Forbidden**
```json
{
  "success": false,
  "message": "Access forbidden. Insufficient permissions."
}
```

### **404 Not Found**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### **500 Internal Server Error**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 📝 **POSTMAN COLLECTION**

Import this into Postman to test all endpoints:

```json
{
  "info": {
    "name": "Retail Bandhu Lite API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{accessToken}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://your-app.repl.co/api/v1"
    },
    {
      "key": "accessToken",
      "value": ""
    }
  ]
}
```

---

## 🔑 **AUTHENTICATION HEADER**

All protected endpoints require:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📊 **RATE LIMITS**

- **General API:** 100 requests per 15 minutes
- **Authentication:** 5 requests per 15 minutes
- **WhatsApp:** 30 messages per minute

---

## 🌐 **CORS**

Allowed origins:
- `https://www.retailbandhu.in`
- `http://localhost:3000` (development)

---

**API Version:** 1.0.0  
**Last Updated:** December 2024  
**Support:** support@retailbandhu.in
