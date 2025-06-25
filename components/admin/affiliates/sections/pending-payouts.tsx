"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PendingPayoutType } from "@/lib/admin-data/types"
import { formatPrice } from "@/lib/utils"
import { useState } from "react"
import PayoutModal from "./payoutModal"
import { useCanAccess } from "@/lib/permissions/use-can-access"


const PendingPayouts = ({pendingList}: {pendingList: PendingPayoutType[]}) => {
    const [selectedPayout, setSelectedPayout] = useState<PendingPayoutType | null>(null)
    const canUpdate = useCanAccess("affiliates", "update")
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-gray-900">Pending Payouts</CardTitle>
                    <CardDescription>Affiliates with unpaid commissions ready for payout</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="font-semibold text-gray-700">Affiliate Name</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Referral Code</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Unpaid Commission</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Account Name</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Bank Name</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Account Number</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingList.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">
                                            <div className="text-gray-500">No pending payouts</div>
                                        </TableCell>
                                    </TableRow>
                                ) : pendingList.map((affiliate) => (
                                    <TableRow key={affiliate.id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium text-gray-900">{affiliate.affiliateName}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                {affiliate.referralCode}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-semibold text-green-600">
                                            {formatPrice(affiliate.unpaidCommissionTotal)}
                                        </TableCell>
                                        <TableCell className="text-gray-700">{affiliate.accountName}</TableCell>
                                        <TableCell className="text-gray-700">{affiliate.bankName}</TableCell>
                                        <TableCell className="text-gray-700">{affiliate.accountNumber}</TableCell>
                                        <TableCell>
                                            <Button
                                                disabled={!canUpdate}
                                                size="sm"
                                                onClick={() => setSelectedPayout(affiliate)}
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                Make Payout
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            <PayoutModal selectedPayout={selectedPayout} setSelectedPayout={setSelectedPayout} />
        </div>
    )
}

export default PendingPayouts