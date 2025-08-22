import { NextRequest } from "next/server";
import { proxyJson } from "@/lib/next-api-auth";

export async function PUT(request: NextRequest, ctx: any) {
  try {
    const addressId = ctx?.params?.addressId as string;
    const body = await request.json();
    
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
      `${process.env.NEXT_PUBLIC_API_END_POINT}/users/addresses/${addressId}`,
      request,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        requireAuth: true,
      }
    );
  } catch (error) {
    console.error("Update address error:", error);
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

export async function DELETE(request: NextRequest, ctx: any) {
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
      `${process.env.NEXT_PUBLIC_API_END_POINT}/users/addresses/${addressId}`,
      request,
      {
        method: "DELETE",
        requireAuth: true,
      }
    );
  } catch (error) {
    console.error("Delete address error:", error);
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
