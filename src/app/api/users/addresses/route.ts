import { NextRequest } from "next/server";
import { proxyJson } from "@/lib/next-api-auth";

export async function GET(request: NextRequest) {
  return proxyJson(
    `${process.env.NEXT_PUBLIC_API_END_POINT}/users/addresses`,
    request,
    {
      method: "GET",
      requireAuth: true,
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.type || !body.street || !body.city || !body.state || !body.zipCode || !body.country) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields: type, street, city, state, zipCode, country"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return proxyJson(
      `${process.env.NEXT_PUBLIC_API_END_POINT}/users/addresses`,
      request,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        requireAuth: true,
      }
    );
  } catch (error) {
    console.error("Add address error:", error);
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
