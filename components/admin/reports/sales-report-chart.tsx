"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data - would be replaced with actual data from API
const salesData = [
  { date: "May 16", online: 12500, pos: 8500, total: 21000 },
  { date: "May 17", online: 14200, pos: 9800, total: 24000 },
  { date: "May 18", online: 11800, pos: 7600, total: 19400 },
  { date: "May 19", online: 15600, pos: 10200, total: 25800 },
  { date: "May 20", online: 18900, pos: 12500, total: 31400 },
  { date: "May 21", online: 21500, pos: 14800, total: 36300 },
  { date: "May 22", online: 17200, pos: 11500, total: 28700 },
]

export function SalesReportChart() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Daily Sales Revenue</h3>
        <div className="text-sm text-muted-foreground">
          Total: ₦{salesData.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}
        </div>
      </div>

      <ChartContainer
        config={{
          online: {
            label: "Online Sales",
            color: "hsl(var(--chart-1))",
          },
          pos: {
            label: "POS Sales",
            color: "hsl(var(--chart-2))",
          },
        }}
        className="h-[350px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="online" fill="var(--color-online)" name="Online Sales" stackId="a" />
            <Bar dataKey="pos" fill="var(--color-pos)" name="POS Sales" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
