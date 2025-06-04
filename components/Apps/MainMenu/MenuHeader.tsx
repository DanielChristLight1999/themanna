"use client"

import { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React from 'react'
import useCartStore from '@/stores/cartstore'

const MenuHeader = () => {
  const loadCart = useCartStore((state) => state.loadCart)
  useEffect(() => { loadCart() }, [])
  return (
    <div className='p-6 flex flex-col gap-8'>
      <h1 className={`text-5xl font-semibold`}>Delicious <br />food for you</h1>
      <div className='flex border items-center gap-4 rounded-full p-4'>
        <Search size={29} />
        <Input placeholder='Search' className='w-full h-12 rounded-full focus-visible:ring-0 border-none shadow-none border-gray-300' />
      </div>
    </div>
  )
}

export default MenuHeader