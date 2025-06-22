// components/pos/pos-hydrator.tsx
"use client"

import { useEffect } from "react"
import { usePOSStore } from "@/stores/usePOSStore"
import { Order, Payment } from "@/lib/generated/prisma"
import { RestaurantSettingsData } from "@/lib/getsettingsData"


export type HydrationProps = {
  session: {
    id: string
    openedAt: Date
    staffId: string
    closedAt: Date | null
    staff: {
      name: string | null
    }
    orders: {
      id: string
      status: Order["status"]
      orderType: Order["orderType"]
      paymentStatus: Order["paymentStatus"]
      placedAt: Date
      items: {
        product: {
          id: number
          name: string
          price: number
          images: { url: string }[]
        }
        quantity: number
      }[]
      payment: Payment | null
    }[]
  },
  settingsData: RestaurantSettingsData
}
export function POSHydrator({ session, settingsData }: HydrationProps) {
  const rehydrateSession = usePOSStore((state) => state.rehydrateSession)

  useEffect(() => {
    rehydrateSession({
      sessionId: session.id,
      cashierId: session.staffId,
      cashierName: session.staff.name || "Unknown Cashier",
      startTime: new Date(session.openedAt),
      settingsData: settingsData,
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
