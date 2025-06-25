
import EarningsChart from "@/components/affiliate/dashboard/earnings-chart"
import RecentCommissions from "@/components/affiliate/dashboard/recent-commissions-table"
import SummaryCards from "@/components/affiliate/dashboard/summary-cards"
import { getEarningsData } from "@/lib/affiliate-data/get-dashboard-data"

export default async function Dashboard() {
  const earningsData = await getEarningsData()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Track your affiliate performance and earnings</p>
      </div>

      {/* Summary Cards */}
      <SummaryCards />
      {/* Earnings Chart */}
      <EarningsChart earningsData={earningsData} />
      {/* Recent Commissions */}
      <RecentCommissions />
    </div>
  )
}
