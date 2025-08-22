import { NextRequest } from "next/server";
import { getAuthHeaderOrRefresh } from "@/lib/next-api-auth";

export async function GET(request: NextRequest) {
  try {
    console.log("Orders test API called");

    if (!process.env.NEXT_PUBLIC_API_END_POINT) {
      console.error("NEXT_PUBLIC_API_END_POINT is not defined");
      return new Response(
        JSON.stringify({
          message: "Backend URL not configured",
          env: process.env.NODE_ENV,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const url = new URL(
      `${process.env.NEXT_PUBLIC_API_END_POINT}/v1/api/orders`
    );
    console.log("Testing backend URL:", url.toString());

    const { authHeader } = await getAuthHeaderOrRefresh(request);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (authHeader) headers["Authorization"] = authHeader;

    const res = await fetch(url.toString(), {
      method: "GET",
      headers,
      cache: "no-store",
    });

    console.log("Backend test response status:", res.status);
    console.log(
      "Backend test response headers:",
      Object.fromEntries(res.headers.entries())
    );

    const contentType = res.headers.get("content-type") || "application/json";
    let data: any;

    try {
      if (contentType.includes("application/json")) {
        const text = await res.text();
        data = text ? JSON.parse(text) : null;
      } else {
        data = await res.text();
      }
    } catch (parseError) {
      console.error("Error parsing test response:", parseError);
      data = { message: "Error parsing response", raw: await res.text() };
    }

    return new Response(
      JSON.stringify({
        success: res.ok,
        status: res.status,
        statusText: res.statusText,
        data: data,
        backendUrl: url.toString(),
        authorized: Boolean(authHeader),
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Orders test API error:", error);
    return new Response(
      JSON.stringify({
        message: "Test failed",
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
