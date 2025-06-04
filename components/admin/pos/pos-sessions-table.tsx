"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EyeIcon, MoreHorizontalIcon } from "lucide-react"
import { PosSessionDetailsDialog } from "./pos-session-details-dialog"

// Mock data - would be replaced with actual data from API
const sessions = [
  {
    id: "POS-001",
    cashier: "John Doe",
    startTime: "2023-05-22 08:00",
    endTime: "2023-05-22 16:00",
    status: "CLOSED",
    totalSales: 45000,
    totalOrders: 18,
    paymentMethods: {
      CASH: 25000,
      CARD: 15000,
      TRANSFER: 5000,
    },
  },
  {
    id: "POS-002",
    cashier: "Jane Smith",
    startTime: "2023-05-22 08:00",
    endTime: null,
    status: "ACTIVE",
    totalSales: 32000,
    totalOrders: 12,
    paymentMethods: {
      CASH: 18000,
      CARD: 12000,
      TRANSFER: 2000,
    },
  },
  {
    id: "POS-003",
    cashier: "Mike Johnson",
    startTime: "2023-05-22 16:00",
    endTime: null,
    status: "ACTIVE",
    totalSales: 15000,
    totalOrders: 6,
    paymentMethods: {
      CASH: 8000,
      CARD: 7000,
      TRANSFER: 0,
    },
  },
  {
    id: "POS-004",
    cashier: "Sarah Williams",
    startTime: "2023-05-21 08:00",
    endTime: "2023-05-21 16:00",
    status: "CLOSED",
    totalSales: 52000,
    totalOrders: 22,
    paymentMethods: {
      CASH: 30000,
      CARD: 18000,
      TRANSFER: 4000,
    },
  },
  {
    id: "POS-005",
    cashier: "David Okafor",
    startTime: "2023-05-21 16:00",
    endTime: "2023-05-21 23:00",
    status: "CLOSED",
    totalSales: 38000,
    totalOrders: 15,
    paymentMethods: {
      CASH: 20000,
      CARD: 15000,
      TRANSFER: 3000,
    },
  },
]

export function PosSessionsTable() {
  const [selectedSession, setSelectedSession] = useState<any | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const handleViewDetails = (session: any) => {
    setSelectedSession(session)
    setIsDetailsOpen(true)
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session ID</TableHead>
                <TableHead>Cashier</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead className="text-right">Total Sales</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.id}</TableCell>
                  <TableCell>{session.cashier}</TableCell>
                  <TableCell>{session.startTime}</TableCell>
                  <TableCell>{session.endTime || "In Progress"}</TableCell>
                  <TableCell>
                    <Badge variant={session.status === "ACTIVE" ? "success" : "secondary"}>{session.status}</Badge>
                  </TableCell>
                  <TableCell>{session.totalOrders}</TableCell>
                  <TableCell className="text-right">₦{session.totalSales.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(session)}>
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Print Receipt</DropdownMenuItem>
                          {session.status === "ACTIVE" && <DropdownMenuItem>Close Session</DropdownMenuItem>}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PosSessionDetailsDialog session={selectedSession} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
    </>
  )
}
