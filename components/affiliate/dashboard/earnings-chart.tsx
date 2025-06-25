"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EarningsChartData } from "@/lib/affiliate-data/types"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const EarningsChart = ({earningsData}: {earningsData: EarningsChartData}) => {
    return (
        <Card className=" shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Earnings Over Time</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={earningsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#f0fdf4",
                                    border: "1px solid #10b981",
                                    borderRadius: "8px",
                                }}
                            />
                            <Bar dataKey="earnings" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default EarningsChart