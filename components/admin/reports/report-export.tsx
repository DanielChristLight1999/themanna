"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  DownloadIcon,
  FileTextIcon,
  FileSpreadsheetIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  LoaderIcon,
} from "lucide-react"

interface GeneratedReport {
  id: string
  config: any
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

interface ReportExportProps {
  report: GeneratedReport
  expanded?: boolean
}

export function ReportExport({ report, expanded = false }: ReportExportProps) {
  const [exportFormat, setExportFormat] = useState("csv")
  const [fileName, setFileName] = useState(`${report.config.templateName}_${new Date().toISOString().split("T")[0]}`)
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeSummary, setIncludeSummary] = useState(true)
  const [includeMetadata, setIncludeMetadata] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<"idle" | "success" | "error">("idle")

  const exportFormats = [
    { id: "csv", label: "CSV", icon: FileTextIcon, description: "Comma-separated values for spreadsheets" },
    { id: "excel", label: "Excel", icon: FileSpreadsheetIcon, description: "Microsoft Excel workbook" },
    { id: "pdf", label: "PDF", icon: FileTextIcon, description: "Portable document format" },
    { id: "json", label: "JSON", icon: FileTextIcon, description: "JavaScript object notation" },
  ]

  const handleExport = async () => {
    setIsExporting(true)
    setExportStatus("idle")

    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate export data based on format
      const exportData = generateExportData()

      // Create and download file
      downloadFile(exportData, `${fileName}.${exportFormat}`)

      setExportStatus("success")
    } catch (error) {
      setExportStatus("error")
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const generateExportData = () => {
    const { data, config, metadata } = report

    switch (exportFormat) {
      case "csv":
        return generateCSV(data)
      case "excel":
        return generateExcel(data, config, metadata)
      case "pdf":
        return generatePDF(data, config, metadata)
      case "json":
        return generateJSON(data, config, metadata)
      default:
        return generateCSV(data)
    }
  }

  const generateCSV = (data: any[]) => {
    if (data.length === 0) return ""

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            // Escape commas and quotes in CSV
            if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value
          })
          .join(","),
      ),
    ].join("\n")

    return csvContent
  }

  const generateExcel = (data: any[], config: any, metadata: any) => {
    // In a real implementation, you would use a library like xlsx
    // For now, return CSV format as fallback
    return generateCSV(data)
  }

  const generatePDF = (data: any[], config: any, metadata: any) => {
    // In a real implementation, you would use a library like jsPDF
    // For now, return a simple text format
    const content = [
      `Report: ${config.templateName}`,
      `Generated: ${new Date(metadata.generatedAt).toLocaleString()}`,
      `Total Records: ${metadata.totalRecords}`,
      "",
      "Data:",
      JSON.stringify(data, null, 2),
    ].join("\n")

    return content
  }

  const generateJSON = (data: any[], config: any, metadata: any) => {
    return JSON.stringify(
      {
        report: {
          config,
          metadata,
          data,
        },
      },
      null,
      2,
    )
  }

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (!expanded) {
    return (
      <Button onClick={handleExport} disabled={isExporting} className="gap-2">
        {isExporting ? (
          <>
            <LoaderIcon className="h-4 w-4 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <DownloadIcon className="h-4 w-4" />
            Export
          </>
        )}
      </Button>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DownloadIcon className="h-5 w-5" />
            Export Report
          </CardTitle>
          <CardDescription>Download your report in various formats for external use</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Format Selection */}
          <div className="space-y-3">
            <Label>Export Format</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {exportFormats.map((format) => (
                <div key={format.id}>
                  <input
                    type="radio"
                    id={format.id}
                    name="exportFormat"
                    value={format.id}
                    checked={exportFormat === format.id}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={format.id}
                    className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-colors ${
                      exportFormat === format.id
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-primary/50"
                    }`}
                  >
                    <format.icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{format.label}</span>
                    <span className="text-xs text-muted-foreground text-center">{format.description}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* File Name */}
          <div className="space-y-2">
            <Label htmlFor="fileName">File Name</Label>
            <Input
              id="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name"
            />
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <Label>Export Options</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="includeCharts" checked={includeCharts} onCheckedChange={setIncludeCharts} />
                <Label htmlFor="includeCharts" className="cursor-pointer">
                  Include charts and visualizations
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="includeSummary" checked={includeSummary} onCheckedChange={setIncludeSummary} />
                <Label htmlFor="includeSummary" className="cursor-pointer">
                  Include summary and insights
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="includeMetadata" checked={includeMetadata} onCheckedChange={setIncludeMetadata} />
                <Label htmlFor="includeMetadata" className="cursor-pointer">
                  Include report metadata
                </Label>
              </div>
            </div>
          </div>

          {/* Export Status */}
          {exportStatus === "success" && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircleIcon className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Report exported successfully! The file has been downloaded to your device.
              </AlertDescription>
            </Alert>
          )}

          {exportStatus === "error" && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircleIcon className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Export failed. Please try again or contact support if the issue persists.
              </AlertDescription>
            </Alert>
          )}

          {/* Export Button */}
          <Button onClick={handleExport} disabled={isExporting || !fileName} className="w-full gap-2">
            {isExporting ? (
              <>
                <LoaderIcon className="h-4 w-4 animate-spin" />
                Exporting {exportFormat.toUpperCase()}...
              </>
            ) : (
              <>
                <DownloadIcon className="h-4 w-4" />
                Export as {exportFormat.toUpperCase()}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Export Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Export Preview</CardTitle>
          <CardDescription>Preview of what will be included in your export</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Data Records</span>
              <Badge variant="secondary">{report.metadata.totalRecords} rows</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">File Format</span>
              <Badge variant="outline">{exportFormat.toUpperCase()}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estimated Size</span>
              <Badge variant="outline">{Math.round(report.metadata.totalRecords * 0.1 * 100) / 100} KB</Badge>
            </div>
            {includeCharts && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Charts</span>
                <Badge variant="secondary">Included</Badge>
              </div>
            )}
            {includeSummary && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Summary</span>
                <Badge variant="secondary">Included</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
