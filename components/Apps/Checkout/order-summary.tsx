"use client"

import Image from "next/image"
// import { useCheckout } from "./checkout-context"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag } from "lucide-react"
import { useCheckoutStore } from "@/stores/checkoutstore"
import useCartStore from "@/stores/cartstore"
import { formatPrice } from "@/lib/utils"

export default function OrderSummary() {
    const cartItems = useCartStore((state) => state.cart)
    const getSubtotal = useCartStore((state) => state.getSubtotal)
    const getDeliveryFee = useCheckoutStore((state) => state.getDeliveryFee)
    const getTotal = useCheckoutStore((state) => state.getTotal)

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <ShoppingBag className="mr-2 h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items count */}
        <div className="text-sm text-muted-foreground mb-4">
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
        </div>

        {/* Item list */}
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {cartItems.map((item) => (
            <div key={item.productId} className="flex gap-3">
              {item.image && (
                <div className="bg-muted rounded-md overflow-hidden h-12 w-12 flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-sm font-medium">₦{(item.price * item.quantity).toLocaleString()}</p>
                </div>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                {/* {item.options && item.options.length > 0 && (
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">{item.options.join(", ")}</p>
                )} */}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Price calculations */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(getSubtotal())}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span>{formatPrice(getDeliveryFee())}</span>
          </div>

          <Separator className="my-2" />

          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{formatPrice(getTotal(getSubtotal()))}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-muted/50 text-xs text-muted-foreground">
        <p>Delivery time may vary based on restaurant preparation time and traffic conditions.</p>
      </CardFooter>
    </Card>
  )
}
