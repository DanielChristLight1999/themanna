"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { PrinterIcon, DownloadIcon, CheckCircleIcon } from "lucide-react"

interface Transaction {
  id: string
  items: any[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: string
  timestamp: string
}

interface PosSession {
  id: string
  cashier: string
  startTime: string
}

interface PosReceiptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: Transaction | null
  session: PosSession | null
}

export function PosReceiptDialog({ open, onOpenChange, transaction, session }: PosReceiptDialogProps) {
  if (!transaction || !session) return null

  const handlePrint = () => {
    // In a real app, this would trigger the print functionality
    console.log("Printing receipt...")
  }

  const handleDownload = () => {
    // In a real app, this would download the receipt as PDF
    console.log("Downloading receipt...")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
            Transaction Complete
          </DialogTitle>
          <DialogDescription>Payment processed successfully</DialogDescription>
        </DialogHeader>

        {/* Receipt */}
        <div className="bg-white text-black p-6 font-mono text-sm border rounded-lg">
          <div className="text-center mb-4">
            <h2 className="font-bold text-lg">THE MANA RESTAURANT</h2>
            <p>123 Lagos Street, Ikeja, Lagos</p>
            <p>+234 812 345 6789</p>
          </div>

          <Separator className="my-4" />

          <div className="space-y-1 mb-4">
            <div className="flex justify-between">
              <span>Receipt #:</span>
              <span>{transaction.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{new Date(transaction.timestamp).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span>{new Date(transaction.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Cashier:</span>
              <span>{session.cashier}</span>
            </div>
            <div className="flex justify-between">
              <span>Session:</span>
              <span>{session.id}</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-1 mb-4">
            {transaction.items.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
                <div className="text-xs text-gray-600 ml-4">@ ₦{item.price.toLocaleString()} each</div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₦{transaction.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (7.5%):</span>
              <span>₦{transaction.tax.toLocaleString()}</span>
            </div>
            {transaction.discount > 0 && (
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-₦{transaction.discount.toLocaleString()}</span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>TOTAL:</span>
              <span>₦{transaction.total.toLocaleString()}</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="uppercase">{transaction.paymentMethod}</span>
            </div>
          </div>

          <div className="text-center mt-6 text-xs">
            <p>Thank you for your business!</p>
            <p>Visit us again soon</p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handlePrint} className="flex-1 gap-2">
            <PrinterIcon className="h-4 w-4" />
            Print Receipt
          </Button>
          <Button variant="outline" onClick={handleDownload} className="flex-1 gap-2">
            <DownloadIcon className="h-4 w-4" />
            Download PDF
          </Button>
          <Button onClick={() => onOpenChange(false)} className="flex-1">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
