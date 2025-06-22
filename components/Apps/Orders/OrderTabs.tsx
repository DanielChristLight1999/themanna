import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'
import CartList from '../Cart/CartList'
import CartSummary from '../Cart/CartSummary'
import OrderList from './OrderList'
import prisma from '@/db'
import { getRestaurantSettingsNoAdmin } from '@/lib/getsettingsData'

const OrdersTabs = async ({ userId }: { userId: string }) => {
    const ongoingOrders = await prisma.order.findMany({
        where: {
            customerId: userId,
            status: {
                in: ['PENDING', 'CONFIRMED', 'IN_TRANSIT']
            }
        },
        select: {
            id: true,
            placedAt: true,
            totalAmount: true,
            status: true,
            address: { select: { label: true, street: true, city: true, state: true, postalCode: true } },
            deliveryFee: true,
            payment: { select: { method: true } },
            items: {
                select: {
                    product: { select: { name: true } },
                    quantity: true,
                    unitPrice: true
                }
            }
        }
    })

     const completedOrders = await prisma.order.findMany({
        where: {
            customerId: userId,
            status: {
                in: ['DELIVERED', 'CANCELLED']
            }
        },
        select: {
            id: true,
            placedAt: true,
            totalAmount: true,
            status: true,
            address: { select: { label: true, street: true, city: true, state: true, postalCode: true } },
            deliveryFee: true,
            payment: { select: { method: true } },
            items: {
                select: {
                    product: { select: { name: true } },
                    quantity: true,
                    unitPrice: true
                }
            }
        }
    })
    const {paymentSettings} = await getRestaurantSettingsNoAdmin()
    const taxRate = paymentSettings?.taxRate || 0

    return (
        <Tabs defaultValue='cart' className=' p-6'>
            <TabsList className='h-14 p-2  w-full'>
                <TabsTrigger value='cart'>Cart</TabsTrigger>
                <TabsTrigger value='ongoing'>Ongoing</TabsTrigger>
                <TabsTrigger value='completed'>Completed</TabsTrigger>
            </TabsList>
            <TabsContent className='flex flex-col gap-6' value='cart'>
                <CartList />
                <CartSummary taxRate={taxRate} />
            </TabsContent>
            <TabsContent value='ongoing'>
                <OrderList orders={ongoingOrders} />
            </TabsContent>
            <TabsContent value='completed'>
                <OrderList orders={completedOrders} />
            </TabsContent>
        </Tabs>
    )
}

export default OrdersTabs