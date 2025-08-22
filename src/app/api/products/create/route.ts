import { NextRequest } from "next/server";
import { envConfig } from "@/config";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Creating product with body:", body);

    // Get auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("sessionToken")?.value;

    const backendUrl = `${envConfig.NEXT_PUBLIC_BACKEND_URL}/api/${envConfig.NEXT_PUBLIC_API_VERSION}/products`;
    console.log("Create product API called, backend URL:", backendUrl);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(backendUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    console.log("Create product response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Create product API error:", errorText);

      return new Response(errorText, {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Create product error:", e);
    return new Response(JSON.stringify({ message: "Internal Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
