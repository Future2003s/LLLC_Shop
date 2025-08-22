import { NextRequest } from "next/server";
import { envConfig } from "@/config";

export async function GET(request: NextRequest) {
  try {
    const backendUrl = `${envConfig.NEXT_PUBLIC_BACKEND_URL}/api/${envConfig.NEXT_PUBLIC_API_VERSION}/health`;

    console.log("Testing backend connection to:", backendUrl);
    console.log("Environment config:", {
      backendUrl: envConfig.NEXT_PUBLIC_BACKEND_URL,
      apiVersion: envConfig.NEXT_PUBLIC_API_VERSION,
    });

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Backend health check response:", {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
    });

    if (response.ok) {
      const data = await response.json();
      return new Response(
        JSON.stringify({
          success: true,
          message: "Backend connection successful",
          backendUrl,
          response: data,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      const errorText = await response.text();
      console.error("Backend health check failed:", errorText);

      return new Response(
        JSON.stringify({
          success: false,
          message: "Backend connection failed",
          backendUrl,
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          timestamp: new Date().toISOString(),
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error testing backend connection:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to connect to backend",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
