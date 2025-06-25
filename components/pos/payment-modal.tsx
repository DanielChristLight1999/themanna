"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CreditCard, Banknote, Smartphone } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import PriceInput from "../Apps/common/PriceInput"
import { usePOSStore } from "@/stores/usePOSStore"
import { toast } from "sonner"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  total: number,
  onPaymentComplete: (paymentMethod: "CASH" | "TRANSFER" | "CARD", paidAmount: number, sessionId: string, changeGiven?: number) => void,
}

export function PaymentModal({ isOpen, onClose, total, onPaymentComplete }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<"CASH" | "TRANSFER" | "CARD" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const sessionId = usePOSStore((state) => state.sessionId)
  const [discount, setDiscount] = useState(0)
  const [amountPaid, setAmountPaid] = useState<number>(total)
  const [changeAmount, setChangeAmount] = useState<number>(0)


  // Ensure amountPaid doesn’t exceed total after discount
  useEffect(() => {
    const netTotal = total - discount
    if (amountPaid > netTotal) {
      setAmountPaid(netTotal)
    }
  }, [discount, total, amountPaid])

  useEffect(() => {
    if (selectedMethod === "CASH" && amountPaid) {
      const cash = Number.parseFloat(amountPaid.toFixed(2))
      const change = cash - total
      setChangeAmount(change > 0 ? change : 0)
    } else {
      setChangeAmount(0)
    }
  }, [amountPaid, total, selectedMethod])

  const handlePayment = async () => {
    if (!selectedMethod || amountPaid <= 0) return

    setIsProcessing(true)
    if (!sessionId) {
      toast.error("No active session found")
      return
    }
    onPaymentComplete(selectedMethod, amountPaid, sessionId, selectedMethod === "CASH" ? changeAmount : undefined)
    // Reset state
    setIsProcessing(false)
    setSelectedMethod(null)
    setDiscount(0)
    setAmountPaid(total)
    onClose()
  }

  const netTotal = Math.max(total - discount, 0)
  const balance = amountPaid - netTotal

  const paymentMethods = [
    {
      id: "CASH" as const,
      name: "Cash",
      icon: Banknote,
      description: "Pay with physical cash",
    },
    {
      id: "TRANSFER" as const,
      name: "Bank Transfer",
      icon: CreditCard,
      description: "Direct transfer to account",
    },
    {
      id: "CARD" as const,
      name: "Card",
      icon: Smartphone,
      description: "Pay with card",
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded border bg-gray-50 p-4 text-center">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-orange-600">{formatPrice(total)}</p>
          </div>

          {/* Discount Input */}
          <div className="space-y-1">

            <PriceInput
              value={discount}
              onChange={(e) => setDiscount(e || 0)}
              label="Discount (₦)"
              placeholder="₦0.00"
              min={0}
              max={total}
            />
          </div>

          {/* Amount Paid Input */}

         <div>
           <PriceInput value={amountPaid} onChange={(e) => setAmountPaid(e || 0)} label="Amount Paid (₦)" placeholder="₦0.00" />
           <Button className="m-0 text-indigo-900 underline p-0" onClick={() => setAmountPaid(total)} variant={"link"}>Max</Button>
         </div>
          {/* Balance/Change */}
          <div className="flex justify-between text-sm pt-2 border-t">
            <span>Balance/Change:</span>
            <span className={`font-semibold ${balance < 0 ? "text-red-500" : "text-green-600"}`}>
              {formatPrice(balance)}
            </span>
          </div>

          {/* Payment Methods */}
          <div className="space-y-2 pt-2">
            <p className="text-sm font-medium">Payment Method</p>
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full p-3 border rounded-lg text-left transition-colors ${selectedMethod === method.id
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <method.icon className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">{method.name}</p>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {changeAmount > 0 && (
            <div className="text-center p-2 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-600">Change to give:</p>
              <p className="text-lg font-bold text-green-700">{formatPrice(changeAmount)}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button
              className="flex-1 bg-orange-600 hover:bg-orange-700"
              onClick={handlePayment}
              disabled={isProcessing || !selectedMethod || amountPaid <= 0}
            >
              {isProcessing ? "Processing..." : "Complete Payment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
