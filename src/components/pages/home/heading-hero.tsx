// components/HeadingHero.tsx
import { cn } from "@/lib/utils";
import React from "react";

export default function HeadingHero({ className }: { className: string }) {
  return (
    <h1
      className={cn(
        className,
        "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
      )}
    >
      Vải Thanh Hà
      <span className="block text-xl sm:text-2xl lg:text-3xl font-normal text-gray-600 mt-2">
        (タンハーライチ)
      </span>
    </h1>
  );
}
