import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'
import FoodMenuCarousel from './FoodMenuCarousel'
import FoodDialog from './FoodDialog'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getCategories, getProducts } from '@/lib/getData'
// const foodsbycategory = [
//     {
//         name: "All",
//         id: "all",
//     },
//     {
//         name: "Drinks",
//         id: "drinks",
//     },
//     {
//         name: "Desserts",
//         id: "desserts",
//     },
//     {
//         name: "Snacks",
//         id: "snacks",
//     }
// ]
// interface ProductItem {
//     name: string;
//     id: string;
//     image: string;
//     price: number;
//     rating: number;
//     description: string;
// }
const FoodMenu = async () => {
    const session = await auth()
    if(!session?.user?.id){
        redirect("/auth/login")
    }
    const products = await getProducts()
    const categories = await getCategories()

    return (
        <div>
            <Tabs defaultValue='all'>
                <TabsList className='w-full max-w-100 ml-2 pl-22 bg-transparent overflow-auto flex items-center gap-4 '>
                    <TabsTrigger className={` data-[state=active]:border-pink-500 rounded-none data-[state=active]:text-pink-500  text-xl text-gray-500`} value={"all"}>All</TabsTrigger>
                    {categories.map((category) => (
                        <TabsTrigger className={` data-[state=active]:border-pink-500 rounded-none data-[state=active]:text-pink-500  text-xl text-gray-500`} key={category.id} value={category.id}>{category.name}</TabsTrigger>
                    ))}
                </TabsList>
                <TabsContent value={"all"}>
                    <FoodMenuCarousel foodsbycategory={products} />
                </TabsContent>
                {categories.map((category) => {
                    const foodsbycategory = products.filter((product) => product.category.id === category.id)
                    return (<TabsContent key={category.id} value={category.id}>
                        <FoodMenuCarousel foodsbycategory={foodsbycategory} />
                    </TabsContent>)
                })}
            </Tabs>
            <FoodDialog />
        </div>
    )
}

export default FoodMenu