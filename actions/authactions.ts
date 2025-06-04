"use server"

import { auth, signIn, signOut } from "@/auth"
import { addressSchema } from "@/components/Apps/Checkout/new-address-dialog"
import prisma from "@/db"
import { Role } from "@/lib/generated/prisma"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"
import { z } from "zod"

export async function LoginOAuth() {
    await signIn("google", { redirectTo: "http://app.localhost:3000/" })
}

export async function LogOutOAuth(redirectTo?: string) {
    await signOut({ redirectTo: redirectTo || "/auth/login" })
}

export async function SignupUser(email: string, password: string, confirmPassword: string, firstName: string, lastName: string, phone: string) {
    if (!email || !password || !confirmPassword || !firstName || !lastName || !phone) {
        return { error: true, message: "All fields are required" }
    }
    try {

        if (password !== confirmPassword) {
            return { error: true, message: "Passwords do not match" }
        }
        if (!email.includes("@") || email.length === 0) {
            return { error: true, message: "Invalid email" }
        }

        const existinguser = await prisma.user.findUnique({
            where: { email: email }
        })
        if (existinguser) {
            if (existinguser.email === email) {
                return { error: true, message: "Email already in use" }
            }
            if (existinguser.phone === phone) {
                return { error: true, message: "Phone number already in use" }
            }
            return { error: true, message: "Email or phone number already in use" }
        }
        const url = await signIn("credentials", {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            redirect: false,
        })
        console.log("url", url)

        return { error: false, message: "Successfully signed in" }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: true, message: "Invalid email or password" }
                default: return { error: true, message: "Something went wrong" }
            }
        }
        console.error(error)
        return { error: true, message: "Something went wrong" }
    }
}

export async function LoginUser(email: string, password: string) {

    try {
        if (!email || !password) {
            return { error: true, message: "Invalid email or password" }
        }
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!user) {
            return { error: true, message: "Invalid email or password" }
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash as string);
        if (!isMatch) {
            return { error: true, message: "Invalid email or password" }
        }

        const url = await signIn("credentials", {
            email: email,
            password: password,
            redirect: false
        });
        console.log("url", url)
        return { error: false, message: "Successfully signed in" }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: true, message: "Invalid email or password" }
                default: return { error: true, message: "Something went wrong" }
            }
        }
        return { error: true, message: "Something went wrong" }
    }
}

export async function LoginAdmin(email: string, password: string) {
    try {
        const existinguser = await prisma.user.findUnique({
            where: { email: email, role: Role.ADMIN }
        })
        if (!existinguser) {
            return { error: true, message: "Invalid email or password" }
        }
        const isMatch = await bcrypt.compare(password, existinguser.passwordHash as string);
        if (!isMatch) {
            return { error: true, message: "Invalid email or password" }
        }

        const url = await signIn("credentials", {
            email: email,
            password: password,
            redirect: false
        });
        console.log("url", url)
        return { error: false, message: "Successfully signed in" }
    } catch (error) {
        if(error instanceof AuthError){
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: true, message: "Invalid email or password" }
                default: return { error: true, message: "Something went wrong" }
            
            }
        }
        return { error: true, message: "Something went wrong" }
    }
}

export async function Signin() {
    await signIn()
}

export async function getUserAddresses() {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Not authenticated")
    }
    const data = await prisma.address.findMany({
        where: {
            userId: session.user.id
        }
    })
    return data
}

export async function createUserAddress(data: z.infer<typeof addressSchema>) {
    const session = await auth();
    if (!session) {
        return { error: true, message: "User not logged in" }
    }
    const userid = session.user?.id as string

    try {
        const { address, city, state, name, zipCode, isDefault } = data

        await prisma.address.create({
            data: {
                userId: userid,
                label: name,
                street: address,
                city: city,
                state: state,
                postalCode: zipCode,
                isDefault: isDefault
            }
        })
        return {error: false, message: "Successfully added address"}
    } catch (error) {
        console.log(error)
        return {error:true, message: "An error occured try again"}
    }
}