"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DownloadIcon,
  RefreshCwIcon,
  SaveIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  BarChart3Icon,
  TableIcon,
  TrendingUpIcon,
} from "lucide-react"
import { ReportTable } from "./report-table"
import { ReportCharts } from "./report-charts"
import { ReportSummary } from "./report-summary"
import { ReportExport } from "./report-export"
import { getReportsData } from "@/actions/admin/reports-actions"
import { type ReportData } from "@/lib/mock-data/reports-data"
import { extractorderId } from "@/lib/utils"

interface ReportConfig {
  templateId: string
  templateName: string
  fields: string[]
  filters: Record<string, any>
  groupBy?: string
  format: string
  dateRange?: { from: Date; to: Date }
}

interface ReportDisplayProps {
  config: ReportConfig | null
  onConfigSave?: (config: ReportConfig) => void
  onRefresh?: () => void
}

interface GeneratedReport {
  id: string
  config: ReportConfig
  data: any[]
  metadata: {
    totalRecords: number
    generatedAt: string
    executionTime: number
    dataSource: string
  }
  status: "success" | "error" | "loading"
  error?: string
}

export function ReportDisplay({ config, onConfigSave, onRefresh }: ReportDisplayProps) {
  const [report, setReport] = useState<GeneratedReport | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("table")



  const generateReport = useCallback( async (reportConfig: ReportConfig) => {
    setIsGenerating(true)
    setReport({
      id: `report_${Date.now()}`,
      config: reportConfig,
      data: [],
      metadata: {
        totalRecords: 0,
        generatedAt: new Date().toISOString(),
        executionTime: 0,
        dataSource: "mock",
      },
      status: "loading",
    })

    try {
      // Simulate API call delay
      const reportData = await getReportsData()
      const processedData = processReportData(reportData, reportConfig)

      const generatedReport: GeneratedReport = {
        id: `report_${Date.now()}`,
        config: reportConfig,
        data: processedData,
        metadata: {
          totalRecords: processedData.length,
          generatedAt: new Date().toISOString(),
          executionTime: 1.2,
          dataSource: "database",
        },
        status: "success",
      }

      setReport(generatedReport)
    } catch (error) {
      setReport((prev) => ({
        ...prev!,
        status: "error",
        error: "Failed to generate report. Please check your configuration and try again.",
      }))
    } finally {
      setIsGenerating(false)
    }
  }, [setReport, setIsGenerating])

    useEffect(() => {
    if (config) {
      generateReport(config)
    }
  }, [config, generateReport])

  const processReportData = (reportData: ReportData, config: ReportConfig): any[] => {
    let data: any[] = []

    // Select data source based on template
    switch (config.templateId) {
      case "sales-summary":
        data = reportData.orders.map((order) => {
          const payment = reportData.payments.find((p) => p.orderId === order.id)
          const customer = reportData.users.find((u) => u.id === order.customerId)
          return {
            id: `#ORD-${extractorderId(order.id)?.toUpperCase()}`,
            placedAt: order.placedAt,
            totalAmount: order.totalAmount,
            status: order.status,
            orderType: order.orderType,
            paymentStatus: order.paymentStatus,
            customerName: customer?.name || "Unknown",
            customerEmail: customer?.email || "N/A",
            paymentMethod: payment?.method || "N/A",
            profit: Math.round(order.totalAmount * 0.3), // Mock profit calculation
            taxAmount: order.taxAmount || 0,
            deliveryFee: order.deliveryFee || 0,
          }
        })
        break
      case "product-performance":
        data = reportData.products.map((product) => {
          // const category = reportData.categories.find((c) => c.id === product.categoryId)
          const inventory = reportData.inventory.find((i) => i.productId === product.id)
          return {
            id: product.id,
            name: product.name,
            price: product.price,
            costPrice: product.costPrice,
            category: product.category,
            // categoryName: category?.name || "Uncategorized",
            isActive: product.isActive,
            sku: product.sku,
            currentStock: inventory?.quantity || 0,
            stockStatus: inventory && inventory.quantity <= inventory.lowStockAlert ? "Low Stock" : "In Stock",
            profitMargin: Math.round(((product.price - product.costPrice) / product.price) * 100),
            totalSold: Math.floor(Math.random() * 100), // Mock sales data
          }
        })
        break
      case "customer-insights":
        data = reportData.users
          .filter((user) => user.role === "CUSTOMER")
          .map((customer) => {
            const customerOrders = reportData.orders.filter((order) => order.customerId === customer.id)
            const totalSpent = customerOrders.reduce((sum, order) => sum + order.totalAmount, 0)
            return {
              id: customer.id,
              name: customer.name,
              email: customer.email,
              createdAt: customer.createdAt,
              role: customer.role,
              totalOrders: customerOrders.length,
              totalSpent,
              averageOrderValue: customerOrders.length > 0 ? Math.round(totalSpent / customerOrders.length) : 0,
              lastOrderDate: customerOrders.length > 0 ? customerOrders[customerOrders.length - 1].placedAt : null,
              customerSegment: totalSpent > 10000 ? "VIP" : totalSpent > 5000 ? "Regular" : "New",
            }
          })
        break
      case "inventory-status":
        data = reportData.inventory.map((item) => {
          const product = reportData.products.find((p) => p.id === item.productId)
          const category = reportData.categories.find((c) => c.id === product?.categoryId)
          return {
            id: item.id,
            productId: item.productId,
            productName: product?.name || "Unknown Product",
            categoryName: category?.name || "Uncategorized",
            quantity: item.quantity,
            lowStockAlert: item.lowStockAlert,
            updatedAt: item.updatedAt,
            price: product?.price || 0,
            stockValue: (product?.costPrice || 0) * item.quantity,
            stockStatus: item.quantity <= item.lowStockAlert ? "Low Stock" : "In Stock",
            reorderRecommendation: item.quantity <= item.lowStockAlert ? "Reorder Now" : "Sufficient",
          }
        })
        break
      case "affiliate-performance":
        data = reportData.affiliates.map((affiliate) => {
          const user = reportData.users.find((u) => u.id === affiliate.userId)
          const commissions = reportData.commissions.filter((c) => c.affiliateId === affiliate.userId)
          const totalCommissions = commissions.reduce((sum, c) => sum + c.amount, 0)
          return {
            id: affiliate.userId,
            userId: affiliate.userId,
            affiliateName: user?.name || "Unknown",
            affiliateEmail: user?.email || "N/A",
            referralCode: affiliate.referralCode,
            totalEarnings: affiliate.totalEarnings,
            status: affiliate.status,
            createdAt: affiliate.createdAt,
            totalCommissions,
            paidCommissions: commissions.filter((c) => c.paid).reduce((sum, c) => sum + c.amount, 0),
            pendingCommissions: commissions.filter((c) => !c.paid).reduce((sum, c) => sum + c.amount, 0),
            conversionRate: Math.round(Math.random() * 10 * 100) / 100, // Mock conversion rate
            clicksGenerated: Math.floor(Math.random() * 1000), // Mock clicks
          }
        })
        break
      case "pos-sessions":
        data = reportData.posSessions.map((session) => {
          const staff = reportData.users.find((u) => u.id === session.staffId)
          return {
            id: session.id,
            staffId: session.staffId,
            staffName: staff?.name || "Unknown Staff",
            openedAt: session.openedAt,
            closedAt: session.closedAt,
            duration: session.closedAt
              ? Math.round(
                  (new Date(session.closedAt).getTime() - new Date(session.openedAt).getTime()) / (1000 * 60 * 60),
                )
              : 0,
            totalSales: Math.floor(Math.random() * 50000), // Mock sales data
          }
        })
        break
      default:
        data = []
    }

    // Apply filters safely
    if (config.filters && Object.keys(config.filters).length > 0) {
      Object.entries(config.filters).forEach(([key, value]) => {
        if (value && value !== "all" && value !== "") {
          data = data.filter((item) => {
            const itemValue = item[key]
            if (itemValue === undefined || itemValue === null) return false
            return String(itemValue).toLowerCase() === String(value).toLowerCase()
          })
        }
      })
    }

    // Apply field selection safely
    if (config.fields && config.fields.length > 0) {
      data = data.map((item) => {
        const filteredItem: any = { id: item.id } // Always include ID
        config.fields.forEach((field) => {
          if (item.hasOwnProperty(field)) {
            filteredItem[field] = item[field]
          }
        })
        return filteredItem
      })
    }

    return data
  }

  const handleSaveConfig = () => {
    if (config && onConfigSave) {
      onConfigSave(config)
    }
  }

  const handleRefresh = () => {
    if (config) {
      generateReport(config)
    }
    if (onRefresh) {
      onRefresh()
    }
  }

  if (!config) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BarChart3Icon className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Report Configuration</h3>
          <p className="text-muted-foreground text-center">
            Configure and generate a report using the report generator above to see results here.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (isGenerating || report?.status === "loading") {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
          <h3 className="text-lg font-semibold mb-2">Generating Report</h3>
          <p className="text-muted-foreground text-center">
            Processing your request and analyzing data...
            <br />
            <span className="text-sm">This may take a few moments</span>
          </p>
        </CardContent>
      </Card>
    )
  }

  if (report?.status === "error") {
    return (
      <Card className="w-full">
        <CardContent className="py-8">
          <Alert className="border-destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription className="ml-2">
              <strong>Report Generation Failed</strong>
              <br />
              {report.error}
            </AlertDescription>
          </Alert>
          <div className="flex justify-center mt-6">
            <Button onClick={handleRefresh} variant="outline" className="gap-2">
              <RefreshCwIcon className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!report || report.status !== "success") {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                {config.templateName}
              </CardTitle>
              <CardDescription>
                Generated on {new Date(report.metadata.generatedAt).toLocaleString()} • {report.metadata.totalRecords}{" "}
                records • {report.metadata.executionTime}s execution time
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{config.format}</Badge>
              <Button onClick={handleSaveConfig} variant="outline" size="sm" className="gap-2">
                <SaveIcon className="h-4 w-4" />
                Save Config
              </Button>
              <Button onClick={handleRefresh} variant="outline" size="sm" className="gap-2">
                <RefreshCwIcon className="h-4 w-4" />
                Refresh
              </Button>
              <ReportExport report={report} />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Report Content */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="table" className="gap-2">
                  <TableIcon className="h-4 w-4" />
                  Table
                </TabsTrigger>
                <TabsTrigger value="charts" className="gap-2">
                  <BarChart3Icon className="h-4 w-4" />
                  Charts
                </TabsTrigger>
                <TabsTrigger value="summary" className="gap-2">
                  <TrendingUpIcon className="h-4 w-4" />
                  Summary
                </TabsTrigger>
                <TabsTrigger value="export" className="gap-2">
                  <DownloadIcon className="h-4 w-4" />
                  Export
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="table" className="mt-0">
                <ReportTable data={report.data} config={config} />
              </TabsContent>

              <TabsContent value="charts" className="mt-0">
                <ReportCharts data={report.data} config={config} />
              </TabsContent>

              <TabsContent value="summary" className="mt-0">
                <ReportSummary data={report.data} config={config} metadata={report.metadata} />
              </TabsContent>

              <TabsContent value="export" className="mt-0">
                <ReportExport report={report} expanded />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
