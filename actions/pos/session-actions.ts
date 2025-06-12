// lib/pos-data/createSession.ts
'use server'

import { auth } from '@/auth'
import prisma from '@/db'
import { PaymentMethod } from '@/lib/generated/prisma'
import { CartItem } from '@/stores/usePOSStore'

export async function createPOSSession() {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: true, message: 'Not authenticated' }
  }

  const existing = await prisma.posSession.findFirst({
    where: {
      staffId: session.user.id,
      closedAt: null,
    },
    include: {
      staff: {
        select: { name: true },
      }
    }
  })

  if (existing) {
    return {
      error: false,
      message: 'Session already active',
      session: existing,
    }
  }

  const newSession = await prisma.posSession.create({
    data: {
      staffId: session.user.id,
    },
    include: {
      staff: {
        select: { name: true },
      },
    },
  })

  return {
    error: false,
    message: 'Session started',
    session: newSession,
  }
}


export async function endPOSSession(sessionId: string, summaryData:{
  totalRevenue: number,
  totalOrders: number,
  totalSales: number,
  transferAmount: number,
  cashAmount: number,
  taxAmount: number,


}) {
  const session = await auth()
  if (!session?.user?.id) return { error: true, message: "Unauthorized" }
  
  try {
    await prisma.posSession.update({
      where: { id: sessionId },
      data: {
        closedAt: new Date(),
        posRevenue: summaryData.totalRevenue,
        totalSales: summaryData.totalSales,
        transferAmt: summaryData.transferAmount,
        orderCount: summaryData.totalOrders,
        cashAmount: summaryData.cashAmount,
        taxAmount: summaryData.taxAmount
      },
    })

    return { error: false, message: "Session closed successfully" }
  } catch (error) {
    console.error(error)
    return { error: true, message: "Could not close session" }
  }
}


export async function savePendingOrder({ sessionId, cart }: {
  sessionId: string,
  cart: {
    id: string
    name: string
    price: number
    quantity: number
    image?: string
  }[]
}) {
  console.log("Saving pending order", { sessionId, cart })
  const session = await auth()
  if (!session?.user?.id) return { error: true, message: "Unauthorized" }

  try {
    const order = await prisma.order.create({
      data: {
        customerId: session.user.id,
        status: "PENDING",
        orderType: "POS",
        paymentStatus: "PENDING",
        totalAmount: cart.reduce((sum, item) => sum + item.price * item.quantity * 1.08, 0),
        taxAmount: cart.reduce((sum, item) => sum + item.price * item.quantity * 0.08, 0),
        placedAt: new Date(),
        sessionId: sessionId,
        items: {
          create: cart.map((item) => ({
            product: { connect: { id: parseInt(item.id) } },
            quantity: item.quantity,
            unitPrice: item.price,
          }))
        }
      }
    })

    return { error: false, message: "order saved" }
  } catch (e) {
    console.error(e)
    return { error: true, message: "Could not save order" }
  }
}

export async function updateSavedOrder(orderId: string, cart: CartItem[]) {
  // Delete previous order items (simpler than diffing)
  const session = await auth()
  if (!session?.user?.id) return { error: true, message: "Unauthorized" }


  try {
    await prisma.orderItem.deleteMany({
      where: { orderId },
    })

    // const updatedItems = cart.map((i) => ({
    //   orderId,
    //   productId: parseInt(i.id),
    //   quantity: i.quantity,
    //   unitPrice: i.price, // fetch latest price if needed
    // }))

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
       totalAmount: cart.reduce((sum, item) => sum + item.price * item.quantity * 1.08, 0),
        taxAmount: cart.reduce((sum, item) => sum + item.price * item.quantity * 0.08, 0),
        items: {
          create: cart.map((item) => ({
            product: { connect: { id: parseInt(item.id) } },
            quantity: item.quantity,
            unitPrice: item.price,
          }))
        }
      }
    })

    return { error: false, message: "order saved" }
  } catch (error) {
    console.error(error)
    return { error: true, message: "Could not save order" }
  }
}

export async function CompleteOrder(cart: CartItem[], sessionId: string, paymentMethod: PaymentMethod, paymentAmount: number, resumeId?: string) {

  const session = await auth()
  if (!session?.user?.id) return { error: true, message: "Unauthorized" }

  try {
    if(resumeId) {
      await prisma.orderItem.deleteMany({
        where: { orderId: resumeId },
        })
      const order = await prisma.order.update({
        where: { id: resumeId },
        data: {
          status: "DELIVERED",
          orderType: "POS",
          paymentStatus: "SUCCESS",
          totalAmount: cart.reduce((sum, item) => sum + item.price * item.quantity * 1.08, 0),
          taxAmount: cart.reduce((sum, item) => sum + item.price * item.quantity * 0.08, 0),
          placedAt: new Date(),
          items: {
            create: cart.map((item) => ({
              product: { connect: { id: parseInt(item.id) } },
              quantity: item.quantity,
              unitPrice: item.price,
            }))
          }
        }
      })

      await prisma.payment.create({
        data: {
          orderId: order.id,
          method: paymentMethod,
          amount: paymentAmount,
          status: "SUCCESS",
          paidAt: new Date(),
        }
      })

      return { error: false, message: "Order completed successfully", order: order}
    }
    const order = await prisma.order.create({
    data: {
      customerId: session.user.id,
      sessionId: sessionId,
      status: "DELIVERED",
      orderType: "POS",
      paymentStatus: "SUCCESS",
      totalAmount: cart.reduce((sum, item) => sum + item.price * item.quantity * 1.08, 0),
      taxAmount: cart.reduce((sum, item) => sum + item.price * item.quantity * 0.08, 0),
      placedAt: new Date(),
      items: {
        create: cart.map((item) => ({
          product: { connect: { id: parseInt(item.id) } },
          quantity: item.quantity,
          unitPrice: item.price,
        }))
      }
    }
  })
  
   await prisma.payment.create({
    data: {
      orderId: order.id,
      method: paymentMethod,
      amount: paymentAmount,
      status: "SUCCESS",
      paidAt: new Date(),
    }
  })

  return { error: false, message: "Order completed successfully", order: order }
  } catch (error) {
    console.error(error)
    return { error: true, message: "Could not complete order" }
  }
  
}