"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle2, Clock, MapPin, Receipt } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"

type OrderItem = {
  name: string
  quantity: number
  price: number
  image?: string
}

type Address = {
  label: string
  street: string
  city: string
  state: string
  postalCode?: string
}

type ConfirmationData = {
  success: boolean
  message: string
  orderNumber: string
  estimatedDeliveryTime: string
  address?: Address
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  paymentMethod: string
  orderNote?: string
}

export default function ConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
//   const reference = searchParams.get("reference") || ""
  const [data, setData] = useState<ConfirmationData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const reference = searchParams.get("reference") || ""
    if (!reference || typeof reference !== "string") return

    const fetchConfirmation = async () => {
      try {
        const res = await fetch(`/api/payment/verify?reference=${reference}`)
        const result = await res.json()
        if (result.success) {
          setData(result)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchConfirmation()
  }, [searchParams])

  if (loading) {
    return <p className="text-center mt-10">Verifying your payment...</p>
  }

  if (!data) {
    return (
      <div className="text-center mt-10 text-red-600">
        <h2 className="text-xl font-semibold">Payment Verification Failed</h2>
        <p>We couldn't verify your payment. Please contact support if you were charged.</p>
        <Link href="/" className="text-blue-600 underline mt-2 inline-block">Go back to Menu</Link>
      </div>
    )
  }

  const { orderNumber, estimatedDeliveryTime, address, items, subtotal, deliveryFee, total, paymentMethod, orderNote } = data

  return (
    <Card className="border-none md:border md:border-green-200 max-w-2xl mx-auto mt-10">
      <CardHeader className="text-center border-b pb-6">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-2xl text-green-700">Order Confirmed!</CardTitle>
        <CardDescription className="text-base">Your order has been received and is being prepared.</CardDescription>
      </CardHeader>

      <CardContent className="md:border border-none space-y-6 pt-6">
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

        {address ? (
          <div className="space-y-2">
            <h3 className="font-medium">Delivery Address</h3>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{address.label}</p>
                <p className="text-sm text-muted-foreground">{address.street}</p>
                <p className="text-sm text-muted-foreground">
                  {address.city}, {address.state} {address.postalCode || ""}
                </p>
              </div>
            </div>
          </div>
        ) : ""}

        {orderNote ? (
          <div className="mt-2">
            <p className="text-sm font-medium">Delivery Instructions:</p>
            <p className="text-sm text-muted-foreground">{orderNote}</p>
          </div>
        ) : ""}

        <div className="space-y-2">
          <h3 className="font-medium">Payment Method</h3>
          <p className="text-sm">
            {paymentMethod === "paystack" ? "Paid with Paystack" : paymentMethod}
          </p>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-medium">Order Summary</h3>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                {item.image && (
                  <div className="bg-muted rounded-md overflow-hidden h-16 w-16 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <div className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="bg-muted p-4 rounded-md space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
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
