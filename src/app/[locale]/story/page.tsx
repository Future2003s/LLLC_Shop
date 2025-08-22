import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import AboutPage from "../about/page";

export default async function LocaleStoryPage({
  params,
}: {
  params: Promise<{ locale?: string }>;
}) {
  const { locale } = await params;
  if (!locale || !isValidLocale(locale)) {
    notFound();
  }

  return <AboutPage />;
}
