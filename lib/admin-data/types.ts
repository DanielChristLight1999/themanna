import { Affiliate, AffiliateApprovalStatus } from "../generated/prisma";

export type AffiliateWithRelations = Affiliate & {
  commissions: { amount: number }[];
  referrals: { id: string }[];
};

export type PendingPayoutType = {
    id: string;
    affiliateName: string;
    referralCode: string;
    unpaidCommissions: { id: string; amount: number; paid: boolean }[];
    unpaidCommissionTotal: number;
    accountName: string;
    bankName: string;
    accountNumber: string;
}

export type PendingApplicationsType = {
    id: string;
    name: string;
    phone: string;
    email: string;
    date: Date;
}

export type PayoutHistoryType = {
    id: number;
    affiliateName: string;
    amountPaid: number;
    notes: string;
    timestamp: Date;
    commissions: { id: string; amount: number }[];
}


export type ActiveAffiliateType = {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    referralCode: string;
    totalreferrals: number;
    totalcommissions: number;
    pendingcommissions: number;
    status: AffiliateApprovalStatus;
    joindate: Date;
}