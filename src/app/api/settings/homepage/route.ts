import { NextRequest } from "next/server";
import { envConfig } from "@/config";
import { proxyJson } from "@/lib/next-api-auth";

// Site settings for homepage banners, hero texts, etc.
// Supports GET for public consumption and PUT for admin updates (auth required).

export async function GET(request: NextRequest) {
  const base = envConfig.NEXT_PUBLIC_API_END_POINT;
  const template = process.env.API_SETTINGS_HOMEPAGE_GET_URL_TEMPLATE; // e.g., /settings/homepage
  const candidates: string[] = [];
  if (template) candidates.push(template);
  candidates.push("/settings/homepage");
  candidates.push("/site-settings/homepage");

  for (const path of candidates) {
    const backendUrl = `${base}${path.startsWith("/") ? path : `/${path}`}`;
    const res = await fetch(backendUrl, { cache: "no-store" });
    if (res.status !== 404 && res.status !== 405) {
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
    }
  }

  return new Response(
    JSON.stringify({ message: "Homepage settings not found" }),
    {
      status: 404,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function PUT(request: NextRequest) {
  const base = envConfig.NEXT_PUBLIC_API_END_POINT;
  const template = process.env.API_SETTINGS_HOMEPAGE_PUT_URL_TEMPLATE; // e.g., /settings/homepage
  const candidates: string[] = [];
  if (template) candidates.push(template);
  candidates.push("/settings/homepage");
  candidates.push("/site-settings/homepage");

  let body: any = null;
  try {
    body = await request.json();
  } catch {}

  for (const path of candidates) {
    const backendUrl = `${base}${path.startsWith("/") ? path : `/${path}`}`;
    const res = await proxyJson(backendUrl, request, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
      requireAuth: true,
    });
    if (res.status !== 404 && res.status !== 405) return res;
  }

  return new Response(
    JSON.stringify({ message: "Homepage settings update not found" }),
    {
      status: 404,
      headers: { "Content-Type": "application/json" },
    }
  );
}
