"use client";
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import React from 'react'
type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
interface AuthButtonProps {
    buttonText: string,
    loading: boolean,
    className?: string,
    variant?: ButtonVariant
}
const AuthButton = ({buttonText, loading, className, variant} : AuthButtonProps) => {
  return (
    <Button type="submit" className={className} variant={variant}>
        {loading ? <div className='animate-spin'>
            <LoaderCircle />
        </div> : buttonText}
    </Button>
  )
}

export default AuthButton