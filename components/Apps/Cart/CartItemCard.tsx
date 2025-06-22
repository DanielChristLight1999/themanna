"use client"
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import useCartStore, { CartItem } from '@/stores/cartstore';
import { Minus, Plus, TrashIcon } from 'lucide-react';
import Image from 'next/image'
import React from 'react'

// interface CartItemCardProps {
//     item: {
//         product: {
//             name: string;
//             image: string | null;
//             price: number;
//         };
//         id: string;
//         quantity: number;
//     }
// }
const CartItemCard = ({ item }: {item: CartItem}) => {
    const increment = useCartStore((state) => state.increment)
    const decrement = useCartStore((state) => state.decrement)
    const deleteItem = useCartStore((state) => state.delete)
    const handleIncrement = () => {
        const data = {
            productId: item.productId,
            name: item.name,
            image: item.image,
            price: item.price,
        }
        increment(data)
    }

    return (
        <div className='flex md:flex-row md:gap-6 flex-col md:border-b md:border-0 border shadow md:shadow-none bg-white md:rounded-none rounded-xl p-4 '>
            <div>
                
            </div>
            <div className='flex w-full'>
                <div className='flex gap-4 w-full items-center'>
                    <div className='w-8 h-8 overflow-hidden'>
                        <Image width={1000} height={1000} src={item.image || "/images/defaultfoodimage.png"} alt={item.name} className='w-full h-full rounded-full object-cover' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <h1 className=' font-semibold'>{item.name}</h1>
                        <p className='text-sm text-pink-500 font-semibold'>{formatPrice(item.price)}</p>
                    </div>
                </div>
                <div className='flex flex-col gap-2 items-end'>
                    <div className='flex shadow items-center bg-gray-300 p-2 rounded-full gap-6'>
                        <Button onClick={() => decrement(item.productId)} asChild variant='ghost' className='p-0 h-5 w-5 md:w-6  md:h-6 rounded-full'>
                            <Minus className=' text-black rounded-full' size={20} />
                        </Button>
                        <span className='text-sm font-semibold'>{item.quantity}</span>
                        <Button onClick={handleIncrement} asChild variant='ghost' className='p-0 h-5 w-5 md:w-6 rounded-full md:h-6'>
                            <Plus className=' text-black rounded-full' size={20} />
                        </Button>
                    </div>
                </div>
            </div>
            <div className='flex md:items-center  justify-end'>
                <Button onClick={() => deleteItem(item.productId)} asChild variant='ghost' className='p-0 w-6 lg:mb-4 rounded-full h-6'>
                    <TrashIcon className=' text-red-500 hover:text-red-600 cursor-pointer' size={20} />
                </Button>
            </div>
        </div>
    )
}

export default CartItemCard