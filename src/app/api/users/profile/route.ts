import { NextRequest } from "next/server";
import { proxyJson } from "@/lib/next-api-auth";

export async function GET(request: NextRequest) {
  return proxyJson(
    `${process.env.NEXT_PUBLIC_API_END_POINT}/users/profile`,
    request,
    {
      method: "GET",
      requireAuth: true,
    }
  );
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    return proxyJson(
      `${process.env.NEXT_PUBLIC_API_END_POINT}/users/profile`,
      request,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        requireAuth: true,
      }
    );
  } catch (error) {
    console.error("Update profile error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
