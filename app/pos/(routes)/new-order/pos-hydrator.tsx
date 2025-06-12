// components/pos/POSHydrator.tsx
"use client"

import { useEffect } from "react"
import { usePOSStore } from "@/stores/usePOSStore"
import { CartItem } from "@/stores/usePOSStore"

type Props = {
  cart: CartItem[],
  sessiondata: {
    id: string,
    staffId: string,
    openedAt: Date,
    cashierName: string,
  }
}

export function POSHydrator({ cart, sessiondata }: Props) {
  const rehydrate = usePOSStore((state) => state.rehydrateSession)

  useEffect(() => {
    if (cart.length > 0) {
      rehydrate({
        sessionId: sessiondata.id,
        cashierId: sessiondata.staffId,
        cashierName: sessiondata.cashierName,
        startTime: new Date(sessiondata.openedAt),
        cart: cart,
        isActive: true,
      })
    }
  }, [cart, rehydrate])

  return null
}
