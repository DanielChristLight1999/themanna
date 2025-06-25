import prisma from "@/db"

import {
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
    startOfDay,
    endOfDay
} from 'date-fns';
import { ActiveAffiliateType, AffiliateWithRelations } from "../types";

function filterAffiliatesByPeriod(affiliates: AffiliateWithRelations[], period: string) {
    const now = new Date();

    try {
        switch (period) {
            case 'week':
                return affiliates.filter(affiliate =>
                    affiliate.createdAt >= startOfWeek(now) &&
                    affiliate.createdAt <= endOfWeek(now)
                );

            case 'month':
                return affiliates.filter(affiliate =>
                    affiliate.createdAt >= startOfMonth(now) &&
                    affiliate.createdAt <= endOfMonth(now)
                );

            case 'year':
                return affiliates.filter(affiliate =>
                    affiliate.createdAt >= startOfYear(now) &&
                    affiliate.createdAt <= endOfYear(now)
                );

            case 'today':
                return affiliates.filter(affiliate =>
                    affiliate.createdAt >= startOfDay(now) &&
                    affiliate.createdAt <= endOfDay(now)
                );

            default:
                throw new Error(`Invalid period: ${period}`);
        }
    } catch (error) {
        console.error('Error filtering affiliates by period:', error);
        return [];
    }
}
// Helper function to calculate metrics for a period
const calculateMetrics = (affiliatesData: AffiliateWithRelations[], period: string) => {
    const filtered = filterAffiliatesByPeriod(affiliatesData, period);
    const totalCommissions = filtered.reduce(
        (total, affiliate) => total + affiliate.commissions.reduce(
            (acc, commission) => acc + commission.amount, 0
        ), 0
    );

    return {
        totalAffiliates: filtered.length,
        activeAffiliates: filtered.filter(a => a.status == "APPROVED").length,
        totalCommissions,
        pendingCommissions: totalCommissions - filtered.reduce(
            (total, affiliate) => total + (affiliate.totalEarnings || 0), 0
        ),
        referrals: filtered.reduce(
            (total, affiliate) => total + affiliate.referrals.length, 0
        ),
    };
};

function createEmptyMetrics() {
    return {
        totalAffiliates: 0,
        activeAffiliates: 0,
        totalCommissions: 0,
        pendingCommissions: 0,
        referrals: 0
    };
}

import { format, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';

export type PeriodData = {
  date: string;
  commissions: number;
  referrals: number;
}[];

function generateAffiliateStats(affiliates: AffiliateWithRelations[], period: string): PeriodData {
  const now = new Date();
  
  if (period === "week") {
    // Generate daily stats for the current week
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    return days.map(day => {
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);
      const dayAffiliates = affiliates.filter(a => 
        a.createdAt >= dayStart && a.createdAt <= dayEnd
      );
      
      return {
        date: format(day, 'MMM d'),
        commissions: dayAffiliates.reduce((sum, a) => 
          sum + a.commissions.reduce((acc, c) => acc + c.amount, 0), 0),
        referrals: dayAffiliates.reduce((sum, a) => sum + a.referrals.length, 0)
      };
    });
    
  } else if (period === "month") {
    // Generate weekly stats for the current month
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const weeks = eachWeekOfInterval(
      { start: monthStart, end: monthEnd },
      { weekStartsOn: 1 } // Monday as first day of week
    );
    
    return weeks.map((weekStart, index) => {
      const weekEnd = endOfWeek(weekStart);
      const weekAffiliates = affiliates.filter(a => 
        a.createdAt >= weekStart && a.createdAt <= weekEnd
      );
      
      return {
        date: `Week ${index + 1}`,
        commissions: weekAffiliates.reduce((sum, a) => 
          sum + a.commissions.reduce((acc, c) => acc + c.amount, 0), 0),
        referrals: weekAffiliates.reduce((sum, a) => sum + a.referrals.length, 0)
      };
    });
    
  } else {
    // Assume "year" - generate monthly stats for the current year
    const yearStart = startOfYear(now);
    const yearEnd = endOfYear(now);
    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });
    
    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const monthAffiliates = affiliates.filter(a => 
        a.createdAt >= monthStart && a.createdAt <= monthEnd
      );
      
      return {
        date: format(month, 'MMM'),
        commissions: monthAffiliates.reduce((sum, a) => 
          sum + a.commissions.reduce((acc, c) => acc + c.amount, 0), 0),
        referrals: monthAffiliates.reduce((sum, a) => sum + a.referrals.length, 0)
      };
    });
  }
}

const periods = ['today', 'week', 'month', 'year'] as const;

export type AffiliateStatsType = Record<typeof periods[number], ReturnType<typeof calculateMetrics>>

export const getAdminAffiliatesData = async () => {
    try {
        // Fetch data with only necessary fields
        const affiliatesData = await prisma.affiliate.findMany({
            include: {
                commissions: {
                    select: { amount: true }
                },
                referrals: {
                    select: { id: true }
                }
            }
        });



        // Calculate all periods at once
        const data = Object.fromEntries(
            periods.map(period => [period, calculateMetrics(affiliatesData, period)])
        ) as AffiliateStatsType;

        return data;
    } catch (error) {
        console.error('Failed to fetch affiliate data:', error);
        // Return empty stats or rethrow based on your needs
        return {
            today: createEmptyMetrics(),
            week: createEmptyMetrics(),
            month: createEmptyMetrics(),
            year: createEmptyMetrics()
        };
    }
};

export const getAdminAffiliatesChartData = async () => {
    const affiliatesData = await prisma.affiliate.findMany({
        include: {
            commissions: {
                select: { amount: true }
            },
            referrals: {
                select: { id: true }
            }
        }
    });

    const weekly = generateAffiliateStats(affiliatesData, 'week');
    const monthly = generateAffiliateStats(affiliatesData, 'month');
    const yearly = generateAffiliateStats(affiliatesData, 'year');

    return {
        weekly,
        monthly,
        yearly
    };
}

export const getAdminPayoutsData = async () => {
    const payoutsData = await prisma.affiliate.findMany({
        select: {
            userId: true,
            user: {select: {name: true}},
            referralCode: true,
            commissions: {select: {id: true, amount: true, paid:true}},
            bankAccount: {select: {accountName: true, bankName: true, accountNumber: true}}
        }
    })

    const data = payoutsData.map(payout => ({
        id: payout.userId,
        affiliateName: payout.user.name || "",
        referralCode: payout.referralCode || "",
        unpaidCommissions: payout.commissions.filter(commission => commission.paid === false),
        unpaidCommissionTotal: payout.commissions.filter(commission => commission.paid === false).reduce((sum, c) => sum + c.amount, 0),
        accountName: payout.bankAccount?.accountName || "",
        bankName: payout.bankAccount?.bankName || "",
        accountNumber: payout.bankAccount?.accountNumber || "",
    }))
    const pendingPayouts = data.filter(payout => payout.unpaidCommissionTotal > 0)

    return pendingPayouts;
}

export const getAdminPayoutHistory = async () => {
    const data = await prisma.commissionPayoutLog.findMany({
        select: {
            id: true,
            affiliate: {select: {user: {select: {name: true}}}},
            totalAmount: true,
            note: true,
            paidAt: true,
            commissions: {select: {id: true, amount: true}}
        }
    })

    const payoutsHistory = data.map(payout => ({
        id: payout.id,
        affiliateName: payout.affiliate.user.name || "",
        amountPaid: payout.totalAmount,
        notes: payout.note || "",
        timestamp: payout.paidAt,
        commissions: payout.commissions.map(c => ({id: c.id, amount: c.amount}))
    }))

    return payoutsHistory
}


export const getPendingApplications = async () => {
    try {
        const data = await prisma.affiliate.findMany({
            where: {
                status: "PENDING"
            },
            select: {
                userId: true,
                user: {select: {name: true, phone: true, email: true}},
                createdAt: true
            }
        })
        const pendingApplications = data.map(app => ({
            id: app.userId,
            name: app.user.name || "",
            phone: app.user.phone || "",
            email: app.user.email,
            date: app.createdAt,
        }))
        return pendingApplications
    } catch (error) {
        console.error('Failed to fetch pending applications:', error);
        return [];
    }
}

export async function getActiveAffiliates(): Promise<ActiveAffiliateType[]> {
    try {
        const affiliates = await prisma.affiliate.findMany({
            where: {
                status: "APPROVED",
            },
           select: {
               userId: true,
               user: {select: {name: true, email: true, phone: true}},
               referralCode: true,
               status: true,
               createdAt: true,
               commissions: {select: {id: true, amount: true, paid: true}},
               referrals: {select: {id: true}}
           }
        });
        const activeAffiliates = affiliates.map((affiliate) => ({
            id: affiliate.userId,
            name: affiliate.user.name,
            email: affiliate.user.email,
            phone: affiliate.user.phone,
            referralCode: affiliate.referralCode,
            totalreferrals: affiliate.referrals.length,
            totalcommissions: affiliate.commissions.reduce((acc, commission) => acc + commission.amount, 0),
            pendingcommissions: affiliate.commissions.filter(commission => !commission.paid).reduce((acc, commission) => acc + commission.amount, 0),
            status: affiliate.status,
            joindate: affiliate.createdAt,
        }));
        return activeAffiliates;
    } catch (error) {
        console.error('Failed to fetch active affiliates:', error);
        return [];
    }
}