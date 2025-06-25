"use client"

import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Printer } from "lucide-react"
import { extractorderId, formatPrice } from "@/lib/utils"
import { usePOSStore } from "@/stores/usePOSStore"

export interface ReceiptProps {
  isOpen: boolean
  onClose: () => void
  order: {
    id: string
    items: Array<{
      product: {
        id: number
        name: string
        price: number
      }
      quantity: number
    }>
    subtotal: number
    taxAmount: number
    totalAmount: number
    payment?: {
      method: "CASH" | "TRANSFER" | "CARD"
    }
    placedAt: Date
    cashierName: string
    changeGiven?: number
  }
}

function ReceiptContent({ order }: { order: ReceiptProps["order"] }) {
  const settingsData = usePOSStore((state) => state.settingsData)
  const restaurantInfo = settingsData?.restaurantInfo
  if (!restaurantInfo) return null
  const {name, address, phone} = restaurantInfo
  const date = order.placedAt.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
  const time = order.placedAt.toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  return (
    <div className="receipt-content p-4 text-sm font-mono max-w-sm mx-auto text-black">
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold">{name}</h1>
        <p className="text-xs">{address}</p>
        <p className="text-xs">{phone}</p>
      </div>

      <Separator className="my-2" />

      <div className="space-y-1 mb-4">
        <div className="flex justify-between">
          <span>Order ID:</span>
          <span className="uppercase">ORD-{extractorderId(order.id)}</span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{date}</span>
        </div>
        <div className="flex justify-between">
          <span>Time:</span>
          <span>{time}</span>
        </div>
        <div className="flex justify-between">
          <span>Cashier:</span>
          <span>{order.cashierName}</span>
        </div>
      </div>

      <Separator className="my-2" />

      <div className="mb-4">
        <h2 className="font-semibold mb-2">Items</h2>
        {order.items.map((item, idx) => (
          <div key={idx} className="mb-2">
            <div className="flex justify-between">
              <span>{item.product.name} (x{item.quantity})</span>
              <span>{formatPrice(item.product.price * item.quantity)}</span>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-2" />

      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (7.5%):</span>
          <span>{formatPrice(order.taxAmount)}</span>
        </div>
        <div className="flex justify-between font-bold text-base border-t pt-2">
          <span>Total:</span>
          <span>{formatPrice(order.totalAmount)}</span>
        </div>
        {order.changeGiven && (
          <div className="flex justify-between">
            <span>Change Given:</span>
            <span>{formatPrice(order.changeGiven)}</span>
          </div>
        )}
        {order.payment?.method && (
          <div className="flex justify-between">
            <span>Payment:</span>
            <span>{order.payment.method}</span>
          </div>
        )}
      </div>

      <Separator className="my-4" />

      <p className="text-center text-xs text-muted-foreground">
        Thank you for dining with us!
        <br />
        Visit again.
      </p>
    </div>
  )
}

export function ReceiptModal({ isOpen, onClose, order }: ReceiptProps) {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `receipt-${order.id}`,
    onAfterPrint: onClose,
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-full overflow-auto print:hidden">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Receipt</span>
            <Button size="sm" variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div ref={printRef} className="p-4 bg-white">
          <ReceiptContent order={order} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
