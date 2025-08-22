"use client";
import useTranslations from "@/i18n/useTranslations";

export function DashboardPage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{t("dashboard.title")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">
            {t("dashboard.totalProducts")}
          </h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">
            {t("dashboard.totalOrders")}
          </h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">
            {t("dashboard.totalRevenue")}
          </h3>
          <p className="text-3xl font-bold text-purple-600">$0</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">
            {t("dashboard.totalCustomers")}
          </h3>
          <p className="text-3xl font-bold text-orange-600">0</p>
        </div>
      </div>
    </div>
  );
}
