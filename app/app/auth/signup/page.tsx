import { auth } from '@/auth';
import SignupForm from '@/components/Apps/Auth/signupForm'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
  const session = await auth();
    if(session){
      redirect("/")
    }
  return (
    <div className='h-full absolute w-full flex justify-center top-0'>
        <SignupForm />
    </div>
  )
}

export default page