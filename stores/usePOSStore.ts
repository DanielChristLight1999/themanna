

// stores/pos-store.ts
import { OrderStatus, PaymentMethod, PaymentStatus } from "@/lib/generated/prisma"
import { RestaurantSettingsData } from "@/lib/getsettingsData"
import { create } from "zustand"

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export type Order = {
  id: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  orderType: "POS"
  sessionId: string
  timestamp: Date
}

type POSState = {
  cashierId: string | null
  sessionId: string | null
  cashierName: string
  startTime: Date | null
  isActive: boolean
  cart: CartItem[]
  orders: Order[]
  settingsData: RestaurantSettingsData | null
}

type POSActions = {
  initSession: (cashierId: string, cashierName: string, sessionId: string, startTime: Date) => void
  rehydrateSession: (sessionData: Partial<POSState>) => void
  endSession: () => void
  addToCart: (item: Omit<CartItem, "quantity">) => void
  updateQuantity: (id: string, quantity: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  completeOrder: (paymentMethod: Order["paymentMethod"]) => Order | null
}

export const usePOSStore = create<POSState & POSActions>((set, get) => ({
  cashierId: null,
  sessionId: null,
  cashierName: "",
  startTime: null,
  isActive: false,
  cart: [],
  orders: [],
  settingsData: null,
  initSession: (cashierId, cashierName, sessionId, startTime) => {
    set({
      cashierId,
      sessionId,
      cashierName,
      startTime,
      isActive: true,
      cart: [],
      orders: [],
    })
  },

  // rehydrateSession: (data) => {
  //   set({
  //     ...get(),
  //     ...data,
  //     isActive: true,
  //   })
  // },
  rehydrateSession: (data: Partial<POSState>) => {
    set((state) => ({
      ...state,
      ...data,
      isActive: true,
    }))
  },

  endSession: () => {
    set({
      isActive: false,
      sessionId: null,
      cashierId: null,
      cashierName: "",
      startTime: null,
      cart: [],
      orders: [],
    })
  },

  addToCart: (item) => {
    const cart = get().cart
    const exists = cart.find((i) => i.id === item.id)
    if (exists) {
      set({
        cart: cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      })
    } else {
      set({ cart: [...cart, { ...item, quantity: 1 }] })
    }
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(id)
    } else {
      set({
        cart: get().cart.map((i) =>
          i.id === id ? { ...i, quantity } : i
        ),
      })
    }
  },

  removeFromCart: (id) => {
    set({
      cart: get().cart.filter((i) => i.id !== id),
    })
  },

  clearCart: () => {
    set({ cart: [] })
  },

  completeOrder: (paymentMethod) => {
    const cart = get().cart
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const tax = subtotal * 0.075
    const total = subtotal + tax

    if (!get().sessionId) return null

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items: [...cart],
      subtotal,
      tax,
      total,
      status: "CONFIRMED",
      paymentMethod,
      paymentStatus: "SUCCESS",
      orderType: "POS",
      sessionId: get().sessionId!,
      timestamp: new Date(),
    }

    set({
      cart: [],
      orders: [...get().orders, newOrder],
    })

    return newOrder
  },
}))
