import { useState, useCallback, useEffect } from "react";
import {
  authService,
  BackendAuthResponse,
  BackendUserProfile,
} from "@/services/auth.service";
import { ExtendedLoginBodyType } from "@/shemaValidation/auth.schema";
import { HttpError } from "@/lib/http";
import { useAppContextProvider } from "@/context/app-context";

// Auth state interface
interface AuthState {
  user: BackendUserProfile | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth actions interface
interface AuthActions {
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<BackendAuthResponse>;
  loginExtended: (data: ExtendedLoginBodyType) => Promise<BackendAuthResponse>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
  updateUser: (userData: Partial<BackendUserProfile>) => void;
  testConnection: () => Promise<{ success: boolean; message: string }>;
  testApi: () => Promise<{ success: boolean; message: string }>;
}

// Combined auth hook return type
type UseAuthReturn = AuthState & AuthActions;

// Local storage keys
const STORAGE_KEYS = {
  TOKEN: "auth_token",
  REFRESH_TOKEN: "auth_refresh_token",
  USER: "auth_user",
  REMEMBER_ME: "auth_remember_me",
} as const;

export const useAuth = (): UseAuthReturn => {
  const { setSessionToken } = useAppContextProvider();
  // State management
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        const rememberMe =
          localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === "true";

        if (token && userStr) {
          const user = JSON.parse(userStr);
          setAuthState({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Validate token on initialization
          if (rememberMe) {
            validateAndRefreshToken(token, refreshToken);
          }
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  // Validate and refresh token
  const validateAndRefreshToken = useCallback(
    async (token: string, refreshToken: string | null) => {
      try {
        const isValid = await authService.validateToken(token);
        if (!isValid.valid && refreshToken) {
          await refreshAuth();
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        await logout();
      }
    },
    []
  );

  // Save auth data to localStorage
  const saveAuthData = useCallback(
    (data: BackendAuthResponse, rememberMe: boolean = false) => {
      const { user, token, refreshToken } = data.data;

      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, String(rememberMe));
    },
    []
  );

  // Clear auth data from localStorage
  const clearAuthData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
  }, []);

  // Helper: login via Next API to set httpOnly cookies for middleware
  const loginViaNextApi = useCallback(
    async (body: {
      email: string;
      password: string;
      rememberMe?: boolean;
      deviceInfo?: any;
    }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        const message = data?.error || data?.message || "Login failed";
        throw new HttpError({
          statusCode: res.status,
          payload: { message },
          url: "/api/auth/login",
        });
      }
      return data as BackendAuthResponse;
    },
    []
  );

  // Login function
  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean = false) => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

        const response = await loginViaNextApi({
          email,
          password,
          rememberMe,
        });

        saveAuthData(response, rememberMe);
        try {
          setSessionToken(response.data.token);
        } catch {}

        setAuthState({
          user: {
            ...response.data.user,
            addresses: [],
            preferences: {
              language: "en",
              currency: "USD",
              notifications: { email: true, sms: false, push: true },
            },
          },
          token: response.data.token,
          refreshToken: response.data.refreshToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return response;
      } catch (error) {
        const errorMessage =
          error instanceof HttpError
            ? error.payload?.message || "Login failed"
            : "An unexpected error occurred";

        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        throw error;
      }
    },
    [saveAuthData, loginViaNextApi]
  );

  // Login with extended data (rememberMe/deviceInfo)
  const loginExtended = useCallback(
    async (data: ExtendedLoginBodyType) => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

        const response = await loginViaNextApi(data);

        saveAuthData(response, Boolean(data.rememberMe));
        try {
          setSessionToken(response.data.token);
        } catch {}

        setAuthState({
          user: {
            ...response.data.user,
            addresses: [],
            preferences: {
              language: "en",
              currency: "USD",
              notifications: { email: true, sms: false, push: true },
            },
          },
          token: response.data.token,
          refreshToken: response.data.refreshToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return response;
      } catch (error) {
        const errorMessage =
          error instanceof HttpError
            ? error.payload?.message || "Login failed"
            : "An unexpected error occurred";

        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        throw error;
      }
    },
    [saveAuthData, loginViaNextApi]
  );

  // Register function - sử dụng endpoint /auth/register từ API_DOCUMENTATION.md
  const register = useCallback(
    async (userData: any) => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

        const response = await authService.register(userData);

        saveAuthData(response, false);

        setAuthState({
          user: {
            ...response.data.user,
            addresses: [],
            preferences: {
              language: "en",
              currency: "USD",
              notifications: { email: true, sms: false, push: true },
            },
          },
          token: response.data.token,
          refreshToken: response.data.refreshToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        const errorMessage =
          error instanceof HttpError
            ? error.payload?.message || "Registration failed"
            : "An unexpected error occurred";

        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        throw error;
      }
    },
    [saveAuthData]
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call Next API to clear httpOnly cookies and notify backend
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthData();
      try {
        setSessionToken("");
      } catch {}
      setAuthState({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, [authState.token, clearAuthData]);

  // Refresh auth token
  const refreshAuth = useCallback(async () => {
    try {
      if (!authState.refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await authService.refreshToken(authState.refreshToken);

      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
      localStorage.setItem(
        STORAGE_KEYS.REFRESH_TOKEN,
        response.data.refreshToken
      );

      setAuthState((prev) => ({
        ...prev,
        token: response.data.token,
        refreshToken: response.data.refreshToken,
      }));
    } catch (error) {
      console.error("Token refresh failed:", error);
      await logout();
    }
  }, [authState.refreshToken, logout]);

  // Clear error
  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null }));
  }, []);

  // Update user data
  const updateUser = useCallback(
    (userData: Partial<BackendUserProfile>) => {
      setAuthState((prev) => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...userData } : null,
      }));

      // Update localStorage
      if (authState.user) {
        const updatedUser = { ...authState.user, ...userData };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      }
    },
    [authState.user]
  );

  // Test connection to backend
  const testConnection = useCallback(async () => {
    try {
      const result = await authService.testConnection();
      return result;
    } catch (error) {
      return { success: false, message: "Connection test failed" };
    }
  }, []);

  // Test API endpoint
  const testApi = useCallback(async () => {
    try {
      const result = await authService.testApi();
      return result;
    } catch (error) {
      return { success: false, message: "API test failed" };
    }
  }, []);

  return {
    ...authState,
    login,
    loginExtended,
    register,
    logout,
    refreshAuth,
    clearError,
    updateUser,
    testConnection,
    testApi,
  };
};
