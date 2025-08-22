"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchMe, meQueryKey } from "./query";

export function useMe() {
  return useQuery({ queryKey: meQueryKey, queryFn: fetchMe });
}

