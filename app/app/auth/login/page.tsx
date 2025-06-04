// import { auth } from '@/auth'
import LoginForm from '@/components/Apps/Auth/loginForm'
// import { redirect } from 'next/navigation';
import React from 'react'
const page = async () => {
  // const session = await auth();
  // if(session){
  //   redirect("http")
  // }
  return (
    <div className='h-full absolute w-full top-0'>
      {/* {JSON.stringify(session)} */}
        <LoginForm />
    </div>
  )
}

export default page