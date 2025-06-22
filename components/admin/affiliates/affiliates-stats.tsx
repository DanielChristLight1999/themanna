"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock data - would be replaced with actual data from API
const getStatsData = (period: string) => {
  if (period === "week") {
    return {
      totalAffiliates: 12,
      activeAffiliates: 8,
      totalCommissions: 45000,
      pendingCommissions: 12500,
      referrals: 28,
    }
  } else if (period === "month") {
    return {
      totalAffiliates: 12,
      activeAffiliates: 10,
      totalCommissions: 120000,
      pendingCommissions: 35000,
      referrals: 75,
    }
  } else {
    return {
      totalAffiliates: 12,
      activeAffiliates: 11,
      totalCommissions: 580000,
      pendingCommissions: 85000,
      referrals: 320,
    }
  }
}

// Mock chart data
const getChartData = (period: string) => {
  if (period === "week") {
    return [
      { date: "May 16", commissions: 5000, referrals: 3 },
      { date: "May 17", commissions: 7500, referrals: 5 },
      { date: "May 18", commissions: 4500, referrals: 3 },
      { date: "May 19", commissions: 8500, referrals: 6 },
      { date: "May 20", commissions: 6500, referrals: 4 },
      { date: "May 21", commissions: 9000, referrals: 5 },
      { date: "May 22", commissions: 4000, referrals: 2 },
    ]
  } else if (period === "month") {
    return [
      { date: "Week 1", commissions: 25000, referrals: 15 },
      { date: "Week 2", commissions: 32000, referrals: 20 },
      { date: "Week 3", commissions: 28000, referrals: 18 },
      { date: "Week 4", commissions: 35000, referrals: 22 },
    ]
  } else {
    return [
      { date: "Jan", commissions: 45000, referrals: 28 },
      { date: "Feb", commissions: 52000, referrals: 32 },
      { date: "Mar", commissions: 48000, referrals: 30 },
      { date: "Apr", commissions: 65000, referrals: 40 },
      { date: "May", commissions: 120000, referrals: 75 },
      { date: "Jun", commissions: 95000, referrals: 60 },
      { date: "Jul", commissions: 85000, referrals: 55 },
    ]
  }
}

export function AffiliatesStats() {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <CardTitle>Affiliate Program Overview</CardTitle>
          <CardDescription>Track affiliate performance and commissions</CardDescription>
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
        <Tabs defaultValue="week" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>
          <TabsContent value="week" className="pt-4 w-full space-y-6">
            <StatsCards stats={getStatsData("week")} />
            <AffiliateChart data={getChartData("week")} />
          </TabsContent>
          <TabsContent value="month" className="pt-4 space-y-6">
            <StatsCards stats={getStatsData("month")} />
            <AffiliateChart data={getChartData("month")} />
          </TabsContent>
          <TabsContent value="year" className="pt-4 space-y-6">
            <StatsCards stats={getStatsData("year")} />
            <AffiliateChart data={getChartData("year")} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function StatsCards({ stats }: { stats: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Affiliates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalAffiliates}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Active Affiliates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeAffiliates}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Commissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₦{stats.totalCommissions.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Pending Commissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₦{stats.pendingCommissions.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Referrals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.referrals}</div>
        </CardContent>
      </Card>
    </div>
  )
}

function AffiliateChart({ data }: { data: any[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Affiliate Performance</h3>
      </div>

      <ChartContainer
        config={{
          commissions: {
            label: "Commissions (₦)",
            color: "hsl(var(--chart-1))",
          },
          referrals: {
            label: "Referrals",
            color: "hsl(var(--chart-2))",
          },
        }}
        className="h-[300px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="commissions" yAxisId="left" fill="var(--color-commissions)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="referrals" yAxisId="right" fill="var(--color-referrals)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
