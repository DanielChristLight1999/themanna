import prisma from "@/db";
import { Customer } from "./columns/customersTableColumn";
import { endOfDay, isAfter, startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { OrderStatus, PaymentMethod } from "./generated/prisma";
import { auth } from "@/auth";



export async function getProducts() {
    const data = await prisma.product.findMany({
        where: {
            isActive: true,
            deletedAt: null,
        },
        select: {
            id: true,
            name: true,
            category: { select: { name: true, id: true } },
            images: true,
            price: true,
            description: true,
        }
    });

    const products = data.map((product) => ({
        id: product.id.toString(),
        name: product.name,
        category: {
            id: product.category.id.toString(),
            name: product.category.name,
        },
        image: product.images?.[0]?.url,
        price: product.price,
        description: product.description,
    }))
    return products
}

export async function getProductsHome() {
    const data = await prisma.product.findMany({
        where: {
            isActive: true,
            deletedAt: null,
        },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            images: { select: { url: true } },
            category: { select: { name: true } },
        }
    });
    const menuItems = data.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.images[0].url,
        category: item.category.name,
    }));
    return menuItems
}

export async function getAllProducts() {
    const products = await prisma.product.findMany({
        include: {
            category: true,
            images: true,
        }
    })

    return products
}

export async function getCategories() {
    const data = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
        }
    })
    const categories = data.map((category) => ({
        id: category.id.toString(),
        name: category.name,
    }))
    return categories
}

export async function loadCart() {
    const session = await auth()

    if (!session) {
        throw new Error("Not authenticated")
    }

    const userId = session.user?.id
    const data = await prisma.cartItem.findMany({
        where: {
            userId
        },
        select: {
            quantity: true,
            productId: true,
            product: {
                select: {
                    price: true,
                    name: true,
                    images: true,

                }
            }
        }
    })
    const cartItems = data.map((item) => ({
        quantity: item.quantity,
        productId: item.productId.toString(),
        price: item.product.price,
        image: item.product.images?.[0]?.url,
        name: item.product.name
    }))
    return cartItems
}


export async function getCart(userId: string) {
    const data = await prisma.cartItem.findMany({
        where: {
            userId: userId
        },
        select: {
            id: true,
            quantity: true,
            product: {
                select: {
                    price: true,
                    name: true,
                    images: true,
                }
            }
        }
    })
    const cartItems = data.map((item) => ({
        id: item.id.toString(),
        quantity: item.quantity,
        product: {
            name: item.product.name,
            image: item.product.images?.[0]?.url,
            price: item.product.price,
        }
    }))

    return cartItems
}
export interface CustomerOrderItem {
    name: string
    quantity: number
    price: number
}

export interface CustomerOrder {
    id: string
    customer: string
    phone: string | null
    date: Date
    total: number
    deliveryFee: number | null
    status: OrderStatus
    paymentMethod?: string
    type: string
    items: CustomerOrderItem[]
    address: string
}

export interface CustomerNew {
    id: string
    name: string | null
    email: string
    phone: string | null
    orders: CustomerOrder[]
    totalOrders: number
    totalSpent: number
    lastOrder?: Date
    status: string
    addresses: any[] // Or define a proper type if known
    joinDate: Date
}

export async function getCustomers(): Promise<CustomerNew[]> {
    const data = await prisma.user.findMany({
        where: {
            role: "CUSTOMER"
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            orders: {
                select: {
                    id: true,
                    address: { select: { street: true, city: true, state: true } },
                    deliveryFee: true,
                    placedAt: true,
                    totalAmount: true,
                    status: true,
                    orderType: true,
                    items: {
                        select: {
                            product: { select: { name: true } },
                            quantity: true,
                            unitPrice: true
                        }
                    },
                    customer: {
                        select: {
                            name: true,
                            phone: true,
                            email: true,
                        }
                    },
                    payment: {
                        select: {
                            method: true,
                        }
                    }
                }
            },
            addresses: true,
            isActive: true,
            createdAt: true,
        }
    })
    const customers = data.map((customer) => {
        const orders = customer.orders.map(order => {
            const address = order.address ? `${order.address.street}, ${order.address.city}, ${order.address.state}` : "In-store"
            return {
                id: order.id,
                customer: order.customer.name || order.customer.email,
                phone: order.customer.phone,
                date: order.placedAt,
                total: order.totalAmount,
                deliveryFee: order.deliveryFee,
                status: order.status,
                paymentMethod: order.payment?.method,
                type: order.orderType,
                items: order.items.map(item => {
                    return { name: item.product.name, quantity: item.quantity, price: item.unitPrice }
                }),
                address: address,
            }
        })
        return {
            id: customer.id.toString(),
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            orders: orders,
            totalOrders: customer.orders.length,
            totalSpent: customer.orders.reduce((acc, order) => acc + order.totalAmount, 0),
            lastOrder: customer.orders[0]?.placedAt,
            status: customer.isActive ? "ACTIVE" : "INACTIVE",
            addresses: customer.addresses,
            joinDate: customer.createdAt,
        }
    })

    return customers
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
            status: true,
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

export async function getSavedOrder(orderId: string) {
    return await prisma.order.findUnique({
        where: { id: orderId, status: "PENDING" },
        include: {
            session: {
                include: {
                    staff: true,
                },
            },
            items: {
                select: {
                    quantity: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            images: { select: { url: true } },
                        },
                    },
                },
            },
        },
    })
}


export async function getSessionsData() {
    const now = new Date()
    const todayStart = startOfDay(now)
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    const monthStart = startOfMonth(now)

    const sessions = await prisma.posSession.findMany({
        include: {
            staff: { select: { id: true, name: true } },
            orders: true,
        },
    })

    // Helper: filter closed sessions based on closedAt
    const closedSessionsSince = (date: Date) =>
        sessions.filter((s) => s.closedAt && isAfter(s.closedAt, date))

    // Helper: count active sessions based on openedAt
    const activeSessionsSince = (date: Date) =>
        sessions.filter((s) => !s.closedAt && isAfter(s.openedAt, date))

    const summarize = (targetSessions: typeof sessions) => {
        const totalSessions = targetSessions.length
        const totalRevenue = targetSessions.reduce((acc, s) => acc + (s.posRevenue || 0), 0)
        const totalOrders = targetSessions.reduce((acc, s) => acc + s.orders.length, 0)
        const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0

        return { totalSessions, totalRevenue, averageTicket }
    }

    return {
        today: {
            activeSessions: activeSessionsSince(todayStart).length,
            ...summarize(closedSessionsSince(todayStart)),
        },
        week: {
            activeSessions: activeSessionsSince(weekStart).length,
            ...summarize(closedSessionsSince(weekStart)),
        },
        month: {
            activeSessions: activeSessionsSince(monthStart).length,
            ...summarize(closedSessionsSince(monthStart)),
        },
    }
}

export type PosSessionWithOrdersAndStaff = {
    id: string;
    cashier: string | null;
    startTime: Date;
    endTime: Date | null;
    status: string;
    totalSales: number;
    totalOrders: number;
    paymentMethods: {
        CASH: number;
        CARD: number;
        TRANSFER: number;
    };
    orders: {
        id: string;
        date: Date;
        paymentMethod?: PaymentMethod;
        itemscount: number;
        total: number;
    }[];
}
export async function getAllPOSSessions(): Promise<PosSessionWithOrdersAndStaff[]> {
    const data = await prisma.posSession.findMany({
        include: {
            staff: { select: { id: true, name: true } },
            orders: { include: { items: { select: { id: true } }, payment: { select: { method: true } } } },
        },
        orderBy: { openedAt: "desc" },
    })
    const sessions = data.map((session) => ({
        id: session.id,
        cashier: session.staff.name,
        startTime: session.openedAt,
        endTime: session.closedAt,
        status: session.closedAt ? "CLOSED" : "OPEN",
        totalSales: session.totalSales,
        totalOrders: session.orderCount,
        paymentMethods: {
            CASH: session.cashAmount,
            CARD: session.transferAmt,
            TRANSFER: session.transferAmt,
        },
        orders: session.orders.map(order => ({
            id: order.id,
            date: order.placedAt,
            paymentMethod: order.payment?.method,
            itemscount: order.items.length,
            total: order.totalAmount,
        }))
    }))

    return sessions
}

// export async function getFoodsOfTheDay() {

// const today = new Date().toISOString().split('T')[0];

// const foodsOfTheDay = await prisma.foodOfTheDay.findMany({
//   where: {
//     date: {
//       gte: new Date(today + "T00:00:00Z"),
//       lt: new Date(today + "T23:59:59Z"),
//     },
//   },
//   include: { product: {include: {
//     category: true,
//     images: true,
//   }}, },
// });

// return foodsOfTheDay
// }

export async function getFoodsOfTheDay() {
    const todayStart = startOfDay(new Date())
    const todayEnd = endOfDay(new Date())

    const foodsOfTheDay = await prisma.foodOfTheDay.findMany({
        where: {
            date: {
                gte: todayStart,
                lte: todayEnd,
            },
        },
        include: {
            product: {
                include: {
                    category: true,
                    images: true,
                },
            },
        },
    })

    return foodsOfTheDay
}


export async function getAllflyers() {
    const flyers = await prisma.flyerAd.findMany({
        orderBy: { createdAt: "desc" },
    })
    return flyers
}
export async function getActiveFlyers(position: "top" | "middle" | "footer") {
    const now = new Date()

    return await prisma.flyerAd.findMany({
        where: {
            isActive: true,
            position,
            OR: [
                { expiresAt: null },
                { expiresAt: { gt: now } },
            ],
        },
        orderBy: { createdAt: "desc" }
    })
}
