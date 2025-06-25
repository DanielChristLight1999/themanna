import { auth } from "@/auth"
import prisma from "@/db"
import { ReferralsData } from "./types"
import QRCode from 'qrcode'


export async function getReferralsData(): Promise<ReferralsData[]> {
    const session = await auth()
    if (!session) {
        throw new Error("Not authenticated")
    }
    const userId = session.user.id
    const data = await prisma.referral.findMany({
        where: {
            affiliateId: userId,
        },
        select: {
            id: true,
            referredAt: true,
            user: {select: {name: true, email: true, orders: {select: {id: true}}}},
        },
        orderBy: {
            referredAt: "desc",
        },
    })
    const referrals = data.map((referral) => ({
        id: referral.id,
        name: referral.user.name as string,
        email: referral.user.email,
        dateReferred: referral.referredAt,
        status: referral.user.orders.length > 0 ? "Has Ordered" : "No Orders",

    }))
    return referrals
}

export async function getReferralLink(){
    const session = await auth()
    if (!session) {
        throw new Error("Not authenticated")
    }
    const userId = session.user.id
    const affiliate = await prisma.affiliate.findUnique({
        where: {
            userId: userId
        },
        select: {
            referralCode: true
        }
    })
    if (!affiliate) {
        throw new Error("Affiliate not found")
    }
    const referralLink = `${process.env.NEXT_PUBLIC_SITE_URL}?ref=${affiliate.referralCode}`
    const qrImage = await QRCode.toDataURL(referralLink)
    return {referralLink: referralLink, qrImage: qrImage}
}