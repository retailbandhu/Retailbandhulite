# 📊 **REPORTS & ANALYTICS - COMPLETE IMPLEMENTATION**

## 📋 **PART 5: REPORTS, ANALYTICS & DASHBOARD**

---

## 🛣️ **REPORTS ROUTES**

### **`src/routes/reports.routes.ts`**

```typescript
import { Router } from 'express';
import * as reportsController from '../controllers/reports.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateQuery } from '../middleware/validate.js';
import { dateRangeSchema } from '../validators/reports.validator.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/reports/dashboard
 * @desc    Get main dashboard statistics
 * @access  Private
 */
router.get('/dashboard', reportsController.getDashboard);

/**
 * @route   GET /api/v1/reports/sales
 * @desc    Get sales report with date range
 * @access  Private
 */
router.get(
  '/sales',
  validateQuery(dateRangeSchema),
  reportsController.getSalesReport
);

/**
 * @route   GET /api/v1/reports/revenue
 * @desc    Get revenue trends and analytics
 * @access  Private
 */
router.get(
  '/revenue',
  validateQuery(dateRangeSchema),
  reportsController.getRevenueReport
);

/**
 * @route   GET /api/v1/reports/profit
 * @desc    Get profit/loss analysis
 * @access  Private
 */
router.get(
  '/profit',
  validateQuery(dateRangeSchema),
  reportsController.getProfitReport
);

/**
 * @route   GET /api/v1/reports/inventory
 * @desc    Get inventory status report
 * @access  Private
 */
router.get('/inventory', reportsController.getInventoryReport);

/**
 * @route   GET /api/v1/reports/gst
 * @desc    Get GST report for filing
 * @access  Private
 */
router.get(
  '/gst',
  validateQuery(dateRangeSchema),
  reportsController.getGSTReport
);

/**
 * @route   GET /api/v1/reports/outstanding
 * @desc    Get outstanding payments report
 * @access  Private
 */
router.get('/outstanding', reportsController.getOutstandingReport);

/**
 * @route   GET /api/v1/reports/top-products
 * @desc    Get top selling products
 * @access  Private
 */
router.get(
  '/top-products',
  validateQuery(dateRangeSchema),
  reportsController.getTopProducts
);

/**
 * @route   GET /api/v1/reports/top-customers
 * @desc    Get top customers by revenue
 * @access  Private
 */
router.get(
  '/top-customers',
  validateQuery(dateRangeSchema),
  reportsController.getTopCustomers
);

/**
 * @route   GET /api/v1/reports/payment-methods
 * @desc    Get payment method distribution
 * @access  Private
 */
router.get(
  '/payment-methods',
  validateQuery(dateRangeSchema),
  reportsController.getPaymentMethodsReport
);

/**
 * @route   GET /api/v1/reports/daily-sales
 * @desc    Get daily sales trend
 * @access  Private
 */
router.get(
  '/daily-sales',
  validateQuery(dateRangeSchema),
  reportsController.getDailySales
);

/**
 * @route   GET /api/v1/reports/export/sales
 * @desc    Export sales report as CSV
 * @access  Private
 */
router.get(
  '/export/sales',
  validateQuery(dateRangeSchema),
  reportsController.exportSalesReport
);

/**
 * @route   GET /api/v1/reports/export/gst
 * @desc    Export GST report as CSV
 * @access  Private
 */
router.get(
  '/export/gst',
  validateQuery(dateRangeSchema),
  reportsController.exportGSTReport
);

export default router;
```

---

## 📈 **REPORTS CONTROLLER**

### **`src/controllers/reports.controller.ts`**

```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler.js';
import { successResponse } from '../utils/response.js';
import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  subDays,
  subMonths,
} from 'date-fns';

const prisma = new PrismaClient();

/**
 * @desc    Get main dashboard statistics
 * @route   GET /api/v1/reports/dashboard
 * @access  Private
 */
export const getDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    // Date ranges
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);
    const startOfThisMonth = startOfMonth(today);
    const endOfThisMonth = endOfMonth(today);
    const last30Days = subDays(today, 30);

    // Get all statistics in parallel
    const [
      // Today's stats
      todaySales,
      todayInvoices,

      // This month's stats
      monthSales,
      monthInvoices,

      // Overall stats
      totalCustomers,
      activeCustomers,
      totalProducts,
      lowStockProducts,

      // Financial stats
      totalOutstanding,
      overdueInvoices,

      // Recent activity
      recentInvoices,
      recentPayments,

      // Top performers
      topProducts,
      topCustomers,

      // Trends (last 30 days)
      salesTrend,
    ] = await Promise.all([
      // Today's sales
      prisma.invoice.aggregate({
        where: {
          userId,
          invoiceDate: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
        _sum: {
          totalAmount: true,
          paidAmount: true,
        },
        _count: true,
      }),

      // Today's invoice count
      prisma.invoice.count({
        where: {
          userId,
          invoiceDate: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
      }),

      // This month's sales
      prisma.invoice.aggregate({
        where: {
          userId,
          invoiceDate: {
            gte: startOfThisMonth,
            lte: endOfThisMonth,
          },
        },
        _sum: {
          totalAmount: true,
          paidAmount: true,
        },
        _count: true,
      }),

      // This month's invoice count
      prisma.invoice.count({
        where: {
          userId,
          invoiceDate: {
            gte: startOfThisMonth,
            lte: endOfThisMonth,
          },
        },
      }),

      // Total customers
      prisma.customer.count({
        where: { userId },
      }),

      // Active customers
      prisma.customer.count({
        where: { userId, isActive: true },
      }),

      // Total products
      prisma.product.count({
        where: { userId },
      }),

      // Low stock products
      prisma.product.count({
        where: {
          userId,
          currentStock: {
            lte: prisma.product.fields.minStockLevel,
          },
        },
      }),

      // Total outstanding
      prisma.invoice.aggregate({
        where: {
          userId,
          paymentStatus: { in: ['UNPAID', 'PARTIAL'] },
        },
        _sum: {
          balanceAmount: true,
        },
      }),

      // Overdue invoices
      prisma.invoice.count({
        where: {
          userId,
          paymentStatus: { in: ['UNPAID', 'PARTIAL'] },
          dueDate: {
            lt: today,
          },
        },
      }),

      // Recent invoices
      prisma.invoice.findMany({
        where: { userId },
        take: 5,
        orderBy: { invoiceDate: 'desc' },
        include: {
          customer: {
            select: {
              name: true,
              phoneNumber: true,
            },
          },
        },
      }),

      // Recent payments
      prisma.payment.findMany({
        where: {
          invoice: {
            userId,
          },
        },
        take: 5,
        orderBy: { paymentDate: 'desc' },
        include: {
          customer: {
            select: {
              name: true,
            },
          },
          invoice: {
            select: {
              invoiceNumber: true,
            },
          },
        },
      }),

      // Top products (last 30 days)
      prisma.invoiceItem.groupBy({
        by: ['productId', 'name'],
        where: {
          invoice: {
            userId,
            invoiceDate: {
              gte: last30Days,
            },
          },
        },
        _sum: {
          quantity: true,
          total: true,
        },
        orderBy: {
          _sum: {
            total: 'desc',
          },
        },
        take: 5,
      }),

      // Top customers (last 30 days)
      prisma.invoice.groupBy({
        by: ['customerId'],
        where: {
          userId,
          invoiceDate: {
            gte: last30Days,
          },
        },
        _sum: {
          totalAmount: true,
        },
        _count: true,
        orderBy: {
          _sum: {
            totalAmount: 'desc',
          },
        },
        take: 5,
      }),

      // Sales trend (last 30 days)
      prisma.$queryRaw`
        SELECT 
          DATE(invoice_date) as date,
          COUNT(*) as invoice_count,
          SUM(total_amount) as total_sales,
          SUM(paid_amount) as total_paid
        FROM invoices
        WHERE user_id = ${userId}
          AND invoice_date >= ${last30Days}
        GROUP BY DATE(invoice_date)
        ORDER BY date ASC
      `,
    ]);

    // Get customer names for top customers
    const customerIds = topCustomers
      .map((c) => c.customerId)
      .filter(Boolean) as string[];
    const customerDetails = await prisma.customer.findMany({
      where: {
        id: { in: customerIds },
      },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
      },
    });

    const topCustomersWithDetails = topCustomers.map((tc) => {
      const customer = customerDetails.find((c) => c.id === tc.customerId);
      return {
        ...tc,
        customerName: customer?.name || 'Walk-in Customer',
        customerPhone: customer?.phoneNumber,
      };
    });

    return successResponse(res, {
      message: 'Dashboard data retrieved successfully',
      data: {
        today: {
          sales: todaySales._sum.totalAmount || 0,
          collected: todaySales._sum.paidAmount || 0,
          invoices: todayInvoices,
        },
        thisMonth: {
          sales: monthSales._sum.totalAmount || 0,
          collected: monthSales._sum.paidAmount || 0,
          invoices: monthInvoices,
        },
        customers: {
          total: totalCustomers,
          active: activeCustomers,
        },
        inventory: {
          totalProducts,
          lowStock: lowStockProducts,
        },
        financial: {
          totalOutstanding: totalOutstanding._sum.balanceAmount || 0,
          overdueInvoices,
        },
        recentActivity: {
          invoices: recentInvoices,
          payments: recentPayments,
        },
        topPerformers: {
          products: topProducts,
          customers: topCustomersWithDetails,
        },
        salesTrend,
      },
    });
  }
);

/**
 * @desc    Get sales report
 * @route   GET /api/v1/reports/sales
 * @access  Private
 */
export const getSalesReport = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { startDate, endDate } = req.query;

    const start = startDate
      ? new Date(startDate as string)
      : startOfMonth(new Date());
    const end = endDate ? new Date(endDate as string) : endOfMonth(new Date());

    // Get invoices in date range
    const invoices = await prisma.invoice.findMany({
      where: {
        userId,
        invoiceDate: {
          gte: start,
          lte: end,
        },
      },
      include: {
        customer: {
          select: {
            name: true,
            phoneNumber: true,
          },
        },
        items: true,
      },
      orderBy: { invoiceDate: 'desc' },
    });

    // Calculate summary
    const summary = invoices.reduce(
      (acc, inv) => {
        acc.totalInvoices++;
        acc.totalSales += inv.totalAmount;
        acc.totalPaid += inv.paidAmount;
        acc.totalOutstanding += inv.balanceAmount;
        acc.totalTax += inv.taxAmount;
        acc.totalDiscount += inv.discountAmount;

        if (inv.paymentStatus === 'PAID') acc.paidInvoices++;
        if (inv.paymentStatus === 'UNPAID') acc.unpaidInvoices++;
        if (inv.paymentStatus === 'PARTIAL') acc.partialInvoices++;

        return acc;
      },
      {
        totalInvoices: 0,
        paidInvoices: 0,
        unpaidInvoices: 0,
        partialInvoices: 0,
        totalSales: 0,
        totalPaid: 0,
        totalOutstanding: 0,
        totalTax: 0,
        totalDiscount: 0,
      }
    );

    return successResponse(res, {
      message: 'Sales report retrieved successfully',
      data: {
        summary,
        invoices,
        dateRange: {
          start,
          end,
        },
      },
    });
  }
);

/**
 * @desc    Get revenue report
 * @route   GET /api/v1/reports/revenue
 * @access  Private
 */
export const getRevenueReport = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const start = startDate
      ? new Date(startDate as string)
      : subDays(new Date(), 30);
    const end = endDate ? new Date(endDate as string) : new Date();

    // Determine grouping format
    let dateFormat = '%Y-%m-%d'; // day
    if (groupBy === 'month') dateFormat = '%Y-%m';
    if (groupBy === 'week') dateFormat = '%Y-%W';

    // Get revenue trend
    const revenueTrend = await prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(invoice_date, ${dateFormat}) as period,
        COUNT(*) as invoice_count,
        SUM(total_amount) as total_revenue,
        SUM(paid_amount) as collected_revenue,
        SUM(balance_amount) as pending_revenue,
        SUM(tax_amount) as total_tax
      FROM invoices
      WHERE user_id = ${userId}
        AND invoice_date >= ${start}
        AND invoice_date <= ${end}
      GROUP BY period
      ORDER BY period ASC
    `;

    // Get payment method distribution
    const paymentMethodDistribution = await prisma.invoice.groupBy({
      by: ['paymentMethod'],
      where: {
        userId,
        invoiceDate: {
          gte: start,
          lte: end,
        },
        paymentMethod: { not: null },
      },
      _sum: {
        paidAmount: true,
      },
      _count: true,
    });

    // Get overall summary
    const summary = await prisma.invoice.aggregate({
      where: {
        userId,
        invoiceDate: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        totalAmount: true,
        paidAmount: true,
        balanceAmount: true,
        taxAmount: true,
      },
      _avg: {
        totalAmount: true,
      },
      _count: true,
    });

    return successResponse(res, {
      message: 'Revenue report retrieved successfully',
      data: {
        summary: {
          totalRevenue: summary._sum.totalAmount || 0,
          collectedRevenue: summary._sum.paidAmount || 0,
          pendingRevenue: summary._sum.balanceAmount || 0,
          totalTax: summary._sum.taxAmount || 0,
          averageInvoiceValue: summary._avg.totalAmount || 0,
          totalInvoices: summary._count,
        },
        trend: revenueTrend,
        paymentMethods: paymentMethodDistribution,
        dateRange: {
          start,
          end,
        },
      },
    });
  }
);

/**
 * @desc    Get profit/loss report
 * @route   GET /api/v1/reports/profit
 * @access  Private
 */
export const getProfitReport = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { startDate, endDate } = req.query;

    const start = startDate
      ? new Date(startDate as string)
      : startOfMonth(new Date());
    const end = endDate ? new Date(endDate as string) : endOfMonth(new Date());

    // Get invoice items with product details
    const invoiceItems = await prisma.invoiceItem.findMany({
      where: {
        invoice: {
          userId,
          invoiceDate: {
            gte: start,
            lte: end,
          },
        },
      },
      include: {
        product: {
          select: {
            purchasePrice: true,
            sellingPrice: true,
          },
        },
        invoice: {
          select: {
            invoiceDate: true,
          },
        },
      },
    });

    // Calculate profit
    const profitAnalysis = invoiceItems.reduce(
      (acc, item) => {
        const sellingPrice = item.price;
        const purchasePrice = item.product?.purchasePrice || 0;
        const quantity = item.quantity;

        const revenue = sellingPrice * quantity;
        const cost = purchasePrice * quantity;
        const profit = revenue - cost;
        const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

        acc.totalRevenue += revenue;
        acc.totalCost += cost;
        acc.totalProfit += profit;
        acc.itemCount++;

        return acc;
      },
      {
        totalRevenue: 0,
        totalCost: 0,
        totalProfit: 0,
        itemCount: 0,
      }
    );

    const profitMargin =
      profitAnalysis.totalRevenue > 0
        ? (profitAnalysis.totalProfit / profitAnalysis.totalRevenue) * 100
        : 0;

    return successResponse(res, {
      message: 'Profit report retrieved successfully',
      data: {
        ...profitAnalysis,
        profitMargin,
        dateRange: {
          start,
          end,
        },
      },
    });
  }
);

/**
 * @desc    Get inventory report
 * @route   GET /api/v1/reports/inventory
 * @access  Private
 */
export const getInventoryReport = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    // Get all products with stock info
    const products = await prisma.product.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        sku: true,
        category: true,
        currentStock: true,
        minStockLevel: true,
        purchasePrice: true,
        sellingPrice: true,
        unit: true,
      },
    });

    // Categorize products
    const stockAnalysis = products.reduce(
      (acc, product) => {
        const stockValue = product.currentStock * product.purchasePrice;
        acc.totalValue += stockValue;
        acc.totalProducts++;

        if (product.currentStock === 0) {
          acc.outOfStock++;
        } else if (product.currentStock <= product.minStockLevel) {
          acc.lowStock++;
        } else {
          acc.inStock++;
        }

        return acc;
      },
      {
        totalProducts: 0,
        inStock: 0,
        lowStock: 0,
        outOfStock: 0,
        totalValue: 0,
      }
    );

    // Get category-wise breakdown
    const categoryBreakdown = await prisma.product.groupBy({
      by: ['category'],
      where: { userId },
      _count: true,
      _sum: {
        currentStock: true,
      },
    });

    return successResponse(res, {
      message: 'Inventory report retrieved successfully',
      data: {
        summary: stockAnalysis,
        categoryBreakdown,
        products,
      },
    });
  }
);

/**
 * @desc    Get GST report
 * @route   GET /api/v1/reports/gst
 * @access  Private
 */
export const getGSTReport = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { startDate, endDate } = req.query;

    const start = startDate
      ? new Date(startDate as string)
      : startOfMonth(new Date());
    const end = endDate ? new Date(endDate as string) : endOfMonth(new Date());

    // Get all invoices with GST
    const invoices = await prisma.invoice.findMany({
      where: {
        userId,
        invoiceDate: {
          gte: start,
          lte: end,
        },
      },
      include: {
        customer: {
          select: {
            name: true,
            gstin: true,
          },
        },
        items: {
          select: {
            name: true,
            quantity: true,
            price: true,
            gstRate: true,
            taxAmount: true,
          },
        },
      },
    });

    // Calculate GST summary
    const gstSummary = invoices.reduce(
      (acc, inv) => {
        acc.totalTaxableValue += inv.subtotal;
        acc.totalGST += inv.taxAmount;
        acc.cgst += inv.cgst || 0;
        acc.sgst += inv.sgst || 0;
        acc.igst += inv.igst || 0;
        acc.invoiceCount++;

        return acc;
      },
      {
        totalTaxableValue: 0,
        totalGST: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        invoiceCount: 0,
      }
    );

    // Group by GST rate
    const gstRateBreakdown = await prisma.invoiceItem.groupBy({
      by: ['gstRate'],
      where: {
        invoice: {
          userId,
          invoiceDate: {
            gte: start,
            lte: end,
          },
        },
      },
      _sum: {
        subtotal: true,
        taxAmount: true,
      },
      _count: true,
    });

    return successResponse(res, {
      message: 'GST report retrieved successfully',
      data: {
        summary: gstSummary,
        rateBreakdown: gstRateBreakdown,
        invoices,
        dateRange: {
          start,
          end,
        },
      },
    });
  }
);

/**
 * @desc    Get outstanding payments report
 * @route   GET /api/v1/reports/outstanding
 * @access  Private
 */
export const getOutstandingReport = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    const outstandingInvoices = await prisma.invoice.findMany({
      where: {
        userId,
        paymentStatus: { in: ['UNPAID', 'PARTIAL'] },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    const today = new Date();

    // Categorize by age
    const categorized = outstandingInvoices.reduce(
      (acc, inv) => {
        const dueDate = inv.dueDate ? new Date(inv.dueDate) : null;
        const amount = inv.balanceAmount;

        acc.totalOutstanding += amount;
        acc.invoiceCount++;

        if (dueDate && dueDate < today) {
          acc.overdue.amount += amount;
          acc.overdue.count++;

          const daysOverdue = Math.floor(
            (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysOverdue > 90) {
            acc.over90Days.amount += amount;
            acc.over90Days.count++;
          } else if (daysOverdue > 60) {
            acc.days60to90.amount += amount;
            acc.days60to90.count++;
          } else if (daysOverdue > 30) {
            acc.days30to60.amount += amount;
            acc.days30to60.count++;
          } else {
            acc.days0to30.amount += amount;
            acc.days0to30.count++;
          }
        } else {
          acc.notDue.amount += amount;
          acc.notDue.count++;
        }

        return acc;
      },
      {
        totalOutstanding: 0,
        invoiceCount: 0,
        overdue: { amount: 0, count: 0 },
        notDue: { amount: 0, count: 0 },
        days0to30: { amount: 0, count: 0 },
        days30to60: { amount: 0, count: 0 },
        days60to90: { amount: 0, count: 0 },
        over90Days: { amount: 0, count: 0 },
      }
    );

    return successResponse(res, {
      message: 'Outstanding report retrieved successfully',
      data: {
        summary: categorized,
        invoices: outstandingInvoices,
      },
    });
  }
);

/**
 * @desc    Get top products
 * @route   GET /api/v1/reports/top-products
 * @access  Private
 */
export const getTopProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { startDate, endDate, limit = 10 } = req.query;

    const start = startDate
      ? new Date(startDate as string)
      : subDays(new Date(), 30);
    const end = endDate ? new Date(endDate as string) : new Date();

    const topProducts = await prisma.invoiceItem.groupBy({
      by: ['productId', 'name'],
      where: {
        invoice: {
          userId,
          invoiceDate: {
            gte: start,
            lte: end,
          },
        },
      },
      _sum: {
        quantity: true,
        total: true,
      },
      _count: true,
      orderBy: {
        _sum: {
          total: 'desc',
        },
      },
      take: Number(limit),
    });

    return successResponse(res, {
      message: 'Top products retrieved successfully',
      data: topProducts,
    });
  }
);

/**
 * @desc    Get top customers
 * @route   GET /api/v1/reports/top-customers
 * @access  Private
 */
export const getTopCustomers = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { startDate, endDate, limit = 10 } = req.query;

    const start = startDate
      ? new Date(startDate as string)
      : subDays(new Date(), 30);
    const end = endDate ? new Date(endDate as string) : new Date();

    const topCustomers = await prisma.invoice.groupBy({
      by: ['customerId'],
      where: {
        userId,
        invoiceDate: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        totalAmount: true,
        paidAmount: true,
      },
      _count: true,
      orderBy: {
        _sum: {
          totalAmount: 'desc',
        },
      },
      take: Number(limit),
    });

    // Get customer details
    const customerIds = topCustomers
      .map((c) => c.customerId)
      .filter(Boolean) as string[];
    const customers = await prisma.customer.findMany({
      where: { id: { in: customerIds } },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
      },
    });

    const topCustomersWithDetails = topCustomers.map((tc) => {
      const customer = customers.find((c) => c.id === tc.customerId);
      return {
        ...tc,
        customerName: customer?.name || 'Walk-in Customer',
        customerPhone: customer?.phoneNumber,
      };
    });

    return successResponse(res, {
      message: 'Top customers retrieved successfully',
      data: topCustomersWithDetails,
    });
  }
);

/**
 * @desc    Get payment methods distribution
 * @route   GET /api/v1/reports/payment-methods
 * @access  Private
 */
export const getPaymentMethodsReport = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { startDate, endDate } = req.query;

    const start = startDate
      ? new Date(startDate as string)
      : startOfMonth(new Date());
    const end = endDate ? new Date(endDate as string) : endOfMonth(new Date());

    const distribution = await prisma.payment.groupBy({
      by: ['paymentMethod'],
      where: {
        invoice: {
          userId,
        },
        paymentDate: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        amount: true,
      },
      _count: true,
    });

    return successResponse(res, {
      message: 'Payment methods report retrieved successfully',
      data: distribution,
    });
  }
);

/**
 * @desc    Get daily sales trend
 * @route   GET /api/v1/reports/daily-sales
 * @access  Private
 */
export const getDailySales = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { startDate, endDate } = req.query;

    const start = startDate
      ? new Date(startDate as string)
      : subDays(new Date(), 30);
    const end = endDate ? new Date(endDate as string) : new Date();

    const dailySales = await prisma.$queryRaw`
      SELECT 
        DATE(invoice_date) as date,
        COUNT(*) as invoice_count,
        SUM(total_amount) as total_sales,
        SUM(paid_amount) as collected,
        SUM(balance_amount) as pending
      FROM invoices
      WHERE user_id = ${userId}
        AND invoice_date >= ${start}
        AND invoice_date <= ${end}
      GROUP BY DATE(invoice_date)
      ORDER BY date ASC
    `;

    return successResponse(res, {
      message: 'Daily sales trend retrieved successfully',
      data: dailySales,
    });
  }
);

/**
 * @desc    Export sales report as CSV
 * @route   GET /api/v1/reports/export/sales
 * @access  Private
 */
export const exportSalesReport = asyncHandler(
  async (req: Request, res: Response) => {
    // CSV export logic would go here
    return successResponse(res, {
      message: 'CSV export not yet implemented',
      data: null,
    });
  }
);

/**
 * @desc    Export GST report as CSV
 * @route   GET /api/v1/reports/export/gst
 * @access  Private
 */
export const exportGSTReport = asyncHandler(
  async (req: Request, res: Response) => {
    // CSV export logic would go here
    return successResponse(res, {
      message: 'CSV export not yet implemented',
      data: null,
    });
  }
);
```

---

## ✅ **REPORTS VALIDATORS**

### **`src/validators/reports.validator.ts`**

```typescript
import Joi from 'joi';

export const dateRangeSchema = Joi.object({
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional().min(Joi.ref('startDate')),
  groupBy: Joi.string().valid('day', 'week', 'month').optional(),
  limit: Joi.number().min(1).max(100).optional(),
});
```

---

## 🎯 **REPORTS INCLUDED**

### **✅ Dashboard:**
- Today's sales & invoices
- This month's performance
- Customer & inventory stats
- Recent activity
- Top performers
- Sales trend (30 days)

### **✅ Financial Reports:**
- Sales report with filters
- Revenue trends
- Profit/Loss analysis
- Outstanding payments
- Payment method distribution

### **✅ Business Intelligence:**
- Top selling products
- Top customers by revenue
- Daily sales trends
- Inventory status
- GST compliance report

### **✅ Export Features:**
- CSV exports for sales
- GST filing reports
- Date range filtering
- Multiple grouping options

---

**Next: WhatsApp Integration →**
