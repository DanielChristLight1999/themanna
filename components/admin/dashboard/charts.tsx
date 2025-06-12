"use client"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Legend,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface DashboardChartsProps {
  filterType: "online" | "pos" | "pickup" | "all"
  revenueBaseData: RevenueData[]
  orderStatusBaseData: Record<string, number>
}

interface RevenueData {
  name: string
  online: number
  pos: number
  pickup: number
}

// Mock data - would be replaced with actual data from API
const getRevenueData = (baseData: RevenueData[], filterType?: string) => {
  // This would be an API call in a real application
  // const baseData = [
  //   { name: "Mon", online: 1200, pos: 800, pickup: 400 },
  //   { name: "Tue", online: 1400, pos: 1000, pickup: 600 },
  //   { name: "Wed", online: 1100, pos: 900, pickup: 500 },
  //   { name: "Thu", online: 1700, pos: 1200, pickup: 700 },
  //   { name: "Fri", online: 2100, pos: 1500, pickup: 900 },
  //   { name: "Sat", online: 2400, pos: 1800, pickup: 1100 },
  //   { name: "Sun", online: 1900, pos: 1300, pickup: 800 },
  // ]

  if (!filterType || filterType === "all") {
    return baseData.map((day) => ({
      name: day.name,
      revenue: day.online + day.pos + day.pickup,
    }))
  }

  return baseData.map((day) => ({
    name: day.name,
    revenue: day[filterType as keyof typeof day] as number,
  }))
}

// const getOrderStatusData = (filterType?: string) => {
//   // This would be an API call in a real application
//   const multiplier = filterType === "pos" ? 0.3 : filterType === "pickup" ? 0.15 : filterType === "online" ? 0.55 : 1

//   return [
//     { name: "Pending", value: Math.round(15 * multiplier) },
//     { name: "Confirmed", value: Math.round(25 * multiplier) },
//     { name: "In Transit", value: Math.round(20 * multiplier) },
//     { name: "Delivered", value: Math.round(40 * multiplier) },
//   ]
// }

type OrderStatusData = {
  name: string
  value: number
  raw: number
}

type FilterType = "online" | "pickup" | "pos" | "all"

function getOrderStatusData(baseData: Record<string, number>, filterType: FilterType): OrderStatusData[] {
  // Simulated multipliers — you can replace this with actual logic later
  const multipliers: Record<FilterType, number> = {
    pos: 0.3,
    pickup: 0.15,
    online: 0.55,
    all: 1
  }

  const multiplier = multipliers[filterType] ?? 1
  const filteredValues = Object.entries(baseData).map(([status, raw]) => ({
    name: status.replace("_", " ").toLowerCase().replace(/^\w/, c => c.toUpperCase()),
    raw,
    value: Math.round(raw * multiplier)
  }))

  const total = filteredValues.reduce((acc, item) => acc + item.value, 0)

  return filteredValues.map((item) => ({
    ...item,
    value: total ? Math.round((item.value / total) * 100) : 0
  }))
}

const getHourlyOrdersData = (filterType?: string) => {
  // This would be an API call in a real application
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Different patterns for different order types
  const getOrderCount = (hour: number, type?: string) => {
    if (type === "pos") {
      // POS peaks during lunch and dinner hours
      if (hour >= 11 && hour <= 14) return 5 + Math.floor(Math.random() * 5)
      if (hour >= 18 && hour <= 21) return 7 + Math.floor(Math.random() * 6)
      if (hour >= 7 && hour <= 22) return 1 + Math.floor(Math.random() * 3)
      return 0
    } else if (type === "pickup") {
      // Pickup has smaller peaks, similar pattern to POS
      if (hour >= 11 && hour <= 14) return 2 + Math.floor(Math.random() * 3)
      if (hour >= 18 && hour <= 21) return 3 + Math.floor(Math.random() * 4)
      if (hour >= 7 && hour <= 22) return Math.floor(Math.random() * 2)
      return 0
    } else if (type === "online") {
      // Online orders peak in evening, but happen throughout the day
      if (hour >= 11 && hour <= 14) return 4 + Math.floor(Math.random() * 4)
      if (hour >= 18 && hour <= 22) return 8 + Math.floor(Math.random() * 7)
      if (hour >= 7 && hour <= 23) return 1 + Math.floor(Math.random() * 3)
      return Math.floor(Math.random() * 1)
    } else {
      // All orders combined
      if (hour >= 11 && hour <= 14) return 10 + Math.floor(Math.random() * 10)
      if (hour >= 18 && hour <= 21) return 15 + Math.floor(Math.random() * 15)
      if (hour >= 7 && hour <= 23) return 3 + Math.floor(Math.random() * 7)
      return Math.floor(Math.random() * 2)
    }
  }

  return hours.map((hour) => ({
    hour: hour.toString().padStart(2, "0") + ":00",
    orders: getOrderCount(hour, filterType),
  }))
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export function DashboardCharts({ filterType, revenueBaseData, orderStatusBaseData }: DashboardChartsProps) {
  const revenueData = getRevenueData(revenueBaseData, filterType)
  const orderStatusData = getOrderStatusData(orderStatusBaseData, filterType)
  const hourlyOrdersData = getHourlyOrdersData(filterType)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="max-w-92 md:w-full md:max-w-none">
        <CardHeader>
          <CardTitle>Weekly Revenue</CardTitle>
          <CardDescription>Revenue breakdown for the past week</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue (₦)",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px] w-full"
          >
            <BarChart accessibilityLayer data={revenueData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="max-w-92 md:w-full md:max-w-none">
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
          <CardDescription>Current distribution of order statuses</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <div className="h-[400px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} orders`, "Count"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 max-w-92 md:w-full md:max-w-none">
        <CardHeader>
          <CardTitle>Hourly Order Volume</CardTitle>
          <CardDescription>Number of orders by hour of day</CardDescription>
        </CardHeader>
        <CardContent className="px-2 w-full">
          <ChartContainer
            config={{
              orders: {
                label: "Orders",
                color: "#FF7E00",
              },
            }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyOrdersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" interval={3} tickFormatter={(value) => value.split(":")[0]} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="var(--color-orders)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
