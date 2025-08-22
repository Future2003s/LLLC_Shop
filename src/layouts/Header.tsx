"use client";
import { envConfig } from "@/config";
import Link from "next/link";
import Image from "next/image";
import { useAppContextProvider } from "@/context/app-context";
import { useCart } from "@/context/cart-context";
import { useCartSidebar } from "@/context/cart-sidebar-context";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { ThemeToggle } from "@/components/ui/theme-toggle";
const LanguageSwitcher = dynamic(
  () => import("@/components/LanguageSwitcher"),
  { ssr: false }
);
import type { ComponentType } from "react";
const MobileNavSheet = dynamic(() => import("./MobileNav"), {
  ssr: false,
}) as unknown as ComponentType<{
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  navLinks: ReturnType<typeof getNavLinks>;
}>;
import { useI18n } from "@/i18n/I18nProvider";
import useTranslations from "@/i18n/useTranslations";
import { useAuth } from "@/hooks/useAuth";
import accountApiRequest from "@/apiRequests/account";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

// Navigation links will be translated in component
const getNavLinks = (
  t: (key: string) => string,
  locale: string,
  isAdmin: boolean
) => {
  const links: any[] = [
    { href: `/${locale}`, label: t("nav.home") },
    {
      label: t("nav.products"),
      href: `/${locale}/shop`,
      subItems: [
        { href: `/${locale}/products`, label: t("nav.all_products") },
        {
          href: `/${locale}/products?q=m%E1%BA%ADt+ong`,
          label: t("nav.honey"),
        },
        {
          href: `/${locale}/products?q=v%E1%BA%A3i`,
          label: t("nav.lychee_products"),
        },
      ],
    },
    { href: `/${locale}/story`, label: t("nav.story") },
    {
      label: t("nav.functions"),
      subItems: [
        { href: `/${locale}/payment`, label: t("nav.payment") },
        { href: `/${locale}/login`, label: t("nav.login") },
        { href: `/${locale}/register`, label: t("nav.register") },
        ...(isAdmin
          ? [{ href: `/${locale}/admin/dashboard`, label: t("nav.admin") }]
          : []),
      ],
    },
  ];
  return links;
};

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const ShoppingCartIcon = ({ className }: { className?: string }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.16" />
  </svg>
);
const UserIcon = ({ className }: { className?: string }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const MenuIcon = ({ className }: { className?: string }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const QuickLanguageToggle = () => {
  const { locale } = useI18n();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const newLocale = locale === "vi" ? "en" : "vi";
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 p-2 text-slate-700 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors duration-200"
      aria-label="Chọn ngôn ngữ"
    >
      <span className="text-sm">{locale === "vi" ? "🇻🇳" : "🇺🇸"}</span>
      <span className="text-xs font-medium">{locale.toUpperCase()}</span>
    </button>
  );
};

export default function Header() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);
  const router = useRouter();
  const { sessionToken, setSessionToken } = useAppContextProvider();
  const { logout } = useAuth();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { totalQuantity } = useCart();
  const { openSidebar } = useCartSidebar();
  const t = useTranslations();
  const { locale } = useI18n();
  const navLinks = getNavLinks(t, locale, isAdmin);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsAtTop(currentScrollY < 50);
      if (isMobileMenuOpen) {
        setIsHeaderVisible(true);
        return;
      }
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!sessionToken) return;
      try {
        const user = await accountApiRequest.me(sessionToken);
        setIsAdmin(user?.role === "admin");
      } catch (error) {
        console.error("Failed to check admin status:", error);
      }
    };
    checkAdminStatus();
  }, [sessionToken]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header
        className={`fixed w-full top-0 z-40 transition-all duration-500 ease-in-out bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        } ${!isAtTop ? "shadow-lg dark:shadow-gray-900/20" : ""}`}
      >
        <div className="max-w-screen-xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image
                src={envConfig.NEXT_PUBLIC_URL_LOGO}
                alt="LALA-LYCHEEE Logo"
                width={56}
                height={56}
                className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 object-contain rounded-full"
                priority
                unoptimized
              />
              <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold tracking-tighter hidden sm:block bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                LALA-LYCHEEE
              </span>
            </Link>

            {/* Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <div key={link.label} className="relative group">
                  {link.subItems ? (
                    <>
                      <span className="flex items-center gap-1.5 cursor-pointer py-2 px-1 text-sm lg:text-base font-medium text-slate-700 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors duration-200">
                        {link.label}
                        <ChevronDownIcon className="transition-transform duration-300 group-hover:rotate-180 w-4 h-4" />
                      </span>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 -translate-y-2 z-50 border border-gray-200 dark:border-gray-700">
                        <div className="py-2">
                          {link.subItems.map(
                            (item: { href: string; label: string }) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                className="block w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                              >
                                {item.label}
                              </Link>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={link.href!}
                      className="py-2 px-1 text-sm lg:text-base font-medium text-slate-700 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  )}
                  <span className="absolute bottom-0 left-0 block h-[2px] w-full bg-rose-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
                </div>
              ))}
              {isAdmin && (
                <Link
                  href={`/${locale}/admin/dashboard`}
                  className="py-2 px-3 text-sm lg:text-base font-semibold text-white bg-slate-900 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                >
                  {t("nav.admin")}
                </Link>
              )}
            </nav>

            {/* Icons & Mobile Menu Trigger */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
              {sessionToken ? (
                <div className="relative">
                  <button
                    onClick={() => setIsAccountOpen((v) => !v)}
                    aria-label="Tài khoản"
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-slate-700 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all duration-200"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span className="hidden md:block text-sm font-medium">
                      {t("nav.account")}
                    </span>
                    <ChevronDownIcon className="hidden md:block w-4 h-4" />
                  </button>
                  {isAccountOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                      <Link
                        href={`/${locale}/me`}
                        className="block px-4 py-2.5 text-sm text-slate-700 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-gray-700 hover:text-rose-600 dark:hover:text-rose-400 transition-colors duration-200"
                        onClick={() => setIsAccountOpen(false)}
                      >
                        {t("nav.profile")}
                      </Link>
                      <button
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-gray-700 hover:text-rose-600 dark:hover:text-rose-400 transition-colors duration-200"
                        onClick={async () => {
                          try {
                            await logout();
                            setSessionToken("");
                            setIsAccountOpen(false);
                            toast.success("Đã đăng xuất", {
                              position: "top-center",
                            });
                            router.push(`/${locale}/login`);
                            router.refresh();
                          } catch {
                            toast.error("Đăng xuất thất bại", {
                              position: "top-center",
                            });
                          }
                        }}
                      >
                        {t("nav.logout")}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={`/${locale}/login`}
                  aria-label="Đăng nhập"
                  className="p-2 text-slate-700 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all duration-200"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>
              )}
              <Link
                href={`/${locale}/cart`}
                aria-label="Giỏ hàng"
                className="relative p-2 text-slate-700 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all duration-200"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs font-medium leading-none px-1.5 py-1 rounded-full min-w-[18px] text-center">
                    {totalQuantity}
                  </span>
                )}
              </Link>
              {/* Quick Language Toggle for Mobile */}
              <div className="md:hidden">
                <QuickLanguageToggle />
              </div>
              <ThemeToggle />
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-slate-700 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors duration-200 lg:hidden"
                aria-label="Mở menu"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Right block (desktop) would typically host account/cart icons. Already present above. */}
      </header>
      {isMobileMenuOpen ? (
        <MobileNavSheet
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          isAdmin={isAdmin}
          navLinks={navLinks}
        />
      ) : null}
    </>
  );
}
