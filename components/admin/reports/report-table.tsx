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
import { format, isValid, parseISO } from "date-fns"
import { formatPrice } from "@/lib/utils"

interface ReportTableProps {
  data: any[]
  config: {
    templateId: string
    fields: string[]
    columnTypes?: Record<string, ColumnType>
  }
}

type ColumnType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'currency'
  | 'percentage'
  | 'email'
  | 'id';


interface Column {
  key: string;
  label: string;
  type: ColumnType;
}

type SortDirection = "asc" | "desc" | null

export function ReportTable({ data, config }: ReportTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({})


  // Group similar values (e.g., "New York", "new york", "NEW YORK")
  const groupSimilarValues = (values: string[]) => {
    const groups: Record<string, { value: string; label: string }> = {};

    values.forEach(value => {
      const normalized = value.trim().toLowerCase();
      if (!groups[normalized]) {
        groups[normalized] = {
          value,
          label: value
        };
      }
    });

    return Object.values(groups);
  };

  // Get column definitions based on data
  // const columns = useMemo(() => {
  //   if (data.length === 0) return []

  //   const firstRow = data[0]
  //   return Object.keys(firstRow).map((key) => ({
  //     key,
  //     label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
  //     type: typeof firstRow[key],
  //   }))
  // }, [data])

  //   const columns = useMemo<Column[]>(() => {
  //   if (data.length === 0) return [];

  //   const firstRow = data[0];
  //   return Object.keys(firstRow).map((key) => {
  //     const sampleValue = firstRow[key];
  //     let type = typeof sampleValue;

  //     // Special type detection
  //     if (key.toLowerCase().includes("date") || key.toLowerCase().includes("at")) {
  //       type = "date";
  //     } else if (key.toLowerCase().includes("amount") || 
  //                key.toLowerCase().includes("price") || 
  //                key.toLowerCase().includes("total")) {
  //       type = "currency";
  //     } else if (key.toLowerCase().includes("percent") || 
  //                key.toLowerCase().includes("rate")) {
  //       type = "percentage";
  //     } else if (key.toLowerCase().includes("email")) {
  //       type = "email";
  //     } else if (key.toLowerCase().endsWith("id") || key === "id") {
  //       type = "id";
  //     }

  //     return {
  //       key,
  //       label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
  //       type,
  //     };
  //   });
  // }, [data]);

  const columns = useMemo<Column[]>(() => {
    if (data.length === 0) return [];

    const firstRow = data[0];
    return Object.keys(firstRow).map((key) => {
      const sampleValue = firstRow[key];

      // Default to native type
      let type: ColumnType = typeof sampleValue as ColumnType;

      // Override with our specific types based on column name
      if (key.toLowerCase().includes("date") || key.toLowerCase().includes("at")) {
        type = "date";
      } else if (key.toLowerCase().includes("amount") ||
        key.toLowerCase().includes("price") ||
        key.toLowerCase().includes("total")) {
        type = "currency";
      } else if (key.toLowerCase().includes("percent") ||
        key.toLowerCase().includes("rate")) {
        type = "percentage";
      } else if (key.toLowerCase().includes("email")) {
        type = "email";
      } else if (key.toLowerCase().endsWith("id") || key === "id") {
        type = "id";
      } else if (typeof sampleValue === "string") {
        type = "text";
      }

      return {
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
        type,
      };
    });
  }, [data]);

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
    // Object.entries(columnFilters).forEach(([column, filterValue]) => {
    //   if (filterValue && filterValue !== "all") {
    //     filtered = filtered.filter((row) => String(row[column]) === filterValue)
    //   }
    // })

    // In your processedData useMemo, update the column filters section:
    Object.entries(columnFilters).forEach(([column, filterValue]) => {
      if (!filterValue || filterValue === "all") return;

      const columnType = columns.find(c => c.key === column)?.type;

      // Boolean filtering
      if (columnType === 'boolean') {
        filtered = filtered.filter(row => String(row[column]) === filterValue);
        return;
      }

      // Status filtering
      if (column.toLowerCase().includes('status')) {
        filtered = filtered.filter(row => String(row[column]).toUpperCase() === filterValue.toUpperCase());
        return;
      }

      // // Category filtering
      // if (column.toLowerCase().includes('category')) {
      //   filtered = filtered.filter(row => String(row[column]).toUpperCase() === filterValue.toUpperCase());
      //   return;
      // }

      // Date range filtering
      if (columnType === 'date') {
        const now = new Date();
        const dateValue = (val: any) => typeof val === 'string' ? parseISO(val) : new Date(val);

        switch (filterValue) {
          case 'today':
            filtered = filtered.filter(row => {
              const date = dateValue(row[column]);
              return date.toDateString() === now.toDateString();
            });
            break;
          case 'this_week':
            const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
            filtered = filtered.filter(row => dateValue(row[column]) >= weekStart);
            break;
          case 'this_month':
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            filtered = filtered.filter(row => dateValue(row[column]) >= monthStart);
            break;
          case 'last_month':
            const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
            filtered = filtered.filter(row => {
              const date = dateValue(row[column]);
              return date >= lastMonthStart && date <= lastMonthEnd;
            });
            break;
          default:
            // Exact match fallback
            filtered = filtered.filter(row => String(row[column]) === filterValue);
        }
        return;
      }

      // Numeric range filtering
      if (columnType === 'currency' || columnType === 'number') {
        const numValue = (val: any) => Number(val) || 0;

        if (filterValue.includes('-')) {
          const [min, max] = filterValue.split('-').map(Number);
          filtered = filtered.filter(row => {
            const val = numValue(row[column]);
            return val >= min && (max ? val <= max : true);
          });
        } else if (filterValue.endsWith('+')) {
          const min = Number(filterValue.replace('+', ''));
          filtered = filtered.filter(row => numValue(row[column]) >= min);
        } else {
          // Exact match fallback
          filtered = filtered.filter(row => String(row[column]) === filterValue);
        }
        return;
      }

      // Default exact match
      filtered = filtered.filter(row => String(row[column]) === filterValue);
    });

    // Apply sorting
    // if (sortField && sortDirection) {
    //   filtered.sort((a, b) => {
    //     const aVal = a[sortField]
    //     const bVal = b[sortField]

    //     if (typeof aVal === "number" && typeof bVal === "number") {
    //       return sortDirection === "asc" ? aVal - bVal : bVal - aVal
    //     }

    //     const aStr = String(aVal).toLowerCase()
    //     const bStr = String(bVal).toLowerCase()

    //     if (sortDirection === "asc") {
    //       return aStr.localeCompare(bStr)
    //     } else {
    //       return bStr.localeCompare(aStr)
    //     }
    //   })
    // }

    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        const columnType = columns.find(c => c.key === sortField)?.type || 'text';

        // Handle null/undefined values
        if (aVal === null || aVal === undefined) return sortDirection === "asc" ? 1 : -1;
        if (bVal === null || bVal === undefined) return sortDirection === "asc" ? -1 : 1;

        // Date sorting
        if (columnType === 'date') {
          const dateA = typeof aVal === 'string' ? parseISO(aVal) : new Date(aVal);
          const dateB = typeof bVal === 'string' ? parseISO(bVal) : new Date(bVal);
          return sortDirection === "asc"
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        }

        // Numeric sorting (for both number and currency types)
        if (columnType === 'number' || columnType === 'currency' || columnType === 'percentage') {
          const numA = Number(aVal);
          const numB = Number(bVal);
          return sortDirection === "asc" ? numA - numB : numB - numA;
        }

        // Default string sorting
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        return sortDirection === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      });
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
    // if(column.key.toLowerCase().includes("cost")) {
    //   console.log("Formatting cost price", column.key, value)
    //   return `${formatPrice(value)}`
    // }
    // Format based on column type and name
    if (column.key.toLowerCase().includes("amount") || column.key.toLowerCase().includes("price")) {
      return `${formatPrice(value)}`
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

    if (column.key.toLowerCase().includes("category")) {
      return value
    }

    


    // Format date and time
    if (column.key.toLowerCase().includes("date") || column.key.toLowerCase().includes("at")) {
      try {
        const date = typeof value === 'string' ? parseISO(value) : new Date(value);
        return isValid(date) ? format(date, "dd/MM/yyyy HH:mm") : "Invalid Date"
      } catch (error) {
        return "Invalid Date"
      }
    }


    if (typeof value === "boolean") {
      return <Badge variant={value ? "default" : "secondary"}>{value ? "Yes" : "No"}</Badge>
    }

    if (typeof value === "number") {
      return Number(value).toLocaleString()
    }

    return String(value)
  }

  // const getUniqueValues = (column: string) => {
  //   const values = [...new Set(data.map((row) => String(row[column])))]
  //   return values.filter(Boolean).sort()
  // }


  // Enhanced getUniqueValues to handle different types
  const getUniqueValues = (columnKey: string) => {
    const column = columns.find(c => c.key === columnKey);
    if (!column) return [];

    const values = data.map(row => row[columnKey]);

    // Handle boolean values
    if (column.type === 'boolean') {
      return ['true', 'false'];
    }

    // Handle status fields
    if (column.key.toLowerCase().includes('status')) {
      return [
        'PENDING',
        'CONFIRMED',
        'DELIVERED',
        'CANCELLED',
        'SUCCESS',
        'FAILED'
      ];
    }

    // Get unique values and filter out null/undefined
    const uniqueValues = [...new Set(values.map(v => {
      if (v === null || v === undefined) return null;
      return String(v);
    }))].filter(Boolean) as string[];

    return uniqueValues;
  };


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
      {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
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
      </div> */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {columns.slice(0, 6).map((column) => {
          const uniqueValues = getUniqueValues(column.key);
          const columnType = column.type;

          // Skip columns that shouldn't be filtered
          if (uniqueValues.length <= 1 ||
            uniqueValues.length > 20 && columnType !== 'boolean' ||
            columnType === 'id') {
            return null;
          }

          // Special handling for boolean fields
          if (columnType === 'boolean') {
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
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            );
          }

          // Status fields (from your enums)
          if (column.key.toLowerCase().includes("status")) {
            const statusOptions = [
              { value: "all", label: `All ${column.label}` },
              { value: "PENDING", label: "Pending" },
              { value: "CONFIRMED", label: "Confirmed" },
              { value: "DELIVERED", label: "Delivered" },
              { value: "CANCELLED", label: "Cancelled" },
              { value: "SUCCESS", label: "Success" },
              { value: "FAILED", label: "Failed" },
            ];

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
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }

          // Date range filtering (simple version)
          if (columnType === 'date') {
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
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this_week">This Week</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                </SelectContent>
              </Select>
            );
          }

          // Numeric range filtering (simple version)
          if (columnType === 'currency' || columnType === 'number') {
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
                  <SelectItem value="all">All Values</SelectItem>
                  <SelectItem value="0-1000">₦0 - ₦1,000</SelectItem>
                  <SelectItem value="1000-5000">₦1,000 - ₦5,000</SelectItem>
                  <SelectItem value="5000-10000">₦5,000 - ₦10,000</SelectItem>
                  <SelectItem value="10000-50000">₦10,000 - ₦50,000</SelectItem>
                  <SelectItem value="50000+">₦50,000+</SelectItem>
                </SelectContent>
              </Select>
            );
          }

          // Default text filter with smart grouping
          const groupedValues = groupSimilarValues(uniqueValues);
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
                {groupedValues.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
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
