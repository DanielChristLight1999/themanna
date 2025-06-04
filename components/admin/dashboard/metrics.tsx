
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardMetrics } from "@/lib/getDashboardData"

interface DashboardMetricsProps {
  filterType?: "online" | "pos" | "pickup"
}

export async function DashboardMetrics({ filterType }: DashboardMetricsProps) {
  const metrics = await getDashboardMetrics(filterType)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalOrders}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {metrics.percentChange.orders > 0 ? (
              <span className="text-green-600 flex items-center">
                <ArrowUpIcon className="mr-1 h-3 w-3" />
                {metrics.percentChange.orders}% from last period
              </span>
            ) : (
              <span className="text-red-600 flex items-center">
                <ArrowDownIcon className="mr-1 h-3 w-3" />
                {Math.abs(metrics.percentChange.orders)}% from last period
              </span>
            )}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₦{metrics.totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {metrics.percentChange.revenue > 0 ? (
              <span className="text-green-600 flex items-center">
                <ArrowUpIcon className="mr-1 h-3 w-3" />
                {metrics.percentChange.revenue}% from last period
              </span>
            ) : (
              <span className="text-red-600 flex items-center">
                <ArrowDownIcon className="mr-1 h-3 w-3" />
                {Math.abs(metrics.percentChange.revenue)}% from last period
              </span>
            )}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {filterType === "pos" ? "Avg. Service Time" : "Avg. Delivery Time"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{filterType === "pos" ? "N/A" : `${metrics.avgDeliveryTime} min`}</div>
          {filterType !== "pos" && (
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.percentChange.deliveryTime < 0 ? (
                <span className="text-green-600 flex items-center">
                  <ArrowDownIcon className="mr-1 h-3 w-3" />
                  {Math.abs(metrics.percentChange.deliveryTime)}% faster than last period
                </span>
              ) : (
                <span className="text-red-600 flex items-center">
                  <ArrowUpIcon className="mr-1 h-3 w-3" />
                  {metrics.percentChange.deliveryTime}% slower than last period
                </span>
              )}
            </p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.activeOrders}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {metrics.percentChange.activeOrders > 0 ? (
              <span className="text-green-600 flex items-center">
                <ArrowUpIcon className="mr-1 h-3 w-3" />
                {metrics.percentChange.activeOrders}% from last period
              </span>
            ) : (
              <span className="text-red-600 flex items-center">
                <ArrowDownIcon className="mr-1 h-3 w-3" />
                {Math.abs(metrics.percentChange.activeOrders)}% from last period
              </span>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
