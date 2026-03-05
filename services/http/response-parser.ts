import { logger } from '@/lib/logger';
/**
 * Backend API Response Format
 * All backend endpoints return:
 * {
 *   status: 'success' | 'error',
 *   message?: string,
 *   data: T
 * }
 */
export interface BackendResponse<T = unknown> {
  status: 'success' | 'error' | 'failed';
  message?: string;
  data: T;
}

/**
 * Parse backend response to extract data
 * 
 * Backend returns: { status: 'success', message: '...', data: T }
 * http.get/post returns: axiosResponse.data = { status: 'success', message: '...', data: T }
 * Service returns: response.data = { status: 'success', message: '...', data: T }
 * 
 * So we need to extract response.data.data
 * 
 * @param response - The response from http (axiosResponse.data)
 * @returns The actual data from response.data.data
 */
export function parseBackendResponse<T>(response: unknown): T {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response format');
  }

  const backendResponse = response as BackendResponse<T>;

  if (process.env.NODE_ENV === 'development') {
    logger.info('🔍 [parseBackendResponse] Input response:', JSON.stringify(response, null, 2));
    logger.info('🔍 [parseBackendResponse] Has status?', 'status' in backendResponse);
    logger.info('🔍 [parseBackendResponse] Status value:', (backendResponse as any).status);
    logger.info('🔍 [parseBackendResponse] Has data?', 'data' in backendResponse);
    logger.info('🔍 [parseBackendResponse] Data value:', (backendResponse as any).data);
  }

  if ('status' in backendResponse) {
    if (backendResponse.status === 'error' || backendResponse.status === 'failed') {
      throw new Error(backendResponse.message || 'API error');
    }

    if ('data' in backendResponse) {
      const extractedData = backendResponse.data;
      if (process.env.NODE_ENV === 'development') {
        logger.info('🔍 [parseBackendResponse] Extracted data:', extractedData);
        logger.info('🔍 [parseBackendResponse] Is array?', Array.isArray(extractedData));
        if (Array.isArray(extractedData)) {
          logger.info('🔍 [parseBackendResponse] Array length:', extractedData.length);
        }
      }
      return extractedData;
    }
  }

  if ('data' in backendResponse && !('status' in backendResponse)) {
    return (backendResponse as { data: T }).data;
  }

  return response as T;
}

/**
 * Check if response is successful
 */
export function isBackendResponseSuccess(response: unknown): boolean {
  if (!response || typeof response !== 'object') {
    return false;
  }

  const backendResponse = response as BackendResponse<unknown>;
  return backendResponse.status === 'success';
}

/**
 * Get message from backend response
 */
export function getBackendResponseMessage(response: unknown): string | undefined {
  if (!response || typeof response !== 'object') {
    return undefined;
  }

  const backendResponse = response as BackendResponse<unknown>;
  return backendResponse.message;
}

/**
 * Extract error message from error object
 * Works with both API errors and Axios errors
 */
export function extractErrorMessage(error: any): string {
  if (error?.displayMessage) {
    return error.displayMessage;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  if (error?.message) {
    return error.message;
  }

  return 'Đã xảy ra lỗi, vui lòng thử lại';
}

