export const locales = ["vi", "en", "ja"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "vi";

export function isValidLocale(locale: string | undefined): locale is Locale {
  return !!locale && (locales as readonly string[]).includes(locale);
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (isValidLocale(first)) return first;
  return null;
}

export function createLocalizedPathname(
  pathname: string,
  locale: Locale
): string {
  const segments = pathname.split("/");
  // ensure leading slash
  if (!segments[0]) {
    // pathname like /...
    // segments[1] is first meaningful segment
    if (isValidLocale(segments[1])) {
      segments[1] = locale;
    } else {
      segments.splice(1, 0, locale);
    }
  } else {
    // pathname without leading slash
    if (isValidLocale(segments[0])) {
      segments[0] = locale;
    } else {
      segments.splice(0, 0, locale);
    }
  }

  return segments.join("/") || `/${locale}`;
}
