"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  DownloadIcon,
  FileTextIcon,
  BarChart3Icon,
  TableIcon,
  PieChartIcon,
  SettingsIcon,
  FilterIcon,
} from "lucide-react"
import { ReportDisplay } from "./report-display"

interface ReportField {
  key: string
  label: string
  type: "string" | "number" | "date" | "enum"
  enumValues?: string[]
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  entity: string
  fields: ReportField[]
  defaultFilters?: any
}

const reportTemplates: ReportTemplate[] = [
  {
    id: "sales-summary",
    name: "Sales Summary Report",
    description: "Comprehensive sales analysis with revenue, orders, and payment methods",
    entity: "orders",
    fields: [
      { key: "id", label: "Order ID", type: "string" },
      { key: "customerName", label: "Customer Name", type: "string" },
      { key: "placedAt", label: "Order Date", type: "date" },
      { key: "totalAmount", label: "Total Amount", type: "number" },
      {
        key: "status",
        label: "Status",
        type: "enum",
        enumValues: ["PENDING", "CONFIRMED", "IN_TRANSIT", "DELIVERED", "CANCELLED"],
      },
      { key: "orderType", label: "Order Type", type: "enum", enumValues: ["ONLINE", "POS"] },
      { key: "paymentStatus", label: "Payment Status", type: "enum", enumValues: ["PENDING", "SUCCESS", "FAILED"] },
    ],
  },
  {
    id: "product-performance",
    name: "Product Performance Report",
    description: "Analysis of product sales, revenue, and inventory levels",
    entity: "products",
    fields: [
      { key: "name", label: "Product Name", type: "string" },
      { key: "price", label: "Price", type: "number" },
      { key: "costPrice", label: "Cost Price", type: "number" },
      { key: "category", label: "Category", type: "string" },
      { key: "isActive", label: "Active Status", type: "enum", enumValues: ["true", "false"] },
      { key: "sku", label: "SKU", type: "string" },
    ],
  },
  {
    id: "customer-insights",
    name: "Customer Insights Report",
    description: "Customer behavior, spending patterns, and demographics",
    entity: "users",
    fields: [
      { key: "name", label: "Customer Name", type: "string" },
      { key: "email", label: "Email", type: "string" },
      { key: "createdAt", label: "Registration Date", type: "date" },
      { key: "role", label: "Role", type: "enum", enumValues: ["CUSTOMER", "AFFILIATE"] },
    ],
  },
  {
    id: "inventory-status",
    name: "Inventory Status Report",
    description: "Current stock levels, low stock alerts, and reorder recommendations",
    entity: "inventory",
    fields: [
      {key: "productName", label: "Product Name", type: "string"},
      { key: "quantity", label: "Current Stock", type: "number" },
      { key: "lowStockAlert", label: "Low Stock Threshold", type: "number" },
      { key: "updatedAt", label: "Last Updated", type: "date" },
    ],
  },
  {
    id: "affiliate-performance",
    name: "Affiliate Performance Report",
    description: "Affiliate referrals, commissions, and performance metrics",
    entity: "affiliates",
    fields: [
      { key: "affiliateName", label: "Affiliate Name", type: "string" },
      { key: "affiliateEmail", label: "Affiliate Email", type: "string" },
      { key: "referralCode", label: "Referral Code", type: "string" },
      { key: "totalEarnings", label: "Total Earnings", type: "number" },
      { key: "status", label: "Approval Status", type: "enum", enumValues: ["APPROVED", "PENDING", "REJECTED"] },
      { key: "createdAt", label: "Join Date", type: "date" },
    ],
  },
  {
    id: "pos-sessions",
    name: "POS Sessions Report",
    description: "Point of sale session data and staff performance",
    entity: "posSessions",
    fields: [
      { key: "openedAt", label: "Session Start", type: "date" },
      { key: "closedAt", label: "Session End", type: "date" },
      { key: "staffId", label: "Staff Member", type: "string" },
    ],
  },
]

export function EnhancedReportsGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null)
  const [reportFormat, setReportFormat] = useState("table")
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [groupBy, setGroupBy] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedConfig, setGeneratedConfig] = useState<any>(null)

  const handleTemplateSelect = (templateId: string) => {
    const template = reportTemplates.find((t) => t.id === templateId)
    setSelectedTemplate(template || null)
    if (template) {
      setSelectedFields(template.fields.slice(0, 5).map((f) => f.key)) // Select first 5 fields by default
    }
  }

  const handleFieldToggle = (fieldKey: string) => {
    setSelectedFields((prev) => (prev.includes(fieldKey) ? prev.filter((f) => f !== fieldKey) : [...prev, fieldKey]))
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsGenerating(false)

    // Set the generated config for the display component
    const config = {
      templateId: selectedTemplate?.id || "",
      templateName: selectedTemplate?.name || "Custom Report",
      fields: selectedFields,
      filters,
      groupBy,
      format: reportFormat,
    }

    setGeneratedConfig(config)

    // Here you would typically make an API call to generate the actual report
    console.log("Generating report with:", config)
  }

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3Icon className="h-5 w-5" />
            Advanced Report Generator
          </CardTitle>
          <CardDescription>Create comprehensive reports based on your restaurant&#39;s data schema</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs defaultValue="template" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="template">Template</TabsTrigger>
              <TabsTrigger value="fields">Fields</TabsTrigger>
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="format">Output</TabsTrigger>
            </TabsList>

            <TabsContent value="template" className="space-y-4">
              <div className="space-y-2">
                <Label>Select Report Template</Label>
                <Select onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a pre-built report template" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTemplate && (
                <Card className="p-4 bg-muted/50">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{selectedTemplate.name}</h4>
                      <Badge variant="secondary">{selectedTemplate.entity}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedTemplate.fields.slice(0, 6).map((field) => (
                        <Badge key={field.key} variant="outline" className="text-xs">
                          {field.label}
                        </Badge>
                      ))}
                      {selectedTemplate.fields.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{selectedTemplate.fields.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="fields" className="space-y-4">
              {selectedTemplate ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Select Fields to Include</Label>
                    <div className="text-sm text-muted-foreground">
                      {selectedFields.length} of {selectedTemplate.fields.length} selected
                    </div>
                  </div>

                  <div className="grid gap-3 max-h-80 overflow-y-auto p-4 border rounded-lg">
                    {selectedTemplate.fields.map((field) => (
                      <div key={field.key} className="flex items-center space-x-3">
                        <Checkbox
                          id={field.key}
                          checked={selectedFields.includes(field.key)}
                          onCheckedChange={() => handleFieldToggle(field.key)}
                        />
                        <Label htmlFor={field.key} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span>{field.label}</span>
                            <Badge variant="outline" className="text-xs">
                              {field.type}
                            </Badge>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="group-by">Group By (Optional)</Label>
                    <Select value={groupBy} onValueChange={setGroupBy}>
                      <SelectTrigger id="group-by">
                        <SelectValue placeholder="Select field to group by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Grouping</SelectItem>
                        {selectedTemplate.fields
                          .filter((f) => f.type === "enum" || f.type === "string")
                          .map((field) => (
                            <SelectItem key={field.key} value={field.key}>
                              {field.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <TableIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a report template first to configure fields</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="filters" className="space-y-4">
              {selectedTemplate ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FilterIcon className="h-4 w-4" />
                    <Label>Report Filters</Label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Date Range</Label>
                      <DateRangePicker />
                    </div>

                    {selectedTemplate.fields
                      .filter((f) => f.type === "enum")
                      .slice(0, 3)
                      .map((field) => (
                        <div key={field.key} className="space-y-2">
                          <Label>{field.label}</Label>
                          <Select onValueChange={(value) => setFilters((prev) => ({ ...prev, [field.key]: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder={`Filter by ${field.label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All {field.label}s</SelectItem>
                              {field.enumValues?.map((value) => (
                                <SelectItem key={value} value={value}>
                                  {value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Advanced Filters</Label>
                    <div className="grid gap-2 sm:grid-cols-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="include-deleted" />
                        <Label htmlFor="include-deleted" className="text-sm cursor-pointer">
                          Include deleted records
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="active-only" defaultChecked />
                        <Label htmlFor="active-only" className="text-sm cursor-pointer">
                          Active records only
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="include-test-data" />
                        <Label htmlFor="include-test-data" className="text-sm cursor-pointer">
                          Include test data
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FilterIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a report template first to configure filters</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="format" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Report Format</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: "table", label: "Table", icon: TableIcon },
                      { id: "chart", label: "Charts", icon: BarChart3Icon },
                      { id: "summary", label: "Summary", icon: PieChartIcon },
                      { id: "export", label: "Export", icon: DownloadIcon },
                    ].map((format) => (
                      <div key={format.id}>
                        <Input
                          type="radio"
                          id={format.id}
                          name="format"
                          value={format.id}
                          checked={reportFormat === format.id}
                          onChange={(e) => setReportFormat(e.target.value)}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={format.id}
                          className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-colors ${
                            reportFormat === format.id
                              ? "border-primary bg-primary/5"
                              : "border-muted hover:border-primary/50"
                          }`}
                        >
                          <format.icon className="h-6 w-6" />
                          <span className="text-sm font-medium">{format.label}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report-name">Report Name</Label>
                  <Input
                    id="report-name"
                    placeholder="Enter a name for this report"
                    defaultValue={
                      selectedTemplate ? `${selectedTemplate.name} - ${new Date().toLocaleDateString()}` : "New Report"
                    }
                  />
                </div>

                <Card className="p-4 bg-muted/50">
                  <div className="flex items-start gap-3">
                    <SettingsIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div className="space-y-1">
                      <h4 className="font-medium">Export Options</h4>
                      <div className="grid gap-2 sm:grid-cols-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="include-charts" defaultChecked />
                          <Label htmlFor="include-charts" className="text-sm cursor-pointer">
                            Include charts
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="include-summary" defaultChecked />
                          <Label htmlFor="include-summary" className="text-sm cursor-pointer">
                            Summary section
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="include-metadata" />
                          <Label htmlFor="include-metadata" className="text-sm cursor-pointer">
                            Report metadata
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <Separator />

          <div className="flex justify-between items-center">
            {/* <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <FileTextIcon className="h-4 w-4" />
                Save Template
              </Button>
              <Button variant="outline" className="gap-2">
                <FileTextIcon className="h-4 w-4" />
                Preview
              </Button>
            </div> */}

            <Button
              onClick={handleGenerateReport}
              disabled={!selectedTemplate || selectedFields.length === 0 || isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span className="ml-2">Generating...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <BarChart3Icon className="h-4 w-4" />
                  <span className="ml-2">Generate Report</span>
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedConfig && (
        <ReportDisplay
          config={generatedConfig}
          onConfigSave={(config) => {
            console.log("Saving config:", config)
            // Here you would save the configuration to the backend
          }}
          onRefresh={() => {
            if (generatedConfig) {
              console.log("Refreshing report")
              // Here you would refresh the report data
            }
          }}
        />
      )}
    </div>
  )
}
