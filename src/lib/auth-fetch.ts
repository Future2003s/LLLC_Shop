// Helper function để gửi request với authentication từ frontend
export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Lấy token từ cookies
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
  };

  const sessionToken = getCookie("sessionToken");
  const refreshToken = getCookie("refreshToken");

  if (!sessionToken && !refreshToken) {
    throw new Error("No authentication tokens found");
  }

  // Gửi request với token
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(sessionToken && { Authorization: `Bearer ${sessionToken}` }),
    },
    credentials: "include",
  });

  // Nếu 401, thử refresh token
  if (response.status === 401 && refreshToken) {
    try {
      const refreshResponse = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        const newToken =
          refreshData.data?.accessToken || refreshData.accessToken;

        if (newToken) {
          // Thử lại request với token mới
          return fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${newToken}`,
            },
            credentials: "include",
          });
        }
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
    }
  }

  return response;
}

// Helper cho các method cụ thể
export const authGet = (url: string, options?: RequestInit) =>
  authFetch(url, { ...options, method: "GET" });

export const authPost = (url: string, data: any, options?: RequestInit) =>
  authFetch(url, {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...options?.headers,
    },
    body: JSON.stringify(data),
  });

export const authPut = (url: string, data: any, options?: RequestInit) =>
  authFetch(url, {
    ...options,
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...options?.headers,
    },
    body: JSON.stringify(data),
  });

export const authDelete = (url: string, options?: RequestInit) =>
  authFetch(url, { ...options, method: "DELETE" });
