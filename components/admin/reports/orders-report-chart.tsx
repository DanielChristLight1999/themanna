"use client"

import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data - would be replaced with actual data from API
const ordersData = [
  { date: "May 16", orders: 42, delivered: 40, cancelled: 2 },
  { date: "May 17", orders: 48, delivered: 45, cancelled: 3 },
  { date: "May 18", orders: 38, delivered: 36, cancelled: 2 },
  { date: "May 19", orders: 52, delivered: 49, cancelled: 3 },
  { date: "May 20", orders: 63, delivered: 60, cancelled: 3 },
  { date: "May 21", orders: 72, delivered: 68, cancelled: 4 },
  { date: "May 22", orders: 58, delivered: 55, cancelled: 3 },
]

export interface OrdersData {
  date: string
  orders: number
  delivered: number
  cancelled: number
}

export function OrdersReportChart({ordersData}: {ordersData: OrdersData[]}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Daily Order Volume</h3>
        <div className="text-sm text-muted-foreground">
          Total Orders: {ordersData.reduce((acc, curr) => acc + curr.orders, 0)}
        </div>
      </div>

      <ChartContainer
        config={{
          orders: {
            label: "Total Orders",
            color: "#FF7E00",
          },
          delivered: {
            label: "Delivered",
            color: "#00A86B",
          },
          cancelled: {
            label: "Cancelled",
            color: "#FF0000",
          },
        }}
        className="h-[350px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={ordersData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="orders" stroke="var(--color-orders)" strokeWidth={2} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="delivered" stroke="var(--color-delivered)" strokeWidth={2} />
            <Line type="monotone" dataKey="cancelled" stroke="var(--color-cancelled)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
