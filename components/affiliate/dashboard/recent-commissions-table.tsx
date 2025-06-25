import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getRecentCommissions } from "@/lib/affiliate-data/get-dashboard-data"
import { format } from "date-fns"
import { extractorderId, formatPrice } from "@/lib/utils"

// const recentCommissions = [
//   { orderId: "ORD-001", amount: 1250, status: "Paid", date: "2024-01-15" },
//   { orderId: "ORD-002", amount: 890, status: "Unpaid", date: "2024-01-14" },
//   { orderId: "ORD-003", amount: 2100, status: "Paid", date: "2024-01-13" },
//   { orderId: "ORD-004", amount: 750, status: "Unpaid", date: "2024-01-12" },
//   { orderId: "ORD-005", amount: 1680, status: "Paid", date: "2024-01-11" },
// ]
const RecentCommissions = async () => {
    const recentCommissions = await getRecentCommissions()
    return (
        <Card className=" shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Recent Commissions</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentCommissions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">
                                    No commissions found
                                </TableCell>
                            </TableRow>
                        ) : (
                            recentCommissions.map((commission) => (
                                <TableRow key={commission.orderId} className="hover:bg-emerald-50">
                                    <TableCell className="font-medium">{extractorderId(commission.orderId)}</TableCell>
                                    <TableCell className="font-semibold text-emerald-600">
                                        {formatPrice(commission.amount)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={commission.status === "Paid" ? "default" : "secondary"}
                                            className={
                                                commission.status === "Paid"
                                                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                                    : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                            }
                                        >
                                            {commission.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-600">{format(commission.date, "dd MMM yyyy")}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default RecentCommissions