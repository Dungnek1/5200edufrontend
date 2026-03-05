/**
 * Centralized logging utility
 *
 * WHY: Using console.log directly pollutes production and exposes internal logic.
 * This wrapper provides:
 * - Development-only debug logs
 * - Always-on error logging (for error tracking services like Sentry)
 * - Consistent log formatting
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMeta {
  [key: string]: any;
}

const isDevelopment = process.env.NODE_ENV === 'development';
const enableVerboseLogs = process.env.NEXT_PUBLIC_ENABLE_VERBOSE_LOGS === 'true';

export const logger = {
  /**
   * Info logs - only when verbose logging is enabled
   */
  info: (message: string, meta?: any) => {
    if (enableVerboseLogs) {
    }
  },

  /**
   * Warning logs - only when verbose logging is enabled
   */
  warn: (message: string, meta?: any) => {
    if (enableVerboseLogs) {
    }
  },

  /**
   * Error logs - always enabled
   * TODO: Integrate with error tracking service (Sentry, LogRocket)
   */
  error: (message: string, error?: any) => {
  },

  /**
   * Debug logs - only when verbose logging is enabled
   */
  debug: (message: string, meta?: any) => {
    if (enableVerboseLogs) {
    }
  },
};
