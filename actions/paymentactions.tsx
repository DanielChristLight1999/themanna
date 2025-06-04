"use server"

import { auth } from "@/auth"
import prisma from "@/db"
import { DeliveryType, OrderStatus, PaymentMethod, PaymentStatus } from "@/lib/generated/prisma"


interface OrderData {
    amount: number
    selectedAddressId: string | null
    paymentMethod: string
    orderNote: string
    deliveryFee: number
}

interface PaystackResponse {
    status: boolean,
    message: string,
    data: {
        authorization_url: string,
        access_code: string,
        reference: string
    }

}

export async function initializePayment(orderdata: OrderData) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: true, message: "Not authenticated", url: "" }
    }

    const { selectedAddressId, paymentMethod, amount, deliveryFee, orderNote } = orderdata
    if (!selectedAddressId || !paymentMethod || !amount) {
        return { error: true, message: "Invalid order data", url: "" }
    }
    console.log("order data", orderdata)
    const userId = session.user.id

    const cart = await prisma.cartItem.findMany({
        where: {
            userId: userId
        },
        include: {
            product: {
                select: {
                    price: true,
                }
            }
        }
    })
    const existingorder = await prisma.order.findFirst({
        where: {
            customerId: userId,
            status: OrderStatus.PENDING,
            paymentStatus: PaymentStatus.PENDING
        }
    })
    if(existingorder){
        await prisma.order.delete({where: {id: existingorder.id}})
    }

    const order = await prisma.order.create({
        data: {
            customerId: userId,
            addressId: selectedAddressId,
            deliveryType: DeliveryType.DELIVERY,
            totalAmount: amount,
            deliveryFee: deliveryFee,
            orderNotes: orderNote,
            items: {
                create: cart.map((item) => {
                    return {
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.product.price
                    }
                })
            }

        }
    })
    const payment = await prisma.payment.create({
        data: {
            orderId: order.id,
            method: PaymentMethod.PAYSTACK,
            status: PaymentStatus.PENDING,
            amount: amount,
        }
    })
    const reference = payment.id

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: session.user.email as string,
            amount: payment.amount * 100,
            reference: reference,
            channels: ["card", "bank", "ussd", "bank_transfer"],
            callback: `https://largely-decent-mite.ngrok-free.app/checkout/confirm`,

        })
    })
    const data:PaystackResponse = await response.json();
    
    if(!data.status){
        return { error: true, message: data.message, url: "" }
    }
    return { error: false, message: "Successfully initialized payment", url: data.data.authorization_url }

}