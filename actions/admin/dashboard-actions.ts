"use server"

import prisma from "@/db"
import { DeliveryType, OrderStatus, OrderType, PaymentStatus } from "@/lib/generated/prisma"
import { eachDayOfInterval, endOfWeek, format, startOfDay, startOfWeek, subDays } from "date-fns"

type FilterType = "online" | "pos" | "pickup" | undefined

interface DashboardMetrics {
  totalOrders: number
  totalRevenue: number
  avgDeliveryTime: number
  activeOrders: number
  percentChange: {
    orders: number
    revenue: number
    deliveryTime: number
    activeOrders: number
  }
}

export async function getDashboardMetrics(filterType?: FilterType): Promise<DashboardMetrics> {
  const today = new Date()
  const yesterday = subDays(today, 1)

  // Define filter logic
  const orderTypeFilter = filterType === "pos"
    ? "POS"
    : filterType === "pickup"
      ? { orderType: OrderType.ONLINE, deliveryType: DeliveryType.PICKUP }
      : filterType === "online"
        ? { orderType: OrderType.ONLINE, deliveryType: DeliveryType.DELIVERY }
        : {}

  const baseWhere = {
    ...((typeof orderTypeFilter === "string")
      ? { orderType: orderTypeFilter }
      : orderTypeFilter),
    placedAt: { gte: startOfDay(today) },
    paymentStatus: PaymentStatus.SUCCESS
  }

  const previousWhere = {
    ...((typeof orderTypeFilter === "string")
      ? { orderType: orderTypeFilter }
      : orderTypeFilter),
    placedAt: {
      gte: startOfDay(yesterday),
      lt: startOfDay(today)
    },
    paymentStatus: PaymentStatus.SUCCESS
  }

  // Current day metrics
  const [orderCount, revenue, deliveryTimes, activeOrders] = await Promise.all([
    prisma.order.count({ where: baseWhere }),
    prisma.order.aggregate({
      where: baseWhere,
      _sum: { totalAmount: true }
    }),
    prisma.order.findMany({
      where: {
        ...baseWhere,
        deliveryType: DeliveryType.DELIVERY,
        placedAt: { not: undefined }
      },
      select: {
        placedAt: true,
        updatedAt: true // assuming delivery is done = latest update
      }
    }),
    prisma.order.count({
      where: {
        ...((typeof orderTypeFilter === "string")
          ? { orderType: orderTypeFilter }
          : orderTypeFilter),
        status: { in: ["PENDING", "CONFIRMED", "IN_TRANSIT"] }
      }
    })
  ])

  // Estimate delivery duration (in minutes)
  const avgDeliveryTime = deliveryTimes.length
    ? Math.round(
        deliveryTimes.reduce((sum, o) => {
          const placed = o.placedAt.getTime()
          const updated = o.updatedAt.getTime()
          return sum + (updated - placed) / 60000
        }, 0) / deliveryTimes.length
      )
    : 0

  // Previous day for percent change (basic scaffold)
  const [prevOrderCount, prevRevenue] = await Promise.all([
    prisma.order.count({ where: previousWhere }),
    prisma.order.aggregate({
      where: previousWhere,
      _sum: { totalAmount: true }
    })
  ])

  // Basic percent change helpers
  const calcPercent = (curr: number, prev: number) =>
    prev === 0 ? (curr > 0 ? 100 : 0) : Number((((curr - prev) / prev) * 100).toFixed(2))

  return {
    totalOrders: orderCount,
    totalRevenue: revenue._sum.totalAmount || 0,
    avgDeliveryTime,
    activeOrders,
    percentChange: {
      orders: calcPercent(orderCount, prevOrderCount),
      revenue: calcPercent(revenue._sum.totalAmount || 0, prevRevenue._sum.totalAmount || 0),
      deliveryTime: 0, // hard to track unless you store exact delivery time
      activeOrders: 0  // leave as 0 or track over time with Redis/logs
    }
  }
}



export async function getWeeklyRevenue() {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 }) // Monday
  const end = endOfWeek(new Date(), { weekStartsOn: 1 }) // Sunday

  const days = eachDayOfInterval({ start, end })

  const results = await prisma.order.findMany({
    where: {
      placedAt: {
        gte: start,
        lte: end,
      },
      paymentStatus: PaymentStatus.SUCCESS,
    },
    select: {
      totalAmount: true,
      placedAt: true,
      orderType: true,
      deliveryType: true,
    }
  })

  const dailyRevenueMap: Record<string, { online: number; pos: number; pickup: number }> = {}

  // Initialize days
  for (const day of days) {
    const label = format(day, "EEE") // Mon, Tue, etc.
    dailyRevenueMap[label] = { online: 0, pos: 0, pickup: 0 }
  }

  for (const order of results) {
    const label = format(order.placedAt, "EEE")
    const bucket = dailyRevenueMap[label]

    if (order.orderType === OrderType.POS) {
      bucket.pos += order.totalAmount
    } else if (order.orderType === OrderType.ONLINE && order.deliveryType === DeliveryType.DELIVERY) {
      bucket.online += order.totalAmount
    } else if (order.orderType === OrderType.ONLINE && order.deliveryType === DeliveryType.PICKUP) {
      bucket.pickup += order.totalAmount
    }
  }

  const final = days.map((day) => {
    const label = format(day, "EEE")
    return {
      name: label,
      online: dailyRevenueMap[label].online,
      pos: dailyRevenueMap[label].pos,
      pickup: dailyRevenueMap[label].pickup,
    }
  })

  return final
}



type OrderStatusValue = {
  name: string
  value: number
}

// export async function getOrderStatusData(filterType?: string): Promise<OrderStatusValue[]> {
//   const baseFilter: any = {}

//   // Optional filter logic
//   if (filterType === "pos") {
//     baseFilter.orderType = OrderType.POS
//   } else if (filterType === "online") {
//     baseFilter.orderType = OrderType.ONLINE
//     baseFilter.deliveryType = DeliveryType.DELIVERY
//   } else if (filterType === "pickup") {
//     baseFilter.orderType = OrderType.ONLINE
//     baseFilter.deliveryType = DeliveryType.PICKUP
//   }

//   const statuses = [
//     OrderStatus.PENDING,
//     OrderStatus.CONFIRMED,
//     OrderStatus.IN_TRANSIT,
//     OrderStatus.DELIVERED
//   ]

//   const results = await Promise.all(
//     statuses.map(async (status) => {
//       const count = await prisma.order.count({
//         where: {
//           ...baseFilter,
//           status
//         }
//       })
//       return { name: status.replace("_", " ").toLowerCase().replace(/^\w/, c => c.toUpperCase()), value: count }
//     })
//   )

//   return results
// }


export async function getOrderStatusBaseData(): Promise<Record<OrderStatus, number>> {
  const statuses: OrderStatus[] = [
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.IN_TRANSIT,
    OrderStatus.DELIVERED
  ]

  const counts: Record<OrderStatus, number> = {
    PENDING: 0,
    CONFIRMED: 0,
    IN_TRANSIT: 0,
    DELIVERED: 0,
    CANCELLED: 0
  }

  await Promise.all(
    statuses.map(async (status) => {
      const count = await prisma.order.count({
        where: { status }
      })
      counts[status] = count
    })
  )

  return counts
}


export async function getRecentOrdersBaseData() {
  const orders = await prisma.order.findMany({
    where: {
      placedAt: {
        gte: subDays(new Date(), 7),
      },
      paymentStatus: PaymentStatus.SUCCESS,
    },
    orderBy: { placedAt: "desc" },
    take: 10,
    select: {
        id: true,
        customer: { select: { name: true } },
        status: true,
        totalAmount: true,
        orderType: true,
    }
  })

  const allOrders = [
    ...orders.map((order) => ({
      id: order.id,
      customer: order.customer.name,
      status: order.status,
      total: order.totalAmount,
      type: order.orderType,
    })),
  ]
  return allOrders

  // Filter logic
}

export async function getTopProducts(filterType?: FilterType) {
  // Build filters
  const baseFilter: any = {
    payment: {
      status: PaymentStatus.SUCCESS,
    },
  }

  if (filterType === "online") {
    baseFilter.orderType = OrderType.ONLINE
    baseFilter.deliveryType = DeliveryType.DELIVERY
  } else if (filterType === "pickup") {
    baseFilter.orderType = OrderType.ONLINE
    baseFilter.deliveryType = DeliveryType.PICKUP
  } else if (filterType === "pos") {
    baseFilter.orderType = OrderType.POS
  }

  // Fetch all order items with joined product info
  const orderItems = await prisma.orderItem.findMany({
    where: {
      order: baseFilter,
    },
    select: {
      productId: true,
      quantity: true,
      unitPrice: true,
      product: {
        select: {
          name: true,
        },
      },
    },
  })

  // Aggregate quantity and revenue per product
  const stats: Record<number, { name: string; quantity: number; revenue: number }> = {}

  for (const item of orderItems) {
    const key = item.productId
    if (!stats[key]) {
      stats[key] = {
        name: item.product.name,
        quantity: 0,
        revenue: 0,
      }
    }
    stats[key].quantity += item.quantity
    stats[key].revenue += item.unitPrice * item.quantity
  }

  const allProducts = Object.values(stats)

  const totalRevenue = allProducts.reduce((acc, p) => acc + p.revenue, 0)

  const result = allProducts
    .sort((a, b) => b.revenue - a.revenue) // sort by top revenue
    .slice(0, 5) // limit to top 5
    .map((item) => ({
      name: item.name,
      quantity: item.quantity,
      revenue: item.revenue,
      percentage: totalRevenue > 0 ? Math.round((item.revenue / totalRevenue) * 100) : 0,
    }))

  return result
}
