"use client"

import { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React from 'react'
import useCartStore from '@/stores/cartstore'
import { playWrite } from '@/lib/fonts'
import useUIStore from '@/stores/uistore'

const MenuHeader = () => {
  const loadCart = useCartStore((state) => state.loadCart)
  const setSearchQuery = useUIStore((state) => state.setSearchQuery)
  const searchQuery = useUIStore((state) => state.searchQuery)
  useEffect(() => { loadCart() }, [loadCart])
  return (
    <div className='p-6 flex flex-col gap-8'>
      <h1 className={`text-4xl md:text-6xl py-2 md:py-10 ${playWrite.className} font-semibold gradient-text-new`}>Eat <span className='text-sm md:text-xl'>Healthy</span>, Live <span className='text-sm md:text-xl'>Healthy</span>...</h1>

      <div className='flex border items-center gap-4 rounded-full p-4'>
        <Search size={29} />
        <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder='Search' className='w-full h-12 rounded-full focus-visible:ring-0 border-none shadow-none border-gray-300' />
      </div>
    </div>
  )
}

export default MenuHeader