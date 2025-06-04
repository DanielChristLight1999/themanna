import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { Minus, MinusCircle, Plus, PlusCircle, PlusIcon, Trash2, TrashIcon } from 'lucide-react';
import Image from 'next/image'
import React from 'react'

interface CartItemCardProps {
    item: {
        product: {
            name: string;
            image: string | null;
            price: number;
        };
        id: string;
        quantity: number;
    }
}
const CartItemCard = ({ item }: CartItemCardProps) => {
    return (
        <div className='flex flex-col border shadow bg-white rounded-xl p-4 '>
            <div className='flex w-full'>
                <div className='flex gap-4 w-full items-center'>
                    <div className='w-8 h-8 overflow-hidden'>
                        <Image width={1000} height={1000} src={item.product.image || "/images/defaultfoodimage.png"} alt={item.product.name} className='w-full h-full rounded-full object-cover' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <h1 className=' font-semibold'>{item.product.name}</h1>
                        <p className='text-sm text-pink-500 font-semibold'>{formatPrice(item.product.price)}</p>
                    </div>
                </div>
                <div className='flex flex-col gap-2 items-end'>
                    <div className='flex shadow items-center bg-gray-300 p-2 rounded-full gap-6'>
                        <Minus className=' text-black rounded-full' size={20} />
                        <span className='text-sm font-semibold'>{item.quantity}</span>
                        <Plus className='text-black rounded-full' size={20} />
                    </div>
                </div>
            </div>
            <div className='flex justify-end'>
                <TrashIcon className='text-red-500 hover:text-red-600 cursor-pointer' size={20} />
            </div>
        </div>
    )
}

export default CartItemCard