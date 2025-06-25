"use client"

import { Badge } from "@/components/ui/badge"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PosSessionWithOrdersAndStaff } from "@/lib/getData"
import { extractorderId, formatPrice } from "@/lib/utils"
import { format } from "date-fns"
import { ClockIcon, PrinterIcon, UserIcon } from "lucide-react"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"

interface PosSessionDetailsDialogProps {
  session: PosSessionWithOrdersAndStaff | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PosSessionDetailsDialog({ session, open, onOpenChange }: PosSessionDetailsDialogProps) {

  // Mock data for orders in this session
  const contentRef = useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({contentRef})
  if (!session) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent  ref={contentRef} className="max-w-3xl print:max-w-full print:border-none print:shadow-none max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>POS Session #{extractorderId(session.id)}</span>
            <Badge variant={session.status === "ACTIVE" ? "default" : "secondary"}>{session.status}</Badge>
          </DialogTitle>
          <DialogDescription>View details for this POS session</DialogDescription>
        </DialogHeader>

        <div className="grid print:px-10 gap-6">
          <div className="grid gap-3">
            <div className="text-sm font-medium">Session Information</div>
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <span>Cashier: {session.cashier}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
                <span>Start Time: {format(new Date(session.startTime), "HH:mm")}</span>
              </div>
              {session.endTime && (
                <div className="flex items-center gap-2 text-sm">
                  <ClockIcon className="h-4 w-4 text-muted-foreground" />
                  <span>End Time: {format(new Date(session.endTime), "HH:mm")}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid gap-3">
            <div className="text-sm font-medium">Session Summary</div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-lg font-medium">{formatPrice(session.totalSales)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-lg font-medium">{session.totalOrders}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Average Order Value</p>
                <p className="text-lg font-medium">
                  {formatPrice(session.totalSales / session.totalOrders || 0)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-3">
            <div className="text-sm font-medium">Payment Methods</div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Cash</p>
                <p className="text-lg font-medium">{formatPrice(session.paymentMethods.CASH)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Card</p>
                <p className="text-lg font-medium">{formatPrice(session.paymentMethods.CARD)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Transfer</p>
                <p className="text-lg font-medium">{formatPrice(session.paymentMethods.TRANSFER)}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-3">
            <div className="text-sm font-medium">Orders in this Session</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {session.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{extractorderId(order.id)}</TableCell>
                    <TableCell>{format(new Date(order.date), "dd/MM/yy HH:mm")}</TableCell>
                    <TableCell>{order.itemscount}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell className="text-right">{formatPrice(order.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter className="flex print:hidden flex-col sm:flex-row gap-2">
          <Button onClick={reactToPrintFn} variant="outline" className="flex-1 gap-2">
            <PrinterIcon className="h-4 w-4" />
            Print Summary
          </Button>
          {session.status === "ACTIVE" && (
            <Button variant="destructive" className="flex-1">
              Close Session
            </Button>
          )}
          <Button onClick={() => onOpenChange(false)} className="flex-1">Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
