"use client"
import { Button } from '@/components/ui/button'
import useUIStore from '@/stores/uistore'
import { PlusIcon } from 'lucide-react'
import React from 'react'

const MenuHeader = () => {
    const setisOpen = useUIStore((state) => state.setIsMenuItemDialogOpen)
    return (
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Menu & Inventory</h1>
            <Button onClick={() => setisOpen(true)} className="flex items-center gap-2">
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Product
            </Button>
        </div>
    )
}

export default MenuHeader