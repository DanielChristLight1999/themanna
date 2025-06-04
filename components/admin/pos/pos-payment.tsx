"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCardIcon, BanknoteIcon, SmartphoneIcon, PercentIcon } from "lucide-react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  image?: string
}

interface PosPaymentProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cartItems: CartItem[]
  onProcessPayment: (paymentData: any) => void
}

export function PosPayment({ open, onOpenChange, cartItems, onProcessPayment }: PosPaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [discountType, setDiscountType] = useState("amount")
  const [discountValue, setDiscountValue] = useState("")
  const [cashReceived, setCashReceived] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.075 // 7.5% tax

  const discount = useMemo(() => {
    const value = Number.parseFloat(discountValue) || 0
    if (discountType === "percentage") {
      return (subtotal * value) / 100
    }
    return value
  }, [discountValue, discountType, subtotal])

  const total = subtotal + tax - discount
  const change = Number.parseFloat(cashReceived) - total

  const handleProcessPayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    onProcessPayment({
      method: paymentMethod,
      discount,
      cashReceived: paymentMethod === "cash" ? Number.parseFloat(cashReceived) : total,
      change: paymentMethod === "cash" ? change : 0,
    })

    // Reset form
    setDiscountValue("")
    setCashReceived("")
    setPaymentMethod("cash")
    setIsProcessing(false)
  }

  const canProcess = () => {
    if (paymentMethod === "cash") {
      return Number.parseFloat(cashReceived) >= total
    }
    return true
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
          <DialogDescription>
            Complete the transaction by selecting payment method and processing payment
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - Order Summary */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-3">Order Summary</h3>
              <div className="space-y-2 max-h-40 overflow-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Discount Section */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <PercentIcon className="h-4 w-4" />
                Discount
              </Label>
              <div className="flex gap-2">
                <Tabs value={discountType} onValueChange={setDiscountType} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="amount">Amount</TabsTrigger>
                    <TabsTrigger value="percentage">Percentage</TabsTrigger>
                  </TabsList>
                  <TabsContent value="amount" className="mt-2">
                    <Input
                      type="number"
                      placeholder="Discount amount"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                    />
                  </TabsContent>
                  <TabsContent value="percentage" className="mt-2">
                    <Input
                      type="number"
                      placeholder="Discount percentage"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      max="100"
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (7.5%):</span>
                <span>₦{tax.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount:</span>
                  <span>-₦{discount.toLocaleString()}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Method */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-3">Payment Method</h3>
              <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="cash">Cash</TabsTrigger>
                  <TabsTrigger value="card">Card</TabsTrigger>
                  <TabsTrigger value="transfer">Transfer</TabsTrigger>
                </TabsList>

                <TabsContent value="cash" className="mt-4">
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <BanknoteIcon className="h-5 w-5" />
                        <span className="font-medium">Cash Payment</span>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cash-received">Cash Received</Label>
                        <Input
                          id="cash-received"
                          type="number"
                          placeholder="Enter amount received"
                          value={cashReceived}
                          onChange={(e) => setCashReceived(e.target.value)}
                        />
                      </div>
                      {cashReceived && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Amount Due:</span>
                            <span>₦{total.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Cash Received:</span>
                            <span>₦{Number.parseFloat(cashReceived).toLocaleString()}</span>
                          </div>
                          <div
                            className={`flex justify-between font-medium ${change >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            <span>Change:</span>
                            <span>₦{change.toLocaleString()}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="card" className="mt-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <CreditCardIcon className="h-5 w-5" />
                        <span className="font-medium">Card Payment</span>
                      </div>
                      <div className="text-center py-8 text-muted-foreground">
                        <CreditCardIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Insert or tap card to process payment</p>
                        <Badge variant="outline" className="mt-2">
                          Amount: ₦{total.toLocaleString()}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="transfer" className="mt-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <SmartphoneIcon className="h-5 w-5" />
                        <span className="font-medium">Bank Transfer</span>
                      </div>
                      <div className="text-center py-8 text-muted-foreground">
                        <SmartphoneIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Customer to transfer to restaurant account</p>
                        <Badge variant="outline" className="mt-2">
                          Amount: ₦{total.toLocaleString()}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleProcessPayment} disabled={!canProcess() || isProcessing} className="min-w-[120px]">
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              `Process Payment`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
