import { NextRequest } from "next/server";
import { envConfig } from "@/config";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeInactive = searchParams.get("includeInactive");
  const search = searchParams.get("search");
  const page = searchParams.get("page") || "0";
  const limit = searchParams.get("limit") || "50";

  const params = new URLSearchParams();
  if (includeInactive) params.set("includeInactive", includeInactive);
  if (search) params.set("search", search);
  // Fix pagination: use page=1 for backend if page=0 from frontend
  const backendPage = parseInt(page) === 0 ? "1" : page;
  params.set("page", backendPage);
  params.set("limit", limit);

  const backendUrl = `${envConfig.NEXT_PUBLIC_BACKEND_URL}/api/${
    envConfig.NEXT_PUBLIC_API_VERSION
  }/brands?${params.toString()}`;

  console.log("Admin brands API called, backend URL:", backendUrl);

  try {
    const res = await fetch(backendUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Admin brands API error - status:", res.status);
      const errorText = await res.text();
      console.error("Error response:", errorText);

      return new Response(
        JSON.stringify({
          data: [],
          message: "Failed to fetch brands",
          error: errorText,
        }),
        {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await res.json();
    console.log("Admin brands API response:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Admin brands API error:", e);
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Creating brand with data:", body);

    const backendUrl = `${envConfig.NEXT_PUBLIC_BACKEND_URL}/api/${envConfig.NEXT_PUBLIC_API_VERSION}/brands`;

    console.log("Create brand API called, backend URL:", backendUrl);

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("Create brand API error - status:", res.status);
      const errorText = await res.text();
      console.error("Error response:", errorText);

      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to create brand",
          error: errorText,
        }),
        {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await res.json();
    console.log("Create brand API response:", data);

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Create brand API error:", e);
    return new Response(
      JSON.stringify({
        success: false,
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
