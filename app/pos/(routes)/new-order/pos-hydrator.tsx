// components/pos/POSHydrator.tsx
"use client"

import { useEffect } from "react"
import { usePOSStore } from "@/stores/usePOSStore"
import { CartItem } from "@/stores/usePOSStore"
import { RestaurantSettingsData } from "@/lib/getsettingsData"

type Props = {
  cart: CartItem[],
  sessiondata: {
    id: string,
    staffId: string,
    openedAt: Date,
    cashierName: string,
  },
  settingsData: RestaurantSettingsData
}

export function POSHydrator({ cart, sessiondata, settingsData }: Props) {
  const rehydrate = usePOSStore((state) => state.rehydrateSession)

  useEffect(() => {
    if (cart.length > 0) {
      rehydrate({
        sessionId: sessiondata.id,
        cashierId: sessiondata.staffId,
        cashierName: sessiondata.cashierName,
        startTime: new Date(sessiondata.openedAt),
        settingsData: settingsData,
        cart: cart,
        isActive: true,
      })
    }
  }, [cart, rehydrate])

  return null
}
