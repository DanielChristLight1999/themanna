// components/pos/pos-hydrator.tsx
"use client"

import { useEffect } from "react"
import { usePOSStore } from "@/stores/usePOSStore"
import { HydrationProps } from "@/lib/pos-data/getposdata"

export function POSHydrator({ session }: HydrationProps) {
  const rehydrateSession = usePOSStore((state) => state.rehydrateSession)

  useEffect(() => {
    rehydrateSession({
      sessionId: session.id,
      cashierId: session.staffId,
      cashierName: session.staff.name || "Unknown Cashier",
      startTime: new Date(session.openedAt),
      orders: session.orders.map((order) => {
        const items = order.items.map((item) => ({
          id: String(item.product.id),
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images?.[0]?.url ?? "",
        }))

        const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
        const tax = subtotal * 0.075
        const total = order.payment?.amount ?? subtotal + tax

        return {
          id: order.id,
          items,
          subtotal,
          tax,
          total,
          status: order.status,
          paymentMethod: order.payment?.method || "CASH",
          paymentStatus: order.paymentStatus,
          orderType: "POS",
          sessionId: session.id,
          timestamp: new Date(order.placedAt),
        }
      }),
    })
  }, [rehydrateSession, session])

  return null // it's just for hydration
}
