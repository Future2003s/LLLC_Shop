"use client";
import { useState, useRef, useEffect } from "react";
import { locales } from "../i18n/config";
import { useI18n } from "../i18n/I18nProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const labels: Record<string, string> = {
    vi: "Tiếng Việt",
    en: "English",
    ja: "日本語",
  };

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div ref={ref} className="relative inline-block text-left w-full sm:w-auto">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full sm:w-auto gap-3 py-2.5 px-4 border border-gray-200 rounded-xl text-sm bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2.5">
          <span className="text-lg">
            {locale === "vi" ? "🇻🇳" : locale === "en" ? "🇺🇸" : "🇯🇵"}
          </span>
          <span className="font-medium text-gray-700">
            {labels[locale] ?? locale.toUpperCase()}
          </span>
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 sm:right-0 mt-3 w-full sm:w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <div className="py-1">
            {locales.map((l, index) => (
              <button
                key={l}
                onClick={() => {
                  console.log(
                    "Language clicked:",
                    l,
                    "Current locale:",
                    locale
                  );
                  // Let I18nProvider handle navigation
                  setLocale(l as any);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 text-sm transition-all duration-150 flex items-center gap-3 group ${
                  l === locale
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:text-gray-900"
                } ${index === 0 ? "rounded-t-xl" : ""} ${
                  index === locales.length - 1 ? "rounded-b-xl" : ""
                }`}
              >
                <span className="text-lg flex-shrink-0">
                  {l === "vi" ? "🇻🇳" : l === "en" ? "🇺🇸" : "🇯🇵"}
                </span>
                <span className="flex-1">{labels[l] ?? l.toUpperCase()}</span>
                {l === locale && (
                  <svg
                    className="w-4 h-4 text-blue-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
