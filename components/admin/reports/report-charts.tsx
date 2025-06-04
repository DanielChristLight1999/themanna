"use client"

import { useState, useMemo, ReactElement } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { BarChart3Icon, LineChartIcon, PieChartIcon, AreaChartIcon, SettingsIcon, TrendingUpIcon } from "lucide-react"

interface ReportChartsProps {
  data: any[]
  config: {
    templateId: string
    fields: string[]
  }
}

const COLORS = [
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#ec4899",
  "#6366f1",
]

export function ReportCharts({ data, config }: ReportChartsProps) {
  const [chartType, setChartType] = useState("bar")
  const [xAxis, setXAxis] = useState("defaultX")
  const [yAxis, setYAxis] = useState("defaultY")
  const [groupBy, setGroupBy] = useState("defaultGroup")

  // Analyze data to suggest chart configurations
  const dataAnalysis = useMemo(() => {
    if (data.length === 0) return { numericFields: [], categoricalFields: [], dateFields: [] }

    const firstRow = data[0]
    const numericFields: string[] = []
    const categoricalFields: string[] = []
    const dateFields: string[] = []

    Object.entries(firstRow).forEach(([key, value]) => {
      if (typeof value === "number") {
        numericFields.push(key)
      } else if (key.toLowerCase().includes("date") || key.toLowerCase().includes("at")) {
        dateFields.push(key)
      } else if (typeof value === "string" || typeof value === "boolean") {
        categoricalFields.push(key)
      }
    })

    return { numericFields, categoricalFields, dateFields }
  }, [data])

  // Set default axes based on template
  useMemo(() => {
    if (dataAnalysis.numericFields.length === 0) return

    switch (config.templateId) {
      case "sales-summary":
        setXAxis("placedAt")
        setYAxis("totalAmount")
        setGroupBy("status")
        break
      case "product-performance":
        setXAxis("name")
        setYAxis("price")
        setGroupBy("categoryName")
        break
      case "customer-insights":
        setXAxis("name")
        setYAxis("totalSpent")
        setGroupBy("customerSegment")
        break
      case "inventory-status":
        setXAxis("productName")
        setYAxis("quantity")
        setGroupBy("stockStatus")
        break
      default:
        setXAxis(dataAnalysis.categoricalFields[0] || dataAnalysis.dateFields[0] || "defaultX")
        setYAxis(dataAnalysis.numericFields[0] || "defaultY")
        setGroupBy(dataAnalysis.categoricalFields[1] || "defaultGroup")
    }
  }, [config.templateId, dataAnalysis])

  // Process data for charts
  const chartData = useMemo(() => {
    if (!xAxis || !yAxis || data.length === 0) return []

    const processedData: any[] = []
    const groupedData: Record<string, any> = {}

    data.forEach((row) => {
      const xValue = row[xAxis]
      const yValue = Number(row[yAxis]) || 0
      const groupValue = groupBy && groupBy !== "defaultGroup" ? row[groupBy] : "default"

      // Handle different x-axis value types
      let key: string
      if (xAxis.toLowerCase().includes("date") || xAxis.toLowerCase().includes("at")) {
        key = new Date(xValue).toLocaleDateString()
      } else {
        key = String(xValue || "Unknown")
      }

      if (!groupedData[key]) {
        groupedData[key] = { [xAxis]: key }
      }

      if (groupBy && groupBy !== "defaultGroup") {
        const groupKey = String(groupValue || "Unknown")
        groupedData[key][groupKey] = (groupedData[key][groupKey] || 0) + yValue
      } else {
        groupedData[key][yAxis] = (groupedData[key][yAxis] || 0) + yValue
      }
    })

    return Object.values(groupedData).slice(0, 20) // Limit to 20 data points
  }, [data, xAxis, yAxis, groupBy])

  // Get unique group values for legend
  const groupValues = useMemo(() => {
    if (!groupBy || groupBy === "defaultGroup") return []
    const values = [...new Set(data.map((row) => row[groupBy]))].filter(Boolean)
    return values.map((v) => String(v)).sort()
  }, [data, groupBy])

  const formatValue = (value: any, field: string) => {
    if (field.toLowerCase().includes("amount") || field.toLowerCase().includes("price")) {
      return `₦${Number(value).toLocaleString()}`
    }
    if (field.toLowerCase().includes("date") || field.toLowerCase().includes("at")) {
      return new Date(value).toLocaleDateString()
    }
    return String(value)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{formatValue(label, xAxis)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatValue(entry.value, yAxis)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <BarChart3Icon className="h-12 w-12 mb-4" />
          <p>No data available for the selected configuration</p>
        </div>
      )
    }

    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    }

    switch (chartType) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {groupBy && groupValues.length > 0 ? (
              groupValues.map((group, index) => (
                <Bar key={group} dataKey={group} fill={COLORS[index % COLORS.length]} name={String(group)} />
              ))
            ) : (
              <Bar dataKey={yAxis} fill={COLORS[0]} name={yAxis} />
            )}
          </BarChart>
        )

      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {groupBy && groupValues.length > 0 ? (
              groupValues.map((group, index) => (
                <Line
                  key={group}
                  type="monotone"
                  dataKey={group}
                  stroke={COLORS[index % COLORS.length]}
                  name={String(group)}
                />
              ))
            ) : (
              <Line type="monotone" dataKey={yAxis} stroke={COLORS[0]} name={yAxis} />
            )}
          </LineChart>
        )

      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {groupBy && groupValues.length > 0 ? (
              groupValues.map((group, index) => (
                <Area
                  key={group}
                  type="monotone"
                  dataKey={group}
                  stackId="1"
                  stroke={COLORS[index % COLORS.length]}
                  fill={COLORS[index % COLORS.length]}
                  name={String(group)}
                />
              ))
            ) : (
              <Area type="monotone" dataKey={yAxis} stroke={COLORS[0]} fill={COLORS[0]} name={yAxis} />
            )}
          </AreaChart>
        )

      case "pie":
        const pieData = chartData.slice(0, 8).map((item, index) => ({
          name: formatValue(item[xAxis], xAxis),
          value:
            item[yAxis] ||
            (groupBy
              ? Object.values(item).reduce((sum: number, val) => (typeof val === "number" ? sum + val : sum), 0)
              : 0),
          fill: COLORS[index % COLORS.length],
        }))

        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatValue(value, yAxis)} />
          </PieChart>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Chart Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Chart Configuration
          </CardTitle>
          <CardDescription>
            Customize your chart visualization by selecting different axes and grouping options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Chart Type</label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">X-Axis</label>
              <Select value={xAxis} onValueChange={setXAxis}>
                <SelectTrigger>
                  <SelectValue placeholder="Select X-axis" />
                </SelectTrigger>
                <SelectContent>
                  {[...dataAnalysis.categoricalFields, ...dataAnalysis.dateFields].map((field) => (
                    <SelectItem key={field} value={field}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Y-Axis</label>
              <Select value={yAxis} onValueChange={setYAxis}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Y-axis" />
                </SelectTrigger>
                <SelectContent>
                  {dataAnalysis.numericFields.map((field) => (
                    <SelectItem key={field} value={field}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Group By</label>
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Optional grouping" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="defaultGroup">No Grouping</SelectItem>
                  {dataAnalysis.categoricalFields.map((field) => (
                    <SelectItem key={field} value={field}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {chartType === "bar" && <BarChart3Icon className="h-5 w-5" />}
                {chartType === "line" && <LineChartIcon className="h-5 w-5" />}
                {chartType === "area" && <AreaChartIcon className="h-5 w-5" />}
                {chartType === "pie" && <PieChartIcon className="h-5 w-5" />}
                {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
              </CardTitle>
              <CardDescription>
                {xAxis && yAxis && (
                  <>
                    {formatValue("", xAxis).replace("₦", "").replace("0", xAxis)} vs{" "}
                    {formatValue("", yAxis).replace("₦", "").replace("0", yAxis)}
                    {groupBy && ` grouped by ${groupBy}`}
                  </>
                )}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {groupValues.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {groupValues.slice(0, 5).map((group, index) => (
                    <Badge key={group} variant="outline" style={{ borderColor: COLORS[index % COLORS.length] }}>
                      {String(group)}
                    </Badge>
                  ))}
                  {groupValues.length > 5 && <Badge variant="outline">+{groupValues.length - 5} more</Badge>}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart() as ReactElement}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Chart Insights */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUpIcon className="h-5 w-5" />
              Chart Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{chartData.length}</div>
                <div className="text-sm text-muted-foreground">Data Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{groupValues.length || 1}</div>
                <div className="text-sm text-muted-foreground">Series</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
                </div>
                <div className="text-sm text-muted-foreground">Chart Type</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
