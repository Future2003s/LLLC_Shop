import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import Page from "../page";

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale?: string }>;
}) {
  const { locale } = await params;
  if (!locale || !isValidLocale(locale)) {
    notFound();
  }

  // Render the original home page component
  return <Page />;
}
