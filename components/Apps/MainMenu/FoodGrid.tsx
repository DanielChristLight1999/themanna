import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import useCartStore from '@/stores/cartstore'
import useUIStore, { FoodItem } from '@/stores/uistore'
import { Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import FoodCard from './FoodCard'

const FoodGrid = ({ foods, category }: { foods: FoodItem[], category: string }) => {
    const cart = useCartStore(state => state.cart)
    const increment = useCartStore(state => state.increment)
    const decrement = useCartStore(state => state.decrement)
    const getItem = useCartStore(state => state.getItem)
    const searchQuery = useUIStore(state => state.searchQuery)

    // Filter foods based on search query
   

    const handleIncrement = async (item: FoodItem) => {
        const data = {
            productId: item.id.toString(),
            name: item.name,
            image: item.image,
            price: item.price,
        }
        await increment(data)
    }

    const handleDecrement = async (id: string) => {
        await decrement(id)
    }
    const foodsbycategory = category === "all" ? foods : foods.filter(food => food.category.id === category)
     const filteredFoods = foodsbycategory
        ? foodsbycategory.filter(food => food.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : foodsbycategory;
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {filteredFoods.length > 0 ? filteredFoods.map((item, index) => {
                const itemInCart = getItem(item.id.toString())
                return (
                    <FoodCard key={index} itemInCart={itemInCart} item={item} index={index} handleIncrement={handleIncrement} handleDecrement={handleDecrement} />
                    
                )
            }) : (
                <div className="text-center">
                    <h3 className="font-semibold text-gray-500 text-lg">No products found</h3>
                </div>
            )}
        </div>
    )
}

export default FoodGrid
