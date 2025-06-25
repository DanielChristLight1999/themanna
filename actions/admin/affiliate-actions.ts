"use server"

import { auth } from "@/auth"
import prisma from "@/db";
import { PendingPayoutType } from "@/lib/admin-data/types";
import { canAccess } from "@/lib/permissions/check-permissions";


export async function createPayout(selectedPayout: PendingPayoutType, note: string) {
  const session = await auth()
  if (!session) return { error: true, message: "Unauthorized" }
  if (session.user.role !== "ADMIN") return { error: true, message: "Unauthorized" }

  const { unpaidCommissions, unpaidCommissionTotal, accountName, bankName, accountNumber, id: affiliateId } = selectedPayout

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Mark all selected commissions as paid
      const commissionIds = unpaidCommissions.map((c) => c.id)

      await tx.commission.updateMany({
        where: {
          id: { in: commissionIds },
        },
        data: {
          paid: true,
        },
      })

      // 2. Create the CommissionPayout log
      await tx.commissionPayoutLog.create({
        data: {
          affiliateId: affiliateId,
          totalAmount: unpaidCommissionTotal,
          bankName: bankName,
          accountNumber: accountNumber,
          accountName: accountName,
          note: note,
          paidAt: new Date(),
          commissions: {
            connect: commissionIds.map((id) => ({ id })),
          },
        },
      })

      return { success: true }
    })

    return {
      error: false,
      message: "Payout completed successfully.",
    }
  } catch (err) {
    console.error("Failed to create payout:", err)
    return {
      error: true,
      message: "Something went wrong. Please try again.",
    }
  }
}


export async function approveAffiliate(id: string){
    try {
        const session = await auth()
        if(!session){
            return {error: true, message: "not authorized" }
        }
        const canUpdate = await canAccess({
            userId: session.user.id,
            mod: "affiliates",
            action: "update"
        })
        if (!canUpdate) return { error: true, message: "Unauthorized" }
        await prisma.affiliate.update({
            where: {
                userId: id
            },
            data: {
                status: "APPROVED"
            }
        })
        return { error: false, message: "Affiliate approved successfully" }
    } catch (error) {
        console.error("Error approving affiliate:", error)
        return { error: true, message: "Something went wrong" }
    }
}

export async function rejectAffiliate(id: string) {
    try {
        const session = await auth()
        if (!session) return { error: true, message: "Unauthorized" }
        const canUpdate = await canAccess({
            userId: session.user.id,
            mod: "affiliates",
            action: "update"
        })
        if (!canUpdate) return { error: true, message: "Unauthorized" }
        await prisma.affiliate.update({
            where: {
                userId: id
            },
            data: {
                status: "REJECTED"
            }
        })
        return { error: false, message: "Affiliate rejected successfully" }
    } catch (error) {
        console.error("Error approving affiliate:", error)
        return { error: true, message: "Something went wrong" }
    }
}