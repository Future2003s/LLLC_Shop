import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return <section className="mt-25">{children}</section>;
}

export default layout;
