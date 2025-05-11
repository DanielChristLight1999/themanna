import { Headset } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const Nav = () => {
  return (
    <div className='flex w-full lg:px-28 p-6 items-center justify-between'>
        <Image className='w-32' src={"/images/themanalogo.svg"} width={150} height={150} alt="Themana Logo" />
        <Headset size={26} />
    </div>
  )
}

export default Nav