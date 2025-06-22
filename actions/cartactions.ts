"use server"

import { auth } from "@/auth"
import prisma from "@/db"
// const AddToCartSchema = z.object({
//   productId: z.string().uuid(),
// })

export async function addToCart(productId: number) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: true, message: "Not authenticated" }
  }
  if (!productId) {
    return { error: true, message: "Invalid product ID" }
  }

  const userId = session.user.id
  try {

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
  } catch (error) {
    console.error("Error adding to cart:", error)
    return { error: true, message: "Error adding to cart" }
  }

}


export async function removeFromCart(productId: number) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: true, message: "Not authenticated" }
  }

  const userId = session.user.id
  if (!productId) {
    return { error: true, message: "Invalid product ID" }
  }
  try {

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    })

    if (!existingItem) {
      return { error: true, message: "Item not found in cart" }
    }

    if (existingItem.quantity <= 1) {
      await prisma.cartItem.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      })
    } else {
      await prisma.cartItem.update({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
        data: {
          quantity: { decrement: 1 },
        },
      })
    }

    return { error: false, message: "Successfully removed from cart" }

  } catch (error) {
    console.error(error)
    return { error: true, message: "Error removing from cart" }
  }
}

export async function deleteFromCart(productId: number) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: true, message: "Not authenticated" }
  }

  const userId = session.user.id
  if (!productId) {
    return { error: true, message: "Invalid product ID" }
  }
  try {

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    })

    if (!existingItem) {
      return { error: true, message: "Item not found in cart" }
    }

    await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    })

    return { error: false, message: "Successfully removed from cart" }

  } catch (error) {
    console.error(error)
    return { error: true, message: "Error removing from cart" }
  }
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


export async function getCart() {
  const session = await auth()

  if (!session) {
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