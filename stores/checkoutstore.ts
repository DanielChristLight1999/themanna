// checkoutStore.ts
import { getUserAddresses } from '@/actions/authactions'
import { Address } from '@/lib/generated/prisma'
import { useCallback } from 'react'
// import { RestaurantSettingsData } from '@/lib/getsettingsData'
import { create } from 'zustand'

// export type Address = {
//     id: string
//     name: string
//     address: string
//     apartment?: string
//     city: string
//     state: string
//     zipCode: string
//     isDefault: boolean
// }

export type FoodItem = {
    id: string
    name: string
    price: number
    quantity: number
    image?: string
    options?: string[]
}

export type PaymentMethod = "card" | "bank_transfer"

type CheckoutState = {
    currentStep: number
    selectedAddressId: string | null
    paymentMethod: PaymentMethod | null
    orderNote: string
    orderNumber: string | null
    estimatedDeliveryTime: string | null
    userAddresses: Address[]
    // cartItems: FoodItem[] | []
    // settingsData: RestaurantSettingsData | null
    getuserAddresses: () => Promise<void>
    setSelectedAddressId: (id: string) => void
    setPaymentMethod: (method: PaymentMethod) => void
    setOrderNote: (note: string) => void
    nextStep: () => void
    prevStep: () => void
    goToStep: (step: number) => void
    placeOrder: () => Promise<void>
    getDeliveryFee: () => number
    getTotal: (subtotal: number) => number
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
    currentStep: 1,
    selectedAddressId: "",
    paymentMethod: null,
    orderNote: "",
    orderNumber: null,
    estimatedDeliveryTime: null,
    userAddresses: [],
    // cartItems: [],
    // settingsData: null,
    getuserAddresses: useCallback(async () => {
        const data = await getUserAddresses()
        set({ userAddresses: data })
    }, []),
    setSelectedAddressId: (id) => set({ selectedAddressId: id }),
    setPaymentMethod: (method) => set({ paymentMethod: method }),
    setOrderNote: (note) => set({ orderNote: note }),

    nextStep: () =>
        set((state) => ({ currentStep: Math.min(state.currentStep + 1, 3) })),

    prevStep: () =>
        set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

    goToStep: (step) => {
        if (step >= 1 && step <= 3) set({ currentStep: step })
    },
    getDeliveryFee: () => 500,

    getTotal: (subtotal) => subtotal + get().getDeliveryFee(),

    placeOrder: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const orderNumber = `FD-${Math.floor(100000 + Math.random() * 900000)}`

        const now = new Date()
        const deliveryStart = new Date(now.getTime() + 30 * 60000)
        const deliveryEnd = new Date(now.getTime() + 45 * 60000)

        const formatTime = (date: Date) =>
            date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

        const estimatedDeliveryTime = `${formatTime(
            deliveryStart
        )} - ${formatTime(deliveryEnd)}`

        set({
            orderNumber,
            estimatedDeliveryTime,
            currentStep: 3,
        })
    },
}))
