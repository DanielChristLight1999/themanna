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

  const orders = await prisma.order.findMany({
    where: {
      orderType: "POS",
      paymentStatus: "SUCCESS",
      sessionId: activePosSession.id,
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