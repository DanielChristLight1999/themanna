"use server"

import prisma from "@/db"
import { PaymentMethod } from "@/lib/generated/prisma"
import { addDays, endOfDay, format } from "date-fns"

interface GenerateReportOptions {
  reportType: "sales" | "products" | "inventory" | "customers" | "affiliates"
  startDate: Date
  endDate: Date
}

export async function generateReport(options: GenerateReportOptions) {
  const { reportType, startDate, endDate } = options

  switch (reportType) {
    case "sales":
      return await generateSalesReport(startDate, endDate)
    // case "products":
    //   return await generateProductReport(startDate, endDate)
    // case "inventory":
    //   return await generateInventoryReport()
    // case "customers":
    //   return await generateCustomerReport(startDate, endDate)
    // case "affiliates":
    //   return await generateAffiliateReport(startDate, endDate)
    default:
      return { summary : { totalOrders: 0, totalRevenue: 0 }, details: [] }
  }
}

async function generateSalesReport(startDate: Date, endDate: Date, location?: string, paymentMethod?: PaymentMethod) {
  const orders = await prisma.order.findMany({
    where: {
      placedAt: {
        gte: startDate,
        lte: endOfDay(endDate),
      },
      payment: {
        ...(paymentMethod && { method: paymentMethod }),
        status: "SUCCESS",
      },
      ...(location && {
        address: {
          city: location,
        },
      }),
    },
    include: {
      payment: true,
      customer: true,
    },
  })

  const totalRevenue = orders.reduce((sum, order) => sum + (order.payment?.amount ?? 0), 0)
  return {
    summary: {
      totalOrders: orders.length,
      totalRevenue,
    },
    details: orders,
  }
}

// Add stubs for other reports (implement as needed)
async function generateProductReport(start: Date, end: Date) {
  return { message: "Product report not yet implemented" }
}

async function generateInventoryReport() {
  return await prisma.inventory.findMany({ include: { product: true } })
}

async function generateCustomerReport(start: Date, end: Date) {
  return await prisma.user.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
      role: "CUSTOMER",
    },
  })
}

async function generateAffiliateReport(start: Date, end: Date) {
  return await prisma.affiliate.findMany({
    include: {
      user: true,
      commissions: {
        where: {
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      },
    },
  })
}


export async function getReportsData() {
    const categories = await prisma.category.findMany()
    const products = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            price: true,
            categoryId: true,
            costPrice: true,
            sku: true,
            isActive: true,
        }
    })
    const users = await prisma.user.findMany({
        where: { role: "CUSTOMER" },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
        }
    })
    const affiliates = await prisma.affiliate.findMany({
        select: {
            userId: true,
            totalEarnings: true,
            createdAt: true,
            referralCode: true,
            approved: true,
        }
    })
    const orders = await prisma.order.findMany()
    const payments = await prisma.payment.findMany()
    const posSessions = await prisma.posSession.findMany()
    const inventory = await prisma.inventory.findMany()
    const commissions = await prisma.commission.findMany()
    return {
        users,
        products,
        orders,
        categories,
        affiliates,
        posSessions,
        inventory,
        payments,
        commissions,
    }
}