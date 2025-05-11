"use client"
import React from 'react'
import ReusableAuthForm from '../AuthForm'
import { z } from 'zod'

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
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
    },
    {
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        placeholder: 'Confirm your password',
    }
]

const SignupForm = () => {
    const onSubmit = async (values: z.infer<typeof schema>) => {
        console.log(values)
    }
    return (
        <div className='flex flex-col justify-between h-full w-full'>
            <div className='  h-full flex flex-col justify-center items-center'>
                <h1 className='text-4xl text-white font-bold text-center'>Sign Up</h1>
                <p className='text-center text-white'>Create an account to access all features</p>
            </div>
            <ReusableAuthForm type='signup' submitButtonText='Signup' onSubmit={onSubmit} schema={schema} fields={fields} defaultValues={{}} />
        </div>
    )
}

export default SignupForm