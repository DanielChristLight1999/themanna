"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { ReferralsData } from "@/lib/affiliate-data/types"
import { format } from "date-fns"

const referrals = [
  { id: 1, name: "John Doe", email: "john@example.com", dateReferred: "2024-01-10", status: "Has Ordered" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", dateReferred: "2024-01-08", status: "No Orders" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", dateReferred: "2024-01-05", status: "Has Ordered" },
  { id: 4, name: "Sarah Wilson", email: "sarah@example.com", dateReferred: "2024-01-03", status: "Has Ordered" },
  { id: 5, name: "David Brown", email: "david@example.com", dateReferred: "2024-01-01", status: "No Orders" },
  { id: 6, name: "Lisa Davis", email: "lisa@example.com", dateReferred: "2023-12-28", status: "Has Ordered" },
  { id: 7, name: "Tom Miller", email: "tom@example.com", dateReferred: "2023-12-25", status: "No Orders" },
  { id: 8, name: "Emma Garcia", email: "emma@example.com", dateReferred: "2023-12-22", status: "Has Ordered" },
]

export default function ReferralsTable({referrals} : {referrals: ReferralsData[]}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredReferrals = referrals.filter((referral) => {
    const matchesSearch =
      referral.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || referral.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Referrals</h1>
        <p className="text-gray-600 mt-2">Manage and track all your referred users</p>
      </div>

      {/* Filters */}
      <Card className="border-emerald-200 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Has Ordered">Has Ordered</SelectItem>
                <SelectItem value="No Orders">No Orders</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Referrals Table */}
      <Card className="border-emerald-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            All Referrals ({filteredReferrals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date Referred</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReferrals.map((referral) => (
                  <TableRow key={referral.id} className="hover:bg-emerald-50 transition-colors">
                    <TableCell className="font-medium">{referral.name}</TableCell>
                    <TableCell className="text-gray-600">{referral.email}</TableCell>
                    <TableCell className="text-gray-600">{format(referral.dateReferred, "dd MMM yyyy")}</TableCell>
                    <TableCell>
                      <Badge
                        variant={referral.status === "Has Ordered" ? "default" : "secondary"}
                        className={
                          referral.status === "Has Ordered"
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }
                      >
                        {referral.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredReferrals.length === 0 && (
            <div className="text-center py-8 text-gray-500">No referrals found matching your criteria.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
