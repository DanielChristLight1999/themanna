"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchIcon } from "lucide-react"

export function CustomersFilter() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search by name, email, or phone..." className="pl-8 w-full" />
      </div>
      <Select defaultValue="all">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Customers</SelectItem>
          <SelectItem value="active">Active (30 days)</SelectItem>
          <SelectItem value="inactive">Inactive (&gt;30 days)</SelectItem>
          <SelectItem value="top">Top Spenders</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline">Export</Button>
    </div>
  )
}
