import { formatPrice } from '@/lib/utils'
import useUIStore, { FoodItem } from '@/stores/uistore'
import Image from 'next/image'
import React from 'react'

const FoodGrid = ({ foods }: { foods: FoodItem[] }) => {
    const setCurrentFoodItem = useUIStore((state) => state.setCurrentFoodItem)
    const setIsFoodDialogOpen = useUIStore((state) => state.setIsFoodDialogOpen)

    const handleItemClick = (food: FoodItem) => {
        setCurrentFoodItem(food)
        setIsFoodDialogOpen(true)
    }
    return (
        <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {foods.map((food) => (
                <div onClick={() => handleItemClick(food)} key={food.id} className="border rounded-xl shadow hover:shadow-lg transition p-4 cursor-pointer bg-white">
                    <div className="w-full h-40 relative rounded-lg overflow-hidden mb-4">
                        <Image
                            src={food.image || "/images/defaultfoodimage.png"}
                            alt={food.name}
                            fill
                            className="object-cover object-center"
                        />
                    </div>
                    <div className="text-center">
                        <h3 className="font-semibold text-lg">{food.name}</h3>
                        <p className="text-pink-500 font-bold">{formatPrice(food.price)}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default FoodGrid
