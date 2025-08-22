import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields: email, password",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Resolve backend base URL with safe fallback
    const baseUrl =
      process.env.NEXT_PUBLIC_API_END_POINT || "http://localhost:8081/api/v1";

    // Forward to backend
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const contentType = res.headers.get("content-type") || "application/json";
    let data;
    try {
      if (contentType.includes("application/json")) {
        const text = await res.text();
        data = text ? JSON.parse(text) : null;
      } else {
        data = await res.text();
      }
    } catch (error) {
      console.error("JSON parse error:", error);
      data = { success: false, error: "Invalid response from server" };
    }

    // Set cookies if login successful and tokens provided
    if (res.ok && data?.success && data?.data?.token) {
      const isProd = process.env.NODE_ENV === "production";
      const sessionToken = data.data.token as string;
      const refreshToken = data.data.refreshToken as string | undefined;

      const response = NextResponse.json(
        typeof data === "string" ? JSON.parse(data) : data,
        { status: res.status }
      );

      response.cookies.set("sessionToken", sessionToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
        path: "/",
      });

      if (refreshToken) {
        response.cookies.set("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
          secure: isProd,
          path: "/",
        });
      }

      return response;
    }

    return new Response(
      typeof data === "string" ? data : JSON.stringify(data),
      {
        status: res.status,
        headers: { "Content-Type": contentType },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
