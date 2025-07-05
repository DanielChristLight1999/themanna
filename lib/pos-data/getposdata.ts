import { auth } from "@/auth";
import prisma from "@/db";


export async function getActivePOSSession(){
    const session = await auth();
    if (!session) {
        throw new Error("No active session found");
    }
    const posSession = await prisma.posSession.findFirst({
        where: {
            staffId: session?.user?.id,
            closedAt: null,  
        },
        include: {
            staff: {select: { name: true }},
            orders: {
                where: {
                    orderType: "POS",
                    paymentStatus: "SUCCESS",
                },
                include: {
                    items: {
                        select: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    images: {select: { url: true }},
                                }
                            },
                            quantity: true,
                        }
                    },
                    payment: true,  
                }
            }
        }
    });
    return posSession;

}


export async function getActivePOSOrders() {
  const session = await auth()
  if (!session?.user?.id) return []

  const posSession = await prisma.posSession.findFirst({
    where: {
      staffId: session.user.id,
      closedAt: null,
    },
    select: {
      id: true,
    },
  })

  if (!posSession) return []

  const orders = await prisma.order.findMany({
    where: {
      orderType: "POS",
      paymentStatus: "PENDING",
      status: "PENDING",
      // optionally filter by session ID:
      sessionId: posSession.id
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      payment: true,
    },
    orderBy: { placedAt: "desc" },
  })

  return orders
}

export async function getCompletedPOSOrders() {
  const activePosSession = await getActivePOSSession()
  if (!activePosSession) return []

  const data = await prisma.order.findMany({
    where: {
      orderType: "POS",
      paymentStatus: "SUCCESS",
      sessionId: activePosSession.id,
    },
    include: {
      session: {
        select:{
          staff: {
            select: {
              name: true,
            }
          }
        }
      },
      items: {
        include: {
          product: true,
          
        },
      },
      payment: true,
    },
    orderBy: { placedAt: "desc" },
  })

  const orders = data.map((order) => ({
    id: order.id,
    items: order.items.map((item) => ({
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
      },
      quantity: item.quantity,
    })),
    subtotal: order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    taxAmount: order.taxAmount,
    totalAmount: order.totalAmount,
    payment: order.payment,
    status: order.status,
    placedAt: order.placedAt,
    cashierName: order.session?.staff.name,
    changeGiven: 0,
  }))

  return orders
}