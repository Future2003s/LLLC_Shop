"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Bell, ChevronsLeft, ChevronsRight, Menu, Search } from "lucide-react";

export type AdminNavItem = {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export default function AdminShell({
  children,
  navItems,
  brand = { name: "LALA-LYCHEE", short: "L" },
  notifCount = 0,
  userName = "Admin",
}: {
  children: React.ReactNode;
  navItems: AdminNavItem[];
  brand?: { name: string; short: string };
  notifCount?: number;
  userName?: string;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const openDrawer = () => {
    setSidebarOpen(true);
    requestAnimationFrame(() => setDrawerVisible(true));
  };
  const closeDrawer = () => {
    setDrawerVisible(false);
    setTimeout(() => setSidebarOpen(false), 200);
  };
  // Draggable menu button position (persisted per path)
  const storageKey = (p: string) => `admin_fab_pos:${p || "root"}`;
  // Return a constant position for the initial server and client render to avoid hydration mismatch
  const initialPos = () =>
    ({ left: 12, top: 200 } as { left: number; top: number });
  const [fabPos, setFabPos] = useState<{ left: number; top: number }>(
    initialPos
  );
  const dragRef = useRef<HTMLDivElement>(null);
  // Click vs drag threshold handling for FAB
  const DRAG_THRESHOLD = 10; // px
  const dragInfoRef = useRef<{
    startX: number;
    startY: number;
    dragging: boolean;
  }>({ startX: 0, startY: 0, dragging: false });

  const pointerRef = useRef<{ isDown: boolean; pointerId: number }>({
    isDown: false,
    pointerId: -1,
  });

  useEffect(() => {
    // Clamp position when viewport changes
    const clamp = () => {
      setFabPos((pos) => {
        const pad = 8;
        const w = typeof window !== "undefined" ? window.innerWidth : 390;
        const h = typeof window !== "undefined" ? window.innerHeight : 844;
        const size = 56; // button approx 56px
        const left = Math.min(
          Math.max(pos.left, pad),
          Math.max(pad, w - size - pad)
        );
        const top = Math.min(
          Math.max(pos.top, pad),
          Math.max(pad, h - size - pad)
        );
        return { left, top };
      });
    };
    clamp();
    window.addEventListener("resize", clamp);
    return () => window.removeEventListener("resize", clamp);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(pathname || "/"), JSON.stringify(fabPos));
    } catch {}
  }, [fabPos, pathname]);

  const onDrag = (e: React.PointerEvent) => {
    const el = dragRef.current;
    if (!el) return;
    const rect = el.parentElement?.getBoundingClientRect();
    const pad = 8;
    const size = 56;
    const w = rect?.width || window.innerWidth;
    const h = rect?.height || window.innerHeight;
    const left = Math.min(
      Math.max(e.clientX - size / 2, pad),
      Math.max(pad, w - size - pad)
    );
    const top = Math.min(
      Math.max(e.clientY - size / 2, pad),
      Math.max(pad, h - size - pad)
    );
    setFabPos({ left, top });
  };

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const currentSectionLabel = (() => {
    const match = navItems.find((i) => pathname?.startsWith(i.href));
    return match?.label || "";
  })();

  const groups = [
    {
      label: "Quản lý",
      ids: new Set(["dashboard", "orders", "products", "admin-products"]),
    },
    { label: "Hệ thống", ids: new Set(["accounts", "analytics", "settings"]) },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-100 text-gray-800">
        {/* Desktop sidebar (hidden on mobile, use drawer below) */}
        <aside
          className={`hidden lg:flex flex-col ${
            sidebarCollapsed ? "w-20" : "w-64"
          } bg-white shadow-lg transition-all duration-300 overflow-hidden min-h-screen z-30`}
        >
          <div className="h-20 border-b flex items-center px-6 flex-shrink-0">
            <div className="h-10 w-10 rounded-md bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
              {brand.short}
            </div>
            <div className={`ml-3 ${sidebarCollapsed ? "hidden" : "block"}`}>
              <div className="font-bold">{brand.name}</div>
              <div className="text-xs text-muted-foreground">Admin</div>
            </div>
          </div>
          <nav className="flex-1 py-4 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname?.startsWith(item.href) || false;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 hover:bg-rose-50 transition-colors cursor-pointer ${
                    isActive
                      ? "text-rose-600 bg-rose-50 font-semibold"
                      : "text-slate-700"
                  }`}
                >
                  <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </span>
                  <span
                    className={`${
                      sidebarCollapsed ? "hidden" : "block"
                    } truncate`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile drawer */}
        {sidebarOpen && (
          <div
            className={`fixed inset-0 z-50 ${
              drawerVisible ? "opacity-100" : "opacity-0"
            } transition-opacity duration-200`}
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={closeDrawer}
            />
            <aside
              className={`relative z-10 w-64 h-full bg-white shadow-lg flex flex-col transform ${
                drawerVisible ? "translate-x-0" : "-translate-x-full"
              } transition-transform duration-200 will-change-transform`}
            >
              <div className="h-16 border-b flex items-center px-4 flex-shrink-0">
                <div className="h-9 w-9 rounded-md bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                  {brand.short}
                </div>
                <div className="ml-2 font-semibold">{brand.name}</div>
              </div>
              <nav className="flex-1 py-3 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = pathname?.startsWith(item.href) || false;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={closeDrawer}
                      className={`block px-4 py-2.5 hover:bg-rose-50 transition-colors cursor-pointer ${
                        isActive
                          ? "text-rose-600 bg-rose-50 font-semibold"
                          : "text-slate-700"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Mobile quick-launch draggable menu button */}
        <div
          ref={dragRef}
          className="lg:hidden fixed z-40 touch-none active:scale-[0.98]"
          style={{ left: fabPos.left, top: fabPos.top }}
          onPointerDown={(e) => {
            pointerRef.current.isDown = true;
            pointerRef.current.pointerId = e.pointerId;
            (e.currentTarget as any).setPointerCapture(e.pointerId);
            const info = dragInfoRef.current;
            info.startX = e.clientX;
            info.startY = e.clientY;
            info.dragging = false;
            e.currentTarget.classList.add("ring-2", "ring-blue-400");
          }}
          onPointerUp={(e) => {
            pointerRef.current.isDown = false;
            pointerRef.current.pointerId = -1;
            try {
              e.currentTarget.classList.remove("ring-2", "ring-blue-400");
            } catch {}
            const info = dragInfoRef.current;
            if (!info.dragging) {
              openDrawer();
            }
          }}
          onPointerCancel={(e) => {
            pointerRef.current.isDown = false;
            pointerRef.current.pointerId = -1;
            try {
              e.currentTarget.classList.remove("ring-2", "ring-blue-400");
            } catch {}
            dragInfoRef.current.dragging = false;
          }}
          onPointerMove={(e) => {
            // Ignore move if pointer isn't down or belongs to a different pointer (multi-touch safety)
            if (
              !pointerRef.current.isDown ||
              pointerRef.current.pointerId !== e.pointerId
            )
              return;
            const info = dragInfoRef.current;
            const dx = Math.abs(e.clientX - info.startX);
            const dy = Math.abs(e.clientY - info.startY);
            const dist = Math.hypot(dx, dy);
            if (!info.dragging && dist < DRAG_THRESHOLD) return;
            info.dragging = true;
            const el = dragRef.current;
            if (!el) return;
            const rect = el.parentElement?.getBoundingClientRect();
            const pad = 8;
            const size = 56;
            const w = rect?.width || window.innerWidth;
            const h = rect?.height || window.innerHeight;
            const left = Math.min(
              Math.max(e.clientX - size / 2, pad),
              Math.max(pad, w - size - pad)
            );
            const top = Math.min(
              Math.max(e.clientY - size / 2, pad),
              Math.max(pad, h - size - pad)
            );
            setFabPos({ left, top });
          }}
        >
          <Button
            variant="default"
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg active:scale-[0.98]"
            aria-label="Mở menu"
          >
            <Menu size={22} />
          </Button>
        </div>

        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm h-16 flex items-center justify-between px-3 sm:px-4 lg:px-8">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={openDrawer}>
                <Menu size={20} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:inline-flex"
                onClick={() => setSidebarCollapsed((v) => !v)}
                aria-label="Toggle sidebar"
              >
                {sidebarCollapsed ? (
                  <ChevronsRight size={20} />
                ) : (
                  <ChevronsLeft size={20} />
                )}
              </Button>
              <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-lg">
                <Search className="text-gray-500" size={18} />
                <Input
                  placeholder="Tìm kiếm..."
                  className="bg-transparent border-0 focus-visible:ring-0 ml-2 w-[260px]"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label="Thông báo"
                  >
                    <Bell className="h-5 w-5 text-gray-600" />
                    {notifCount > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-medium leading-none text-white bg-pink-600 rounded-full">
                        {notifCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Không có thông báo mới</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2">
                    <img
                      src="https://placehold.co/36x36/fecdd3/be185d?text=A"
                      alt="Admin"
                      className="w-9 h-9 rounded-full"
                    />
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium">{userName}</div>
                      <div className="text-xs text-muted-foreground">
                        Quản trị viên
                      </div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
                  <DropdownMenuItem>Đổi mật khẩu</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Đăng xuất</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
