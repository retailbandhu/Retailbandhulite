/**
 * Server-Side Validation Utilities
 * Validates and sanitizes all incoming data
 * Prevents injection attacks and data corruption
 */

// ============================================
// VALIDATION RULES
// ============================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  sanitized?: any;
}

/**
 * Sanitize string input (prevent XSS)
 */
export function sanitizeString(input: any): string {
  if (typeof input !== 'string') {
    return String(input || '');
  }
  
  // Remove dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (basic)
 */
export function isValidPhone(phone: string): boolean {
  // Allow digits, spaces, +, -, ()
  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.length >= 10;
}

/**
 * Validate number
 */
export function isValidNumber(value: any): boolean {
  return !isNaN(Number(value)) && isFinite(Number(value));
}

/**
 * Validate positive number
 */
export function isPositiveNumber(value: any): boolean {
  return isValidNumber(value) && Number(value) > 0;
}

// ============================================
// PRODUCT VALIDATION
// ============================================

export interface ProductInput {
  id?: string;
  name: string;
  price: number;
  stock?: number;
  barcode?: string;
  category?: string;
  gstRate?: number;
  unit?: string;
}

export function validateProduct(data: any): ValidationResult {
  const errors: string[] = [];

  // Required fields
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Product name is required and must be a string');
  } else if (data.name.length > 200) {
    errors.push('Product name must be less than 200 characters');
  }

  if (!data.price || !isValidNumber(data.price)) {
    errors.push('Product price is required and must be a valid number');
  } else if (Number(data.price) < 0) {
    errors.push('Product price cannot be negative');
  } else if (Number(data.price) > 1000000) {
    errors.push('Product price seems unreasonably high');
  }

  // Optional fields with validation
  if (data.stock !== undefined && !isValidNumber(data.stock)) {
    errors.push('Stock must be a valid number');
  }

  if (data.stock !== undefined && Number(data.stock) < 0) {
    errors.push('Stock cannot be negative');
  }

  if (data.gstRate !== undefined && !isValidNumber(data.gstRate)) {
    errors.push('GST rate must be a valid number');
  }

  if (data.gstRate !== undefined && (Number(data.gstRate) < 0 || Number(data.gstRate) > 100)) {
    errors.push('GST rate must be between 0 and 100');
  }

  // Sanitize strings
  const sanitized: ProductInput = {
    id: data.id,
    name: sanitizeString(data.name),
    price: Number(data.price),
    stock: data.stock !== undefined ? Number(data.stock) : undefined,
    barcode: data.barcode ? sanitizeString(data.barcode) : undefined,
    category: data.category ? sanitizeString(data.category) : undefined,
    gstRate: data.gstRate !== undefined ? Number(data.gstRate) : undefined,
    unit: data.unit ? sanitizeString(data.unit) : undefined,
  };

  return {
    valid: errors.length === 0,
    errors,
    sanitized,
  };
}

// ============================================
// CUSTOMER VALIDATION
// ============================================

export interface CustomerInput {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalPurchases?: number;
  totalSpent?: number;
  lastVisit?: string;
}

export function validateCustomer(data: any): ValidationResult {
  const errors: string[] = [];

  // Required fields
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Customer name is required and must be a string');
  } else if (data.name.length > 200) {
    errors.push('Customer name must be less than 200 characters');
  }

  if (!data.phone || typeof data.phone !== 'string') {
    errors.push('Phone number is required');
  } else if (!isValidPhone(data.phone)) {
    errors.push('Phone number format is invalid');
  }

  // Optional email validation
  if (data.email && !isValidEmail(data.email)) {
    errors.push('Email format is invalid');
  }

  // Sanitize
  const sanitized: CustomerInput = {
    id: data.id,
    name: sanitizeString(data.name),
    phone: sanitizeString(data.phone),
    email: data.email ? sanitizeString(data.email) : undefined,
    address: data.address ? sanitizeString(data.address) : undefined,
    totalPurchases: data.totalPurchases !== undefined ? Number(data.totalPurchases) : 0,
    totalSpent: data.totalSpent !== undefined ? Number(data.totalSpent) : 0,
    lastVisit: data.lastVisit,
  };

  return {
    valid: errors.length === 0,
    errors,
    sanitized,
  };
}

// ============================================
// BILL VALIDATION
// ============================================

export interface BillItemInput {
  id: string;
  name: string;
  quantity: number;
  price: number;
  gstRate?: number;
}

export interface BillInput {
  id?: string;
  billNumber: string;
  items: BillItemInput[];
  customerId?: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  date?: string;
  time?: string;
}

export function validateBill(data: any): ValidationResult {
  const errors: string[] = [];

  // Required fields
  if (!data.billNumber || typeof data.billNumber !== 'string') {
    errors.push('Bill number is required');
  }

  if (!data.items || !Array.isArray(data.items)) {
    errors.push('Bill items are required and must be an array');
  } else {
    // Validate each item
    data.items.forEach((item: any, index: number) => {
      if (!item.name || typeof item.name !== 'string') {
        errors.push(`Item ${index + 1}: Name is required`);
      }
      if (!isPositiveNumber(item.quantity)) {
        errors.push(`Item ${index + 1}: Quantity must be a positive number`);
      }
      if (!isPositiveNumber(item.price)) {
        errors.push(`Item ${index + 1}: Price must be a positive number`);
      }
    });
  }

  if (!isValidNumber(data.subtotal) || Number(data.subtotal) < 0) {
    errors.push('Subtotal must be a non-negative number');
  }

  if (!isValidNumber(data.tax) || Number(data.tax) < 0) {
    errors.push('Tax must be a non-negative number');
  }

  if (!isValidNumber(data.discount) || Number(data.discount) < 0) {
    errors.push('Discount must be a non-negative number');
  }

  if (!isValidNumber(data.total) || Number(data.total) < 0) {
    errors.push('Total must be a non-negative number');
  }

  if (!data.paymentMethod || typeof data.paymentMethod !== 'string') {
    errors.push('Payment method is required');
  }

  // Validate payment method
  const validPaymentMethods = ['Cash', 'UPI', 'Card', 'Credit'];
  if (data.paymentMethod && !validPaymentMethods.includes(data.paymentMethod)) {
    errors.push(`Payment method must be one of: ${validPaymentMethods.join(', ')}`);
  }

  // Verify totals match
  if (data.items && Array.isArray(data.items)) {
    const calculatedSubtotal = data.items.reduce(
      (sum: number, item: any) => sum + (Number(item.quantity) * Number(item.price)),
      0
    );
    
    if (Math.abs(calculatedSubtotal - Number(data.subtotal)) > 0.01) {
      errors.push('Subtotal does not match items total');
    }

    const calculatedTotal = calculatedSubtotal + Number(data.tax) - Number(data.discount);
    if (Math.abs(calculatedTotal - Number(data.total)) > 0.01) {
      errors.push('Total calculation is incorrect');
    }
  }

  // Sanitize
  const sanitized: BillInput = {
    id: data.id,
    billNumber: sanitizeString(data.billNumber),
    items: data.items ? data.items.map((item: any) => ({
      id: item.id,
      name: sanitizeString(item.name),
      quantity: Number(item.quantity),
      price: Number(item.price),
      gstRate: item.gstRate !== undefined ? Number(item.gstRate) : undefined,
    })) : [],
    customerId: data.customerId ? sanitizeString(data.customerId) : undefined,
    subtotal: Number(data.subtotal),
    tax: Number(data.tax),
    discount: Number(data.discount),
    total: Number(data.total),
    paymentMethod: sanitizeString(data.paymentMethod),
    date: data.date,
    time: data.time,
  };

  return {
    valid: errors.length === 0,
    errors,
    sanitized,
  };
}

// ============================================
// STORE INFO VALIDATION
// ============================================

export interface StoreInfoInput {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  gstNumber?: string;
}

export function validateStoreInfo(data: any): ValidationResult {
  const errors: string[] = [];

  // Required fields
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Store name is required');
  } else if (data.name.length > 200) {
    errors.push('Store name must be less than 200 characters');
  }

  // Optional validations
  if (data.email && !isValidEmail(data.email)) {
    errors.push('Email format is invalid');
  }

  if (data.phone && !isValidPhone(data.phone)) {
    errors.push('Phone number format is invalid');
  }

  // Sanitize
  const sanitized: StoreInfoInput = {
    name: sanitizeString(data.name),
    address: data.address ? sanitizeString(data.address) : undefined,
    phone: data.phone ? sanitizeString(data.phone) : undefined,
    email: data.email ? sanitizeString(data.email) : undefined,
    gstNumber: data.gstNumber ? sanitizeString(data.gstNumber) : undefined,
  };

  return {
    valid: errors.length === 0,
    errors,
    sanitized,
  };
}

// ============================================
// GENERIC HELPERS
// ============================================

/**
 * Validate ID format
 */
export function isValidId(id: string): boolean {
  return typeof id === 'string' && id.length > 0 && id.length < 100;
}

/**
 * Validate pagination parameters
 */
export function validatePagination(params: any): {
  page: number;
  limit: number;
} {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.limit) || 20));
  
  return { page, limit };
}

/**
 * Rate limiting check (simple in-memory)
 */
const requestCounts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests = 100,
  windowMs = 60000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  if (!record || now > record.resetAt) {
    requestCounts.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count };
}
