"use client";

import React from 'react'
import ReusableAuthForm from '../AuthForm'
import { z } from 'zod'
import { LoginUser } from '@/actions/authactions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})
const fields = [
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'Enter your email',
    },
    {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Enter your password',
    }
]
const LoginForm = () => {
    const router = useRouter()
    const onSubmit = async (values: z.infer<typeof schema>) => {
        const response = await LoginUser(values.email, values.password)
        if (response.error) {
            toast.error(response.message)
        } else {
            toast.success(response.message)
            router.replace("/")
        }
    }
    return (
        <div className='flex flex-col justify-between h-full w-full'>
            <div className='  h-full flex flex-col justify-center items-center'>
                <h1 className='text-4xl text-white font-bold text-center'>Log In</h1>
                <p className='text-center text-white'>Please sign in to your account</p>
            </div>
            <ReusableAuthForm className='border-none' googleLogin={true} type='login' submitButtonText='Login' onSubmit={onSubmit} schema={schema} fields={fields} defaultValues={{ email: "", password: "" }} />
        </div>
    )
}

export default LoginForm