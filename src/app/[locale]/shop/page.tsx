import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import ProductsPage from "../products/page";

export default async function LocaleShopPage({
  params,
}: {
  params: Promise<{ locale?: string }>;
}) {
  const { locale } = await params;
  if (!locale || !isValidLocale(locale)) {
    notFound();
  }

  return <ProductsPage />;
}
