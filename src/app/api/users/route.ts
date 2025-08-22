import { NextRequest } from "next/server";
import { envConfig } from "@/config";

export async function GET(_request: NextRequest) {
  try {
    const res = await fetch(`${envConfig.NEXT_PUBLIC_API_END_POINT}/users`, {
      cache: "no-store",
    });
    const contentType = res.headers.get("content-type") || "application/json";
    let data: any;
    try {
      if (contentType.includes("application/json")) {
        const text = await res.text();
        data = text ? JSON.parse(text) : null;
      } else {
        data = await res.text();
      }
    } catch {
      data = null;
    }
    return new Response(
      typeof data === "string" ? data : JSON.stringify(data),
      {
        status: res.status,
        headers: { "Content-Type": contentType },
      }
    );
  } catch {
    return new Response(JSON.stringify({ data: [] }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
