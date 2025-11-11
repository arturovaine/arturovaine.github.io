/**
 * Production-safe logger utility
 * Removes console logs in production for better performance
 */

const isDev = import.meta.env?.DEV ?? true;

export const logger = {
  log: (...args) => {
    if (isDev) console.log(...args);
  },
  
  error: (...args) => {
    if (isDev) console.error(...args);
  },
  
  warn: (...args) => {
    if (isDev) console.warn(...args);
  },
  
  info: (...args) => {
    if (isDev) console.info(...args);
  }
};

export default logger;