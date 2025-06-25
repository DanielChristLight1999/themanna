import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSummaryData } from "@/lib/affiliate-data/get-dashboard-data"
import { formatPrice } from "@/lib/utils"
import { DollarSign, Users, Clock, CheckCircle } from "lucide-react"

const SummaryCards = async () => {
    const { totalEarnings, earningsGrowth, referralsThisMonth, totalReferrals, paidThisMonth, paidCommissions, unpaidCommissions } = await getSummaryData()
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className=" shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">{formatPrice(totalEarnings)}</div>
                    <p className="text-xs text-emerald-500 mt-1">
                        {earningsGrowth >= 0 ? "+" : ""}
                        {earningsGrowth}% from last month
                    </p>
                </CardContent>
            </Card>

            <Card className=" shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Referrals</CardTitle>
                    <Users className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">{totalReferrals}</div>
                    <p className="text-xs text-emerald-500 mt-1">{referralsThisMonth} new this month</p>
                </CardContent>
            </Card>

            <Card className=" shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Unpaid Commissions</CardTitle>
                    <Clock className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-amber-600">{formatPrice(unpaidCommissions)}</div>
                    <p className="text-xs text-amber-500 mt-1">Pending payment</p>
                </CardContent>
            </Card>

            <Card className=" shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Paid Commissions</CardTitle>
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">{formatPrice(paidCommissions)}</div>
                    <p className="text-xs text-emerald-500 mt-1">This month: {formatPrice(paidThisMonth)}</p>
                </CardContent>
            </Card>
        </div>
    )
}

export default SummaryCards