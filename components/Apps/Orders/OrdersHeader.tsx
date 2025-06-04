"use client"

import useCartStore from "@/stores/cartstore"
import { useEffect } from "react"

const OrdersHeader = () => {
    const loadCart = useCartStore((state) => state.loadCart)

    useEffect(() => { loadCart() }, [])
    return (
        <div className='px-6'>
            <h1 className='text-2xl font-bold'>Orders</h1>
        </div>
    )
}

export default OrdersHeader