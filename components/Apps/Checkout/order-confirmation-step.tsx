"use client"

import Link from "next/link"
import Image from "next/image"
import { CheckCircle2, Clock, MapPin, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCheckoutStore } from "@/stores/checkoutstore"
import useCartStore from "@/stores/cartstore"
import { formatPrice } from "@/lib/utils"

export default function OrderConfirmationStep() {
    const orderNumber = useCheckoutStore((state) => state.orderNumber)
    const estimatedDeliveryTime = useCheckoutStore((state) => state.estimatedDeliveryTime)
    const cartItems = useCartStore((state) => state.cart)
    const userAddresses = useCheckoutStore((state) => state.userAddresses)
    const selectedAddressId = useCheckoutStore((state) => state.selectedAddressId)
    const paymentMethod = useCheckoutStore((state) => state.paymentMethod)
    const orderNote = useCheckoutStore((state) => state.orderNote)
    const getSubtotal = useCartStore((state) => state.getSubtotal)
    const getDeliveryFee = useCheckoutStore((state) => state.getDeliveryFee)
    const getTotal = useCheckoutStore((state) => state.getTotal)

  const selectedAddress = userAddresses.find((addr) => addr.id === selectedAddressId)

  return (
    <Card className="border-green-200">
      <CardHeader className="text-center border-b pb-6">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-2xl text-green-700">Order Confirmed!</CardTitle>
        <CardDescription className="text-base">Your order has been received and is being prepared.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-muted p-4 rounded-md flex items-start gap-3">
            <Receipt className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="font-medium">{orderNumber}</p>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-md flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Estimated Delivery</p>
              <p className="font-medium">{estimatedDeliveryTime}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Delivery Address</h3>
          {selectedAddress && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{selectedAddress.name}</p>
                <p className="text-sm text-muted-foreground">{selectedAddress.address}</p>
                {selectedAddress.apartment && (
                  <p className="text-sm text-muted-foreground">{selectedAddress.apartment}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                </p>
              </div>
            </div>
          )}

          {orderNote && (
            <div className="mt-2">
              <p className="text-sm font-medium">Delivery Instructions:</p>
              <p className="text-sm text-muted-foreground">{orderNote}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Payment Method</h3>
          <p className="text-sm">{paymentMethod === "paystack" ? "Paid with Paystack" : "Bank Transfer"}</p>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-medium">Order Summary</h3>
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex items-center gap-4">
                {item.image && (
                  <div className="bg-muted rounded-md overflow-hidden h-16 w-16 flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  {/* {item.options && item.options.length > 0 && (
                    <p className="text-xs text-muted-foreground">{item.options.join(", ")}</p>
                  )} */}
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <div className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="bg-muted p-4 rounded-md space-y-2">
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
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <Button asChild className="w-full">
          <Link href="/orders">Track Your Order</Link>
        </Button>
        <Button variant="outline" asChild className="w-full">
          <Link href="/">Return to Menu</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
