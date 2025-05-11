import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Play } from 'lucide-react'
import Image from 'next/image'

const Hero = () => {
  return (
    <div className='flex flex-col lg:flex-row lg:justify-between lg:px-28 w-full gap-4 items-center p-4 px-7'>
      <div className='flex-col gap-4 lg:gap-6 flex'>
        <div className='flex gap-4'>
          <h1 className='text-8xl lg:text-9xl text-[#FF7E00] font-black'>Fast</h1>
          <div>
            <h1 className='text-6xl lg:text-8xl font-bold'>Food</h1>
            <h1 className='text-4xl lg:text-6xl font-semibold'>Delivery</h1>
          </div>
        </div>
        <p className='text-xl max-w-2xl text-gray-500'>
          Sed ut perspiciatis unde omnis iste natus sit voluptatem accusantium doloremque laudantium
        </p>
        <div className='flex items-center mt-6 lg:justify-start lg:gap-4 justify-between w-full'>
          <Button className='rounded-full shadow text-xl p-6  h-14' asChild>
            <Link href='http://app.christlight-pc.local:3000/'> Order Now </Link>
          </Button>
          <Button variant={"link"} className=' rounded-full p-6 text-black text-xl h-14' asChild>
            <Link href='/'> 
              <Play fill='black' className='!size-12 bg-white shadow rounded-full p-4' />
              <span>Watch Video</span>
            </Link>
          </Button>
        </div>
      </div>
      <div className='w-full max-w-xl '>
        <Image className='w-full animate-bounce-slow object-cover' src={"/images/foodhero.svg"} width={1000} height={1000} alt="Themana Logo" />
      </div>
    </div>
  )
}

export default Hero