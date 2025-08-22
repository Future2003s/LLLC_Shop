import { ReactNode } from "react";
import { headers } from "next/headers";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import HydrateClient from "@/providers/hydrate-client";
import { meQueryKey } from "./query";

async function fetchMeServer() {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") || "http";
  const url = `${proto}://${host}/api/auth/me`;
  console.log("Server-side fetchMeServer URL:", url);

  const res = await fetch(url, {
    cache: "no-store",
    headers: { cookie: h.get("cookie") || "" },
  });

  console.log("Server-side fetch response:", {
    status: res.status,
    ok: res.ok,
  });

  if (!res.ok) {
    console.log("Server-side fetch failed:", res.status);
    return null;
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  console.log("Server-side fetch result:", { status: res.status, data });
  return data;
}

export default async function MeLayout({ children }: { children: ReactNode }) {
  const qc = new QueryClient();
  console.log("MeLayout: Starting prefetch...");
  await qc.prefetchQuery({ queryKey: meQueryKey, queryFn: fetchMeServer });
  console.log("MeLayout: Prefetch completed");
  const dehydratedState = dehydrate(qc);
  return <HydrateClient state={dehydratedState}>{children}</HydrateClient>;
}
