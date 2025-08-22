import { NextRequest, NextResponse } from "next/server";

type RefreshResult = {
  authHeader: string | null;
  setCookie?: string | null;
};

export async function getAuthHeaderOrRefresh(
  request: NextRequest
): Promise<RefreshResult> {
  let authHeader = request.headers.get("authorization") || "";
  if (authHeader.startsWith("Bearer ")) {
    return { authHeader, setCookie: null };
  }
  const accessFromCookie = request.cookies.get("sessionToken")?.value || "";
  if (accessFromCookie) {
    return { authHeader: `Bearer ${accessFromCookie}` } as any;
  }
  const refreshToken = request.cookies.get("refreshToken")?.value;
  if (!refreshToken) return { authHeader: null };
  try {
    // Forward the refresh token explicitly as a Cookie header. "credentials" does not
    // include cross-origin cookies in Node fetch.
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_END_POINT}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );
    if (!res.ok) return { authHeader: null };
    const contentType = res.headers.get("content-type") || "";
    let data: any;
    try {
      if (contentType.includes("application/json")) {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } else {
        data = {};
      }
    } catch (error) {
      console.error("JSON parse error:", error);
      data = {};
    }
    const newAccess = data?.accessToken || data?.data?.accessToken;
    const setCookie = res.headers.get("set-cookie");
    if (!newAccess) return { authHeader: null };
    return { authHeader: `Bearer ${newAccess}`, setCookie };
  } catch {
    return { authHeader: null };
  }
}

export async function proxyJson<ResponseBody = any>(
  backendUrl: string,
  request: NextRequest,
  init: RequestInit & { requireAuth?: boolean } = {}
) {
  try {
    const { authHeader, setCookie } = await getAuthHeaderOrRefresh(request);
    if (init.requireAuth && !authHeader) {
      console.log("Authentication required but no auth header found");
      return new NextResponse(JSON.stringify({ message: "Unauthenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Making request to:", backendUrl);
    console.log("Auth header present:", !!authHeader);

    let res = await fetch(backendUrl, {
      ...init,
      headers: {
        ...(init.headers || {}),
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      cache: "no-store",
    });

    console.log("Backend response status:", res.status);
    console.log(
      "Backend response headers:",
      Object.fromEntries(res.headers.entries())
    );

    // If unauthorized, try refreshing once then retry
    if (res.status === 401 && init.requireAuth) {
      const refresh = await getAuthHeaderOrRefresh(request);
      if (refresh.authHeader) {
        res = await fetch(backendUrl, {
          ...init,
          headers: {
            ...(init.headers || {}),
            Authorization: refresh.authHeader,
          },
          cache: "no-store",
        });
        if (refresh.setCookie) {
          // Attach new cookie to response if we succeed
        }
      }
    }

    const contentType = res.headers.get("content-type") || "application/json";
    let body: any;

    try {
      if (contentType.includes("application/json")) {
        body = await res.json();
      } else {
        body = await res.text();
      }
    } catch (parseError) {
      console.error("Error parsing response body:", parseError);
      body = { message: "Error parsing response" };
    }

    const response = new NextResponse(
      typeof body === "string" ? body : JSON.stringify(body),
      {
        status: res.status,
        headers: {
          "Content-Type": contentType,
          ...(res.headers.get("access-control-allow-origin") && {
            "Access-Control-Allow-Origin": res.headers.get(
              "access-control-allow-origin"
            )!,
          }),
          ...(res.headers.get("access-control-allow-methods") && {
            "Access-Control-Allow-Methods": res.headers.get(
              "access-control-allow-methods"
            )!,
          }),
          ...(res.headers.get("access-control-allow-headers") && {
            "Access-Control-Allow-Headers": res.headers.get(
              "access-control-allow-headers"
            )!,
          }),
        },
      }
    );

    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    if (res.status === 401 && init.requireAuth) {
      // force client logout: clear cookies
      response.headers.append(
        "set-cookie",
        "sessionToken=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax"
      );
      response.headers.append(
        "set-cookie",
        "refreshToken=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict"
      );
    }

    return response;
  } catch (error) {
    console.error("proxyJson error:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
