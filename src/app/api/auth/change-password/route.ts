import { NextRequest } from "next/server";
import { proxyJson } from "@/lib/next-api-auth";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.currentPassword || !body.newPassword) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields: currentPassword, newPassword"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return proxyJson(
      `${process.env.NEXT_PUBLIC_API_END_POINT}/auth/change-password`,
      request,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        requireAuth: true,
      }
    );
  } catch (error) {
    console.error("Change password error:", error);
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
