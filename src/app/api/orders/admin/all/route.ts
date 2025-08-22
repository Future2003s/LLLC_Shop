import { NextRequest } from "next/server";
import { proxyJson } from "@/lib/next-api-auth";

export async function GET(request: NextRequest) {
  try {
    console.log(
      "Admin Orders API called with params:",
      request.nextUrl.searchParams.toString()
    );

    // Kiểm tra environment variable
    if (!process.env.NEXT_PUBLIC_API_END_POINT) {
      console.error("NEXT_PUBLIC_API_END_POINT is not defined");
      return new Response(
        JSON.stringify({ message: "Backend URL not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const url = new URL(
      `${process.env.NEXT_PUBLIC_API_END_POINT}/orders/admin/all`
    );

    // Copy all search params
    const searchParams = request.nextUrl.searchParams;
    for (const [key, value] of searchParams.entries()) {
      url.searchParams.set(key, value);
    }

    console.log("Backend URL:", url.toString());

    const response = await proxyJson(url.toString(), request, {
      method: "GET",
      requireAuth: true,
    });
    console.log("Admin Orders API response status:", response.status);

    return response;
  } catch (e) {
    console.error("Admin Orders API error:", e);
    return new Response(
      JSON.stringify({
        message: "Internal Error",
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
