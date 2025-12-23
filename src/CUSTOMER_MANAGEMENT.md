# 👥 **CUSTOMER MANAGEMENT - COMPLETE IMPLEMENTATION**

## 📋 **PART 4: CUSTOMER ROUTES, CONTROLLERS & SERVICES**

---

## 🛣️ **CUSTOMER ROUTES**

### **`src/routes/customer.routes.ts`**

```typescript
import { Router } from 'express';
import * as customerController from '../controllers/customer.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate, validateQuery } from '../middleware/validate.js';
import {
  createCustomerSchema,
  updateCustomerSchema,
  customerQuerySchema,
} from '../validators/customer.validator.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/customers
 * @desc    Get all customers with pagination and search
 * @access  Private
 */
router.get(
  '/',
  validateQuery(customerQuerySchema),
  customerController.getCustomers
);

/**
 * @route   GET /api/v1/customers/:id
 * @desc    Get single customer with transaction history
 * @access  Private
 */
router.get('/:id', customerController.getCustomerById);

/**
 * @route   POST /api/v1/customers
 * @desc    Create new customer
 * @access  Private
 */
router.post(
  '/',
  validate(createCustomerSchema),
  customerController.createCustomer
);

/**
 * @route   PUT /api/v1/customers/:id
 * @desc    Update customer details
 * @access  Private
 */
router.put(
  '/:id',
  validate(updateCustomerSchema),
  customerController.updateCustomer
);

/**
 * @route   DELETE /api/v1/customers/:id
 * @desc    Delete customer (soft delete)
 * @access  Private
 */
router.delete('/:id', customerController.deleteCustomer);

/**
 * @route   GET /api/v1/customers/:id/invoices
 * @desc    Get customer's invoice history
 * @access  Private
 */
router.get('/:id/invoices', customerController.getCustomerInvoices);

/**
 * @route   GET /api/v1/customers/:id/payments
 * @desc    Get customer's payment history
 * @access  Private
 */
router.get('/:id/payments', customerController.getCustomerPayments);

/**
 * @route   GET /api/v1/customers/:id/balance
 * @desc    Get customer's outstanding balance
 * @access  Private
 */
router.get('/:id/balance', customerController.getCustomerBalance);

/**
 * @route   POST /api/v1/customers/:id/payment
 * @desc    Record payment from customer
 * @access  Private
 */
router.post('/:id/payment', customerController.recordPayment);

/**
 * @route   GET /api/v1/customers/stats/overview
 * @desc    Get customer statistics overview
 * @access  Private
 */
router.get('/stats/overview', customerController.getCustomerStats);

/**
 * @route   GET /api/v1/customers/search/:query
 * @desc    Search customers by name/phone
 * @access  Private
 */
router.get('/search/:query', customerController.searchCustomers);

export default router;
```

---

## 🎯 **CUSTOMER CONTROLLER**

### **`src/controllers/customer.controller.ts`**

```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  successResponse,
  errorResponse,
  paginationMeta,
} from '../utils/response.js';

const prisma = new PrismaClient();

/**
 * @desc    Get all customers
 * @route   GET /api/v1/customers
 * @access  Private
 */
export const getCustomers = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const {
      page = 1,
      limit = 20,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isActive,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause
    const where: any = { userId };

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { phoneNumber: { contains: search as string } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { businessName: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    // Get customers
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { [sortBy as string]: sortOrder },
        select: {
          id: true,
          name: true,
          phoneNumber: true,
          email: true,
          businessName: true,
          currentBalance: true,
          creditLimit: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              invoices: true,
              payments: true,
            },
          },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    return successResponse(res, {
      message: 'Customers retrieved successfully',
      data: customers,
      meta: paginationMeta(total, Number(page), Number(limit)),
    });
  }
);

/**
 * @desc    Get single customer
 * @route   GET /api/v1/customers/:id
 * @access  Private
 */
export const getCustomerById = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;

    const customer = await prisma.customer.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        invoices: {
          orderBy: { invoiceDate: 'desc' },
          take: 10,
          select: {
            id: true,
            invoiceNumber: true,
            invoiceDate: true,
            totalAmount: true,
            paidAmount: true,
            balanceAmount: true,
            paymentStatus: true,
          },
        },
        payments: {
          orderBy: { paymentDate: 'desc' },
          take: 10,
          select: {
            id: true,
            amount: true,
            paymentMethod: true,
            paymentDate: true,
          },
        },
        _count: {
          select: {
            invoices: true,
            payments: true,
          },
        },
      },
    });

    if (!customer) {
      return errorResponse(res, { message: 'Customer not found' }, 404);
    }

    // Calculate additional stats
    const stats = await prisma.invoice.aggregate({
      where: {
        customerId: id,
        userId,
      },
      _sum: {
        totalAmount: true,
        paidAmount: true,
        balanceAmount: true,
      },
    });

    return successResponse(res, {
      message: 'Customer retrieved successfully',
      data: {
        ...customer,
        stats: {
          totalInvoiceAmount: stats._sum.totalAmount || 0,
          totalPaidAmount: stats._sum.paidAmount || 0,
          totalOutstanding: stats._sum.balanceAmount || 0,
        },
      },
    });
  }
);

/**
 * @desc    Create new customer
 * @route   POST /api/v1/customers
 * @access  Private
 */
export const createCustomer = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const {
      name,
      phoneNumber,
      email,
      address,
      city,
      state,
      pincode,
      gstin,
      businessName,
      creditLimit,
    } = req.body;

    // Check if customer already exists
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        userId,
        phoneNumber,
      },
    });

    if (existingCustomer) {
      return errorResponse(
        res,
        { message: 'Customer with this phone number already exists' },
        409
      );
    }

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        userId,
        name,
        phoneNumber,
        email: email || null,
        address: address || null,
        city: city || null,
        state: state || null,
        pincode: pincode || null,
        gstin: gstin || null,
        businessName: businessName || null,
        creditLimit: creditLimit || 0,
        currentBalance: 0,
        isActive: true,
      },
    });

    return successResponse(
      res,
      {
        message: 'Customer created successfully',
        data: customer,
      },
      201
    );
  }
);

/**
 * @desc    Update customer
 * @route   PUT /api/v1/customers/:id
 * @access  Private
 */
export const updateCustomer = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;
    const updateData = req.body;

    // Check if customer exists
    const customer = await prisma.customer.findFirst({
      where: { id, userId },
    });

    if (!customer) {
      return errorResponse(res, { message: 'Customer not found' }, 404);
    }

    // Update customer
    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: updateData,
    });

    return successResponse(res, {
      message: 'Customer updated successfully',
      data: updatedCustomer,
    });
  }
);

/**
 * @desc    Delete customer
 * @route   DELETE /api/v1/customers/:id
 * @access  Private
 */
export const deleteCustomer = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;

    // Check if customer exists
    const customer = await prisma.customer.findFirst({
      where: { id, userId },
    });

    if (!customer) {
      return errorResponse(res, { message: 'Customer not found' }, 404);
    }

    // Soft delete - mark as inactive
    await prisma.customer.update({
      where: { id },
      data: { isActive: false },
    });

    return successResponse(res, {
      message: 'Customer deleted successfully',
      data: null,
    });
  }
);

/**
 * @desc    Get customer invoices
 * @route   GET /api/v1/customers/:id/invoices
 * @access  Private
 */
export const getCustomerInvoices = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where: {
          customerId: id,
          userId,
        },
        skip,
        take: Number(limit),
        orderBy: { invoiceDate: 'desc' },
        include: {
          items: true,
        },
      }),
      prisma.invoice.count({
        where: {
          customerId: id,
          userId,
        },
      }),
    ]);

    return successResponse(res, {
      message: 'Customer invoices retrieved successfully',
      data: invoices,
      meta: paginationMeta(total, Number(page), Number(limit)),
    });
  }
);

/**
 * @desc    Get customer payments
 * @route   GET /api/v1/customers/:id/payments
 * @access  Private
 */
export const getCustomerPayments = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: {
          customerId: id,
        },
        skip,
        take: Number(limit),
        orderBy: { paymentDate: 'desc' },
        include: {
          invoice: {
            select: {
              invoiceNumber: true,
              totalAmount: true,
            },
          },
        },
      }),
      prisma.payment.count({
        where: {
          customerId: id,
        },
      }),
    ]);

    return successResponse(res, {
      message: 'Customer payments retrieved successfully',
      data: payments,
      meta: paginationMeta(total, Number(page), Number(limit)),
    });
  }
);

/**
 * @desc    Get customer balance
 * @route   GET /api/v1/customers/:id/balance
 * @access  Private
 */
export const getCustomerBalance = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;

    const customer = await prisma.customer.findFirst({
      where: { id, userId },
      select: {
        id: true,
        name: true,
        currentBalance: true,
        creditLimit: true,
      },
    });

    if (!customer) {
      return errorResponse(res, { message: 'Customer not found' }, 404);
    }

    // Get outstanding invoices
    const outstandingInvoices = await prisma.invoice.findMany({
      where: {
        customerId: id,
        userId,
        paymentStatus: { in: ['UNPAID', 'PARTIAL'] },
      },
      select: {
        id: true,
        invoiceNumber: true,
        invoiceDate: true,
        totalAmount: true,
        balanceAmount: true,
        dueDate: true,
      },
    });

    return successResponse(res, {
      message: 'Customer balance retrieved successfully',
      data: {
        customer,
        outstandingInvoices,
        creditAvailable: customer.creditLimit - customer.currentBalance,
      },
    });
  }
);

/**
 * @desc    Record payment from customer
 * @route   POST /api/v1/customers/:id/payment
 * @access  Private
 */
export const recordPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { invoiceId, amount, paymentMethod, notes } = req.body;

    // Verify customer and invoice belong to user
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        customerId: id,
        userId,
      },
    });

    if (!invoice) {
      return errorResponse(res, { message: 'Invoice not found' }, 404);
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        invoiceId,
        customerId: id,
        amount,
        paymentMethod,
        notes: notes || null,
      },
    });

    // Update invoice paid amount and balance
    const newPaidAmount = invoice.paidAmount + amount;
    const newBalanceAmount = invoice.totalAmount - newPaidAmount;

    let paymentStatus: 'PAID' | 'UNPAID' | 'PARTIAL';
    if (newBalanceAmount <= 0) {
      paymentStatus = 'PAID';
    } else if (newPaidAmount > 0) {
      paymentStatus = 'PARTIAL';
    } else {
      paymentStatus = 'UNPAID';
    }

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        paidAmount: newPaidAmount,
        balanceAmount: newBalanceAmount,
        paymentStatus,
      },
    });

    // Update customer balance
    await prisma.customer.update({
      where: { id },
      data: {
        currentBalance: {
          decrement: amount,
        },
      },
    });

    return successResponse(
      res,
      {
        message: 'Payment recorded successfully',
        data: payment,
      },
      201
    );
  }
);

/**
 * @desc    Get customer statistics
 * @route   GET /api/v1/customers/stats/overview
 * @access  Private
 */
export const getCustomerStats = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    const [totalCustomers, activeCustomers, totalOutstanding] =
      await Promise.all([
        prisma.customer.count({
          where: { userId },
        }),
        prisma.customer.count({
          where: { userId, isActive: true },
        }),
        prisma.customer.aggregate({
          where: { userId },
          _sum: {
            currentBalance: true,
          },
        }),
      ]);

    // Get top customers by revenue
    const topCustomers = await prisma.customer.findMany({
      where: { userId },
      take: 10,
      orderBy: {
        invoices: {
          _count: 'desc',
        },
      },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        currentBalance: true,
        _count: {
          select: {
            invoices: true,
          },
        },
      },
    });

    return successResponse(res, {
      message: 'Customer stats retrieved successfully',
      data: {
        totalCustomers,
        activeCustomers,
        inactiveCustomers: totalCustomers - activeCustomers,
        totalOutstanding: totalOutstanding._sum.currentBalance || 0,
        topCustomers,
      },
    });
  }
);

/**
 * @desc    Search customers
 * @route   GET /api/v1/customers/search/:query
 * @access  Private
 */
export const searchCustomers = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { query } = req.params;

    const customers = await prisma.customer.findMany({
      where: {
        userId,
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { phoneNumber: { contains: query } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        email: true,
        currentBalance: true,
      },
    });

    return successResponse(res, {
      message: 'Search results',
      data: customers,
    });
  }
);
```

---

## ✅ **CUSTOMER VALIDATORS**

### **`src/validators/customer.validator.ts`**

```typescript
import Joi from 'joi';

export const createCustomerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'any.required': 'Name is required',
  }),

  phoneNumber: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Please provide a valid Indian phone number',
      'any.required': 'Phone number is required',
    }),

  email: Joi.string().email().optional().allow(''),

  address: Joi.string().max(500).optional().allow(''),

  city: Joi.string().max(100).optional().allow(''),

  state: Joi.string().max(100).optional().allow(''),

  pincode: Joi.string()
    .pattern(/^\d{6}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Please provide a valid 6-digit pincode',
    }),

  gstin: Joi.string()
    .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Please provide a valid GSTIN',
    }),

  businessName: Joi.string().max(200).optional().allow(''),

  creditLimit: Joi.number().min(0).default(0),
});

export const updateCustomerSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional().allow(''),
  address: Joi.string().max(500).optional().allow(''),
  city: Joi.string().max(100).optional().allow(''),
  state: Joi.string().max(100).optional().allow(''),
  pincode: Joi.string().pattern(/^\d{6}$/).optional().allow(''),
  gstin: Joi.string()
    .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .optional()
    .allow(''),
  businessName: Joi.string().max(200).optional().allow(''),
  creditLimit: Joi.number().min(0).optional(),
  isActive: Joi.boolean().optional(),
});

export const customerQuerySchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
  search: Joi.string().optional(),
  sortBy: Joi.string()
    .valid('name', 'createdAt', 'currentBalance')
    .default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  isActive: Joi.string().valid('true', 'false').optional(),
});
```

---

## 🎯 **KEY FEATURES IMPLEMENTED**

### **✅ Customer Management:**
- Create, read, update, delete customers
- Search customers by name/phone/email
- Pagination and sorting
- Soft delete (inactive flag)

### **✅ Financial Tracking:**
- Credit limit management
- Outstanding balance tracking
- Payment history
- Invoice history

### **✅ Analytics:**
- Customer statistics
- Top customers by revenue
- Outstanding amounts
- Active/inactive customer counts

### **✅ Transaction Management:**
- Record payments
- Link payments to invoices
- Automatic balance updates
- Payment status tracking

---

**Next: Reports & Analytics →**
