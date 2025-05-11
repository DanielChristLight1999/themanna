import { Headset } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const Nav = () => {
  return (
    <div className='flex bg-red-500 w-full items-center border-2 border-red-500 justify-between'>
        <Image src={"/images/themanalogo.png"} width={100} height={100} alt="Themana Logo" />
        <Headset />
    </div>
  )
}

export default Nav