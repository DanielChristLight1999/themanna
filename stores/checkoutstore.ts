// checkoutStore.ts
import { getUserAddresses } from '@/actions/authactions'
import { Address } from '@/lib/generated/prisma'
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

export type PaymentMethod = "paystack" | "bank-transfer"

type CheckoutState = {
    currentStep: number
    selectedAddressId: string | null
    paymentMethod: PaymentMethod | null
    orderNote: string
    orderNumber: string | null
    estimatedDeliveryTime: string | null
    userAddresses: Address[]
    cartItems: FoodItem[]
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

// Mock data
// const mockAddresses: Address[] = [
//     {
//         id: "addr1",
//         name: "Home",
//         address: "123 Main Street",
//         apartment: "Apt 4B",
//         city: "Lagos",
//         state: "Lagos State",
//         zipCode: "100001",
//         isDefault: true,
//     },
//     {
//         id: "addr2",
//         name: "Work",
//         address: "456 Office Plaza",
//         city: "Lagos",
//         state: "Lagos State",
//         zipCode: "100002",
//         isDefault: false,
//     },
//     {
//         id: "addr3",
//         name: "Friend's Place",
//         address: "789 Park Avenue",
//         apartment: "Suite 12",
//         city: "Abuja",
//         state: "FCT",
//         zipCode: "900108",
//         isDefault: false,
//     },
// ]

const mockCartItems: FoodItem[] = [
    {
        id: "item1",
        name: "Jollof Rice with Chicken",
        price: 2500,
        quantity: 2,
        image: "/placeholder.svg?height=80&width=80",
        options: ["Extra Spicy", "Extra Chicken"],
    },
    {
        id: "item2",
        name: "Suya Platter",
        price: 3000,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
    },
    {
        id: "item3",
        name: "Chapman Drink",
        price: 800,
        quantity: 3,
        image: "/placeholder.svg?height=80&width=80",
    },
]

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
    currentStep: 1,
    selectedAddressId: "",
    paymentMethod: null,
    orderNote: "",
    orderNumber: null,
    estimatedDeliveryTime: null,
    userAddresses: [],
    cartItems: mockCartItems,
    getuserAddresses: async () => {
        const data = await getUserAddresses()
        set({ userAddresses: data })
    },
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
