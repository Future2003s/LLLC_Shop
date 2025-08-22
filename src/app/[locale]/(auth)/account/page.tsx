"use client";
import { useAppContextProvider } from "@/context/app-context";
import React from "react";

export default function Page() {
  const { setSessionToken } = useAppContextProvider();

  return <div className="mt-25"></div>;
}
