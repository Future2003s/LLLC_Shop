import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sessionToken")?.value;

  try {
    if (token) {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_END_POINT || "http://localhost:8081/api/v1";
      await fetch(`${baseUrl}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  } finally {
    cookieStore.delete("sessionToken");
    cookieStore.delete("refreshToken");
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
