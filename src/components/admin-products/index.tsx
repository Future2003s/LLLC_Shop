"use client";
import useTranslations from "@/i18n/useTranslations";

export function AdminProductsPage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{t("products.title")}</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">{t("messages.loadingData")}</p>
      </div>
    </div>
  );
}
