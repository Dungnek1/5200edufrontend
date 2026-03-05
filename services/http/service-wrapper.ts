/**
 * Standard Service Call Wrapper
 * Provides consistent error handling and response parsing across all services
 */

import type { AxiosResponse } from 'axios';
import { parseBackendResponse, extractErrorMessage } from './response-parser';

import { logger } from '@/lib/logger';
/**
 * Standard API response wrapper type
 */
export type ServiceResponse<T> = {
  data: T;
  message?: string;
};

/**
 * Standard service call error
 */
export class ServiceError extends Error {
  public statusCode?: number;
  public originalError?: unknown;

  constructor(message: string, statusCode?: number, originalError?: unknown) {
    super(message);
    this.name = 'ServiceError';
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

/**
 * Wrap a service call with consistent error handling
 *
 * @param apiCall - The axios promise (httpClient.get/post/etc)
 * @returns Parsed data or throws ServiceError
 *
 * @example
 * ```ts
 * // Before:
 * const response = await httpClient.get('/users');
 * const users = parseBackendResponse<User[]>(response.data);
 *
 * After:
 * const users = await serviceCall<User[]>(httpClient.get('/users'));
 * ```
 */
export async function serviceCall<T>(
  apiCall: Promise<AxiosResponse>
): Promise<T> {
  try {
    const response = await apiCall;

    return parseBackendResponse<T>(response.data);

  } catch (error: unknown) {
    if (error instanceof ServiceError) {
      throw error;
    }

    const statusCode = (error as { response?: { status?: number } })?.response?.status;

    const message = extractErrorMessage(error);

    if (process.env.NODE_ENV === 'development') {
      logger.error('[ServiceError]', {
        message,
        statusCode,
        originalError: error,
      });
    }

    throw new ServiceError(message, statusCode, error);
  }
}

/**
 * Wrap a service call that returns the full response (with headers, etc)
 */
export async function serviceCallWithResponse<T>(
  apiCall: Promise<AxiosResponse>
): Promise<ServiceResponse<T>> {
  try {
    const response = await apiCall;

    const data = parseBackendResponse<T>(response.data);

    return {
      data,
      message: (response.data as { message?: string })?.message,
    };

  } catch (error: unknown) {
    if (error instanceof ServiceError) {
      throw error;
    }

    const statusCode = (error as { response?: { status?: number } })?.response?.status;
    const message = extractErrorMessage(error);

    throw new ServiceError(message, statusCode, error);
  }
}

/**
 * Handle service errors consistently in UI components
 * Returns user-friendly error message
 */
export function handleServiceError(error: unknown): string {
  if (error instanceof ServiceError) {
    return error.message;
  }

  return extractErrorMessage(error);
}

/**
 * Check if error is a network/error type that should trigger retry
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof ServiceError) {
    const code = error.statusCode;
    return code === 429 || code === 503 || code === 504;
  }

  const statusCode = (error as { response?: { status?: number } })?.response?.status;
  return statusCode === 429 || statusCode === 503 || statusCode === 504;
}
