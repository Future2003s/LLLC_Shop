import { NextRequest } from "next/server";
import { proxyJson } from "@/lib/next-api-auth";

export async function GET(request: NextRequest) {
  return proxyJson(
    `${process.env.NEXT_PUBLIC_API_END_POINT}/reports/dashboard`,
    request,
    { method: "GET", requireAuth: true }
  );
}
