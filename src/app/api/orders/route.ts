import { NextRequest } from "next/server";
import { proxyJson } from "@/lib/next-api-auth";
import { emitOrderCreated } from "@/lib/sse-broadcaster";

export async function GET(request: NextRequest) {
  try {
    console.log(
      "Orders API called with params:",
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

    const url = new URL(`${process.env.NEXT_PUBLIC_API_END_POINT}/orders`);
    const page = request.nextUrl.searchParams.get("page");
    const size = request.nextUrl.searchParams.get("size");
    if (page) url.searchParams.set("page", page);
    if (size) url.searchParams.set("size", size);
    console.log("Backend URL:", url.toString());

    const response = await proxyJson(url.toString(), request, {
      method: "GET",
      requireAuth: true,
    });
    console.log("Orders API response status:", response.status);

    return response;
  } catch (e) {
    console.error("Orders API error:", e);
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

export async function PUT(request: NextRequest) {
  try {
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
    const body = await request.json();
    const orderId = body.orderId;
    const status = body.status;
    if (!orderId || !status) {
      return new Response(
        JSON.stringify({ message: "Missing orderId or status" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return proxyJson(
      `${process.env.NEXT_PUBLIC_API_END_POINT}/orders/${orderId}`,
      request,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        requireAuth: true,
      }
    );
  } catch (e) {
    console.error("Order update error:", e);
    return new Response(JSON.stringify({ message: "Internal Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
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
    const body = await request.json();
    const response = await proxyJson(
      `${process.env.NEXT_PUBLIC_API_END_POINT}/orders`,
      request,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        // allow unauth if backend allows public create; otherwise set true
        requireAuth: false,
      }
    );
    try {
      if (response.status >= 200 && response.status < 300) {
        let data;
        try {
          const text = await response.clone().text();
          data = text ? JSON.parse(text) : null;
        } catch (error) {
          console.error("JSON parse error:", error);
          data = null;
        }
        emitOrderCreated({ id: data?.data?.id ?? null, at: Date.now() });
      }
    } catch {}
    return response;
  } catch (e) {
    return new Response(JSON.stringify({ message: "Internal Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
