import { useState, useCallback } from "react";
import { toast } from "sonner";

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: any;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const {
    onSuccess,
    onError,
    showSuccessToast = true,
    showErrorToast = true,
    successMessage = "Operation completed successfully",
    errorMessage = "An error occurred",
  } = options;

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setLoading(true);
        setError(null);

        const result = await apiFunction(...args);

        setData(result);

        if (showSuccessToast && successMessage) {
          toast.success(successMessage);
        }

        if (onSuccess) {
          onSuccess(result);
        }
      } catch (err: any) {
        const errorMessage =
          err?.message || options.errorMessage || "An error occurred";

        setError(err);

        if (showErrorToast) {
          toast.error(errorMessage);
        }

        if (onError) {
          onError(err);
        }
      } finally {
        setLoading(false);
      }
    },
    [
      apiFunction,
      onSuccess,
      onError,
      showSuccessToast,
      showErrorToast,
      successMessage,
      options.errorMessage,
    ]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// Specialized hooks for common API patterns
export function useAuth() {
  const login = useApi(
    async (credentials: { email: string; password: string }) => {
      // Implementation will be added when auth context is created
      return {} as any;
    },
    {
      successMessage: "Login successful",
      errorMessage: "Login failed",
    }
  );

  const register = useApi(
    async (userData: any) => {
      // Implementation will be added when auth context is created
      return {} as any;
    },
    {
      successMessage: "Registration successful",
      errorMessage: "Registration failed",
    }
  );

  return { login, register };
}

export function useProducts() {
  const getProducts = useApi(async (filters?: any) => {
    // Implementation will be added when products API is integrated
    return {} as any;
  });

  const getProduct = useApi(async (id: string) => {
    // Implementation will be added when products API is integrated
    return {} as any;
  });

  return { getProducts, getProduct };
}
