import { NextRequest } from "next/server";
import { proxyJson } from "@/lib/next-api-auth";
import { envConfig } from "@/config";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();
    const url = `${envConfig.NEXT_PUBLIC_BACKEND_URL}/api/${envConfig.NEXT_PUBLIC_API_VERSION}/orders/${id}/status`;

    console.log("Updating order status:", { id, body, url });
    console.log("Request body type:", typeof body);
    console.log("Request body keys:", Object.keys(body));

    // Log request details for debugging
    console.log(
      "Request headers:",
      Object.fromEntries(request.headers.entries())
    );
    console.log("Request cookies:", request.cookies.getAll());

    const response = await proxyJson(url, request, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      requireAuth: true,
    });

    // Log the response for debugging
    console.log("Order status update response status:", response.status);
    console.log(
      "Order status update response headers:",
      Object.fromEntries(response.headers.entries())
    );

    console.log("Order status update response:", response.status);
    return response;
  } catch (e) {
    console.error("Order status update error:", e);
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
