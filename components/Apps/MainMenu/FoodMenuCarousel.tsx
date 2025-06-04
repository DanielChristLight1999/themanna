"use client"
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { formatPrice } from '@/lib/utils'
import useUIStore, { FoodItem } from '@/stores/uistore'
import Image from 'next/image'
import React from 'react'
export const foodlist = [
    {
        name: "Chicken Tikka",
        category: "main",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        price: 10000,
        rating: 4.5,
        description: "Chicken Tikka is a popular Indian dish made with marinated chicken pieces cooked in a tandoor oven. It is usually served with naan, rice, and raita.",
    },
    {
        name: "Mango Lassi",
        category: "drinks",
        image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054",
        price: 4250,
        rating: 4.8,
        description: "Mango Lassi is a refreshing Indian yogurt drink blended with ripe mangoes and a touch of cardamom.",
    },
    {
        name: "Margherita Pizza",
        category: "main",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: 12000,
        rating: 4.3,
        description: "Classic Italian pizza with fresh tomato sauce, mozzarella cheese, and basil leaves on a crispy crust.",
    },
    {
        name: "French Fries",
        category: "snacks",
        image: "https://images.unsplash.com/photo-1630431341973-02e1b662ec35?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: 5000,
        rating: 4.1,
        description: "Crispy golden French fries, lightly salted and perfect as a side or snack.",
    },
    {
        name: "Chocolate Lava Cake",
        category: "desserts",
        image: "https://images.unsplash.com/photo-1665556387816-cba60197beec?q=80&w=2130&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: 6000,
        rating: 4.9,
        description: "Warm chocolate cake with a gooey molten center, served with a scoop of vanilla ice cream.",
    },
    {
        name: "Iced Matcha Latte",
        category: "drinks",
        image: "https://images.unsplash.com/photo-1559001724-fbad036dbc9e?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: 5500,
        rating: 4.6,
        description: "Chilled matcha green tea blended with milk and sweetened lightly for a refreshing drink.",
    },
]

const FoodMenuCarousel = ({ foodsbycategory }: { foodsbycategory: FoodItem[] }) => {
    const setCurrentFoodItem = useUIStore((state) => state.setCurrentFoodItem)
    const setIsFoodDialogOpen = useUIStore((state) => state.setIsFoodDialogOpen)
    const handleCarouselItemClick = (food: FoodItem) => {
        setCurrentFoodItem(food)
        setIsFoodDialogOpen(true)
    }
    
    return (

        <Carousel>
            <CarouselContent className='gap-4 ml-6 py-6'>
                {foodsbycategory.map((food, index) => (
                    <CarouselItem onClick={() => handleCarouselItemClick(food)} className='shadow-none relative h-80 flex flex-col justify-end items-center p-0 gap-4 basis-1/2' key={index}>
                        <div className='rounded-full absolute border top-0 w-32 shadow-md h-32 overflow-hidden'>
                            <Image width={1000} height={1000} src={food.image || "/images/defaultfoodimage.png"} alt={food.name} className='w-full h-full object-center object-cover' />
                        </div>
                        <div className='flex border flex-col rounded-3xl shadow-md w-full justify-end h-64 text-center items-center '>
                            <div className='py-4 h-2/3 px-6 flex flex-col justify-between'>
                                <h1 className='text-2xl font-bold'>{food.name}</h1>
                                <p className='text-lg font-semibold text-pink-500'>{formatPrice(food.price)}</p>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}

export default FoodMenuCarousel