'use server'

import prisma from '@/db'
import { startOfDay, endOfDay } from 'date-fns'

// ✅ Add a product to today's Food of the Day
export async function addFoodOfTheDay(productId: number) {
  const today = startOfDay(new Date())

  try {
    console.log("adding food of the day")
   const food =  await prisma.foodOfTheDay.create({
      data: {
        productId,
        date: today,
      },
      include: {product: {
        include: {
            category: true,
            images: true,
        }
      }}
    })
    console.log("food of the day added", food)
    return { success: true, message: 'Product added to today\'s food of the day', food }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, message: 'Product already set for today', food: null }
    }
    return { success: false, message: error.message || 'Unknown error', food: null }
  }
}

// ✅ Get all foods of the day for today
// export async function getFoodsOfTheDay() {
//   const today = new Date()

//   const foods = await prisma.foodOfTheDay.findMany({
//     where: {
//       date: {
//         gte: startOfDay(today),
//         lt: endOfDay(today),
//       },
//     },
//     include: {
//       product: true,
//     },
//   })

//   return foods
// }

// ✅ Remove a product from today's Food of the Day
export async function removeFoodOfTheDay(productId: number) {
  const today = startOfDay(new Date())

  await prisma.foodOfTheDay.delete({
    where: {
      productId_date: {
        productId,
        date: today,
      },
    },
  })

  return { success: true, message: 'Product removed from today\'s food of the day' }
}

// 🕘 Optional: Get food of the day history
export async function getFoodOfTheDayHistory(limit: number = 30) {
  return await prisma.foodOfTheDay.findMany({
    take: limit,
    orderBy: { date: 'desc' },
    include: { product: true },
  })
}
