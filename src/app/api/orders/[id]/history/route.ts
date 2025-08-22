import { NextRequest } from "next/server";
import { proxyJson } from "@/lib/next-api-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    const url = `${process.env.NEXT_PUBLIC_API_END_POINT}/orders/${id}/history`;

    console.log("Fetching order history:", { id, url });

    const response = await proxyJson(url, request, {
      method: "GET",
      requireAuth: true,
    });

    console.log("Order history response:", response.status);
    return response;
  } catch (e) {
    console.error("Order history error:", e);
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
