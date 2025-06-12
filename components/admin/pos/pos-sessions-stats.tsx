
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSessionsData } from "@/lib/getData"


export async function PosSessionsStats() {
  const SessionstatsData = await getSessionsData()
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <CardTitle>POS Sessions Overview</CardTitle>
          <CardDescription>Track in-store sales and cashier performance</CardDescription>
        </div>
        <div className="hidden sm:block">
          <DateRangePicker />
        </div>
        <Button variant="outline" className="sm:hidden">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Date Range
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
          </TabsList>
          <TabsContent value="today" className="pt-4">
            <StatsCards stats={SessionstatsData.today} />
          </TabsContent>
          <TabsContent value="week" className="pt-4">
            <StatsCards stats={SessionstatsData.week} />
          </TabsContent>
          <TabsContent value="month" className="pt-4">
            <StatsCards stats={SessionstatsData.month} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
interface Stats {
  totalSessions: number
  totalRevenue: number
  averageTicket: number
  activeSessions: number
}
function StatsCards({ stats }: { stats: Stats }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSessions}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Average Ticket</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₦{stats.averageTicket.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Active Sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeSessions}</div>
        </CardContent>
      </Card>
    </div>
  )
}
