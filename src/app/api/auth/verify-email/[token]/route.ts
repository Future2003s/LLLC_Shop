import { NextRequest } from "next/server";

export async function GET(request: NextRequest, ctx: any) {
  try {
    const token = ctx?.params?.token as string;
    
    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing verification token"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Forward to backend
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_END_POINT}/auth/verify-email/${token}`,
      {
        method: "GET",
      }
    );

    const contentType = res.headers.get("content-type") || "application/json";
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
      data = { success: false, error: "Invalid response from server" };
    }

    return new Response(
      typeof data === "string" ? data : JSON.stringify(data),
      {
        status: res.status,
        headers: { "Content-Type": contentType },
      }
    );
  } catch (error) {
    console.error("Verify email error:", error);
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
