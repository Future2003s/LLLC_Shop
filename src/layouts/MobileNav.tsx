"use client";
import Link from "next/link";
import { useState } from "react";
import useTranslations from "@/i18n/useTranslations";
import { useI18n } from "@/i18n/I18nProvider";
import dynamic from "next/dynamic";
import { ChevronDown, X } from "lucide-react";

const LanguageSwitcher = dynamic(() => import("@/components/LanguageSwitcher"), {
  ssr: false,
});

export type NavLink = {
  label: string;
  href?: string;
  subItems?: { href: string; label: string }[];
};

export default function MobileNav({
  isOpen,
  onClose,
  isAdmin,
  navLinks,
}: {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  navLinks: NavLink[];
}) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const t = useTranslations();
  const { locale } = useI18n();

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <span className="font-bold text-lg text-rose-800">{t("nav.menu")}</span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-rose-100 rounded-lg transition-colors duration-200"
            aria-label="Đóng menu"
          >
            <X className="text-slate-600 w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 overflow-y-auto h-full pb-20">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.subItems ? (
                  <>
                    <button
                      onClick={() =>
                        setActiveDropdown(activeDropdown === link.label ? null : link.label)
                      }
                      className="w-full flex justify-between items-center py-3 px-3 text-base font-medium text-slate-700 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors duration-200"
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`transition-transform duration-300 w-4 h-4 ${
                          activeDropdown === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {activeDropdown === link.label && (
                      <ul className="pl-4 mt-2 space-y-1 border-l-2 border-gray-200">
                        {link.subItems.map((item) => (
                          <li key={item.label}>
                            <Link
                              href={item.href}
                              className="block py-2.5 px-3 text-sm text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors duration-200"
                              onClick={onClose}
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href!}
                    className="block py-3 px-3 text-base font-medium text-slate-700 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors duration-200"
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
            {isAdmin && (
              <li className="pt-2 border-t border-gray-200 mt-4">
                <Link
                  href={`/${locale}/dashboard?section=dashboard`}
                  className="block py-3 px-3 text-base font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors duration-200"
                  onClick={onClose}
                >
                  {t("nav.admin")}
                </Link>
              </li>
            )}
          </ul>

          {/* Language Switcher in Mobile */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="px-3">
              <div className="mb-3">
                <span className="text-sm font-medium text-slate-600">
                  {t("nav.language")}
                </span>
              </div>
              <LanguageSwitcher />
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

