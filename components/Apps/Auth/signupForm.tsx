"use client"
import React from 'react'
import ReusableAuthForm from '../AuthForm'
import { z } from 'zod'
import { SignupUser } from '@/actions/authactions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

// const schema = z.object({
//     email: z.string().email(),
//     password: z.string().min(8),
//     confirmPassword: z.string().min(8),
// })

const schema = z
    .object({
        firstName: z.string().min(1, { message: 'First name is required' }),
        lastName: z.string().min(1, { message: 'Last name is required' }),
        phone: z
            .string()
            .trim()
            .regex(/^\d{11}$/, { message: 'Phone number must be exactly 11 digits' }),
        email: z
            .string()
            .trim()
            .min(1, { message: 'Email is required' })
            .email({ message: 'Invalid email address' }),
        password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters' })
            .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
            .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
            .regex(/[0-9]/, { message: 'Password must contain at least one number' })
            .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' }),
        confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

const fields = [
    {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        placeholder: 'Enter your first name',
    },
    {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        placeholder: 'Enter your last name',
    },
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'Enter your email address',
    },
    {
        name: 'phone',
        label: 'Phone',
        type: 'tel',
        placeholder: 'Enter your phone number',
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
const defaultValues = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
}

const SignupForm = () => {
    const router = useRouter()

    const onSubmit = async (values: z.infer<typeof schema>) => {
        const response = await SignupUser(values.email, values.password, values.confirmPassword, values.firstName, values.lastName, values.phone)
        if (response.error) {
            toast.error(response.message)
            return
        }
        toast.success(response.message)
        router.push("/")
    }
    return (
        <div className='flex h-full flex-col md:items-center gap-4 justify-center  w-full'>
            <div className=' flex flex-col justify-center items-center'>
                <h1 className='text-4xl text-white font-bold text-center'>Sign Up</h1>
                <p className='text-center text-white'>Create an account to access all features</p>
            </div>
            <ReusableAuthForm className='w-full  md:max-w-md' googleLogin={false} type='signup' submitButtonText='Signup' onSubmit={onSubmit} schema={schema} fields={fields} defaultValues={defaultValues} />
        </div>
    )
}

export default SignupForm