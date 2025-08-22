import { NextRequest } from "next/server";
import { envConfig } from "@/config";
import { proxyJson } from "@/lib/next-api-auth";

// Upload banner image, update text for homepage hero/banner.
// Accepts multipart/form-data or JSON depending on backend.

export async function PUT(request: NextRequest) {
  const base = envConfig.NEXT_PUBLIC_API_END_POINT;
  const template = process.env.API_SETTINGS_BANNER_PUT_URL_TEMPLATE; // e.g., /settings/homepage/banner
  const candidates: string[] = [];
  if (template) candidates.push(template);
  candidates.push("/settings/homepage/banner");
  candidates.push("/site-settings/homepage/banner");

  // If multipart, we forward raw body without JSON parsing
  const contentType = request.headers.get("content-type") || "";
  const init: RequestInit & { requireAuth?: boolean } = {
    method: "PUT",
    headers: contentType.includes("multipart/")
      ? {}
      : { "Content-Type": "application/json" },
    body: contentType.includes("multipart/")
      ? (request as any).body
      : await request.text(),
    requireAuth: true,
  };

  for (const path of candidates) {
    const backendUrl = `${base}${path.startsWith("/") ? path : `/${path}`}`;
    const res = await proxyJson(backendUrl, request, init);
    if (res.status !== 404 && res.status !== 405) return res;
  }
  return new Response(
    JSON.stringify({ message: "Banner update endpoint not found" }),
    {
      status: 404,
      headers: { "Content-Type": "application/json" },
    }
  );
}
