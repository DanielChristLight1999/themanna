"use client"
import React, { useEffect } from 'react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { HomeMenuItem } from './HomeContent'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import useCartStore from '@/stores/cartstore'
import { Minus, Plus } from 'lucide-react'
import { useReadLocalStorage } from 'usehooks-ts'
import { getCartFromLanding } from '@/actions/cartactions'
import { menusectiondata } from '@/lib/home-data/getlandingpage'

const MenuSection = ({ menuItems, isVisible }: { menuItems: HomeMenuItem[], isVisible: boolean }) => {
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
    const handleIncrement = async (item: HomeMenuItem) => {
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

    return (
        <section id="menu" className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">{menusectiondata.title}</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">{menusectiondata.description}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {menuItems.map((item, index) => {
                        const itemInCart = getItem(item.id.toString())
                        return (
                            <Card
                                key={item.id}
                                className={`group hover:shadow-xl p-0 transition-all duration-300 transform hover:-translate-y-2 ${isVisible ? "animate-fade-in" : ""}`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <CardContent className="p-0 flex flex-col h-full justify-between">
                                    <div className="relative overflow-hidden rounded-t-lg">
                                        <Image
                                            src={item.image}
                                            width={500}
                                            height={500}
                                            alt={item.name}
                                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <Badge className="absolute top-4 left-4 bg-orange-500 text-white">{item.category}</Badge>
                                    </div>
                                    <div className="p-6 ">
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-orange-500 transition-colors">
                                            {item.name}
                                        </h3>
                                        <p className="text-gray-600 mb-4">{item.description || ""}</p>
                                        <div className='flex items-end justify-between'>
                                            <span className="text-2xl font-bold text-orange-500">{formatPrice(item.price)}</span>
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
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* <div className="text-center mt-12">
                    <Button size="lg" className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-4">
                        {menusectiondata.cta}
                    </Button>
                </div> */}
            </div>
        </section>
    )
}

export default MenuSection