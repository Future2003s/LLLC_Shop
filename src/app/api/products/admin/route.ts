import { NextRequest } from "next/server";
import { envConfig } from "@/config";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const categoryId = searchParams.get("categoryId");
  const status = searchParams.get("status");
  const page = searchParams.get("page") || "0";
  const size = searchParams.get("size") || "20";

  const params = new URLSearchParams();
  if (q) params.set("search", q);
  if (categoryId) params.set("category", categoryId);
  if (status) params.set("status", status);
  params.set("page", page);
  params.set("limit", size);

  const backendUrl = `${envConfig.NEXT_PUBLIC_BACKEND_URL}/api/${
    envConfig.NEXT_PUBLIC_API_VERSION
  }/products?${params.toString()}`;

  console.log("Admin products API called, backend URL:", backendUrl);

  try {
    const res = await fetch(backendUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Admin products API error - status:", res.status);
      const errorText = await res.text();
      console.error("Error response:", errorText);

      return new Response(
        JSON.stringify({
          data: [],
          message: "Failed to fetch admin products",
          error: errorText,
        }),
        {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await res.json();
    console.log("Admin products API response:", data);

    // Transform backend response to match frontend expectations
    const transformedData = {
      data: data.data || [],
      pagination: data.pagination || {
        page: parseInt(page),
        size: parseInt(size),
        totalElements: 0,
        totalPages: 0,
      },
    };

    return new Response(JSON.stringify(transformedData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Admin products API error:", e);
    return new Response(
      JSON.stringify({
        data: [],
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
