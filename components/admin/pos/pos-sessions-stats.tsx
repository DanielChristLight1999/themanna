"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock data - would be replaced with actual data from API
const getStatsData = (period: string) => {
  if (period === "today") {
    return {
      totalSessions: 8,
      totalRevenue: 125000,
      averageTicket: 15625,
      activeSessions: 2,
    }
  } else if (period === "week") {
    return {
      totalSessions: 42,
      totalRevenue: 685000,
      averageTicket: 16309,
      activeSessions: 2,
    }
  } else {
    return {
      totalSessions: 180,
      totalRevenue: 2950000,
      averageTicket: 16388,
      activeSessions: 2,
    }
  }
}

export function PosSessionsStats() {
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
            <StatsCards stats={getStatsData("today")} />
          </TabsContent>
          <TabsContent value="week" className="pt-4">
            <StatsCards stats={getStatsData("week")} />
          </TabsContent>
          <TabsContent value="month" className="pt-4">
            <StatsCards stats={getStatsData("month")} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function StatsCards({ stats }: { stats: any }) {
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
