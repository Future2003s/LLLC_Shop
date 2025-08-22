// Simple in-memory broadcaster (per server instance)
const clients = new Set<WritableStreamDefaultWriter<string>>();

export function addSSEClient(writer: WritableStreamDefaultWriter<string>) {
  clients.add(writer);
}

export function removeSSEClient(writer: WritableStreamDefaultWriter<string>) {
  clients.delete(writer);
}

export function emitOrderCreated(payload: any) {
  const data = typeof payload === "string" ? payload : JSON.stringify(payload);
  const encoder = new TextEncoder();
  clients.forEach(async (w) => {
    try {
      await w.write(encoder.encode(`event: order\ndata: ${data}\n\n`) as any);
    } catch {}
  });
}
