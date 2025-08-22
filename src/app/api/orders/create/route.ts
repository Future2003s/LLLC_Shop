import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    // For guest checkout, auth is optional
    // In a real app, you would persist the order and trigger notifications here
    const body = await request.json();
    // Basic validation
    if (
      !body?.customer?.fullName ||
      !body?.customer?.phone ||
      !body?.customer?.address
    ) {
      return new Response(
        JSON.stringify({ message: "Thiếu thông tin khách hàng" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    // Prepare headers - include auth if available
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authHeader && authHeader.startsWith("Bearer ")) {
      headers.Authorization = authHeader;
    }

    // Proxy to backend guest orders create
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_END_POINT}/orders/guest`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );
    const contentType = res.headers.get("content-type") || "";
    let data;
    try {
      if (contentType.includes("application/json")) {
        const text = await res.text();
        data = text ? JSON.parse(text) : null;
      } else {
        data = await res.text();
      }
    } catch (error) {
      console.error("JSON parse error:", error);
      data = null;
    }
    return new Response(
      typeof data === "string" ? data : JSON.stringify(data),
      {
        status: res.status,
        headers: { "Content-Type": contentType || "application/json" },
      }
    );
  } catch (e) {
    return new Response(JSON.stringify({ message: "Internal Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
