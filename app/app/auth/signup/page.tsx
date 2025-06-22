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
    <div className='h-full w-full'>
        <SignupForm />
    </div>
  )
}

export default page