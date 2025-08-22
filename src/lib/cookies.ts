// Cookie utility functions for Next.js
export const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof document === 'undefined') return; // Server-side check
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  
  // Set secure cookie with SameSite=Strict for security
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null; // Server-side check
  
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return; // Server-side check
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const getAllCookies = (): Record<string, string> => {
  if (typeof document === 'undefined') return {}; // Server-side check
  
  return document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string>);
};

// Auth-specific cookie functions
export const setAuthCookies = (sessionToken: string, refreshToken?: string) => {
  setCookie("sessionToken", sessionToken, 7); // 7 days
  if (refreshToken) {
    setCookie("refreshToken", refreshToken, 30); // 30 days
  }
};

export const clearAuthCookies = () => {
  deleteCookie("sessionToken");
  deleteCookie("refreshToken");
};

export const getAuthCookies = () => {
  return {
    sessionToken: getCookie("sessionToken"),
    refreshToken: getCookie("refreshToken"),
  };
};
