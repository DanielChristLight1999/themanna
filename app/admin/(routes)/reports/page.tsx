import type { Metadata } from "next"
import { ReportsOverview } from "@/components/admin/reports/reports-overview"
import { getOrdersReportData, getProductCategorySalesPercentages, getSalesReportChartData } from "@/lib/getDashboardData"
import { EnhancedReportsGenerator } from "@/components/admin/reports/enhanced-reports-generator"

export const metadata: Metadata = {
  title: "Reports & Analytics | The Mana Restaurant Admin",
  description: "View reports and analytics for The Mana Restaurant",
}

export default async function ReportsPage() {
  const salesData = await getSalesReportChartData()
  const productCategoryData = await getProductCategorySalesPercentages()
  const ordersData = await getOrdersReportData()
  return (
    <div className="flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
      </div>

      <ReportsOverview />
      <EnhancedReportsGenerator />
    </div>
  )
}
