import { NextRequest } from "next/server";
import { addSSEClient, removeSSEClient } from "@/lib/sse-broadcaster";

export async function GET(_req: NextRequest) {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  addSSEClient(writer);
  const encoder = new TextEncoder();

  // Send initial ping
  await writer.write(encoder.encode(`event: ping\ndata: ok\n\n`));

  const interval = setInterval(() => {
    writer.write(encoder.encode(`event: ping\ndata: ok\n\n`)).catch(() => {});
  }, 30000);

  const response = new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });

  // Cleanup when client disconnects
  response.headers.set("X-Accel-Buffering", "no");
  // Note: no direct close hook, rely on GC and interval clears below
  (response as any).finally?.(() => {
    clearInterval(interval);
    writer.close().catch(() => {});
    removeSSEClient(writer);
  });

  return response;
}
