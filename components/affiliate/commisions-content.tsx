"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentCommisionData } from "@/lib/affiliate-data/types"
import { formatDate } from "date-fns"
import { formatPrice } from "@/lib/utils"

export default function Commissions({commissions, totalPaid, totalUnpaid} : {commissions: RecentCommisionData[], totalPaid: number, totalUnpaid: number}) {
    const [activeTab, setActiveTab] = useState("all")

    const filteredCommissions = commissions.filter((commission) => {
        if (activeTab === "all") return true
        return commission.status.toLowerCase() === activeTab
    })

    // const totalPaid = commissions.filter((c) => c.status === "Paid").reduce((sum, c) => sum + c.amount, 0)
    // const totalUnpaid = commissions.filter((c) => c.status === "Unpaid").reduce((sum, c) => sum + c.amount, 0)

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Commissions</h1>
                <p className="text-gray-600 mt-2">Track all your commission earnings</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-emerald-200 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Commissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">₦{(totalPaid + totalUnpaid).toLocaleString()}</div>
                    </CardContent>
                </Card>

                <Card className="border-emerald-200 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Paid Commissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">₦{totalPaid.toLocaleString()}</div>
                    </CardContent>
                </Card>

                <Card className="border-emerald-200 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Unpaid Commissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">₦{totalUnpaid.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Commissions Table with Tabs */}
            <Card className="border-emerald-200 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-900">Commission History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-emerald-50">
                            <TabsTrigger value="all" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                                All ({commissions.length})
                            </TabsTrigger>
                            <TabsTrigger value="paid" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                                Paid ({commissions.filter((c) => c.status === "Paid").length})
                            </TabsTrigger>
                            <TabsTrigger value="unpaid" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                                Unpaid ({commissions.filter((c) => c.status === "Unpaid").length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value={activeTab} className="mt-6">
                            <div className="overflow-x-auto">
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
                                        {filteredCommissions.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center">
                                                    No commissions found
                                                </TableCell>
                                            </TableRow>
                                        ) : filteredCommissions.map((commission) => (
                                            <TableRow key={commission.id} className="hover:bg-emerald-50 transition-colors">
                                                <TableCell className="font-medium">{commission.orderId}</TableCell>
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
                                                <TableCell className="text-gray-600">{formatDate(commission.date, "dd MMM yyyy")}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
