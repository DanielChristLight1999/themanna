import { auth } from "@/auth"
import prisma from "@/db"
import { endOfDay, endOfMonth, format, startOfDay, startOfMonth, subDays, subMonths } from "date-fns"
import { EarningsChartData, RecentCommisionData } from "./types"


export async function getSummaryData() {
    const session = await auth()
    if (!session) {
        throw new Error("Not authenticated")
    }
    const userId = session.user.id

    const now = new Date()
    const startOfThisMonth = startOfMonth(now)
    const endOfThisMonth = endOfMonth(now)
    const startOfLastMonth = startOfMonth(subMonths(now, 1))
    const endOfLastMonth = endOfMonth(subMonths(now, 1))

    const affiliate = await prisma.affiliate.findUnique({
        where: { userId },
        select: {
            totalEarnings: true,
            referrals: {
                select: {
                    referredAt: true,
                },
            },
            commissions: {
                select: {
                    amount: true,
                    paid: true,
                    createdAt: true,
                },
            },
        },
    })

    if (!affiliate) throw new Error("Affiliate not found")

    const totalReferrals = affiliate.referrals.length
    const referralsThisMonth = affiliate.referrals.filter(
        (r) => r.referredAt >= startOfThisMonth && r.referredAt <= endOfThisMonth
    ).length

    let paidCommissions = 0
    let unpaidCommissions = 0
    let paidThisMonth = 0
    let paidLastMonth = 0

    for (const commission of affiliate.commissions) {
        if (commission.paid) {
            paidCommissions += commission.amount
            if (commission.createdAt >= startOfThisMonth && commission.createdAt <= endOfThisMonth) {
                paidThisMonth += commission.amount
            }
            if (commission.createdAt >= startOfLastMonth && commission.createdAt <= endOfLastMonth) {
                paidLastMonth += commission.amount
            }
        } else {
            unpaidCommissions += commission.amount
        }
    }

    const earningsGrowth = paidLastMonth > 0
        ? ((paidThisMonth - paidLastMonth) / paidLastMonth) * 100
        : 0

    return {
        totalEarnings: affiliate.totalEarnings,
        totalReferrals,
        referralsThisMonth,
        unpaidCommissions,
        paidCommissions,
        paidThisMonth,
        earningsGrowth: Math.round(earningsGrowth * 10) / 10, // round to 1 decimal
    }
}



export async function getEarningsData(): Promise<EarningsChartData> {
    const session = await auth()
    if (!session) {
        throw new Error("Not authenticated")
    }
    const userId = session.user.id
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonthIndex = now.getMonth() // 0-based index: Jan = 0, Jun = 5, etc.

    const monthLabels = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ]

    // Initialize earnings for Jan to Dec
    const earningsMap: Record<string, number> = monthLabels.reduce((acc, label) => {
        acc[label] = 0
        return acc
    }, {} as Record<string, number>)

    // Fetch paid commissions for this year
    const commissions = await prisma.commission.findMany({
        where: {
            affiliateId: userId,
            paid: true,
            createdAt: {
                gte: new Date(`${currentYear}-01-01T00:00:00Z`),
                lte: new Date(`${currentYear}-12-31T23:59:59Z`),
            },
        },
        select: {
            amount: true,
            createdAt: true,
        },
    })

    // Group by month
    for (const c of commissions) {
        const month = format(c.createdAt, "MMM") // e.g., Jan, Feb
        earningsMap[month] += c.amount
    }

    // Build final data: Jan to current month only
    const earningsData: EarningsChartData = monthLabels
        .slice(0, currentMonthIndex + 1)
        .map((month) => ({
            month,
            earnings: earningsMap[month],
        }))

    return earningsData
}


export async function getRecentCommissions(): Promise<RecentCommisionData[]> {
    const session = await auth()
    if (!session) {
        throw new Error("Not authenticated")
    }
    const userId = session.user.id
    const today = new Date()
    const sevenDaysAgo = subDays(today, 7)
    const data = await prisma.commission.findMany({
        where: {
            affiliateId: userId,
            paid: true,
            createdAt: {
                gte: startOfDay(sevenDaysAgo),
                lte: endOfDay(today),
            }
        },
        select: {
            id: true,
            orderId: true,
            amount: true,
            createdAt: true,
            paid: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    const commisions = data.map((commission) => ({
        id: commission.id,
        orderId: commission.orderId,
        amount: commission.amount,
        status: commission.paid ? "Paid" : "Unpaid",
        date: commission.createdAt,
    }))

    return commisions

    
}