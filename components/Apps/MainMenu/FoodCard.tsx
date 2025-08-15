import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { CartItem } from '@/stores/cartstore'
import { FoodItem } from '@/stores/uistore'
import { Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const FoodCard = ({ itemInCart, item, index, handleIncrement, handleDecrement }: { itemInCart?: CartItem, item: FoodItem, index: number, handleIncrement: (item: FoodItem) => void, handleDecrement: (id: string) => void }) => {
    return (
        <Card
            key={item.id}
            className={`group hover:shadow-xl p-0 transition-all duration-300 transform hover:-translate-y-2`}
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <CardContent className="p-0 flex flex-col h-full justify-between">
                <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                        src={item.image || ""}
                        width={500}
                        height={500}
                        alt={item.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    {/* Dark Overlay when Sold Out */}
                    {item.stock <= 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white text-lg font-bold uppercase tracking-widest">
                                Sold Out
                            </span>
                        </div>
                    )}
                    {/* <Badge className="absolute top-4 left-4 bg-orange-500 text-white">{item.category}</Badge> */}
                </div>
                <div className="p-6 ">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-orange-500 transition-colors">
                        {item.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{item.description || ""}</p>
                    <div className='flex flex-col items-start justify-between'>
                        <span className="text-2xl font-bold text-orange-500">{formatPrice(item.price)}</span>
                        <div className="flex items-center justify-between mt-6">
                            {itemInCart ? (
                                <div className="flex items-center gap-2">
                                    <Button onClick={() => handleDecrement(itemInCart.productId)} size="icon">
                                        <Minus />
                                    </Button>

                                    <span className="text-lg font-semibold">{itemInCart.quantity}</span>
                                    <Button disabled = {item.stock <= 0} size="icon" onClick={() => handleIncrement(item)}>
                                        <Plus />
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    disabled = {item.stock <= 0}
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
}

export default FoodCard