/**
 * Error handling utilities for Web Components
 * Provides graceful error handling and reporting
 */

class ErrorHandler {
  constructor() {
    this.setupGlobalHandlers();
  }

  setupGlobalHandlers() {
    // Catch unhandled errors
    window.addEventListener('error', (event) => {
      this.logError('Unhandled Error', event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', event.reason);
      event.preventDefault(); // Prevent console error
    });
  }

  logError(type, error, context = {}) {
    const errorInfo = {
      type,
      message: error?.message || error,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...context
    };

    // Only log in development
    if (import.meta.env?.DEV) {
      console.error(`🚨 ${type}:`, errorInfo);
    }

    // In production, you could send to error reporting service
    // this.sendToErrorService(errorInfo);
  }

  // Wrapper for component methods to catch errors gracefully
  safeExecute(fn, fallback = () => {}) {
    try {
      return fn();
    } catch (error) {
      this.logError('Component Error', error);
      return fallback();
    }
  }

  // Helper for safe DOM queries
  safeQuerySelector(root, selector) {
    try {
      return root?.querySelector?.(selector) || null;
    } catch (error) {
      this.logError('DOM Query Error', error, { selector });
      return null;
    }
  }

  // Helper for safe property access
  safePropertyAccess(obj, path, defaultValue = null) {
    try {
      return path.split('.').reduce((current, prop) => current?.[prop], obj) ?? defaultValue;
    } catch (error) {
      this.logError('Property Access Error', error, { path });
      return defaultValue;
    }
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();
export default errorHandler;