"use client"
// import DeliveryAddressStep from "./delivery-address-step"
import PaymentMethodStep from "./payment-method-step"
import OrderConfirmationStep from "./order-confirmation-step"
import OrderSummary from "./order-summary"
import { useCheckoutStore } from "@/stores/checkoutstore"
import useCartStore from "@/stores/cartstore"
import DeliveryAddressStep from "./delivery-address-step"
import { useEffect } from "react"

export default function CheckoutProcess() {
  const currentStep = useCheckoutStore((state) => state.currentStep)
  const cartItems = useCartStore((state) => state.cart)
  const loadcart = useCartStore((state) => state.loadCart)

  useEffect(() => {
    loadcart()
  }, [])

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Add some delicious meals to your cart before proceeding to checkout.
        </p>
        <a href="/" className="text-primary hover:underline">
          Browse our menu
        </a>
      </div>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="order-last md:order-first md:col-span-2 space-y-8">
        {currentStep === 1 && <DeliveryAddressStep />}
        {currentStep === 2 && <PaymentMethodStep />}
        {currentStep === 3 && <OrderConfirmationStep />}
      </div>

      <div className="order-first md:order-last md:col-span-1">
        <OrderSummary />
      </div>
    </div>
  )
}
