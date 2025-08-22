"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut, ShoppingCart, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getUserFullName,
  getUserAvatarUrl,
  UserProfile,
} from "@/apiRequests/users";

export function UserMenu() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (isLoading) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/login">Đăng nhập</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Đăng ký</Link>
        </Button>
      </div>
    );
  }

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  const getInitials = (firstName: string, lastName: string) => {
    return (firstName[0] + lastName[0]).toUpperCase();
  };

  // ép kiểu user về UserProfile để dùng helper
  const fullName = getUserFullName(user as unknown as UserProfile);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={getUserAvatarUrl(user.avatar)} alt={fullName} />
            <AvatarFallback className="bg-rose-100 text-rose-700 text-sm font-medium">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span className="inline-block bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full text-xs font-medium">
                {user.role.toUpperCase()}
              </span>
              {("isEmailVerified" in user
                ? (user as any).isEmailVerified
                : false) && (
                <span className="inline-block bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-xs font-medium">
                  ✓
                </span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/me" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Trang cá nhân</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/cart" className="cursor-pointer">
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Giỏ hàng</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/orders" className="cursor-pointer">
            <Package className="mr-2 h-4 w-4" />
            <span>Đơn hàng của tôi</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Cài đặt</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
