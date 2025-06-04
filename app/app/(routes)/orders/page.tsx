import { auth } from '@/auth'
import OrdersHeader from '@/components/Apps/Orders/OrdersHeader'
import OrdersTabs from '@/components/Apps/Orders/OrderTabs'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
    const session = await auth()
    if(!session?.user?.id){
        redirect("/auth/login")
    }
  return (
    <div className='h-screen'>
        <OrdersHeader />
        <OrdersTabs userId={session.user.id as string} />
    </div>
  )
}

export default page