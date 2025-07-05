"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { OrderWithItems } from "@/app/pos/(routes)/active-orders/active-orders-content"
import { extractorderId, formatPrice } from "@/lib/utils"
import { PastOrderWithItems } from "@/app/pos/(routes)/past-orders/past-orders-content"

interface OrderTableProps {
  orders: PastOrderWithItems[]
  showActions?: boolean
  onUpdateStatus?: (orderId: string, status: "CONFIRMED" | "CANCELLED" | "DELIVERED") => void
  setShowReceipt?: (show: boolean) => void
  setCurrentOrder?: (order: PastOrderWithItems) => void 
}

export function OrderTable({ orders, showActions = false, onUpdateStatus, setShowReceipt, setCurrentOrder }: OrderTableProps) {

  const formatTime = (date: Date) =>
    new Intl.DateTimeFormat("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800"
      case "DELIVERED":
        return "bg-green-100 text-green-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            {showActions && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium uppercase">#ORD-{extractorderId(order.id)}</TableCell>
              <TableCell>{formatTime(order.placedAt)}</TableCell>
              <TableCell>
                {order.items.slice(0, 2).map((item, index) => (
                  <div key={index} className="text-sm">
                    {item.product.name} × {item.quantity}
                  </div>
                ))}
                {order.items.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{order.items.length - 2} more
                  </div>
                )}
              </TableCell>
              <TableCell>{formatPrice(order.totalAmount)}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
              </TableCell>

              {showActions && (
                <TableCell>
                  <div className="flex space-x-2">
                    {order.status === "PENDING" ? (
                      <Button size="sm" asChild variant="outline">
                        <Link href={`/new-order?resume=${order.id}`}>Resume</Link>
                      </Button>
                    ) : order.status === "CONFIRMED" ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateStatus?.(order.id, "DELIVERED")}
                          className="text-green-600 hover:text-green-700"
                        >
                          Deliver
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateStatus?.(order.id, "CANCELLED")}
                          className="text-red-600 hover:text-red-700"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : <Button 
                        size={"sm"}
                        variant={"outline"}
                        onClick={() => {
                          setCurrentOrder?.(order)
                          setShowReceipt?.(true)
                        }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        View
                      </Button>}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
