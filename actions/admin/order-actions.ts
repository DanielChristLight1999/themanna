"use server"

import prisma from "@/db"
import { OrderStatus } from "@/lib/generated/prisma"
import { subDays } from "date-fns"



export async function getAllOrders(daysAgo: number = 30) {
    const data = await prisma.order.findMany({
        where: {
            placedAt: {
                gte: subDays(new Date(), daysAgo),
            },
        },
        select: {
            id: true,
            address: {select: {street: true, city: true, state: true}},
            deliveryFee: true,
            placedAt: true,
            totalAmount: true,
            status: true,
            orderType: true,
            items: {select: {
                product: {select: {name: true, id: true}},
                quantity: true,
                unitPrice: true
            }},
            customer: { select: {
                name: true,
                phone: true,
                email: true,
            }},
            payment: {select: {
                method: true,
            }}
        }
    })
    const orders = data.map(order => {
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
                return {id:item.product.id, name: item.product.name, quantity: item.quantity, price: item.unitPrice}
            }),
            address: address,
        }
    })
    return orders
}


export async function updateOrderStatus(orderId: string, status: OrderStatus) {
   try {
    await prisma.order.update({
        where: { id: orderId },
        data: { status: status }
    })
    return { error: false, message: "Order status updated successfully" }
   } catch (error) {
    console.error("Error updating order status:", error)
    return { error: true, message: "Failed to update order status" }
   }
}