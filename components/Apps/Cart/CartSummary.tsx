"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import useCartStore from "@/stores/cartstore"
import useUIStore from "@/stores/uistore"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

const CartSummary = ({taxRate}: {taxRate: number}) => {
  const cart = useCartStore((state) => state.cart)
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const tax = subtotal * (taxRate / 100);
  const totalPrice = subtotal + tax;
  const loading = useUIStore((state) => state.isLoading)
  const setIsLoading = useUIStore((state) => state.setIsLoading)
  const router = useRouter()
  const handleCheckout = () => {
    setIsLoading(true)
    router.push("/checkout")
    setIsLoading(false)
  }
  if(cart.length === 0){
    return ""
  }
  return (
    <Card className="h-fit border-none shadow-none p-0 mb-20">
      <CardHeader className="p-0">
        <CardTitle className="text-xl p-0">Cart Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax ({taxRate}%)</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <div className="text-right">
            <div>{formatPrice(totalPrice)}</div>
            <div className="text-xs text-muted-foreground mt-1">Delivery fees not included</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-0">
        <Button onClick={handleCheckout} className="w-full h-12" size="lg" disabled={cart.length === 0 || loading}>
          {loading ? <Loader2 className="!size-7 animate-spin" /> : "Checkout"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CartSummary