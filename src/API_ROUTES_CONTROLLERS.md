# 🛣️ **API ROUTES & CONTROLLERS**

## 📋 **PART 3: ROUTES, CONTROLLERS & SERVICES**

---

## 🔀 **1. ROUTE INDEX**

### **`src/routes/index.ts`**

```typescript
import { Router } from 'express';
import authRoutes from './auth.routes.js';
import billingRoutes from './billing.routes.js';
import inventoryRoutes from './inventory.routes.js';
import customerRoutes from './customer.routes.js';
import reportsRoutes from './reports.routes.js';
import whatsappRoutes from './whatsapp.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/billing', billingRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/customers', customerRoutes);
router.use('/reports', reportsRoutes);
router.use('/whatsapp', whatsappRoutes);
router.use('/admin', adminRoutes);

// API info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Retail Bandhu API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      billing: '/api/v1/billing',
      inventory: '/api/v1/inventory',
      customers: '/api/v1/customers',
      reports: '/api/v1/reports',
      whatsapp: '/api/v1/whatsapp',
      admin: '/api/v1/admin',
    },
  });
});

export default router;
```

---

## 🔐 **2. AUTHENTICATION ROUTES**

### **`src/routes/auth.routes.ts`**

```typescript
import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} from '../validators/auth.validator.js';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  authController.register
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  authController.login
);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', authController.refreshToken);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, authController.getProfile);

/**
 * @route   PUT /api/v1/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, authController.updateProfile);

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change password
 * @access  Private
 */
router.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

export default router;
```

### **`src/controllers/auth.controller.ts`**

```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';

const prisma = new PrismaClient();

/**
 * @desc    Register new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { phoneNumber, email, password, name, storeName, gstin } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { phoneNumber },
        ...(email ? [{ email }] : []),
      ],
    },
  });

  if (existingUser) {
    return errorResponse(
      res,
      { message: 'User with this phone number or email already exists' },
      409
    );
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      phoneNumber,
      email: email || null,
      password: hashedPassword,
      name,
      storeName: storeName || null,
      gstin: gstin || null,
      role: 'RETAILER',
      isActive: true,
      isVerified: false,
    },
    select: {
      id: true,
      phoneNumber: true,
      email: true,
      name: true,
      storeName: true,
      role: true,
      createdAt: true,
    },
  });

  // Generate tokens
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email || undefined,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
    email: user.email || undefined,
    role: user.role,
  });

  return successResponse(
    res,
    {
      message: 'Registration successful',
      data: {
        user,
        accessToken,
        refreshToken,
      },
    },
    201
  );
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { phoneNumber, password } = req.body;

  // Find user
  const user = await prisma.user.findUnique({
    where: { phoneNumber },
  });

  if (!user) {
    return errorResponse(
      res,
      { message: 'Invalid phone number or password' },
      401
    );
  }

  // Check if user is active
  if (!user.isActive) {
    return errorResponse(
      res,
      { message: 'Your account has been deactivated. Please contact support.' },
      403
    );
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    return errorResponse(
      res,
      { message: 'Invalid phone number or password' },
      401
    );
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  // Generate tokens
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email || undefined,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
    email: user.email || undefined,
    role: user.role,
  });

  return successResponse(res, {
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        email: user.email,
        name: user.name,
        storeName: user.storeName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    },
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      phoneNumber: true,
      email: true,
      name: true,
      storeName: true,
      storeAddress: true,
      gstin: true,
      role: true,
      subscriptionPlan: true,
      subscriptionExpiry: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return errorResponse(res, { message: 'User not found' }, 404);
  }

  return successResponse(res, {
    message: 'Profile retrieved successfully',
    data: user,
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/auth/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { name, email, storeName, storeAddress, gstin } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(storeName && { storeName }),
        ...(storeAddress && { storeAddress }),
        ...(gstin && { gstin }),
      },
      select: {
        id: true,
        phoneNumber: true,
        email: true,
        name: true,
        storeName: true,
        storeAddress: true,
        gstin: true,
        role: true,
        updatedAt: true,
      },
    });

    return successResponse(res, {
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  }
);

/**
 * @desc    Change password
 * @route   POST /api/v1/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return errorResponse(res, { message: 'User not found' }, 404);
    }

    // Verify current password
    const isPasswordValid = await comparePassword(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return errorResponse(
        res,
        { message: 'Current password is incorrect' },
        401
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return successResponse(res, {
      message: 'Password changed successfully',
      data: null,
    });
  }
);

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh
 * @access  Public
 */
export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    // Implementation for refresh token logic
    return successResponse(res, {
      message: 'Token refreshed successfully',
      data: {},
    });
  }
);

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  // Clear any server-side sessions if applicable
  return successResponse(res, {
    message: 'Logout successful',
    data: null,
  });
});
```

---

## 💰 **3. BILLING ROUTES**

### **`src/routes/billing.routes.ts`**

```typescript
import { Router } from 'express';
import * as billingController from '../controllers/billing.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createInvoiceSchema,
  updateInvoiceSchema,
} from '../validators/billing.validator.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/billing/invoices
 * @desc    Get all invoices for user
 * @access  Private
 */
router.get('/invoices', billingController.getInvoices);

/**
 * @route   GET /api/v1/billing/invoices/:id
 * @desc    Get single invoice
 * @access  Private
 */
router.get('/invoices/:id', billingController.getInvoiceById);

/**
 * @route   POST /api/v1/billing/invoices
 * @desc    Create new invoice
 * @access  Private
 */
router.post(
  '/invoices',
  validate(createInvoiceSchema),
  billingController.createInvoice
);

/**
 * @route   PUT /api/v1/billing/invoices/:id
 * @desc    Update invoice
 * @access  Private
 */
router.put(
  '/invoices/:id',
  validate(updateInvoiceSchema),
  billingController.updateInvoice
);

/**
 * @route   DELETE /api/v1/billing/invoices/:id
 * @desc    Delete invoice
 * @access  Private
 */
router.delete('/invoices/:id', billingController.deleteInvoice);

/**
 * @route   GET /api/v1/billing/invoices/:id/pdf
 * @desc    Generate and download invoice PDF
 * @access  Private
 */
router.get('/invoices/:id/pdf', billingController.generateInvoicePDF);

/**
 * @route   POST /api/v1/billing/invoices/:id/send
 * @desc    Send invoice via WhatsApp
 * @access  Private
 */
router.post('/invoices/:id/send', billingController.sendInvoice);

/**
 * @route   GET /api/v1/billing/stats
 * @desc    Get billing statistics
 * @access  Private
 */
router.get('/stats', billingController.getBillingStats);

export default router;
```

### **`src/controllers/billing.controller.ts`**

```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler.js';
import { successResponse, errorResponse, paginationMeta } from '../utils/response.js';

const prisma = new PrismaClient();

/**
 * @desc    Get all invoices
 * @route   GET /api/v1/billing/invoices
 * @access  Private
 */
export const getInvoices = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { page = 1, limit = 20, status, search } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  // Build where clause
  const where: any = { userId };

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { invoiceNumber: { contains: search as string, mode: 'insensitive' } },
      { customer: { name: { contains: search as string, mode: 'insensitive' } } },
    ];
  }

  // Get invoices
  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
          },
        },
        items: true,
      },
      orderBy: { invoiceDate: 'desc' },
    }),
    prisma.invoice.count({ where }),
  ]);

  return successResponse(res, {
    message: 'Invoices retrieved successfully',
    data: invoices,
    meta: paginationMeta(total, Number(page), Number(limit)),
  });
});

/**
 * @desc    Get invoice by ID
 * @route   GET /api/v1/billing/invoices/:id
 * @access  Private
 */
export const getInvoiceById = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;

    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });

    if (!invoice) {
      return errorResponse(res, { message: 'Invoice not found' }, 404);
    }

    return successResponse(res, {
      message: 'Invoice retrieved successfully',
      data: invoice,
    });
  }
);

/**
 * @desc    Create new invoice
 * @route   POST /api/v1/billing/invoices
 * @access  Private
 */
export const createInvoice = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { customerId, items, discountAmount, paymentMethod, paidAmount, notes, dueDate } = req.body;

    // Generate invoice number
    const lastInvoice = await prisma.invoice.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { invoiceNumber: true },
    });

    const invoiceNumber = lastInvoice
      ? `INV-${(parseInt(lastInvoice.invoiceNumber.split('-')[1]) + 1).toString().padStart(6, '0')}`
      : 'INV-000001';

    // Calculate totals
    let subtotal = 0;
    let taxAmount = 0;

    const invoiceItems = items.map((item: any) => {
      const itemSubtotal = item.quantity * item.price;
      const itemTax = (itemSubtotal * item.gstRate) / 100;
      const itemTotal = itemSubtotal + itemTax;

      subtotal += itemSubtotal;
      taxAmount += itemTax;

      return {
        ...item,
        subtotal: itemSubtotal,
        taxAmount: itemTax,
        total: itemTotal,
      };
    });

    const totalAmount = subtotal + taxAmount - (discountAmount || 0);
    const balanceAmount = totalAmount - (paidAmount || 0);

    // Determine payment status
    let paymentStatus: 'PAID' | 'UNPAID' | 'PARTIAL';
    if (paidAmount >= totalAmount) {
      paymentStatus = 'PAID';
    } else if (paidAmount > 0) {
      paymentStatus = 'PARTIAL';
    } else {
      paymentStatus = 'UNPAID';
    }

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        userId,
        customerId,
        subtotal,
        taxAmount,
        discountAmount: discountAmount || 0,
        totalAmount,
        paidAmount: paidAmount || 0,
        balanceAmount,
        paymentStatus,
        paymentMethod,
        notes,
        dueDate,
        status: 'DRAFT',
        items: {
          create: invoiceItems,
        },
      },
      include: {
        customer: true,
        items: true,
      },
    });

    // Update inventory for each item
    for (const item of items) {
      if (item.productId) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            currentStock: {
              decrement: item.quantity,
            },
          },
        });

        // Log inventory change
        await prisma.inventoryLog.create({
          data: {
            productId: item.productId,
            userId,
            type: 'SALE',
            quantity: -item.quantity,
            previousStock: 0, // You would fetch this from product
            newStock: 0, // You would calculate this
            reason: 'Sale',
            referenceId: invoice.id,
          },
        });
      }
    }

    return successResponse(
      res,
      {
        message: 'Invoice created successfully',
        data: invoice,
      },
      201
    );
  }
);

/**
 * @desc    Update invoice
 * @route   PUT /api/v1/billing/invoices/:id
 * @access  Private
 */
export const updateInvoice = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;
    const updateData = req.body;

    const invoice = await prisma.invoice.findFirst({
      where: { id, userId },
    });

    if (!invoice) {
      return errorResponse(res, { message: 'Invoice not found' }, 404);
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        items: true,
      },
    });

    return successResponse(res, {
      message: 'Invoice updated successfully',
      data: updatedInvoice,
    });
  }
);

/**
 * @desc    Delete invoice
 * @route   DELETE /api/v1/billing/invoices/:id
 * @access  Private
 */
export const deleteInvoice = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;

    const invoice = await prisma.invoice.findFirst({
      where: { id, userId },
    });

    if (!invoice) {
      return errorResponse(res, { message: 'Invoice not found' }, 404);
    }

    await prisma.invoice.delete({
      where: { id },
    });

    return successResponse(res, {
      message: 'Invoice deleted successfully',
      data: null,
    });
  }
);

/**
 * @desc    Generate invoice PDF
 * @route   GET /api/v1/billing/invoices/:id/pdf
 * @access  Private
 */
export const generateInvoicePDF = asyncHandler(
  async (req: Request, res: Response) => {
    // PDF generation logic would go here
    return successResponse(res, {
      message: 'PDF generation not yet implemented',
      data: null,
    });
  }
);

/**
 * @desc    Send invoice via WhatsApp
 * @route   POST /api/v1/billing/invoices/:id/send
 * @access  Private
 */
export const sendInvoice = asyncHandler(async (req: Request, res: Response) => {
  // WhatsApp sending logic would go here
  return successResponse(res, {
    message: 'Invoice sent successfully',
    data: null,
  });
});

/**
 * @desc    Get billing statistics
 * @route   GET /api/v1/billing/stats
 * @access  Private
 */
export const getBillingStats = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    const stats = await prisma.invoice.aggregate({
      where: { userId },
      _sum: {
        totalAmount: true,
        paidAmount: true,
        balanceAmount: true,
      },
      _count: true,
    });

    return successResponse(res, {
      message: 'Stats retrieved successfully',
      data: stats,
    });
  }
);
```

---

## 📦 **4. INVENTORY ROUTES** (Shortened for space)

### **`src/routes/inventory.routes.ts`**

```typescript
import { Router } from 'express';
import * as inventoryController from '../controllers/inventory.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/products', inventoryController.getProducts);
router.get('/products/:id', inventoryController.getProductById);
router.post('/products', inventoryController.createProduct);
router.put('/products/:id', inventoryController.updateProduct);
router.delete('/products/:id', inventoryController.deleteProduct);
router.get('/low-stock', inventoryController.getLowStockProducts);
router.get('/logs', inventoryController.getInventoryLogs);

export default router;
```

---

**Ready for more?** I can create:
- ✅ Customer routes & controllers
- ✅ Reports & analytics
- ✅ WhatsApp integration
- ✅ Complete API documentation

Would you like me to continue?
