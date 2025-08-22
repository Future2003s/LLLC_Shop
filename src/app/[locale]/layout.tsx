import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isValidLocale, defaultLocale } from "@/i18n/config";
import { I18nProvider } from "@/i18n/I18nProvider";
import RouteLoader from "@/components/route-loader";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  const { locale } = await params;
  if (!locale || !isValidLocale(locale)) {
    notFound();
  }

  // load messages server-side to hydrate provider
  let messages = {};
  try {
    messages = (await import(`@/i18n/locales/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load locale ${locale}:`, error);
    // Fallback to default locale
    messages = (await import(`@/i18n/locales/${defaultLocale}.json`)).default;
  }

  return (
    <I18nProvider
      key={locale}
      initialLocale={locale}
      initialMessages={messages}
    >
      {/* Loader khi điều hướng giữa các route (trừ trang chủ) */}
      <RouteLoader>{children}</RouteLoader>
    </I18nProvider>
  );
}
