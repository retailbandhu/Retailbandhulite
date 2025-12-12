/**
 * Logger Utility for Retail Bandhu Lite
 * 
 * Provides environment-aware logging that:
 * - Shows logs in development
 * - Hides logs in production
 * - Adds timestamps and context
 * - Can be extended with analytics
 */

import { isDevelopment } from './environment';

export const logger = {
  /**
   * Log informational messages (development only)
   */
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.log('ℹ️ [INFO]', ...args);
    }
  },

  /**
   * Log warning messages (development only)
   */
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn('⚠️ [WARN]', ...args);
    }
  },

  /**
   * Log error messages (always shown, can be sent to analytics)
   */
  error: (...args: any[]) => {
    console.error('❌ [ERROR]', ...args);
    // TODO: Send to error tracking service (Sentry, etc.)
  },

  /**
   * Log debug messages (development only)
   */
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug('🐛 [DEBUG]', ...args);
    }
  },

  /**
   * Log success messages (development only)
   */
  success: (...args: any[]) => {
    if (isDevelopment) {
      console.log('✅ [SUCCESS]', ...args);
    }
  },

  /**
   * Log with custom context
   */
  custom: (context: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`[${context.toUpperCase()}]`, ...args);
    }
  }
};

/**
 * Log bill generation events
 */
export const logBillEvent = (billNumber: string, amount: number, itemCount: number) => {
  logger.info('Bill Generated:', {
    billNumber,
    amount,
    itemCount,
    timestamp: new Date().toISOString()
  });
};

/**
 * Log stock updates
 */
export const logStockUpdate = (productName: string, oldStock: number, newStock: number) => {
  logger.info('Stock Updated:', {
    product: productName,
    from: oldStock,
    to: newStock,
    change: newStock - oldStock
  });
};

/**
 * Log customer actions
 */
export const logCustomerAction = (action: string, customerId?: string) => {
  logger.info('Customer Action:', {
    action,
    customerId,
    timestamp: new Date().toISOString()
  });
};

/**
 * Log navigation events
 */
export const logNavigation = (from: string, to: string) => {
  logger.debug('Navigation:', {
    from,
    to,
    timestamp: new Date().toISOString()
  });
};