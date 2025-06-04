import type { Metadata } from "next"
import { OrdersTable } from "@/components/admin/orders/orders-table"
import { getAllOrders } from "@/actions/admin/order-actions"

export const metadata: Metadata = {
  title: "Orders | The Mana Restaurant Admin",
  description: "Manage orders for The Mana Restaurant",
}

export default async function OrdersPage() {
  const orders = await getAllOrders()
  return (
    <div className="flex flex-col p-6 h-full pt-12 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
      </div>

      {/* <OrdersFilter /> */}
      <OrdersTable orders={orders} />
    </div>
  )
}
