import prisma from "@/db";
import { Customer } from "./columns/customersTableColumn";


export async function getProducts() {
    const data = await prisma.product.findMany({
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

export async function getCustomers(): Promise<Customer[]> {
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