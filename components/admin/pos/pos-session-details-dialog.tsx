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
import { format } from "date-fns"
import { ClockIcon, PrinterIcon, UserIcon } from "lucide-react"

interface PosSessionDetailsDialogProps {
  session: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PosSessionDetailsDialog({ session, open, onOpenChange }: PosSessionDetailsDialogProps) {
  if (!session) return null

  // Mock data for orders in this session
  const sessionOrders = [
    {
      id: "ORD-101",
      time: "10:15 AM",
      items: 3,
      total: 7500,
      paymentMethod: "CASH",
    },
    {
      id: "ORD-102",
      time: "11:30 AM",
      items: 2,
      total: 5000,
      paymentMethod: "CARD",
    },
    {
      id: "ORD-103",
      time: "12:45 PM",
      items: 4,
      total: 9500,
      paymentMethod: "CASH",
    },
    {
      id: "ORD-104",
      time: "2:20 PM",
      items: 1,
      total: 2500,
      paymentMethod: "TRANSFER",
    },
    {
      id: "ORD-105",
      time: "3:40 PM",
      items: 3,
      total: 7500,
      paymentMethod: "CARD",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>POS Session {session.id}</span>
            <Badge variant={session.status === "ACTIVE" ? "default" : "secondary"}>{session.status}</Badge>
          </DialogTitle>
          <DialogDescription>View details for this POS session</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
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
                <p className="text-lg font-medium">₦{session.totalSales.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-lg font-medium">{session.totalOrders}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Average Order Value</p>
                <p className="text-lg font-medium">
                  ₦{(session.totalSales / session.totalOrders).toLocaleString(undefined, { maximumFractionDigits: 0 })}
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
                <p className="text-lg font-medium">₦{session.paymentMethods.CASH.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Card</p>
                <p className="text-lg font-medium">₦{session.paymentMethods.CARD.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Transfer</p>
                <p className="text-lg font-medium">₦{session.paymentMethods.TRANSFER.toLocaleString()}</p>
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
                  <TableHead>Time</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessionOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.time}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell className="text-right">₦{order.total.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="flex-1 gap-2">
            <PrinterIcon className="h-4 w-4" />
            Print Summary
          </Button>
          {session.status === "ACTIVE" && (
            <Button variant="destructive" className="flex-1">
              Close Session
            </Button>
          )}
          <Button className="flex-1">Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
