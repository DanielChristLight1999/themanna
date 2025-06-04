

import { loadCart } from "@/actions/cartactions";
import { create } from "zustand";

export interface CartItem {
  productId: string;
  quantity: number;
  name: string;
  image: string | null;
  price: number;
}


interface CartStore {
  cart: CartItem[];
  setCart: (items: CartItem[]) => void;
  getItem: (id: string) => CartItem | undefined;
  getSubtotal: () => number;
  loadCart: () => void;
}
const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  setCart: (items) => set({ cart: items }),
  getItem: (id) => get().cart.find((item) => item.productId === id),
  getSubtotal: () =>
    get().cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ),
  loadCart: async () => {
    const cartData = await loadCart()
    set({ cart: cartData })
  },
}));

export default useCartStore