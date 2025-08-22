import { NextRequest } from "next/server";

// Provide static statuses for now. Replace with backend proxy if available.
export async function GET(_request: NextRequest) {
  return new Response(
    JSON.stringify({
      data: ["ACTIVE", "INACTIVE", "OUT_OF_STOCK"],
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
