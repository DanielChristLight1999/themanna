"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"
import { PayoutHistoryType } from "@/lib/admin-data/types"
import { format, formatDate } from "date-fns"
import { formatPrice } from "@/lib/utils"

const payoutHistory = [
    {
        id: 1,
        date: "2024-06-20",
        affiliateName: "David Brown",
        amountPaid: 4500,
        notes: "Monthly commission payout",
        orderIds: ["ORD-001", "ORD-002", "ORD-003"],
        timestamp: "2024-06-20 14:30:00",
    },
    {
        id: 2,
        date: "2024-06-18",
        affiliateName: "Lisa Garcia",
        amountPaid: 2800,
        notes: "Quarterly bonus payout",
        orderIds: ["ORD-004", "ORD-005"],
        timestamp: "2024-06-18 10:15:00",
    },
    {
        id: 3,
        date: "2024-06-15",
        affiliateName: "Robert Taylor",
        amountPaid: 3600,
        notes: "Regular commission payment",
        orderIds: ["ORD-006", "ORD-007", "ORD-008", "ORD-009"],
        timestamp: "2024-06-15 16:45:00",
    },
]
const PayoutHistory = ({historyList}: {historyList: PayoutHistoryType[]}) => {
    const [expandedRows, setExpandedRows] = useState<number[]>([])


    const toggleRowExpansion = (id: number) => {
        setExpandedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-gray-900">Payout History</CardTitle>
                <CardDescription>Record of all completed affiliate payouts</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="font-semibold text-gray-700">Date</TableHead>
                                <TableHead className="font-semibold text-gray-700">Affiliate Name</TableHead>
                                <TableHead className="font-semibold text-gray-700">Amount Paid</TableHead>
                                <TableHead className="font-semibold text-gray-700">Notes</TableHead>
                                <TableHead className="font-semibold text-gray-700">Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {historyList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        <div className="text-gray-500">No payouts found</div>
                                    </TableCell>
                                </TableRow>
                            ) : historyList.map((payout, index) => (
                                <div key={index}>
                                    <TableRow key={index} className="hover:bg-gray-50">
                                        <TableCell className="text-gray-700">{formatDate(payout.timestamp, "dd/MM/yyyy")}</TableCell>
                                        <TableCell className="font-medium text-gray-900">{payout.affiliateName}</TableCell>
                                        <TableCell className="font-semibold text-green-600">
                                            {formatPrice(payout.amountPaid)}
                                        </TableCell>
                                        <TableCell className="text-gray-700">{payout.notes}</TableCell>
                                        <TableCell>
                                            <Collapsible>
                                                <CollapsibleTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => toggleRowExpansion(payout.id)}
                                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                    >
                                                        {expandedRows.includes(payout.id) ? (
                                                            <ChevronDown className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronRight className="h-4 w-4" />
                                                        )}
                                                        Details
                                                    </Button>
                                                </CollapsibleTrigger>
                                            </Collapsible>
                                        </TableCell>
                                    </TableRow>
                                    {expandedRows.includes(payout.id) && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="bg-blue-50 border-l-4 border-l-blue-500">
                                                <div className="p-4 space-y-2">
                                                    <div className="text-gray-700">
                                                        <strong className="text-gray-900">Commission IDs:</strong> {payout.commissions.map(c => c.id).join(", ")}
                                                    </div>
                                                    <div className="text-gray-700">
                                                        <strong className="text-gray-900">Payout Timestamp:</strong> {format(payout.timestamp, "dd/MM/yyyy HH:mm:ss")}
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </div>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

export default PayoutHistory