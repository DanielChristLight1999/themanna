import prisma from "@/db"
import { z } from "zod"

// Login validation schema
export const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters long"),
})

// Signup validation schema
export const signupSchema = z
    .object({
        firstName: z
            .string()
            .min(1, "First name is required")
            .min(2, "Name must be at least 2 characters long")
            .max(50, "Name must be less than 50 characters")
            .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
        lastName: z
            .string()
            .min(1, "Last name is required")
            .min(2, "Name must be at least 2 characters long")
            .max(50, "Name must be less than 50 characters")
            .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
        email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
        phone: z.string().min(1, "Phone number is required").max(15, "Phone number must be less than 15 characters"),
        password: z
            .string()
            .min(1, "Password is required")
            .min(8, "Password must be at least 8 characters long")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "Password must contain at least one uppercase letter, one lowercase letter, and one number",
            ),
        confirmPassword: z.string().min(1, "Please confirm your password"),
        acceptTerms: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })
// Email verification schema
export const emailVerificationSchema = z.object({
  code: z
    .string()
    .min(1, "Verification code is required")
    .length(6, "Verification code must be exactly 6 characters")
    .regex(/^[A-Z0-9]{6}$/, "Verification code must contain only uppercase letters and numbers"),
})

// Forgot password validation schema
export const forgotPasswordSchema = z.object({
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
})

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>

export async function checkVerifiedEmail(email: string){
    const user = await prisma.user.findUnique({
        where: {
            email: email
        },
    })
    if(!user){
        return false
    }
    if(user.emailVerified){
        return true
    }
    return false
}



