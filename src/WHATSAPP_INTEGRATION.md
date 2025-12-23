# 💬 **WHATSAPP BUSINESS API - COMPLETE INTEGRATION**

## 📋 **PART 6: WHATSAPP AUTOMATION & MESSAGING**

---

## 🔧 **WHATSAPP CONFIGURATION**

### **Setup WhatsApp Business API**

1. **Create Meta Business Account:**
   - Go to https://business.facebook.com
   - Create or select business account
   - Set up WhatsApp Business API

2. **Get Credentials:**
   ```bash
   WHATSAPP_API_URL=https://graph.facebook.com/v18.0
   WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
   WHATSAPP_ACCESS_TOKEN=your-permanent-access-token
   WHATSAPP_VERIFY_TOKEN=your-custom-verify-token
   ```

3. **Setup Webhook:**
   - Webhook URL: `https://your-domain.repl.co/api/v1/whatsapp/webhook`
   - Verify Token: Your custom token
   - Subscribe to: messages, message_status

---

## 🛣️ **WHATSAPP ROUTES**

### **`src/routes/whatsapp.routes.ts`**

```typescript
import { Router } from 'express';
import * as whatsappController from '../controllers/whatsapp.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  sendMessageSchema,
  sendInvoiceSchema,
  sendCatalogSchema,
} from '../validators/whatsapp.validator.js';

const router = Router();

/**
 * @route   GET /api/v1/whatsapp/webhook
 * @desc    Verify WhatsApp webhook
 * @access  Public
 */
router.get('/webhook', whatsappController.verifyWebhook);

/**
 * @route   POST /api/v1/whatsapp/webhook
 * @desc    Receive WhatsApp webhook events
 * @access  Public
 */
router.post('/webhook', whatsappController.handleWebhook);

// Protected routes
router.use(authenticate);

/**
 * @route   POST /api/v1/whatsapp/send-message
 * @desc    Send text message
 * @access  Private
 */
router.post(
  '/send-message',
  validate(sendMessageSchema),
  whatsappController.sendMessage
);

/**
 * @route   POST /api/v1/whatsapp/send-invoice
 * @desc    Send invoice via WhatsApp
 * @access  Private
 */
router.post(
  '/send-invoice',
  validate(sendInvoiceSchema),
  whatsappController.sendInvoice
);

/**
 * @route   POST /api/v1/whatsapp/send-catalog
 * @desc    Send product catalog
 * @access  Private
 */
router.post(
  '/send-catalog',
  validate(sendCatalogSchema),
  whatsappController.sendCatalog
);

/**
 * @route   POST /api/v1/whatsapp/send-payment-reminder
 * @desc    Send payment reminder
 * @access  Private
 */
router.post(
  '/send-payment-reminder',
  whatsappController.sendPaymentReminder
);

/**
 * @route   POST /api/v1/whatsapp/send-template
 * @desc    Send template message
 * @access  Private
 */
router.post('/send-template', whatsappController.sendTemplateMessage);

/**
 * @route   GET /api/v1/whatsapp/messages
 * @desc    Get message history
 * @access  Private
 */
router.get('/messages', whatsappController.getMessages);

/**
 * @route   GET /api/v1/whatsapp/messages/:id
 * @desc    Get message status
 * @access  Private
 */
router.get('/messages/:id', whatsappController.getMessageStatus);

/**
 * @route   GET /api/v1/whatsapp/templates
 * @desc    Get available message templates
 * @access  Private
 */
router.get('/templates', whatsappController.getTemplates);

/**
 * @route   POST /api/v1/whatsapp/bulk-send
 * @desc    Send bulk messages
 * @access  Private
 */
router.post('/bulk-send', whatsappController.sendBulkMessages);

export default router;
```

---

## 📱 **WHATSAPP SERVICE**

### **`src/services/whatsapp.service.ts`**

```typescript
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger.js';

const prisma = new PrismaClient();

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

interface SendMessageOptions {
  to: string;
  type: 'text' | 'template' | 'document' | 'image';
  content: any;
  userId?: string;
  referenceId?: string;
}

/**
 * Send WhatsApp message
 */
export const sendWhatsAppMessage = async (
  options: SendMessageOptions
): Promise<any> => {
  try {
    const { to, type, content, userId, referenceId } = options;

    // Format phone number (remove +91 if present, WhatsApp API expects without country code in some cases)
    const phoneNumber = to.startsWith('91') ? to : `91${to.replace(/^\+/, '')}`;

    // Prepare message payload based on type
    let messagePayload: any = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
    };

    switch (type) {
      case 'text':
        messagePayload.type = 'text';
        messagePayload.text = { body: content };
        break;

      case 'template':
        messagePayload.type = 'template';
        messagePayload.template = content;
        break;

      case 'document':
        messagePayload.type = 'document';
        messagePayload.document = content;
        break;

      case 'image':
        messagePayload.type = 'image';
        messagePayload.image = content;
        break;

      default:
        throw new Error(`Unsupported message type: ${type}`);
    }

    // Send message via WhatsApp API
    const response = await axios.post(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      messagePayload,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Save message to database
    const messageRecord = await prisma.whatsAppMessage.create({
      data: {
        phoneNumber,
        messageType: type === 'text' ? 'TEXT' : type.toUpperCase() as any,
        content: typeof content === 'string' ? content : JSON.stringify(content),
        status: 'SENT',
        messageId: response.data.messages[0].id,
        sentAt: new Date(),
        ...(referenceId && { invoiceId: referenceId }),
      },
    });

    logger.info('WhatsApp message sent successfully', {
      messageId: response.data.messages[0].id,
      to: phoneNumber,
    });

    return {
      success: true,
      messageId: response.data.messages[0].id,
      recordId: messageRecord.id,
    };
  } catch (error: any) {
    logger.error('WhatsApp message send failed', {
      error: error.message,
      response: error.response?.data,
    });

    // Save failed message to database
    if (options.userId) {
      await prisma.whatsAppMessage.create({
        data: {
          phoneNumber: options.to,
          messageType: 'TEXT',
          content: typeof options.content === 'string' ? options.content : JSON.stringify(options.content),
          status: 'FAILED',
          errorMessage: error.message,
        },
      });
    }

    throw error;
  }
};

/**
 * Send invoice via WhatsApp
 */
export const sendInvoiceWhatsApp = async (
  invoiceId: string,
  userId: string
): Promise<any> => {
  // Get invoice details
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId },
    include: {
      customer: true,
      items: true,
    },
  });

  if (!invoice) {
    throw new Error('Invoice not found');
  }

  if (!invoice.customer) {
    throw new Error('Invoice has no customer associated');
  }

  // Generate invoice message
  const message = formatInvoiceMessage(invoice);

  // Send message
  const result = await sendWhatsAppMessage({
    to: invoice.customer.phoneNumber,
    type: 'text',
    content: message,
    userId,
    referenceId: invoiceId,
  });

  // Update invoice as sent
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      whatsappSent: true,
      whatsappSentAt: new Date(),
    },
  });

  return result;
};

/**
 * Send payment reminder
 */
export const sendPaymentReminder = async (
  invoiceId: string,
  userId: string
): Promise<any> => {
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId },
    include: {
      customer: true,
      user: true,
    },
  });

  if (!invoice || !invoice.customer) {
    throw new Error('Invoice or customer not found');
  }

  const message = formatPaymentReminderMessage(invoice);

  return sendWhatsAppMessage({
    to: invoice.customer.phoneNumber,
    type: 'text',
    content: message,
    userId,
    referenceId: invoiceId,
  });
};

/**
 * Send template message
 */
export const sendTemplateMessage = async (
  to: string,
  templateName: string,
  parameters: any[],
  userId: string
): Promise<any> => {
  const templateContent = {
    name: templateName,
    language: { code: 'en' },
    components: [
      {
        type: 'body',
        parameters,
      },
    ],
  };

  return sendWhatsAppMessage({
    to,
    type: 'template',
    content: templateContent,
    userId,
  });
};

/**
 * Send product catalog
 */
export const sendProductCatalog = async (
  to: string,
  userId: string
): Promise<any> => {
  // Get user's products
  const products = await prisma.product.findMany({
    where: { userId, isActive: true },
    take: 20,
    select: {
      name: true,
      sellingPrice: true,
      currentStock: true,
      category: true,
    },
  });

  const catalogMessage = formatCatalogMessage(products);

  return sendWhatsAppMessage({
    to,
    type: 'text',
    content: catalogMessage,
    userId,
  });
};

/**
 * Format invoice message
 */
function formatInvoiceMessage(invoice: any): string {
  const storeName = invoice.user?.storeName || 'Retail Bandhu';
  const customerName = invoice.customer?.name || 'Customer';
  
  let message = `🧾 *${storeName}*\n\n`;
  message += `नमस्ते ${customerName} जी,\n\n`;
  message += `📄 Invoice: *${invoice.invoiceNumber}*\n`;
  message += `📅 Date: ${new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}\n\n`;
  message += `*Items:*\n`;
  message += `━━━━━━━━━━━━━━━\n`;

  invoice.items.forEach((item: any, index: number) => {
    message += `${index + 1}. ${item.name}\n`;
    message += `   ${item.quantity} ${item.unit} × ₹${item.price} = ₹${item.total}\n`;
  });

  message += `━━━━━━━━━━━━━━━\n\n`;
  message += `💰 *Total Amount:* ₹${invoice.totalAmount}\n`;
  
  if (invoice.balanceAmount > 0) {
    message += `⚠️ *Balance Due:* ₹${invoice.balanceAmount}\n`;
    if (invoice.dueDate) {
      message += `📆 *Due Date:* ${new Date(invoice.dueDate).toLocaleDateString('en-IN')}\n`;
    }
  } else {
    message += `✅ *Status:* PAID\n`;
  }

  message += `\n🙏 धन्यवाद!\n`;
  message += `For queries, contact us.`;

  return message;
}

/**
 * Format payment reminder message
 */
function formatPaymentReminderMessage(invoice: any): string {
  const storeName = invoice.user?.storeName || 'Retail Bandhu';
  const customerName = invoice.customer?.name || 'Customer';
  
  let message = `⏰ *Payment Reminder*\n\n`;
  message += `नमस्ते ${customerName} जी,\n\n`;
  message += `यह एक friendly reminder है कि आपका payment pending है:\n\n`;
  message += `📄 Invoice: *${invoice.invoiceNumber}*\n`;
  message += `📅 Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}\n`;
  message += `💰 *Pending Amount:* ₹${invoice.balanceAmount}\n`;
  
  if (invoice.dueDate) {
    const dueDate = new Date(invoice.dueDate);
    const today = new Date();
    const isOverdue = dueDate < today;
    
    message += `📆 Due Date: ${dueDate.toLocaleDateString('en-IN')}`;
    if (isOverdue) {
      message += ` ⚠️ (Overdue)\n`;
    } else {
      message += `\n`;
    }
  }

  message += `\n🙏 कृपया जल्द से जल्द payment करें।\n`;
  message += `\nThank you!\n`;
  message += `- ${storeName}`;

  return message;
}

/**
 * Format catalog message
 */
function formatCatalogMessage(products: any[]): string {
  let message = `🛒 *Our Product Catalog*\n\n`;
  message += `हमारे products देखें:\n\n`;

  // Group by category
  const grouped = products.reduce((acc, product) => {
    const category = product.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {} as Record<string, any[]>);

  Object.entries(grouped).forEach(([category, items]) => {
    message += `📦 *${category}*\n`;
    message += `━━━━━━━━━━━━━━━\n`;
    
    items.forEach((product, index) => {
      message += `${index + 1}. ${product.name}\n`;
      message += `   Price: ₹${product.sellingPrice}`;
      if (product.currentStock > 0) {
        message += ` (In Stock)\n`;
      } else {
        message += ` (Out of Stock)\n`;
      }
    });
    
    message += `\n`;
  });

  message += `🛍️ Order करने के लिए हमसे संपर्क करें!\n`;
  message += `\nThank you! 🙏`;

  return message;
}

/**
 * Update message status from webhook
 */
export const updateMessageStatus = async (
  messageId: string,
  status: string
): Promise<void> => {
  const statusMap: Record<string, any> = {
    sent: { status: 'SENT', sentAt: new Date() },
    delivered: { status: 'DELIVERED', deliveredAt: new Date() },
    read: { status: 'READ', readAt: new Date() },
    failed: { status: 'FAILED' },
  };

  const updateData = statusMap[status.toLowerCase()];
  
  if (updateData) {
    await prisma.whatsAppMessage.updateMany({
      where: { messageId },
      data: updateData,
    });
  }
};
```

---

## 🎮 **WHATSAPP CONTROLLER**

### **`src/controllers/whatsapp.controller.ts`**

```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler.js';
import { successResponse, errorResponse } from '../utils/response.js';
import * as whatsappService from '../services/whatsapp.service.js';
import logger from '../utils/logger.js';

const prisma = new PrismaClient();

/**
 * @desc    Verify WhatsApp webhook
 * @route   GET /api/v1/whatsapp/webhook
 * @access  Public
 */
export const verifyWebhook = asyncHandler(
  async (req: Request, res: Response) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      logger.info('WhatsApp webhook verified');
      res.status(200).send(challenge);
    } else {
      logger.error('WhatsApp webhook verification failed');
      res.sendStatus(403);
    }
  }
);

/**
 * @desc    Handle WhatsApp webhook events
 * @route   POST /api/v1/whatsapp/webhook
 * @access  Public
 */
export const handleWebhook = asyncHandler(
  async (req: Request, res: Response) => {
    const body = req.body;

    logger.info('WhatsApp webhook received', { body });

    // Process webhook data
    if (body.object === 'whatsapp_business_account') {
      body.entry?.forEach((entry: any) => {
        entry.changes?.forEach((change: any) => {
          if (change.value?.statuses) {
            // Handle message status updates
            change.value.statuses.forEach((status: any) => {
              whatsappService.updateMessageStatus(
                status.id,
                status.status
              );
            });
          }

          if (change.value?.messages) {
            // Handle incoming messages
            change.value.messages.forEach((message: any) => {
              logger.info('Incoming message', { message });
              // You can implement auto-reply logic here
            });
          }
        });
      });
    }

    res.sendStatus(200);
  }
);

/**
 * @desc    Send text message
 * @route   POST /api/v1/whatsapp/send-message
 * @access  Private
 */
export const sendMessage = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { phoneNumber, message } = req.body;

    const result = await whatsappService.sendWhatsAppMessage({
      to: phoneNumber,
      type: 'text',
      content: message,
      userId,
    });

    return successResponse(res, {
      message: 'Message sent successfully',
      data: result,
    });
  }
);

/**
 * @desc    Send invoice via WhatsApp
 * @route   POST /api/v1/whatsapp/send-invoice
 * @access  Private
 */
export const sendInvoice = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { invoiceId } = req.body;

    const result = await whatsappService.sendInvoiceWhatsApp(
      invoiceId,
      userId!
    );

    return successResponse(res, {
      message: 'Invoice sent successfully',
      data: result,
    });
  }
);

/**
 * @desc    Send product catalog
 * @route   POST /api/v1/whatsapp/send-catalog
 * @access  Private
 */
export const sendCatalog = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { phoneNumber } = req.body;

    const result = await whatsappService.sendProductCatalog(
      phoneNumber,
      userId!
    );

    return successResponse(res, {
      message: 'Catalog sent successfully',
      data: result,
    });
  }
);

/**
 * @desc    Send payment reminder
 * @route   POST /api/v1/whatsapp/send-payment-reminder
 * @access  Private
 */
export const sendPaymentReminder = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { invoiceId } = req.body;

    const result = await whatsappService.sendPaymentReminder(
      invoiceId,
      userId!
    );

    return successResponse(res, {
      message: 'Payment reminder sent successfully',
      data: result,
    });
  }
);

/**
 * @desc    Send template message
 * @route   POST /api/v1/whatsapp/send-template
 * @access  Private
 */
export const sendTemplateMessage = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { phoneNumber, templateName, parameters } = req.body;

    const result = await whatsappService.sendTemplateMessage(
      phoneNumber,
      templateName,
      parameters,
      userId!
    );

    return successResponse(res, {
      message: 'Template message sent successfully',
      data: result,
    });
  }
);

/**
 * @desc    Get message history
 * @route   GET /api/v1/whatsapp/messages
 * @access  Private
 */
export const getMessages = asyncHandler(
  async (req: Request, res: Response) => {
    const { page = 1, limit = 20, status, phoneNumber } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (status) where.status = status;
    if (phoneNumber) where.phoneNumber = { contains: phoneNumber as string };

    const [messages, total] = await Promise.all([
      prisma.whatsAppMessage.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.whatsAppMessage.count({ where }),
    ]);

    return successResponse(res, {
      message: 'Messages retrieved successfully',
      data: messages,
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
 * @desc    Get message status
 * @route   GET /api/v1/whatsapp/messages/:id
 * @access  Private
 */
export const getMessageStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const message = await prisma.whatsAppMessage.findUnique({
      where: { id },
    });

    if (!message) {
      return errorResponse(res, { message: 'Message not found' }, 404);
    }

    return successResponse(res, {
      message: 'Message status retrieved successfully',
      data: message,
    });
  }
);

/**
 * @desc    Get available templates
 * @route   GET /api/v1/whatsapp/templates
 * @access  Private
 */
export const getTemplates = asyncHandler(
  async (req: Request, res: Response) => {
    // Return predefined templates
    const templates = [
      {
        name: 'invoice_notification',
        description: 'Send invoice to customer',
        language: 'en',
      },
      {
        name: 'payment_reminder',
        description: 'Remind customer about pending payment',
        language: 'en',
      },
      {
        name: 'order_confirmation',
        description: 'Confirm order with customer',
        language: 'en',
      },
    ];

    return successResponse(res, {
      message: 'Templates retrieved successfully',
      data: templates,
    });
  }
);

/**
 * @desc    Send bulk messages
 * @route   POST /api/v1/whatsapp/bulk-send
 * @access  Private
 */
export const sendBulkMessages = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { customers, message } = req.body;

    const results = [];

    for (const customer of customers) {
      try {
        const result = await whatsappService.sendWhatsAppMessage({
          to: customer.phoneNumber,
          type: 'text',
          content: message,
          userId,
        });
        results.push({ customer: customer.name, success: true, ...result });
      } catch (error: any) {
        results.push({
          customer: customer.name,
          success: false,
          error: error.message,
        });
      }

      // Rate limiting - wait 1 second between messages
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return successResponse(res, {
      message: 'Bulk messages processed',
      data: results,
    });
  }
);
```

---

## ✅ **WHATSAPP VALIDATORS**

### **`src/validators/whatsapp.validator.ts`**

```typescript
import Joi from 'joi';

export const sendMessageSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Please provide a valid Indian phone number',
    }),
  message: Joi.string().required().max(4096),
});

export const sendInvoiceSchema = Joi.object({
  invoiceId: Joi.string().uuid().required(),
});

export const sendCatalogSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required(),
});
```

---

## 🎯 **WHATSAPP FEATURES IMPLEMENTED**

### **✅ Messaging:**
- Send text messages
- Send invoice details
- Send product catalogs
- Send payment reminders
- Send template messages
- Bulk messaging

### **✅ Webhook Integration:**
- Webhook verification
- Message status updates (sent, delivered, read)
- Incoming message handling
- Auto-reply capability (extendable)

### **✅ Message Tracking:**
- Save all messages to database
- Track delivery status
- Message history
- Failed message logging

### **✅ Business Features:**
- Hindi + English (Hinglish) support
- Professional invoice formatting
- Automated payment reminders
- Product catalog sharing
- Customer engagement

---

**Next: Payment Integration →**
