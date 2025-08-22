"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Menu, Search as SearchIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function SiteHeader() {
  const { toggle } = useSidebar();

  return (
    <header className="bg-white border-b h-16 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggle}
        >
          <Menu size={20} />
        </Button>
        <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-lg">
          <SearchIcon className="text-gray-500" size={18} />
          <Input
            placeholder="Tìm kiếm..."
            className="bg-transparent border-0 focus-visible:ring-0 ml-2 w-[260px]"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Bell className="text-gray-500" size={20} />
        <div className="flex items-center gap-2">
          <img
            src="https://placehold.co/36x36/fecdd3/be185d?text=A"
            alt="Admin"
            className="w-9 h-9 rounded-full"
          />
          <div className="hidden md:block">
            <div className="text-sm font-medium">Admin</div>
            <div className="text-xs text-muted-foreground">Quản trị viên</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
