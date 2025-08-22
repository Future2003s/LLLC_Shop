"use client";
import { OrdersView } from "../dashboard/components/OrdersView";
import { useOrders } from "../dashboard/hooks/useOrders";

export default function OrdersPage() {
  const {
    orders,
    loading,
    error,
    pagination,
    updateOrder,
    goToPage,
    changePageSize,
  } = useOrders();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <OrdersView
        orders={orders}
        loading={loading}
        error={error}
        pagination={pagination}
        onUpdateOrder={updateOrder}
        onGoToPage={goToPage}
        onChangePageSize={changePageSize}
      />
    </div>
  );
}
