"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { defaultLocale, isValidLocale, Locale } from "./config";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

type Messages = Record<string, any>;

// localStorage key for saving user's preferred locale
const LOCALE_STORAGE_KEY = "preferred-locale";

// Helper functions for localStorage
const getStoredLocale = (): Locale | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    return stored && isValidLocale(stored) ? (stored as Locale) : null;
  } catch {
    return null;
  }
};

const setStoredLocale = (locale: Locale) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // localStorage not available, ignore
  }
};

const I18nContext = createContext<{
  locale: Locale;
  messages: Messages;
  setLocale: (l: Locale) => void;
} | null>(null);

export const I18nProvider: React.FC<{
  children: React.ReactNode;
  initialLocale?: Locale;
  initialMessages?: Messages;
}> = ({ children, initialLocale, initialMessages }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get initial locale with proper priority: URL > initialLocale > localStorage > default
  const getInitialLocale = (): Locale => {
    // 1. Check URL first (highest priority)
    const segments = (pathname || "/").split("/").filter(Boolean);
    const urlLocale = segments[0];
    if (urlLocale && isValidLocale(urlLocale)) {
      return urlLocale as Locale;
    }

    // 2. Then initialLocale prop
    if (initialLocale) {
      return initialLocale;
    }

    // 3. Then localStorage
    const storedLocale = getStoredLocale();
    if (storedLocale) {
      return storedLocale;
    }

    // 4. Finally default
    return defaultLocale;
  };

  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);
  const [messages, setMessages] = useState<Messages>(initialMessages ?? {});

  // update locale whenever the pathname changes (handles client-side navigation)
  useEffect(() => {
    // if initialLocale provided, prefer it on first render
    if (initialLocale) return;

    const segments = (pathname || "/").split("/").filter(Boolean);
    const first = segments[0];
    const detected = isValidLocale(first) ? (first as Locale) : defaultLocale;

    // Only update if different from current locale
    if (detected !== locale) {
      setLocaleState(detected);
      // Save to localStorage when locale changes from URL
      setStoredLocale(detected);
    }
  }, [pathname, initialLocale, locale]);

  useEffect(() => {
    // only load messages client-side if not provided by server
    if (initialMessages) return;
    let mounted = true;
    import(`./locales/${locale}.json`)
      .then((m) => {
        if (mounted) setMessages(m.default ?? m);
      })
      .catch(() => {
        if (mounted) setMessages({});
      });
    return () => {
      mounted = false;
    };
  }, [locale, initialMessages]);

  function setLocale(l: Locale) {
    // Save to localStorage immediately when user selects a language
    setStoredLocale(l);

    // navigate to the same path but with new locale as first segment
    const segments = (pathname || "/").split("/").filter(Boolean);
    if (segments.length > 0 && isValidLocale(segments[0])) {
      segments[0] = l;
    } else {
      segments.unshift(l);
    }
    const search = searchParams ? `?${searchParams.toString()}` : "";
    const newPath = `/${segments.join("/")}${search}`;

    // use Next router to navigate client-side
    router.push(newPath);
  }

  return (
    <I18nContext.Provider value={{ locale, messages, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
