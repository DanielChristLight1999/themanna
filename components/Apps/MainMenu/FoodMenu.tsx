"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import FoodMenuCarousel from './FoodMenuCarousel'
import FoodDialog from './FoodDialog'
import FoodGrid from './FoodGrid'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'
import useCartStore from '@/stores/cartstore'
import { useEffect } from 'react'
import { getCartFromLanding, pushCartFromLanding } from '@/actions/cartactions'

interface FoodMenuProps {
    products: {
        id: string;
        name: string;
        category: {
            id: string;
            name: string;
        };
        image: string;
        price: number;
        description: string | null;
    }[];
    categories: {
        id: string;
        name: string;
    }[]
}
const FoodMenu = ({ products, categories }: FoodMenuProps) => {

    const [guestId, setGuestId, removeGuestId] = useLocalStorage<string>("guestId", "", { initializeWithValue: true })
    const setCart = useCartStore(state => state.setCart)
    useEffect(() => {
        async function checkForExistingCart() {
            if (guestId) {
                const response = await pushCartFromLanding(guestId)
                if (response.error) {
                    return
                }
                const cartItems = response.cartItems
                if (!cartItems) {
                    return
                }
                setCart(cartItems)
                removeGuestId()
            }
        }
        checkForExistingCart()
    }, [guestId])
    return (
        <div className="px-4 md:px-10 py-4">
            <Tabs defaultValue="all">
                <TabsList className="w-full overflow-x-auto flex items-center gap-4 bg-transparent mb-4">
                    <TabsTrigger
                        className="data-[state=active]:border-b-2 data-[state=active]:border-pink-500 rounded-none data-[state=active]:text-pink-500 text-base md:text-lg text-gray-500"
                        value="all"
                    >
                        All
                    </TabsTrigger>
                    {categories.map((category) => (
                        <TabsTrigger
                            key={category.id}
                            value={category.id}
                            className="data-[state=active]:border-b-2 data-[state=active]:border-pink-500 rounded-none data-[state=active]:text-pink-500 text-base md:text-lg text-gray-500"
                        >
                            {category.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="all">
                    <FoodMenuCarousel foodsbycategory={products} />
                    <FoodGrid foods={products} />
                </TabsContent>

                {categories.map((category) => {
                
                    return (
                        <TabsContent key={category.id} value={category.id}>
                            <FoodMenuCarousel foodsbycategory={products} />
                            <FoodGrid foods={products} />
                        </TabsContent>
                    )
                })}
            </Tabs>
            <FoodDialog />
        </div>
    )
}

export default FoodMenu