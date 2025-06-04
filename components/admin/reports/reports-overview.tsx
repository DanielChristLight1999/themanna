import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UsersIcon, ShoppingCartIcon, DollarSignIcon, AlertTriangleIcon, UserCheckIcon, ClockIcon } from "lucide-react"
import { getInventoryAlerts } from "@/lib/mock-data/reports-data"
import { getReportsData } from "@/lib/getData"
import { formatPrice } from "@/lib/utils"

export async function ReportsOverview() {
  const reportData = await getReportsData()
  const inventoryAlerts = getInventoryAlerts(reportData.inventory, reportData.products)

  // Calculate metrics from mock data
  const totalRevenue = reportData.orders
    .filter((order) => order.paymentStatus === "SUCCESS")
    .reduce((sum, order) => sum + order.totalAmount, 0)

  const totalOrders = reportData.orders.length
  const deliveredOrders = reportData.orders.filter((order) => order.status === "DELIVERED").length
  const activeCustomers = reportData.users.filter((user) => user.role === "CUSTOMER").length
  const lowStockItems = inventoryAlerts.length
  const activeAffiliates = reportData.affiliates.filter((affiliate) => affiliate.approved).length
  const activePOSSessions = reportData.posSessions.filter((session) => !session.closedAt).length

  const stats = [
    {
      title: "Total Revenue",
      value: `${formatPrice(totalRevenue)}`,
      description: "This month",
      icon: DollarSignIcon,
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      description: `${deliveredOrders} delivered`,
      icon: ShoppingCartIcon,
      trend: "+8.2%",
      trendUp: true,
    },
    {
      title: "Active Customers",
      value: activeCustomers.toString(),
      description: "Registered users",
      icon: UsersIcon,
      trend: "+15.3%",
      trendUp: true,
    },
    {
      title: "Low Stock Items",
      value: lowStockItems.toString(),
      description: "Need restocking",
      icon: AlertTriangleIcon,
      trend: "-2 items",
      trendUp: false,
      variant: lowStockItems > 0 ? "destructive" : "default",
    },
    {
      title: "Active Affiliates",
      value: activeAffiliates.toString(),
      description: "Approved partners",
      icon: UserCheckIcon,
      trend: "+1 this month",
      trendUp: true,
    },
    {
      title: "Active POS Sessions",
      value: activePOSSessions.toString(),
      description: "Currently open",
      icon: ClockIcon,
      trend: "Real-time",
      trendUp: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>{stat.description}</span>
                <Badge variant={stat.variant as "default" | "secondary" || (stat.trendUp ? "default" : "secondary")} className="text-xs">
                  {stat.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick insights based on actual schema data */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inventory Alerts</CardTitle>
            <CardDescription>Items requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {inventoryAlerts.length > 0 ? (
                inventoryAlerts.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div>
                      <p className="font-medium text-sm">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">{item.quantity} units remaining</p>
                    </div>
                    <Badge variant={item.status === "OUT_OF_STOCK" ? "destructive" : "secondary"}>
                      {item.status === "OUT_OF_STOCK" ? "Out of Stock" : "Low Stock"}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">All products are well stocked</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reportData.orders.slice(0, 3).map((order, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div>
                    <p className="font-medium text-sm">Order #{order.id.slice(-6)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.placedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{formatPrice(order.totalAmount)}</p>
                    <Badge
                      variant={
                        order.status === "DELIVERED" ? "default" : order.status === "PENDING" ? "secondary" : "outline"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
