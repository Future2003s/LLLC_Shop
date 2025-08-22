import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value || "";
    const baseUrl =
      process.env.NEXT_PUBLIC_API_END_POINT || "http://localhost:8081/api/v1";
    const res = await fetch(`${baseUrl}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    const contentType = res.headers.get("content-type") || "application/json";
    let data;
    try {
      if (contentType.includes("application/json")) {
        const text = await res.text();
        data = text ? JSON.parse(text) : null;
      } else {
        data = await res.text();
      }
    } catch (error) {
      console.error("JSON parse error:", error);
      data = null;
    }
    // If backend returned new tokens, set them as HttpOnly cookies
    if (res.ok && data?.success && data?.data?.token) {
      const isProd = process.env.NODE_ENV === "production";
      const accessCookie = [
        `sessionToken=${data.data.token}`,
        "Path=/",
        "HttpOnly",
        "SameSite=Lax",
      ];
      if (isProd) accessCookie.push("Secure");

      const cookiesToSet: string[] = [accessCookie.join("; ")];
      if (data.data.refreshToken) {
        const refreshCookie = [
          `refreshToken=${data.data.refreshToken}`,
          "Path=/",
          "HttpOnly",
          "SameSite=Strict",
        ];
        if (isProd) refreshCookie.push("Secure");
        cookiesToSet.push(refreshCookie.join("; "));
      }

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Set-Cookie": cookiesToSet.join(", "),
        },
      });
    }

    return new Response(
      typeof data === "string" ? data : JSON.stringify(data),
      {
        status: res.status,
        headers: { "Content-Type": contentType },
      }
    );
  } catch (e) {
    return new Response(JSON.stringify({ message: "Internal Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
