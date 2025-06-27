import LoginForm from '@/components/Apps/Auth/loginForm'
import React from 'react'
const page = async ({searchParams}: { searchParams: Promise<{ guestId?: string }> }) => {
  const guestId = (await searchParams).guestId
  return (
    <div className='h-full w-full'>
        <LoginForm guestId={guestId} />
    </div>
  )
}

export default page