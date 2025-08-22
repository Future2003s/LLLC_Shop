"use client";
import { usePathname } from "next/navigation";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import CartSidebar from "@/components/ui/cart-sidebar";
import { useCartSidebar } from "@/context/cart-sidebar-context";

function LayoutMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isOpen, closeSidebar } = useCartSidebar();

  // check page admin
  const isAdminPage = pathname.startsWith("/dashboard");

  return (
    <div>
      {!isAdminPage && <Header />}
      <main>{children}</main>
      {!isAdminPage && <Footer />}

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isOpen} onClose={closeSidebar} />
    </div>
  );
}

export default LayoutMain;
