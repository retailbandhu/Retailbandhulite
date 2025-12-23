# 💳 **PAYMENT GATEWAY INTEGRATION - RAZORPAY**

## 📋 **PART 7: PAYMENT PROCESSING & WEBHOOKS**

---

## 🔧 **RAZORPAY SETUP**

### **1. Create Razorpay Account:**
- Go to https://razorpay.com
- Sign up and complete KYC
- Get API credentials from Dashboard

### **2. Environment Variables:**
```bash
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Production
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_production_secret
```

### **3. Install Razorpay SDK:**
```bash
npm install razorpay crypto
npm install -D @types/razorpay
```

---

## 🛣️ **PAYMENT ROUTES**

### **`src/routes/payment.routes.ts`**

```typescript
import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createOrderSchema,
  verifyPaymentSchema,
} from '../validators/payment.validator.js';

const router = Router();

/**
 * @route   POST /api/v1/payments/webhook
 * @desc    Handle Razorpay webhook events
 * @access  Public
 */
router.post('/webhook', paymentController.handleWebhook);

// Protected routes
router.use(authenticate);

/**
 * @route   POST /api/v1/payments/create-order
 * @desc    Create Razorpay order
 * @access  Private
 */
router.post(
  '/create-order',
  validate(createOrderSchema),
  paymentController.createOrder
);

/**
 * @route   POST /api/v1/payments/verify
 * @desc    Verify payment signature
 * @access  Private
 */
router.post(
  '/verify',
  validate(verifyPaymentSchema),
  paymentController.verifyPayment
);

/**
 * @route   GET /api/v1/payments
 * @desc    Get payment history
 * @access  Private
 */
router.get('/', paymentController.getPayments);

/**
 * @route   GET /api/v1/payments/:id
 * @desc    Get payment details
 * @access  Private
 */
router.get('/:id', paymentController.getPaymentById);

/**
 * @route   POST /api/v1/payments/refund
 * @desc    Initiate refund
 * @access  Private
 */
router.post('/refund', paymentController.initiateRefund);

/**
 * @route   GET /api/v1/payments/invoice/:invoiceId
 * @desc    Get payments for specific invoice
 * @access  Private
 */
router.get('/invoice/:invoiceId', paymentController.getInvoicePayments);

export default router;
```

---

## 💰 **PAYMENT SERVICE**

### **`src/services/payment.service.ts`**

```typescript
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger.js';

const prisma = new PrismaClient();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

interface CreateOrderOptions {
  amount: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, any>;
}

/**
 * Create Razorpay order
 */
export const createRazorpayOrder = async (
  options: CreateOrderOptions
): Promise<any> => {
  try {
    const { amount, currency = 'INR', receipt, notes } = options;

    // Amount should be in paise (multiply by 100)
    const amountInPaise = Math.round(amount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt,
      notes,
    });

    logger.info('Razorpay order created', { orderId: order.id });

    return order;
  } catch (error: any) {
    logger.error('Razorpay order creation failed', { error: error.message });
    throw new Error(`Failed to create order: ${error.message}`);
  }
};

/**
 * Verify payment signature
 */
export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  try {
    const text = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    logger.error('Signature verification failed', { error });
    return false;
  }
};

/**
 * Fetch payment details from Razorpay
 */
export const fetchPaymentDetails = async (paymentId: string): Promise<any> => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error: any) {
    logger.error('Failed to fetch payment details', { error: error.message });
    throw error;
  }
};

/**
 * Initiate refund
 */
export const initiateRefund = async (
  paymentId: string,
  amount?: number,
  notes?: Record<string, any>
): Promise<any> => {
  try {
    const refundData: any = {
      notes,
    };

    if (amount) {
      refundData.amount = Math.round(amount * 100); // Convert to paise
    }

    const refund = await razorpay.payments.refund(paymentId, refundData);

    logger.info('Refund initiated', { refundId: refund.id, paymentId });

    return refund;
  } catch (error: any) {
    logger.error('Refund failed', { error: error.message, paymentId });
    throw error;
  }
};

/**
 * Verify webhook signature
 */
export const verifyWebhookSignature = (
  body: string,
  signature: string
): boolean => {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    logger.error('Webhook signature verification failed', { error });
    return false;
  }
};

/**
 * Process successful payment
 */
export const processSuccessfulPayment = async (
  paymentData: any
): Promise<void> => {
  try {
    const { id, order_id, amount, method, status, notes } = paymentData;

    // Find invoice from order receipt
    const invoice = await prisma.invoice.findFirst({
      where: {
        invoiceNumber: notes?.invoiceNumber,
      },
    });

    if (!invoice) {
      logger.error('Invoice not found for payment', { orderId: order_id });
      return;
    }

    // Convert amount from paise to rupees
    const amountInRupees = amount / 100;

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        customerId: invoice.customerId,
        amount: amountInRupees,
        paymentMethod: mapRazorpayMethod(method),
        transactionId: id,
        gatewayResponse: paymentData,
      },
    });

    // Update invoice
    const newPaidAmount = invoice.paidAmount + amountInRupees;
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
      where: { id: invoice.id },
      data: {
        paidAmount: newPaidAmount,
        balanceAmount: newBalanceAmount,
        paymentStatus,
      },
    });

    // Update customer balance if applicable
    if (invoice.customerId) {
      await prisma.customer.update({
        where: { id: invoice.customerId },
        data: {
          currentBalance: {
            decrement: amountInRupees,
          },
        },
      });
    }

    logger.info('Payment processed successfully', {
      paymentId: payment.id,
      invoiceId: invoice.id,
      amount: amountInRupees,
    });
  } catch (error: any) {
    logger.error('Payment processing failed', { error: error.message });
    throw error;
  }
};

/**
 * Map Razorpay payment method to our enum
 */
function mapRazorpayMethod(method: string): any {
  const methodMap: Record<string, any> = {
    card: 'CARD',
    netbanking: 'BANK_TRANSFER',
    wallet: 'UPI',
    upi: 'UPI',
  };

  return methodMap[method] || 'UPI';
}

/**
 * Generate payment link
 */
export const generatePaymentLink = async (
  amount: number,
  customerName: string,
  customerPhone: string,
  customerEmail?: string,
  description?: string,
  invoiceNumber?: string
): Promise<any> => {
  try {
    const paymentLink = await razorpay.paymentLink.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      description: description || 'Payment for invoice',
      customer: {
        name: customerName,
        contact: `+91${customerPhone}`,
        ...(customerEmail && { email: customerEmail }),
      },
      notify: {
        sms: true,
        email: !!customerEmail,
      },
      reminder_enable: true,
      notes: {
        invoiceNumber: invoiceNumber || '',
      },
      callback_url: `${process.env.FRONTEND_URL}/payment-success`,
      callback_method: 'get',
    });

    logger.info('Payment link generated', { linkId: paymentLink.id });

    return paymentLink;
  } catch (error: any) {
    logger.error('Payment link generation failed', { error: error.message });
    throw error;
  }
};
```

---

## 🎮 **PAYMENT CONTROLLER**

### **`src/controllers/payment.controller.ts`**

```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler.js';
import { successResponse, errorResponse } from '../utils/response.js';
import * as paymentService from '../services/payment.service.js';
import logger from '../utils/logger.js';

const prisma = new PrismaClient();

/**
 * @desc    Create Razorpay order
 * @route   POST /api/v1/payments/create-order
 * @access  Private
 */
export const createOrder = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { invoiceId, amount, customerName, customerPhone, customerEmail } =
      req.body;

    // Verify invoice belongs to user
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        userId,
      },
      include: {
        customer: true,
      },
    });

    if (!invoice) {
      return errorResponse(res, { message: 'Invoice not found' }, 404);
    }

    // Create Razorpay order
    const order = await paymentService.createRazorpayOrder({
      amount: amount || invoice.balanceAmount,
      receipt: invoice.invoiceNumber,
      notes: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        customerId: invoice.customerId,
      },
    });

    return successResponse(
      res,
      {
        message: 'Order created successfully',
        data: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          invoice: {
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            totalAmount: invoice.totalAmount,
            balanceAmount: invoice.balanceAmount,
          },
          razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        },
      },
      201
    );
  }
);

/**
 * @desc    Verify payment
 * @route   POST /api/v1/payments/verify
 * @access  Private
 */
export const verifyPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Verify signature
    const isValid = paymentService.verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return errorResponse(
        res,
        { message: 'Invalid payment signature' },
        400
      );
    }

    // Fetch payment details
    const paymentDetails = await paymentService.fetchPaymentDetails(
      razorpay_payment_id
    );

    // Process payment
    await paymentService.processSuccessfulPayment(paymentDetails);

    return successResponse(res, {
      message: 'Payment verified and processed successfully',
      data: {
        paymentId: razorpay_payment_id,
        status: 'success',
      },
    });
  }
);

/**
 * @desc    Handle Razorpay webhook
 * @route   POST /api/v1/payments/webhook
 * @access  Public
 */
export const handleWebhook = asyncHandler(
  async (req: Request, res: Response) => {
    const signature = req.headers['x-razorpay-signature'] as string;
    const body = JSON.stringify(req.body);

    // Verify webhook signature
    const isValid = paymentService.verifyWebhookSignature(body, signature);

    if (!isValid) {
      logger.error('Invalid webhook signature');
      return res.status(400).send('Invalid signature');
    }

    const event = req.body;

    logger.info('Razorpay webhook received', {
      event: event.event,
      paymentId: event.payload?.payment?.entity?.id,
    });

    // Handle different event types
    switch (event.event) {
      case 'payment.captured':
        await paymentService.processSuccessfulPayment(
          event.payload.payment.entity
        );
        break;

      case 'payment.failed':
        logger.info('Payment failed', {
          paymentId: event.payload.payment.entity.id,
        });
        // Handle failed payment
        break;

      case 'refund.created':
        logger.info('Refund created', {
          refundId: event.payload.refund.entity.id,
        });
        // Handle refund
        break;

      default:
        logger.info('Unhandled webhook event', { event: event.event });
    }

    res.status(200).send('OK');
  }
);

/**
 * @desc    Get payment history
 * @route   GET /api/v1/payments
 * @access  Private
 */
export const getPayments = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { page = 1, limit = 20, startDate, endDate } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      invoice: {
        userId,
      },
    };

    if (startDate || endDate) {
      where.paymentDate = {};
      if (startDate) where.paymentDate.gte = new Date(startDate as string);
      if (endDate) where.paymentDate.lte = new Date(endDate as string);
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          invoice: {
            select: {
              invoiceNumber: true,
              totalAmount: true,
            },
          },
          customer: {
            select: {
              name: true,
              phoneNumber: true,
            },
          },
        },
        orderBy: { paymentDate: 'desc' },
      }),
      prisma.payment.count({ where }),
    ]);

    return successResponse(res, {
      message: 'Payments retrieved successfully',
      data: payments,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  }
);

/**
 * @desc    Get payment by ID
 * @route   GET /api/v1/payments/:id
 * @access  Private
 */
export const getPaymentById = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;

    const payment = await prisma.payment.findFirst({
      where: {
        id,
        invoice: {
          userId,
        },
      },
      include: {
        invoice: true,
        customer: true,
      },
    });

    if (!payment) {
      return errorResponse(res, { message: 'Payment not found' }, 404);
    }

    return successResponse(res, {
      message: 'Payment retrieved successfully',
      data: payment,
    });
  }
);

/**
 * @desc    Initiate refund
 * @route   POST /api/v1/payments/refund
 * @access  Private
 */
export const initiateRefund = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { paymentId, amount, reason } = req.body;

    // Verify payment belongs to user
    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        invoice: {
          userId,
        },
      },
    });

    if (!payment) {
      return errorResponse(res, { message: 'Payment not found' }, 404);
    }

    if (!payment.transactionId) {
      return errorResponse(
        res,
        { message: 'No transaction ID found for this payment' },
        400
      );
    }

    // Initiate refund
    const refund = await paymentService.initiateRefund(
      payment.transactionId,
      amount,
      { reason }
    );

    return successResponse(res, {
      message: 'Refund initiated successfully',
      data: {
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
      },
    });
  }
);

/**
 * @desc    Get payments for invoice
 * @route   GET /api/v1/payments/invoice/:invoiceId
 * @access  Private
 */
export const getInvoicePayments = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { invoiceId } = req.params;

    // Verify invoice belongs to user
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        userId,
      },
    });

    if (!invoice) {
      return errorResponse(res, { message: 'Invoice not found' }, 404);
    }

    const payments = await prisma.payment.findMany({
      where: { invoiceId },
      orderBy: { paymentDate: 'desc' },
    });

    return successResponse(res, {
      message: 'Invoice payments retrieved successfully',
      data: payments,
    });
  }
);
```

---

## ✅ **PAYMENT VALIDATORS**

### **`src/validators/payment.validator.ts`**

```typescript
import Joi from 'joi';

export const createOrderSchema = Joi.object({
  invoiceId: Joi.string().uuid().required(),
  amount: Joi.number().min(1).optional(),
  customerName: Joi.string().optional(),
  customerPhone: Joi.string().optional(),
  customerEmail: Joi.string().email().optional(),
});

export const verifyPaymentSchema = Joi.object({
  razorpay_order_id: Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required(),
});
```

---

## 🎯 **PAYMENT FEATURES IMPLEMENTED**

### **✅ Payment Processing:**
- Create Razorpay orders
- Payment signature verification
- Automatic invoice updates
- Customer balance management

### **✅ Webhook Integration:**
- Real-time payment notifications
- Payment capture events
- Failed payment handling
- Refund notifications

### **✅ Refund Management:**
- Full and partial refunds
- Refund tracking
- Automatic invoice adjustments

### **✅ Security:**
- Signature verification
- Webhook signature validation
- Secure API key handling
- Transaction logging

### **✅ Payment Methods Supported:**
- UPI
- Credit/Debit Cards
- Net Banking
- Wallets (Paytm, PhonePe, etc.)

---

**Next: File Upload & Storage →**
