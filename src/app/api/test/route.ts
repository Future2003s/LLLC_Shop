import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Test connection to backend
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_END_POINT}/test`,
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
      data = { message: "Invalid response from backend" };
    }

    return new Response(
      JSON.stringify({
        frontend: "OK",
        backend: res.ok ? "OK" : "ERROR",
        backendStatus: res.status,
        backendData: data,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Backend test error:", error);
    return new Response(
      JSON.stringify({
        frontend: "OK",
        backend: "ERROR",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
