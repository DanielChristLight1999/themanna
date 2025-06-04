import { auth, signIn } from '@/auth'
import FoodMenu from '@/components/Apps/MainMenu/FoodMenu'
import GoToCart from '@/components/Apps/MainMenu/GoToCart'
import MenuHeader from '@/components/Apps/MainMenu/MenuHeader'
import React from 'react'

const page = async () => {
  const session = await auth()
  if(!session){
    await signIn()
  }
  return (
    <div className='relative h-full'>
      {/* {JSON.stringify(session)} */}
      <MenuHeader />
      <FoodMenu />
      <GoToCart />
    </div>
  )
}

export default page