"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Order, Payment } from "@/lib/generated/prisma"
import { HydrationProps } from "@/lib/pos-data/getposdata"
import { usePOSStore } from "@/stores/usePOSStore"
import { DollarSign, ShoppingCart, TrendingUp, Clock } from "lucide-react"
import { useEffect } from "react"


export function DashboardContent() {
  const sessionOrders = usePOSStore((state) => state.orders)
  const isActive = usePOSStore((state) => state.isActive)
  const startTime = usePOSStore((state) => state.startTime)
  const cashierName = usePOSStore((state) => state.cashierName)


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const totalRevenue = sessionOrders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = sessionOrders.length
  const totalItems = sessionOrders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0,
  )

  // Calculate most sold items
  const itemCounts = sessionOrders.reduce(
    (acc, order) => {
      order.items.forEach((item) => {
        acc[item.name] = (acc[item.name] || 0) + item.quantity
      })
      return acc
    },
    {} as Record<string, number>,
  )

  const mostSoldItems = Object.entries(itemCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const sessionDuration = isActive && startTime
    ? Math.floor((Date.now() - startTime.getTime()) / (1000 * 60))
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Current session overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
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
            <CardTitle className="text-sm font-medium">Session Time</CardTitle>
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
            <CardTitle>Most Sold Items</CardTitle>
          </CardHeader>
          <CardContent>
            {mostSoldItems.length > 0 ? (
              <div className="space-y-3">
                {mostSoldItems.map(([itemName, quantity], index) => (
                  <div key={itemName} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <span className="font-medium">{itemName}</span>
                    </div>
                    <span className="text-sm text-gray-600">{quantity} sold</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No items sold yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Session Start:</span>
                <span className="font-medium">
                  {startTime?.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cashier:</span>
                <span className="font-medium">{cashierName}</span>
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
    </div>
  )
}
