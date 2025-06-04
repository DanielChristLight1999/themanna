"use client"
import { LogOutOAuth } from '@/actions/authactions'
import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'
import Image from 'next/image'

const TopNav = () => {
  return (
    <div className='flex items-center justify-between w-full p-6'>
        <Image className='w-32' src={"/images/themanalogo.svg"} width={200} height={200} alt="Themana Logo" />
        <Bell size={32} />
        <Button onClick={async () => await LogOutOAuth()}>Logout</Button>
    </div>
  )
}

export default TopNav