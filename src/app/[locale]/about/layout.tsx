import React, { Fragment } from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return <div className="mt-25 container mx-auto">{children}</div>;
}
