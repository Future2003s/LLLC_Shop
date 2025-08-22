import { NextRequest } from "next/server";
import { proxyJson } from "@/lib/next-api-auth";
import { API_CONFIG } from "@/lib/api-config";

export async function GET(request: NextRequest) {
  return proxyJson(`${API_CONFIG.API_BASE_URL}${API_CONFIG.AUTH.ME}`, request, {
    method: "GET",
    requireAuth: true,
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  return proxyJson(`${API_CONFIG.API_BASE_URL}${API_CONFIG.AUTH.ME}`, request, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    requireAuth: true,
  });
}
