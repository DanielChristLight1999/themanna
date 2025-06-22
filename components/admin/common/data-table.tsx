"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnFiltersState,
  VisibilityState,
  Column,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { exportToCSV, exportToPDF } from "@/lib/exportUtils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  forceMobile?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  forceMobile = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  // Extract filterable columns with options
  const dropdownFilters = table.getAllColumns().filter(col => {
    return (
      col.columnDef.meta &&
      (col.columnDef.meta as any).filterOptions &&
      Array.isArray((col.columnDef.meta as any).filterOptions)
    )
  })

  return (
    <div className="space-y-4 pb-10">
      {/* Search, Filters, Export */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Search all columns..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />

          {dropdownFilters.map((col) => {
            const options = (col.columnDef.meta as any).filterOptions as string[]
            const value = col.getFilterValue() as string || ""

            return (
              <Select
                key={col.id}
                value={value}
                onValueChange={(val) => {col.setFilterValue(val === "__all__" ? undefined : val)}}
              >
                <SelectTrigger className="h-8 w-[150px]">
                  <SelectValue placeholder={`Filter ${col.id}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All</SelectItem>
                  {options.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          })}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              exportToCSV(table.getFilteredRowModel().rows.map(r => r.original))
            }
          >
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              exportToPDF(
                table.getAllColumns().map(c => c.id),
                table.getFilteredRowModel().rows.map(r => r.original)
              )
            }
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border space-y-4 h-full w-full">
        <div className={forceMobile ? "hidden" : "hidden md:block w-full"}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      <div
                        onClick={
                          header.column.getCanSort()
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                        className={
                          header.column.getCanSort() ? "cursor-pointer select-none" : ""
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <span className="ml-1 text-xs">
                            {{
                              asc: "↑",
                              desc: "↓",
                            }[header.column.getIsSorted() as string] ?? ""}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className={forceMobile ? "space-y-4 p-4" : "block md:hidden space-y-4 p-4"}>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map(row => (
              <div
                key={row.id}
                className="border rounded-lg p-4 shadow-sm space-y-2"
              >
                {row.getVisibleCells().map(cell => (
                  <div key={cell.id} className="flex justify-between">
                    <span className="font-medium text-sm text-muted-foreground">
                      {flexRender(cell.column.columnDef.header, {
                        column: cell.column,
                        table: table,
                        header: undefined as any,
                      })}
                    </span>
                    <span className="text-sm text-right">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </span>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground">No results.</p>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-1">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
