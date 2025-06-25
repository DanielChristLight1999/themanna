import { auth } from "@/auth"
import prisma from "@/db"
import { RecentCommisionData } from "./types"


export async function getCommissionsData(): Promise<RecentCommisionData[]> {
    const session = await auth()
    if (!session) {
        throw new Error("Not authenticated")
    }
    const userId = session.user.id
    const currentYear = new Date().getFullYear()
    const data = await prisma.commission.findMany({
        where: {
            affiliateId: userId,
            paid: true,
            createdAt: {
                gte: new Date(`${currentYear}-01-01T00:00:00Z`),
                lte: new Date(`${currentYear}-12-31T23:59:59Z`),
            },
        },
        select: {
            id: true,
            orderId: true,
            paid: true,
            amount: true,
            createdAt: true,
        },
    })
    const commissions = data.map((commission) => ({
        id: commission.id,
        orderId: commission.orderId,
        amount: commission.amount,
        status: commission.paid ? "Paid" : "Unpaid",
        date: commission.createdAt,
    }))

    return commissions
}