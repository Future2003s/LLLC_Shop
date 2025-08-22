"use client";
import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  ClipboardList,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

const navItems = [
  { id: "dashboard", label: "Tổng Quan", icon: <LayoutDashboard size={18} /> },
  { id: "orders", label: "Đơn Hàng", icon: <ClipboardList size={18} /> },
  { id: "products", label: "Sản Phẩm", icon: <ShoppingBag size={18} /> },
  { id: "accounts", label: "Tài Khoản", icon: <Users size={18} /> },
  { id: "settings", label: "Cài Đặt", icon: <Settings size={18} /> },
];

export function AppSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isOpen, close } = useSidebar();

  const baseHref = useMemo(() => {
    return "/dashboard";
  }, [pathname]);

  const currentSection = searchParams?.get("section") || "dashboard";

  return (
    <>
      <aside className="hidden lg:flex fixed left-0 top-0 h-svh w-64 bg-white border-r shadow-sm z-40 flex-col">
        <div className="h-16 border-b flex items-center px-6">
          <div className="h-9 w-9 rounded-md bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
            L
          </div>
          <div className="ml-3">
            <div className="font-bold">LALA-LYCHEE</div>
            <div className="text-xs text-muted-foreground">Admin</div>
          </div>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map((item) => {
            const href = `${baseHref}?section=${item.id}`;
            const isActive = currentSection === item.id;
            return (
              <Link
                key={item.id}
                href={href}
                className={`flex items-center gap-3 py-3 px-6 my-0.5 transition-colors ${
                  isActive
                    ? "bg-pink-100 text-pink-600 border-r-4 border-pink-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={close}></div>
          <aside className="relative z-10 w-64 h-full bg-white shadow-lg flex flex-col">
            <div className="h-16 border-b flex items-center px-4">
              <div className="h-9 w-9 rounded-md bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                L
              </div>
              <div className="ml-2 font-semibold">LALA-LYCHEE</div>
            </div>
            <nav className="flex-1 py-3">
              {navItems.map((item) => {
                const href = `${baseHref}?section=${item.id}`;
                const isActive = currentSection === item.id;
                return (
                  <Link
                    key={item.id}
                    href={href}
                    onClick={close}
                    className={`flex items-center gap-3 py-3 px-4 my-0.5 transition-colors ${
                      isActive
                        ? "bg-pink-100 text-pink-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}

export default AppSidebar;
