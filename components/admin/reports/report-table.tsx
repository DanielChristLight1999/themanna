"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SearchIcon,
  FilterIcon,
} from "lucide-react"
import { format } from "date-fns"

interface ReportTableProps {
  data: any[]
  config: {
    templateId: string
    fields: string[]
  }
}

type SortDirection = "asc" | "desc" | null

export function ReportTable({ data, config }: ReportTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({})

  // Get column definitions based on data
  const columns = useMemo(() => {
    if (data.length === 0) return []

    const firstRow = data[0]
    return Object.keys(firstRow).map((key) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
      type: typeof firstRow[key],
    }))
  }, [data])

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = [...data]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((row) =>
        Object.values(row).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply column filters
    Object.entries(columnFilters).forEach(([column, filterValue]) => {
      if (filterValue && filterValue !== "all") {
        filtered = filtered.filter((row) => String(row[column]) === filterValue)
      }
    })

    // Apply sorting
    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        const aVal = a[sortField]
        const bVal = b[sortField]

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal
        }

        const aStr = String(aVal).toLowerCase()
        const bStr = String(bVal).toLowerCase()

        if (sortDirection === "asc") {
          return aStr.localeCompare(bStr)
        } else {
          return bStr.localeCompare(aStr)
        }
      })
    }

    return filtered
  }, [data, searchTerm, columnFilters, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = processedData.slice(startIndex, endIndex)

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortField(null)
        setSortDirection(null)
      } else {
        setSortDirection("asc")
      }
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleColumnFilter = (column: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: value,
    }))
    setCurrentPage(1) // Reset to first page when filtering
  }

  const formatCellValue = (value: any, column: any) => {
    if (value === null || value === undefined) return "N/A"

    // Format based on column type and name
    if (column.key.toLowerCase().includes("amount") || column.key.toLowerCase().includes("price")) {
      return `₦${Number(value).toLocaleString()}`
    }

    if (column.key.toLowerCase().includes("date") || column.key.toLowerCase().includes("at")) {
      return new Date(value).toLocaleDateString()
    }

    if (column.key.toLowerCase().includes("status")) {
      return (
        <Badge
          variant={
            value === "DELIVERED" || value === "SUCCESS" || value === "In Stock"
              ? "default"
              : value === "PENDING" || value === "Low Stock"
                ? "secondary"
                : value === "CANCELLED" || value === "FAILED"
                  ? "destructive"
                  : "outline"
          }
        >
          {String(value)}
        </Badge>
      )
    }

    if (typeof value === "boolean") {
      return <Badge variant={value ? "default" : "secondary"}>{value ? "Yes" : "No"}</Badge>
    }

    if (typeof value === "number") {
      return Number(value).toLocaleString()
    }

    if(value instanceof Date){
      return format(new Date(value), "dd/MM/yyyy HH:mm")
    }

    return String(value)
  }

  const getUniqueValues = (column: string) => {
    const values = [...new Set(data.map((row) => String(row[column])))]
    return values.filter(Boolean).sort()
  }

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDownIcon className="h-4 w-4" />
    if (sortDirection === "asc") return <ArrowUpIcon className="h-4 w-4" />
    if (sortDirection === "desc") return <ArrowDownIcon className="h-4 w-4" />
    return <ArrowUpDownIcon className="h-4 w-4" />
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <SearchIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
          <p className="text-muted-foreground text-center">No data matches your current filter criteria.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search all columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 rows</SelectItem>
              <SelectItem value="10">10 rows</SelectItem>
              <SelectItem value="25">25 rows</SelectItem>
              <SelectItem value="50">50 rows</SelectItem>
              <SelectItem value="100">100 rows</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FilterIcon className="h-4 w-4" />
          Showing {startIndex + 1}-{Math.min(endIndex, processedData.length)} of {processedData.length} records
        </div>
      </div>

      {/* Column Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {columns.slice(0, 6).map((column) => {
          const uniqueValues = getUniqueValues(column.key)
          if (uniqueValues.length <= 1 || uniqueValues.length > 20) return null

          return (
            <Select
              key={column.key}
              value={columnFilters[column.key] || "all"}
              onValueChange={(value) => handleColumnFilter(column.key, value)}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder={`Filter ${column.label}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {column.label}</SelectItem>
                {uniqueValues.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        })}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {getSortIcon(column.key)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={row.id || index}>
                {columns.map((column) => (
                  <TableCell key={column.key}>{formatCellValue(row[column.key], column)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
              if (pageNum > totalPages) return null

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
