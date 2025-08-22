import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation mirroring backend rules (lengths checked backend-side too)
    const required = ["firstName", "lastName", "email", "password"] as const;
    const missing = required.filter((k) => !body?.[k]);
    if (missing.length) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missing.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_API_END_POINT || "http://localhost:8081/api/v1";
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const contentType = res.headers.get("content-type") || "application/json";
    const text = await res.text();
    const data =
      contentType.includes("application/json") && text
        ? JSON.parse(text)
        : text;

    if (!res.ok) {
      return NextResponse.json(
        typeof data === "string" ? { success: false, message: data } : data,
        { status: res.status }
      );
    }

    return NextResponse.json(
      typeof data === "string" ? { success: true, data: data } : data,
      { status: res.status }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
