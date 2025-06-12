"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Clock, DollarSign, Loader2, ShoppingCart, TrendingUp } from "lucide-react"
import { usePOSStore } from "@/stores/usePOSStore"
import { endPOSSession } from "@/actions/pos/session-actions"
import { toast } from "sonner"

export function EndSessionContent() {
  const orders = usePOSStore((state) => state.orders)
  const cashierName = usePOSStore((state) => state.cashierName)
  const isActive = usePOSStore((state) => state.isActive)
  const startTime = usePOSStore((state) => state.startTime) as Date
  const sessionId = usePOSStore((state) => state.sessionId)
  const [loading, setLoading] = useState(false)
  const endSession = usePOSStore((state) => state.endSession)
  const [showSummary, setShowSummary] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const totalItems = orders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0,
  )
  const totalRevenue = orders.reduce((sum, order) => sum + order.subtotal, 0)
  const totalTax = orders.reduce((sum, order) => sum + order.tax, 0)
  const totalCash = orders
    .filter((order) => order.paymentMethod === "CASH")
    .reduce((sum, order) => sum + order.total, 0)
  const totalTransfer = orders
    .filter((order) => order.paymentMethod === "TRANSFER")
    .reduce((sum, order) => sum + order.total, 0)
  // const totalCard = orders
  //   .filter((order) => order.paymentMethod === "CARD")
  //   .reduce((sum, order) => sum + order.total, 0)
  // const totalOther = orders
  //   .filter((order) => !["CASH", "TRANSFER", "CARD"].includes(order.paymentMethod))
  //   .reduce((sum, order) => sum + order.total, 0)
  // const totalRevenueWithTax = totalRevenue + totalTax
  const totalSalesWithTax = totalSales + totalTax

  const paymentBreakdown = orders.reduce(
    (acc, order) => {
      acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + order.total
      return acc
    },
    {} as Record<string, number>,
  )

  const sessionDuration = isActive
    ? Math.floor((Date.now() - startTime.getTime()) / (1000 * 60))
    : 0

  const handleEndSession = () => {
    setShowSummary(true)
  }

  const confirmEndSession = async () => {
    if (!sessionId) {
      toast.error("No session ID found")
      return
    }
    setLoading(true)
    const summaryData = {
      totalRevenue: totalRevenue,
      totalSales: totalSalesWithTax,
      totalOrders: totalOrders,
      transferAmount: totalTransfer,
      cashAmount: totalCash,
      taxAmount: totalTax
    }
    const response = await endPOSSession(sessionId, summaryData)
    if (response.error) {
      toast.error(response.message || "Failed to end session")
      setLoading(false)
      return
    }
    toast.success("Session ended successfully")
    endSession()
    setLoading(false)
    setShowSummary(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">End Session</h1>
        <p className="text-gray-600">Close current POS session and view summary</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatPrice(totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionDuration}m</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(paymentBreakdown).map(([method, amount]) => (
                <div key={method} className="flex justify-between items-center">
                  <span className="font-medium">{method}</span>
                  <span className="text-orange-600 font-bold">{formatPrice(amount)}</span>
                </div>
              ))}
              {Object.keys(paymentBreakdown).length === 0 && (
                <p className="text-gray-500 text-center py-4">No payments processed</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Cashier:</span>
                <span className="font-medium">{cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Start Time:</span>
                <span className="font-medium">
                  {startTime?.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${isActive ? "text-green-600" : "text-red-600"}`}>
                  {isActive ? "Active" : "Closed"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>End Session</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Ending this session will close the current POS session and move all orders to past orders. You will need
              to start a new session to continue processing orders.
            </p>
            <Button
              onClick={handleEndSession}
              disabled={!isActive}
              className="bg-red-600 hover:bg-red-700"
            >
              {isActive ? "End Current Session" : "Session Already Closed"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Session Summary</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center py-4 border rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">Total Session Revenue</p>
              <p className="text-2xl font-bold text-orange-600">{formatPrice(totalRevenue)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Orders</p>
                <p className="text-xl font-bold">{totalOrders}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Items</p>
                <p className="text-xl font-bold">{totalItems}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Payment Methods:</p>
              {Object.entries(paymentBreakdown).map(([method, amount]) => (
                <div key={method} className="flex justify-between text-sm">
                  <span>{method}:</span>
                  <span className="font-medium">{formatPrice(amount)}</span>
                </div>
              ))}
            </div>

            <div className="flex space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowSummary(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={confirmEndSession} className="flex-1 bg-red-600 hover:bg-red-700">
                {loading ? <Loader2 className="animate-spin mr-2" /> : "Confirm End Session"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
