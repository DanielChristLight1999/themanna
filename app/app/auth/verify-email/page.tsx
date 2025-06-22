import React from 'react'
import VerifyEmailPage from './verify-email-client'
import { redirect } from 'next/navigation'

const page = async ({ searchParams}: { 
  searchParams: Promise<{ email: string}>
}) => {
  const data = await searchParams
  const email = data.email
  if(!email){
    redirect("/auth/login")
  }
  return (
    <VerifyEmailPage email={email} />
  )
}

export default page