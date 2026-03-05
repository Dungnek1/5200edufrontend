import { useState, useCallback, useRef } from 'react';
import { AxiosError } from 'axios';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApi<T, P = void>(
  apiFunc: (params: P) => Promise<T>,
  options?: UseApiOptions<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const apiFuncRef = useRef(apiFunc);
  const optionsRef = useRef(options);

  apiFuncRef.current = apiFunc;
  optionsRef.current = options;

  const execute = useCallback(
    async (params: P) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await apiFuncRef.current(params);
        setData(result);
        optionsRef.current?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof AxiosError
          ? new Error(err.response?.data?.message || err.message)
          : err as Error;
        setError(error);
        optionsRef.current?.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [] // Empty dependency array ensures stable identity
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    error,
    isLoading,
    execute,
    reset,
  };
}
