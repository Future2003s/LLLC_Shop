import { NextRequest } from "next/server";
import { envConfig } from "@/config";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    console.log(`Updating brand ${id} with data:`, body);

    const backendUrl = `${envConfig.NEXT_PUBLIC_BACKEND_URL}/api/${envConfig.NEXT_PUBLIC_API_VERSION}/brands/${id}`;

    console.log("Update brand API called, backend URL:", backendUrl);

    const res = await fetch(backendUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("Update brand API error - status:", res.status);
      const errorText = await res.text();
      console.error("Error response:", errorText);

      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to update brand",
          error: errorText,
        }),
        {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await res.json();
    console.log("Update brand API response:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Update brand API error:", e);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(`Deleting brand ${id}`);

    const backendUrl = `${envConfig.NEXT_PUBLIC_BACKEND_URL}/api/${envConfig.NEXT_PUBLIC_API_VERSION}/brands/${id}`;

    console.log("Delete brand API called, backend URL:", backendUrl);

    const res = await fetch(backendUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Delete brand API error - status:", res.status);
      const errorText = await res.text();
      console.error("Error response:", errorText);

      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to delete brand",
          error: errorText,
        }),
        {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await res.json();
    console.log("Delete brand API response:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Delete brand API error:", e);
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
