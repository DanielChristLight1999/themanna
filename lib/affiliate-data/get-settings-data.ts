import { auth } from "@/auth";
import prisma from "@/db";



export async function getAffiliateSettingsData() {
    const session = await auth()
    if (!session) {
        throw new Error("Not authenticated")
    }
    const userId = session.user.id
    const data = await prisma.affiliate.findUnique({
        where: {
            userId: userId
        },
        select: {
            referralCode: true,
            totalEarnings: true,
            user: {select: {name: true, email: true, phone: true}},
            bankAccount: {select: {accountNumber: true, bankName: true, accountName: true}}
        }
    })
    if (!data) {
        throw new Error("Affiliate not found")
    }
    const totalEarnings = data.totalEarnings
    const referralCode = data.referralCode
    const affiliateDetails = {
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
    }
    return {
        totalEarnings: totalEarnings,
        referralCode: referralCode,
        affiliateDetails: affiliateDetails,
        bankAccount: data.bankAccount
    }
}