import Image from 'next/image'
import React from 'react'

const Layout = (
    { children } : Readonly<{children: React.ReactNode}>
) => {
  return (
    <main className='relative bg-[#121223] h-screen '>
      <div className='w-full top-0 left-0'>
        <Image className='w-full object-cover' src={"/images/bgasset.svg"} width={500} height={500} alt="bg asset" />
      </div>
        {children}
    </main>
  )
}

export default Layout