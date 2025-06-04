import { auth } from '@/auth'
import prisma from '@/db'
import { redirect } from 'next/navigation'
import React from 'react'
import OrderCard, { OrderCardProps } from './OrderCard'
import Link from 'next/link'
import { OrderStatus } from '@/lib/generated/prisma'

const OrderList = async ({orders}: { orders: OrderCardProps[] }) => {
    
    if(orders.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-medium mb-4">You have no orders</h2>
                <p className="text-muted-foreground mb-6">
                    Start your first order to see your orders here.
                </p>
                <Link href="/" className="text-primary hover:underline">
                    Browse our menu
                </Link>
            </div>
        )
    }
    return (
        <div className='h-screen'>
            {orders.map((order, index) => (
                <OrderCard key={index} order={order} />
            ))}
        </div>
    )
}

export default OrderList