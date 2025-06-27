

import { addToCart, deleteFromCart, loadCart, removeFromCart } from "@/actions/cartactions";
import { useCallback } from "react";
import { create } from "zustand";

export interface CartItem {
  productId: string
  name: string
  image: string | null
  price: number
  quantity: number
}

interface CartStore {
  cart: CartItem[]
  setCart: (items: CartItem[]) => void
  getItem: (id: string) => CartItem | undefined
  getSubtotal: () => number
  loadCart: () => Promise<void>
  increment: (item: Omit<CartItem, "quantity">) => Promise<void>
  decrement: (productId: string) => Promise<void>
  delete: (productId: string) => Promise<void>
}

const useCartStore = create<CartStore>((set, get) => ({
  cart: [],

  setCart: (items) => set({ cart: items }),

  getItem: (id) => {
    const { cart } = get()
    return cart.find((item) => item.productId === id)
  },

  getSubtotal: () =>
    get().cart.reduce((total, item) => total + item.price * item.quantity, 0),

  loadCart: async () => {
    const cartData = await loadCart()
    set({ cart: cartData })
  },

  increment: async (item) => {
    const { cart } = get()
    const existing = cart.find((i) => i.productId === item.productId)
    const updatedCart = existing
      ? cart.map((i) =>
        i.productId === item.productId
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
      : [...cart, { ...item, quantity: 1 }]

    set({ cart: updatedCart })

    await addToCart(parseInt(item.productId))
  },

  decrement: async (productId) => {
    const { cart } = get()
    const existing = cart.find((i) => i.productId === productId)
    if (!existing) return

    const updatedCart =
      existing.quantity <= 1
        ? cart.filter((i) => i.productId !== productId)
        : cart.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )

    set({ cart: updatedCart })

    await removeFromCart(parseInt(productId))
  },

  delete: async (productId) => {
    const { cart } = get()
    const existing = cart.find((i) => i.productId === productId)
    if (!existing) return

    const updatedCart = cart.filter((i) => i.productId !== productId)

    set({ cart: updatedCart })

    await deleteFromCart(parseInt(productId))
  },
}))

export default useCartStore