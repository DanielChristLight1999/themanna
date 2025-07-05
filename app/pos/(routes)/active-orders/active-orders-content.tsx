"use client"

import { OrderTable } from "@/components/pos/order-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Order, Payment } from "@/lib/generated/prisma"
import { useState } from "react"
import { PastOrderWithItems } from "../past-orders/past-orders-content"

export type OrderWithItems = Order & {
  items: {
    product: {
      id: number
      name: string
      price: number
      images?: [{ url: string }]
    }
    quantity: number
  }[]
  payment: Payment | null
}
// function mapPrismaOrdersToStoreOrders(orders: OrderWithItems[]): Order[] {
//   return orders.map((order) => {
//     const subtotal = order.items.reduce(
//       (sum, item) => sum + item.product.price * item.quantity,
//       0
//     )
//     const tax = subtotal * 0.075
//     const total = subtotal + tax

//     return {
//       id: order.id,
//       sessionId: order.staffId, // or use sessionId if available in schema
//       items: order.items.map((item) => ({
//         id: item.product.id.toString(),
//         name: item.product.name,
//         price: item.product.price,
//         quantity: item.quantity,
//         image: item.product.images?.[0]?.url || "/images/placeholder.svg",
//       })),
//       subtotal,
//       tax,
//       total,
//       orderType: "POS",
//       paymentMethod: order.payment?.method || "CASH",
//       paymentStatus: order.payment?.status || "PENDING",
//       status: order.status as Order["status"],
//       timestamp: new Date(order.placedAt),
//     }
//   })
// }

export function ActiveOrdersContent({ initialOrders}: { initialOrders: PastOrderWithItems[] }) {
  const [orders, setOrders] = useState(initialOrders)

  const handleUpdateStatus = async (orderId: string, status: "CONFIRMED" | "CANCELLED" | "DELIVERED") => {
    // Optionally call API to update DB order
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Active Orders</h1>
        <p className="text-gray-600">Manage orders from current session</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Session Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No active orders</p>
            </div>
          ) : (
            <OrderTable orders={orders} showActions={true} onUpdateStatus={handleUpdateStatus} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
