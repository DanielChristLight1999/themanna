"use server"

import { auth, signIn, signOut } from "@/auth"
import { addressSchema } from "@/components/Apps/Checkout/new-address-dialog"
import { ProfileFormValues } from "@/components/Apps/profile/profile-summary-card"
import prisma from "@/db"
import { Role } from "@/lib/generated/prisma"
import { toLocalPhoneNumber } from "@/lib/phone-utils"
import { hashPassword } from "@/lib/utils"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"
import { z } from "zod"
import { Resend } from "resend"
import { generateEmailVerificationCode } from "@/lib/emailutils"
import { getRestaurantSettingsNoAdmin } from "@/lib/getsettingsData"
import VerificationCodeEmail from "@/components/EmailTemplates/email-verification"
import redis from "@/lib/redis"

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
            where: { email: email }
        })

        const allowedRoles = new Set<Role>([Role.ADMIN, Role.CASHIER, Role.MANAGER]);

        if (!existinguser || !allowedRoles.has(existinguser.role)) {
            return { error: true, message: "Invalid email or password" };
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
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: true, message: "Invalid email or password" }
                default: return { error: true, message: "Something went wrong" }

            }
        }
        console.log("error", error)
        return { error: true, message: "Something went wrong" }
    }
}

export async function LoginAffiliate(email: string, password: string) {
    try {
        const existinguser = await prisma.user.findUnique({
            where: { email: email },
            include: {affiliate: true}
        })

        const allowedRoles = new Set<Role>([Role.AFFILIATE]);

        if (!existinguser || !allowedRoles.has(existinguser.role)) {
            return { error: true, message: "Invalid email or password" };
        }
        if(!existinguser.isActive){
            return { error: true, message: "Account is not active" }
        }
        if(!existinguser.affiliate){
            return { error: true, message: "Affiliate not found" }
        }
        if(existinguser.affiliate.status !== "APPROVED"){
            return { error: true, message: "Affiliate not approved yet" }
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
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: true, message: "Invalid email or password" }
                default: return { error: true, message: "Something went wrong" }
            }
        }
        console.log("error", error)
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
        return { error: false, message: "Successfully added address" }
    } catch (error) {
        console.log(error)
        return { error: true, message: "An error occured try again" }
    }
}


export async function updateUserPassword(oldPassword: string, password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
        return { error: true, message: "Passwords do not match" }
    }
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Not authenticated")
    }
    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id
        }
    })
    if (!user) {
        return { error: true, message: "Invalid email or password" }
    }
    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash as string);
    if (!isMatch) {
        return { error: true, message: "Invalid email or password" }
    }
    try {
        const hashedPassword = hashPassword(password)
        await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                passwordHash: hashedPassword
            }
        })
        return { error: false, message: "Successfully updated password" }
    } catch (error) {
        console.log(error)
        return { error: true, message: "An error occured try again" }
    }
}

export async function updateUserProfile(data: ProfileFormValues) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: true, message: "Not authenticated" }
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id
        }
    })
    if (!user) {
        return { error: true, message: "Invalid email or password" }
    }
    try {
        await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                name: data.name,
                phone: data.phone
            }
        })
        return { error: false, message: "Successfully updated profile" }
    } catch (error) {
        console.log(error)
        return { error: true, message: "An error occured try again" }
    }
}
export type PhoneNumberValidationResult = {
    valid: boolean
    number: string
    local_format: string
    international_format: string
    country_prefix: string
    country_code: string
    country_name: string
    location: string
    carrier: string
    line_type: "mobile" | "landline" | "voip" | "unknown" | string
}

export async function VerifyPhone(phone: string) {
    try {
        const formatedPhoneNumber = toLocalPhoneNumber(phone)
        if (!formatedPhoneNumber) {
            return { error: true, message: "Invalid phone number" }
        }
        const url = `http://apilayer.net/api/validate?access_key=${process.env.APILAYER_KEY}&number=${formatedPhoneNumber}&country_code=NG&format=1`
        const data = await fetch(url)
        const json: PhoneNumberValidationResult = await data.json()
        if (!json.valid || json.line_type !== "mobile") {
            return { error: true, message: "Invalid phone number" }
        }
        return { error: false, message: "Phone number verified", valid: true }
    } catch (error) {
        console.log(error)
        return { error: true, message: "An error occured try again" }
    }
}
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string) {
    const key = `verify:cooldown:${email}`

    const existingCooldown = await redis.get(key)
    if (existingCooldown) {
        return { error: true, message: "Please wait before requesting another code." }
    }

    const user = await prisma.user.findUnique({ where: { email: email } })
    if (!user) {
        return { error: true, message: "Invalid Email return and signup" }
    }
    if (user.emailVerified) {
        return { error: true, message: "Email already verified" }
    }
    const userName = user.name as string
    const code = generateEmailVerificationCode()
    await redis.set(key, "1", { ex: 60 }) // 60 seconds cooldown
    await redis.set(`verify:code:${email}`, code, { ex: 600 }) // 10 min code
    const { restaurantInfo } = await getRestaurantSettingsNoAdmin()
    if (!restaurantInfo) {
        return { error: true, message: "An error occured try again" }
    }
    const { name, address, logo } = restaurantInfo
    const companyLogo = logo as string
    try {
        const { data, error } = await resend.emails.send({
            from: 'The Manna Restaurant <noreply@mail.themannafood.com>',
            to: email,
            subject: 'The Mana Email Verification',
            react: VerificationCodeEmail({ username: userName, code: code, companyName: name, companyAddress: address, companyLogo: companyLogo, expiryMinutes: 10 })
        });
        if (error) {
            console.log(error)
            return { error: true, message: "An error occured try again" }
        }
        console.log(data)
        return { error: false, message: "Successfully sent verification email" }
    } catch (error) {
        console.log(error)
        return { error: true, message: "An error occured try again" }
    }
}

export async function verifyEmailCode(email: string, code: string) {
    try {
        const key = `verify:code:${email}`
        const actualCode: string | null = await redis.get(key);
        if (actualCode !== code) {
            return { error: true, message: "Invalid code" }
        }

        await prisma.user.update({
            where: {
                email: email
            },
            data: {
                emailVerified: true
            }
        })
        return { error: false, message: "Successfully verified email" }
    } catch (error) {
        console.log(error)
        return { error: true, message: "An error occured try again" }
    }


}