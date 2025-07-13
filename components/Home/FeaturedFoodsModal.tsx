"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Minus, Plus, X } from "lucide-react"
import { Featured } from "@/app/admin/(routes)/foods-of-the-day/pageClient"
import Image from "next/image"
import useCartStore from "@/stores/cartstore"
import { formatPrice } from "@/lib/utils"
import { getCartFromLanding } from "@/actions/cartactions"
import { useReadLocalStorage } from "usehooks-ts"

// // Mock Prisma schema types
// interface Image {
//   id: string
//   url: string
//   productId: string
// }

// interface Category {
//   id: string
//   name: string
// }

// interface Product {
//   id: string
//   name: string
//   description: string
//   price: number
//   images: Image[]
//   category: Category | null
// }

// interface FoodOfTheDay {
//   id: string
//   date: string
//   productId: string
//   product: Product
// }

// Mock data shaped like Prisma schema
// const mockFeaturedFoods: FoodOfTheDay[] = [
//   {
//     id: "1",
//     date: new Date().toISOString().split("T")[0],
//     productId: "prod-1",
//     product: {
//       id: "prod-1",
//       name: "Mana Signature Burger",
//       description:
//         "Our award-winning burger with premium beef, aged cheddar, crispy bacon, and our secret sauce on a brioche bun",
//       price: 14.99,
//       images: [{ id: "img-1", url: "/placeholder.svg?height=400&width=400", productId: "prod-1" }],
//       category: { id: "cat-1", name: "Burgers" },
//     },
//   },
//   {
//     id: "2",
//     date: new Date().toISOString().split("T")[0],
//     productId: "prod-2",
//     product: {
//       id: "prod-2",
//       name: "Spicy Buffalo Wings",
//       description: "Crispy chicken wings tossed in our house-made buffalo sauce, served with ranch dipping sauce",
//       price: 11.99,
//       images: [{ id: "img-2", url: "/placeholder.svg?height=400&width=400", productId: "prod-2" }],
//       category: { id: "cat-2", name: "Appetizers" },
//     },
//   },
//   {
//     id: "3",
//     date: new Date().toISOString().split("T")[0],
//     productId: "prod-3",
//     product: {
//       id: "prod-3",
//       name: "Loaded Nachos Supreme",
//       description:
//         "Crispy tortilla chips loaded with melted cheese, jalapeños, sour cream, guacamole, and your choice of protein",
//       price: 13.99,
//       images: [{ id: "img-3", url: "/placeholder.svg?height=400&width=400", productId: "prod-3" }],
//       category: { id: "cat-3", name: "Shareable" },
//     },
//   },
//   {
//     id: "4",
//     date: new Date().toISOString().split("T")[0],
//     productId: "prod-4",
//     product: {
//       id: "prod-4",
//       name: "Chocolate Lava Cake",
//       description: "Warm chocolate cake with a molten center, served with vanilla ice cream and fresh berries",
//       price: 8.99,
//       images: [{ id: "img-4", url: "/placeholder.svg?height=400&width=400", productId: "prod-4" }],
//       category: { id: "cat-4", name: "Desserts" },
//     },
//   },
// ]

interface FeaturedFoodsModalProps {
  isOpen: boolean
  onClose: () => void
  featuredFoods: Featured[]
}

export function FeaturedFoodsModal({ isOpen, onClose, featuredFoods }: FeaturedFoodsModalProps) {
  const cart = useCartStore(state => state.cart)
  const increment = useCartStore(state => state.increment)
  const decrement = useCartStore(state => state.decrement)
  const getItem = useCartStore(state => state.getItem)
  const guestId = useReadLocalStorage<string>("guestId")
  const setCart = useCartStore(state => state.setCart)

  useEffect(() => {
    async function checkForExistingCart() {
      if (guestId) {
        const response = await getCartFromLanding(guestId)
        if (response.error) {
          return
        }
        const cartItems = response.cartItems
        if (!cartItems) {
          return
        }
        setCart(cartItems)
      }
    }
    checkForExistingCart()
  }, [guestId])
  const handleIncrement = async (item: Featured) => {
    const data = {
      productId: item.productId.toString(),
      name: item.product.name,
      image: item.product.images[0].url,
      price: item.product.price,
    }
    await increment(data)
  }

  const handleDecrement = async (id: string) => {
    await decrement(id)
  }
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full h-[70vh] max-w-4xl bg-white rounded-lg shadow-2xl animate-in zoom-in-95 duration-300  mx-4">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Todays Featured Foods</h2>
              <p className="text-sm md:text-base text-white/80">Handpicked specialties just for you</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full h-8 w-8 md:h-10 md:w-10"
            >
              <X className="h-4 w-4 md:h-6 md:w-6" />
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <div className=" h-full">
          <Carousel className="h-full">
            <CarouselContent className="max-h-[70vh] ">
              {featuredFoods.map((item) => {
                const itemInCart = getItem(item.productId.toString())
                return (
                  <CarouselItem key={item.id} className="flex items-stretch  w-full h-full min-h-[400px]">
                    <div className="flex flex-col lg:flex-row w-full h-full">
                      {/* Image Section */}
                      <div className="lg:w-1/2 h-64 lg:h-full relative overflow-hidden rounded-lg">
                        <Image
                          width={1000}
                          height={1000}
                          src={item.product.images[0]?.url || "/placeholder.svg?height=400&width=400"}
                          alt={item.product.name}
                          className=" w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:hidden" />
                      </div>

                      {/* Content Section */}
                      <div className="lg:w-1/2 p-4 md:p-6 border flex flex-col justify-center space-y-4 md:space-y-6">
                        <div className="space-y-3 md:space-y-4">
                          {item.product.category && (
                            <Badge className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 text-sm font-medium w-fit">
                              {item.product.category.name}
                            </Badge>
                          )}

                          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
                            {item.product.name}
                          </h3>

                          <p className="text-base md:text-lg text-gray-600 leading-relaxed">{item.product.description}</p>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <span className="text-2xl md:text-3xl font-bold text-orange-500">
                              {formatPrice(item.product.price)}
                            </span>
                            <div className="flex items-center justify-between mt-6">
                              {itemInCart ? (
                                <div className="flex items-center gap-2">
                                  <Button onClick={() => handleDecrement(itemInCart.productId)} size="icon">
                                    <Minus />
                                  </Button>

                                  <span className="text-lg font-semibold">{itemInCart.quantity}</span>
                                  <Button size="icon" onClick={() => handleIncrement(item)}>
                                    <Plus />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  onClick={() => handleIncrement(item)}
                                  className=" px-6 bg-orange-500 hover:bg-orange-600"
                                >
                                  Add to Cart
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>

            {/* Navigation Arrows */}
            <CarouselPrevious className="left-4 bg-white/90 hover:bg-white text-gray-800 border-0 shadow-lg transition-all duration-200 hover:scale-110" />
            <CarouselNext className="right-4 bg-white/90 hover:bg-white text-gray-800 border-0 shadow-lg transition-all duration-200 hover:scale-110" />
          </Carousel>
        </div>
      </div>
    </div>
  )
}

interface FloatingFoodButtonProps {
  onClick: () => void
}

export function FloatingFoodButton({ onClick }: FloatingFoodButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-14 h-14 md:w-16 md:h-16 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-in slide-in-from-bottom-4 z-40 hover:scale-110"
      size="icon"
    >
      <span className="text-xl md:text-2xl">🍽️</span>
    </Button>
  )
}

