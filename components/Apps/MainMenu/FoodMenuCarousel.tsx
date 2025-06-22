"use client"
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { formatPrice } from '@/lib/utils'
import useUIStore, { FoodItem } from '@/stores/uistore'
import Image from 'next/image'
import React from 'react'

const FoodMenuCarousel = ({ foodsbycategory }: { foodsbycategory: FoodItem[] }) => {
    const setCurrentFoodItem = useUIStore((state) => state.setCurrentFoodItem)
    const setIsFoodDialogOpen = useUIStore((state) => state.setIsFoodDialogOpen)

    const handleCarouselItemClick = (food: FoodItem) => {
        setCurrentFoodItem(food)
        setIsFoodDialogOpen(true)
    }

    return (
        <Carousel>
            <CarouselContent className="md:hidden gap-4 ml-4 py-6 px-2 md:px-4">
                {foodsbycategory.map((food, index) => (
                    <CarouselItem
                        onClick={() => handleCarouselItemClick(food)}
                        key={index}
                        className="relative flex flex-col justify-end items-center p-0 gap-4 
                                   basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 cursor-pointer"
                    >
                        <div className="rounded-full absolute border top-0 w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 shadow-md overflow-hidden">
                            <Image
                                width={1000}
                                height={1000}
                                src={food.image || "/images/defaultfoodimage.png"}
                                alt={food.name}
                                className="w-full h-full object-cover object-center"
                            />
                        </div>
                        <div className="flex flex-col rounded-3xl shadow-md w-full justify-end h-56 md:h-60 lg:h-64 text-center items-center border bg-white">
                            <div className="pt-24 px-4 flex flex-col justify-between h-full">
                                <h1 className="text-base md:text-lg lg:text-xl font-bold">{food.name}</h1>
                                <p className="text-sm md:text-base font-semibold text-pink-500">{formatPrice(food.price)}</p>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}

export default FoodMenuCarousel
