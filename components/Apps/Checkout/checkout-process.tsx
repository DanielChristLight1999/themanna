"use client"
import PaymentMethodStep from "./payment-method-step"
import OrderConfirmationStep from "./order-confirmation-step"
import OrderSummary from "./order-summary"
import { useCheckoutStore } from "@/stores/checkoutstore"
import DeliveryAddressStep from "./delivery-address-step"
import { CartItem } from "@/stores/cartstore"
import { RestaurantSettingsData } from "@/lib/getsettingsData"
export default function CheckoutProcess({ cartItems, settingsData }: { cartItems: CartItem[], settingsData: RestaurantSettingsData }) {
  const currentStep = useCheckoutStore((state) => state.currentStep)
  // const cartItems = useCartStore((state) => state.cart)
  // const loadcart = useCartStore((state) => state.loadCart)

  // Redirect if cart is empty

  const taxRate = settingsData?.paymentSettings?.taxRate || 0
  const deliveryFee = settingsData?.deliverySettings?.defaultDeliveryFee || 0
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax + deliveryFee;
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
        {currentStep === 2 && <PaymentMethodStep tax={tax} deliveryFee={deliveryFee} total={total} />}
        {currentStep === 3 && <OrderConfirmationStep />}
      </div>

      <div className="order-first md:order-last md:col-span-1">
        <OrderSummary tax={tax} subtotal={subtotal} total={total} taxRate={taxRate} deliveryFee={deliveryFee} cartItems={cartItems} />
      </div>
    </div>
  )
}
