"use client";
import { HydrationBoundary, type DehydratedState } from "@tanstack/react-query";
import React from "react";

export default function HydrateClient({
  state,
  children,
}: {
  state: DehydratedState;
  children: React.ReactNode;
}) {
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}
