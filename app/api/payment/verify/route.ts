import prisma from "@/db"
import { format } from "date-fns"
import { NextRequest, NextResponse } from "next/server"
import { PaymentStatus } from "@/lib/generated/prisma";
import { getRestaurantSettingsNoAdmin } from "@/lib/getsettingsData";
export  async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");

  if (!reference || typeof reference !== "string") {
    // return res.status(400).json({ success: false, message: "Missing or invalid payment reference." })
    return NextResponse.json({ success: false, message: "Missing or invalid payment reference." })
  }
  console.log("verifying payment", reference)

  try {
    // 1. Verify payment with Paystack
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      },
      method: "GET"
    })
    console.log("verify res done",)

    const verifyJson = await verifyRes.json()
    const paymentData = verifyJson.data


    if (!verifyJson.status || paymentData.status !== "success") {
      return NextResponse.json({ success: false, message: "Payment verification failed." })
    }

    // 2. Find local payment and related order
    const payment = await prisma.payment.findUnique({
      where: { id: reference },
      include: {
        order: {
          include: {
            items: {
              include: { product: { include: { images: true } } }
            },
            address: true
          }
        }
      }
    })

    if (!payment || !payment.order) {
      return NextResponse.json({ success: false, message: "Payment not found." })
    }
    console.log("payment found")

    // 3. Update DB if not already marked successful
    if (payment.status !== PaymentStatus.SUCCESS) {
      // const method = paymentData.channel 
      await prisma.payment.update({
        where: { id: reference },
        data: {
          status: PaymentStatus.SUCCESS,
          transactionId: String(paymentData.id),
          paidAt: new Date(paymentData.paid_at),
        }
      })

      const order = await prisma.order.update({
        where: { id: payment.order.id },
        data: { paymentStatus: PaymentStatus.SUCCESS},
        include: {
          items: true
        }
      })
      await prisma.inventory.updateMany({
        where: {
          productId: {
            in: order.items.map((item) => item.productId)
          }
        },
        data: {
          quantity: {
            decrement: order.items.reduce((sum, item) => sum + item.quantity, 0)
          }
        }
      })
      
      if(order.affiliateCode){
        const affiliate = await prisma.affiliate.findUnique({
          where: {referralCode: order.affiliateCode}
        })
        if(affiliate){
          const {restaurantInfo} = await getRestaurantSettingsNoAdmin()
          const commisionAmount = order.totalAmount * (restaurantInfo?.commision || 0.05) // 5% commission

          await prisma.commission.create({
            data: {
              affiliateId: affiliate.userId,
              orderId: order.id,
              amount: commisionAmount,
              paid: false
            }
          })

          await prisma.affiliate.update({
            where: {userId: affiliate.userId},
            data: {
              totalEarnings: {
                increment: commisionAmount
              }
            }
          })
        }
      }


    }
    await prisma.cartItem.deleteMany({
      where: {
        userId: payment.order.customerId
      }
    })

    const order = payment.order
    const subtotal = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    const deliveryFee = order.deliveryFee || 0
    const total = subtotal + deliveryFee
    const deliveryEnd = new Date(order.placedAt.getTime() + 45 * 60000)
    const estimatedDeliveryTime = format(deliveryEnd, "dd/MM/yyyy HH:mm")


    return NextResponse.json({
      success: true,
      message: "Payment verified successfully.",
      orderNumber: order.id,
      estimatedDeliveryTime: estimatedDeliveryTime,
      address: order.address
        ? {
            label: order.address.label,
            street: order.address.street,
            city: order.address.city,
            state: order.address.state,
            postalCode: order.address.postalCode || ""
          }
        : null,
      items: order.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.unitPrice,
        image: item.product.images?.[0]?.url || null
      })),
      subtotal,
      deliveryFee,
      total,
      paymentMethod: paymentData.channel,
      orderNote: order.orderNotes
    })
  } catch (err: any) {
    console.error("Payment verification error:", err)
    return NextResponse.json({ success: false, message: "Internal server error verifying payment." })
  }
}
