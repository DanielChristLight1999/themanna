"use server"

import { auth } from "@/auth"
import prisma from "@/db"
import { z } from "zod"

// const AddToCartSchema = z.object({
//   productId: z.string().uuid(),
// })

export async function addToCart(productId: number) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Not authenticated")
  }
  if (!productId) {
    throw new Error("Invalid product ID")
  }

  const userId = session.user.id


  await prisma.cartItem.upsert({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    update: {
      quantity: { increment: 1 },
    },
    create: {
      userId,
      productId,
      quantity: 1,
    },
  })

  return { error: false, message: "Successfully added to cart" }
}

export async function loadCart(){
  const session = await auth()

  if(!session){
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


export async function getCart(){
  const session = await auth()

  if(!session){
    throw new Error("Not authenticated")
  }

  const userId = session.user?.id
  const cartItems = await prisma.cartItem.findMany({
    where: {
      userId
    },
    select: {
      id: true,
      quantity: true,
      productId: true,
      
    }
  })
  return cartItems
}