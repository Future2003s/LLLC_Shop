import { NextRequest } from "next/server";
import { envConfig } from "@/config";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeInactive = searchParams.get("includeInactive");
  const search = searchParams.get("search");
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "50";

  const params = new URLSearchParams();
  if (includeInactive) params.set("includeInactive", includeInactive);
  if (search) params.set("search", search);
  params.set("page", page);
  params.set("limit", limit);

  const backendUrl = `${envConfig.NEXT_PUBLIC_BACKEND_URL}/api/${
    envConfig.NEXT_PUBLIC_API_VERSION
  }/brands?${params.toString()}`;

  console.log("Brands API called, backend URL:", backendUrl);

  try {
    const res = await fetch(backendUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Brands API error - status:", res.status);
      return new Response(
        JSON.stringify({ data: [], message: "Failed to fetch brands" }),
        {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await res.json();
    console.log("Brands API response:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Brands API error:", e);
    return new Response(
      JSON.stringify({ data: [], message: "Internal Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
