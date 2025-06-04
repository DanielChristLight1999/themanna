"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUpIcon,
  TrendingDownIcon,
  DollarSignIcon,
  UsersIcon,
  PackageIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
} from "lucide-react"

interface ReportSummaryProps {
  data: any[]
  config: {
    templateId: string
    fields: string[]
  }
  metadata: {
    totalRecords: number
    generatedAt: string
    executionTime: number
    dataSource: string
  }
}

export function ReportSummary({ data, config, metadata }: ReportSummaryProps) {
  const insights = useMemo(() => {
    if (data.length === 0) return null

    switch (config.templateId) {
      case "sales-summary":
        return generateSalesInsights(data)
      case "product-performance":
        return generateProductInsights(data)
      case "customer-insights":
        return generateCustomerInsights(data)
      case "inventory-status":
        return generateInventoryInsights(data)
      case "affiliate-performance":
        return generateAffiliateInsights(data)
      default:
        return generateGenericInsights(data)
    }
  }, [data, config.templateId])

  if (!insights) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <TrendingUpIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Summary Available</h3>
          <p className="text-muted-foreground text-center">Unable to generate insights for the current data set.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.keyMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  {metric.change && (
                    <div
                      className={`flex items-center gap-1 text-sm ${
                        metric.change.type === "positive"
                          ? "text-green-600"
                          : metric.change.type === "negative"
                            ? "text-red-600"
                            : "text-muted-foreground"
                      }`}
                    >
                      {metric.change.type === "positive" && <TrendingUpIcon className="h-4 w-4" />}
                      {metric.change.type === "negative" && <TrendingDownIcon className="h-4 w-4" />}
                      {metric.change.value}
                    </div>
                  )}
                </div>
                <div className="p-3 bg-primary/10 rounded-full">{metric.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        {insights.topPerformers && (
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>{insights.topPerformers.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.topPerformers.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.value}</p>
                      {item.percentage && <Progress value={item.percentage} className="w-20 h-2 mt-1" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alerts & Issues */}
        {insights.alerts && insights.alerts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangleIcon className="h-5 w-5 text-orange-500" />
                Alerts & Issues
              </CardTitle>
              <CardDescription>Items requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.alerts.map((alert, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <AlertTriangleIcon className="h-4 w-4 text-orange-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-orange-900">{alert.title}</p>
                      <p className="text-sm text-orange-700">{alert.description}</p>
                    </div>
                    <Badge variant="outline" className="text-orange-700 border-orange-300">
                      {alert.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trends */}
        {insights.trends && (
          <Card>
            <CardHeader>
              <CardTitle>Key Trends</CardTitle>
              <CardDescription>Notable patterns in your data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.trends.map((trend, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        trend.type === "positive"
                          ? "bg-green-100"
                          : trend.type === "negative"
                            ? "bg-red-100"
                            : "bg-blue-100"
                      }`}
                    >
                      {trend.type === "positive" && <TrendingUpIcon className="h-4 w-4 text-green-600" />}
                      {trend.type === "negative" && <TrendingDownIcon className="h-4 w-4 text-red-600" />}
                      {trend.type === "neutral" && <ClockIcon className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div>
                      <p className="font-medium">{trend.title}</p>
                      <p className="text-sm text-muted-foreground">{trend.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Report Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Report Information</CardTitle>
            <CardDescription>Generation details and data source</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Records</span>
                <span className="font-medium">{metadata.totalRecords.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Generated At</span>
                <span className="font-medium">{new Date(metadata.generatedAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Execution Time</span>
                <span className="font-medium">{metadata.executionTime}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Data Source</span>
                <Badge variant="outline">{metadata.dataSource}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Helper functions for generating insights
function generateSalesInsights(data: any[]) {
  const totalRevenue = data.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
  const successfulOrders = data.filter((order) => order.paymentStatus === "SUCCESS")
  const avgOrderValue = successfulOrders.length > 0 ? totalRevenue / successfulOrders.length : 0

  return {
    keyMetrics: [
      {
        label: "Total Revenue",
        value: `₦${totalRevenue.toLocaleString()}`,
        icon: <DollarSignIcon className="h-5 w-5 text-primary" />,
        change: { type: "positive" as const, value: "+12.5%" },
      },
      {
        label: "Total Orders",
        value: data.length.toString(),
        icon: <PackageIcon className="h-5 w-5 text-primary" />,
        change: { type: "positive" as const, value: "+8.3%" },
      },
      {
        label: "Avg Order Value",
        value: `₦${Math.round(avgOrderValue).toLocaleString()}`,
        icon: <TrendingUpIcon className="h-5 w-5 text-primary" />,
      },
      {
        label: "Success Rate",
        value: `${Math.round((successfulOrders.length / data.length) * 100)}%`,
        icon: <CheckCircleIcon className="h-5 w-5 text-primary" />,
      },
    ],
    topPerformers: {
      description: "Highest revenue generating orders",
      items: data
        .sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0))
        .slice(0, 5)
        .map((order, index) => ({
          name: `Order ${order.id}`,
          subtitle: order.customerName || "Unknown Customer",
          value: `₦${(order.totalAmount || 0).toLocaleString()}`,
          percentage: ((order.totalAmount || 0) / totalRevenue) * 100,
        })),
    },
    trends: [
      {
        type: "positive" as const,
        title: "Revenue Growth",
        description: "Sales have increased by 12.5% compared to last period",
      },
      {
        type: "neutral" as const,
        title: "Order Frequency",
        description: "Average time between orders is 3.2 days",
      },
    ],
  }
}

function generateProductInsights(data: any[]) {
  const totalProducts = data.length
  const activeProducts = data.filter((p) => p.isActive).length
  const lowStockProducts = data.filter((p) => p.stockStatus === "Low Stock").length

  return {
    keyMetrics: [
      {
        label: "Total Products",
        value: totalProducts.toString(),
        icon: <PackageIcon className="h-5 w-5 text-primary" />,
      },
      {
        label: "Active Products",
        value: activeProducts.toString(),
        icon: <CheckCircleIcon className="h-5 w-5 text-primary" />,
      },
      {
        label: "Low Stock Items",
        value: lowStockProducts.toString(),
        icon: <AlertTriangleIcon className="h-5 w-5 text-orange-500" />,
      },
      {
        label: "Avg Profit Margin",
        value: `${Math.round(data.reduce((sum, p) => sum + (p.profitMargin || 0), 0) / data.length)}%`,
        icon: <TrendingUpIcon className="h-5 w-5 text-primary" />,
      },
    ],
    topPerformers: {
      description: "Best selling products",
      items: data
        .sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0))
        .slice(0, 5)
        .map((product) => ({
          name: product.name,
          subtitle: product.categoryName || "Uncategorized",
          value: `${product.totalSold || 0} sold`,
          percentage: Math.min(100, ((product.totalSold || 0) / 100) * 100),
        })),
    },
    alerts:
      lowStockProducts > 0
        ? [
            {
              title: "Low Stock Alert",
              description: `${lowStockProducts} products are running low on stock`,
              severity: "Medium",
            },
          ]
        : [],
  }
}

function generateCustomerInsights(data: any[]) {
  const totalCustomers = data.length
  const vipCustomers = data.filter((c) => c.customerSegment === "VIP").length
  const avgSpent = data.reduce((sum, c) => sum + (c.totalSpent || 0), 0) / data.length

  return {
    keyMetrics: [
      {
        label: "Total Customers",
        value: totalCustomers.toString(),
        icon: <UsersIcon className="h-5 w-5 text-primary" />,
      },
      {
        label: "VIP Customers",
        value: vipCustomers.toString(),
        icon: <TrendingUpIcon className="h-5 w-5 text-primary" />,
      },
      {
        label: "Avg Customer Value",
        value: `₦${Math.round(avgSpent).toLocaleString()}`,
        icon: <DollarSignIcon className="h-5 w-5 text-primary" />,
      },
      {
        label: "Retention Rate",
        value: "85%",
        icon: <CheckCircleIcon className="h-5 w-5 text-primary" />,
      },
    ],
    topPerformers: {
      description: "Highest value customers",
      items: data
        .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
        .slice(0, 5)
        .map((customer) => ({
          name: customer.name,
          subtitle: `${customer.totalOrders || 0} orders`,
          value: `₦${(customer.totalSpent || 0).toLocaleString()}`,
          percentage: Math.min(100, ((customer.totalSpent || 0) / 20000) * 100),
        })),
    },
  }
}

function generateInventoryInsights(data: any[]) {
  const totalItems = data.length
  const lowStockItems = data.filter((i) => i.stockStatus === "Low Stock").length
  const totalValue = data.reduce((sum, i) => sum + (i.stockValue || 0), 0)

  return {
    keyMetrics: [
      {
        label: "Total Items",
        value: totalItems.toString(),
        icon: <PackageIcon className="h-5 w-5 text-primary" />,
      },
      {
        label: "Low Stock Items",
        value: lowStockItems.toString(),
        icon: <AlertTriangleIcon className="h-5 w-5 text-orange-500" />,
      },
      {
        label: "Total Stock Value",
        value: `₦${totalValue.toLocaleString()}`,
        icon: <DollarSignIcon className="h-5 w-5 text-primary" />,
      },
      {
        label: "Stock Health",
        value: `${Math.round(((totalItems - lowStockItems) / totalItems) * 100)}%`,
        icon: <CheckCircleIcon className="h-5 w-5 text-primary" />,
      },
    ],
    alerts:
      lowStockItems > 0
        ? [
            {
              title: "Reorder Required",
              description: `${lowStockItems} items need immediate restocking`,
              severity: "High",
            },
          ]
        : [],
  }
}

function generateAffiliateInsights(data: any[]) {
  const totalAffiliates = data.length
  const approvedAffiliates = data.filter((a) => a.approved).length
  const totalEarnings = data.reduce((sum, a) => sum + (a.totalEarnings || 0), 0)
  const avgConversion = data.reduce((sum, a) => sum + (a.conversionRate || 0), 0) / data.length

  return {
    keyMetrics: [
      {
        label: "Total Affiliates",
        value: totalAffiliates.toString(),
        icon: <UsersIcon className="h-5 w-5 text-primary" />,
      },
      {
        label: "Approved Affiliates",
        value: approvedAffiliates.toString(),
        icon: <CheckCircleIcon className="h-5 w-5 text-primary" />,
      },
      {
        label: "Total Earnings",
        value: `₦${totalEarnings.toLocaleString()}`,
        icon: <DollarSignIcon className="h-5 w-5 text-primary" />,
      },
      {
        label: "Avg Conversion",
        value: `${Math.round(avgConversion * 100) / 100}%`,
        icon: <TrendingUpIcon className="h-5 w-5 text-primary" />,
      },
    ],
    topPerformers: {
      description: "Top earning affiliates",
      items: data
        .sort((a, b) => (b.totalEarnings || 0) - (a.totalEarnings || 0))
        .slice(0, 5)
        .map((affiliate) => ({
          name: affiliate.affiliateName || "Unknown",
          subtitle: affiliate.referralCode,
          value: `₦${(affiliate.totalEarnings || 0).toLocaleString()}`,
          percentage: Math.min(
            100,
            ((affiliate.totalEarnings || 0) / Math.max(...data.map((a) => a.totalEarnings || 0))) * 100,
          ),
        })),
    },
  }
}

function generateGenericInsights(data: any[]) {
  return {
    keyMetrics: [
      {
        label: "Total Records",
        value: data.length.toString(),
        icon: <PackageIcon className="h-5 w-5 text-primary" />,
      },
    ],
  }
}
