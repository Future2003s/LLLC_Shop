import { NextRequest } from "next/server";
import { proxyJson } from "@/lib/next-api-auth";

export async function PUT(request: NextRequest, ctx: any) {
  try {
    const addressId = ctx?.params?.addressId as string;
    
    if (!addressId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing address ID"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return proxyJson(
      `${process.env.NEXT_PUBLIC_API_END_POINT}/users/addresses/${addressId}/default`,
      request,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
        requireAuth: true,
      }
    );
  } catch (error) {
    console.error("Set default address error:", error);
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
