/**
 * Environment Detection Utility
 * 
 * Provides safe, consistent environment detection across the app.
 * Works in various contexts: Vite dev, Vite build, tests, etc.
 */

/**
 * Safely detect if we're in development mode
 */
export const isDevelopment = (() => {
  try {
    // Try Vite's import.meta.env first (most reliable in Vite apps)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env.DEV === true || import.meta.env.MODE === 'development';
    }
  } catch {
    // import.meta might not be available in all contexts
  }

  try {
    // Fallback to process.env (Node.js style, might be polyfilled by bundler)
    if (typeof process !== 'undefined' && process.env) {
      return process.env.NODE_ENV === 'development';
    }
  } catch {
    // process might not be available in browser
  }

  // Ultimate fallback: check hostname
  // If we're on localhost, assume development
  if (typeof window !== 'undefined' && window.location) {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname === '';
  }

  // If all else fails, assume production for safety
  return false;
})();

/**
 * Check if we're in production mode
 */
export const isProduction = !isDevelopment;

/**
 * Check if we're in a browser context
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Check if we're in a test environment
 */
export const isTest = (() => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.NODE_ENV === 'test';
    }
  } catch {
    // Not in test
  }
  return false;
})();

/**
 * Get the current environment name
 */
export const getEnvironment = (): 'development' | 'production' | 'test' => {
  if (isTest) return 'test';
  if (isDevelopment) return 'development';
  return 'production';
};

/**
 * Safely get environment variable
 * Works with both import.meta.env and process.env
 */
export const getEnvVar = (key: string, defaultValue: string = ''): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      const value = import.meta.env[key];
      if (value !== undefined) return String(value);
    }
  } catch {
    // Continue to next check
  }

  try {
    if (typeof process !== 'undefined' && process.env) {
      const value = process.env[key];
      if (value !== undefined) return String(value);
    }
  } catch {
    // Continue to default
  }

  return defaultValue;
};
