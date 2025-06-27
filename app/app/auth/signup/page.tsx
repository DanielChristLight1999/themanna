import { auth } from '@/auth';
import SignupForm from '@/components/Apps/Auth/signupForm'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async ({searchParams}: { searchParams: Promise<{ guestId?: string }> }) => {
  const session = await auth();
    if(session){
      redirect("/")
    }
    const guestId = (await searchParams).guestId
  return (
    <div className='h-full w-full'>
        <SignupForm guestId={guestId} />
    </div>
  )
}

export default page