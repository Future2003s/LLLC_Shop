import { NextRequest } from "next/server";
import { envConfig } from "@/config";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeInactive = searchParams.get("includeInactive");
  const parent = searchParams.get("parent");

  const params = new URLSearchParams();
  if (includeInactive) params.set("includeInactive", includeInactive);
  if (parent) params.set("parent", parent);

  const query = params.toString();
  const backendUrl = `${envConfig.NEXT_PUBLIC_BACKEND_URL}/api/${
    envConfig.NEXT_PUBLIC_API_VERSION
  }/categories${query ? `?${query}` : ""}`;

  console.log("Categories API called, backend URL:", backendUrl);

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sessionToken")?.value || "";
    const res = await fetch(backendUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      console.error("Categories API error - status:", res.status);
      return new Response(
        JSON.stringify({ data: [], message: "Failed to fetch categories" }),
        {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await res.json();
    console.log("Categories API response:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Categories API error:", e);
    return new Response(
      JSON.stringify({ data: [], message: "Internal Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sessionToken")?.value || "";

    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Authentication required",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const body = await request.json();
    const backendUrl = `${envConfig.NEXT_PUBLIC_BACKEND_URL}/api/${envConfig.NEXT_PUBLIC_API_VERSION}/categories`;

    console.log("Creating category, backend URL:", backendUrl);
    console.log("Category data:", body);

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        "Category creation failed - status:",
        res.status,
        "error:",
        errorText
      );

      return new Response(errorText, {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    console.log("Category created successfully:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Category creation API error:", e);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal Error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
