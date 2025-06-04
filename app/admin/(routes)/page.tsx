import type { Metadata } from "next"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardMetrics } from "@/components/admin/dashboard/metrics"
import { DashboardCharts } from "@/components/admin/dashboard/charts"
import { RecentOrders } from "@/components/admin/dashboard/recent-orders"
import { TopProducts } from "@/components/admin/dashboard/top-products"
import { getOrderStatusBaseData, getWeeklyRevenue } from "@/lib/getDashboardData"

export const metadata: Metadata = {
  title: "Dashboard | The Mana Restaurant Admin",
  description: "Admin dashboard for The Mana Restaurant",
}

export default async function DashboardPage() {
  const baseData = await getWeeklyRevenue()
  const orderStatusData = await getOrderStatusBaseData()
  return (
    <div className="flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <DateRangePicker />
          </div>
          <div className="md:hidden">
            <Button variant="outline" size="sm">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Date Range
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="online">Online</TabsTrigger>
          <TabsTrigger value="pos">POS</TabsTrigger>
          <TabsTrigger value="pickup">Pickup</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-6 ">
          <DashboardMetrics />
          <DashboardCharts filterType="all" orderStatusBaseData={orderStatusData} revenueBaseData={baseData} />
          <div className="grid gap-6">
            <RecentOrders />
            <TopProducts />
          </div>
        </TabsContent>
        <TabsContent value="online" className="space-y-6">
          <DashboardMetrics filterType="online" />
          <DashboardCharts orderStatusBaseData={orderStatusData} revenueBaseData={baseData} filterType="online" />
          <div className="grid gap-6 md:grid-cols-2">
            <RecentOrders filterType="online" />
            <TopProducts filterType="online" />
          </div>
        </TabsContent>
        <TabsContent value="pos" className="space-y-6">
          <DashboardMetrics filterType="pos" />
          <DashboardCharts orderStatusBaseData={orderStatusData} revenueBaseData={baseData} filterType="pos" />
          <div className="grid gap-6 md:grid-cols-2">
            <RecentOrders filterType="pos" />
            <TopProducts filterType="pos" />
          </div>
        </TabsContent>
        <TabsContent value="pickup" className="space-y-6">
          <DashboardMetrics filterType="pickup" />
          <DashboardCharts orderStatusBaseData={orderStatusData} revenueBaseData={baseData} filterType="pickup" />
          <div className="grid gap-6 md:grid-cols-2">
            <RecentOrders filterType="pickup" />
            <TopProducts filterType="pickup" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
