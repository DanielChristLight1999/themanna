"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { OrderTable } from "@/components/pos/order-table"
// import { OrderWithItems } from "../active-orders/active-orders-content"
import { ReceiptModal } from "@/components/pos/receipt"
import { OrderStatus } from "@/lib/generated/prisma"

export type   PastOrderWithItems = {
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
  taxAmount: number | null
  totalAmount: number
  payment: {
    method: "CASH" | "TRANSFER" | "CARD"
  } | null
  status: OrderStatus
  placedAt: Date
  cashierName?: string | null
  changeGiven?: number
}
export function PastOrdersContent({ orders }: { orders: PastOrderWithItems[] }) {
  // const pastOrders = usePOSStore((state) => state.orders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [showReceipt, setShowReceipt] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<PastOrderWithItems | null>(null)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.product.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPayment = paymentFilter === "all" || order.payment?.method === paymentFilter

    return matchesSearch && matchesStatus && matchesPayment
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Past Orders</h1>
        <p className="text-gray-600">View orders from previous sessions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment Methods</SelectItem>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="TRANSFER">Transfer</SelectItem>
                <SelectItem value="CARD">Card</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setPaymentFilter("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No orders found</p>
            </div>
          ) : (
            <OrderTable setShowReceipt={setShowReceipt} setCurrentOrder={setCurrentOrder} showActions={true} orders={filteredOrders} />
          )}
        </CardContent>
      </Card>

      {currentOrder && <ReceiptModal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        order={currentOrder}
        
      />}
    </div>
  )
}
