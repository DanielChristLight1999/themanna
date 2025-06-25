"use server"

import prisma from "@/db";
import { generateReferralCode, hashPassword } from "@/lib/utils";
import { SignupFormData } from "@/lib/validations";
import { sendAffiliatePendingEmail } from "./email-actions";
import { VerifyPhone } from "../authactions";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";


export async function createAffiliate(data: SignupFormData) {
    try {
        const { firstName, lastName, phone, email, password } = data

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (existingUser) {
            return { error: true, message: "User already exists" }
        }
        const existingPhone = await prisma.user.findFirst({
            where: { phone: phone }
        })
        if (existingPhone) {
            return { error: true, message: "Phone number already exists" }
        }
        const isValidPhone = await VerifyPhone(phone);
        if (isValidPhone.error || !isValidPhone.valid) {
            return { error: true, message: isValidPhone.message }
        }
        const hashedPassword = hashPassword(password);
        const newUser = await prisma.user.create({
            data: {
                name: `${firstName} ${lastName}`,
                email: email,
                passwordHash: hashedPassword,
                phone: phone,
                role: "AFFILIATE"

            }
        })
        const referralCode = generateReferralCode()
        await prisma.affiliate.create({
            data: {
                userId: newUser.id,
                referralCode: referralCode
            }
        })
        await sendAffiliatePendingEmail({
            name: firstName + " " + lastName,
            to: email
        })

        return {error: false, message: "Affiliate created successfully check your email"}
    } catch (error) {
        console.log(error)
        return { error: true, message: "An error occured try again" }
    }
}


export async function deleteAffiliate(){
    try {
        const session = await auth()
        if (!session) {
            return { error: true, message: "User not logged in" }
        }
        const affiliate = await prisma.affiliate.findUnique({
            where: {
                userId: session.user.id
            }
        })

        if (!affiliate) {
            return { error: true, message: "Invalid affiliate" }
        }
        await prisma.user.update({
            where: {
                id: affiliate.userId
            },
            data: {
                isActive: false,
            }
        })
        await prisma.affiliate.update({
            where: {
                userId: affiliate.userId
            },
            data: {
                status: "DELETED"
            }
        })
        return {error: false, message: "Successfully deleted affiliate"}
    } catch (error) {
        console.log(error)
        return { error: true, message: "An error occured try again" }
    }
}

export async function updateAffiliate(data: { name: string, email: string, phone: string }) {
    try {
        const session = await auth()
        if (!session) {
            return { error: true, message: "User not logged in" }
        }
        const { name, email, phone } = data
        if (!name || !email || !phone) {
            return { error: true, message: "All fields are required" }
        }
        await prisma.affiliate.update({
            where: {
                userId: session.user.id
            },
            data: {
               user: {
                   update: {
                       name: name,
                       email: email,
                       phone: phone
                   }
               }
            }
        })
        return { error: false, message: "Successfully updated affiliate" }
    } catch (error) {
        console.log(error)
        return { error: true, message: "An error occured try again" }
    }
}

export async function updateAffiliateUserPassword(oldPassword: string, password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
        return { error: true, message: "Passwords do not match" }
    }
    const session = await auth()
    if (!session) {
        throw new Error("Not authenticated")
    }
    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
            role: "AFFILIATE"
        }
    })
    if (!user) {
        return { error: true, message: "unAuthorized" }
    }
    const isMatch = bcrypt.compareSync(oldPassword, user.passwordHash as string);
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

export async function createAffiliateBankAccount(data: {bankAccountNumber: string, bankName: string, bankAccountName: string}) {
    try {
        const session = await auth()
        if (!session) {
            return { error: true, message: "User not logged in" }
        }
        const { bankAccountNumber, bankName, bankAccountName } = data
        if (!bankAccountNumber || !bankName || !bankAccountName) {
            return { error: true, message: "All fields are required" }
        }
        const affiliate = await prisma.affiliate.findUnique({
            where: {
                userId: session.user.id
            }
        })

        if (!affiliate) {
            return { error: true, message: "Invalid affiliate" }
        }
         await prisma.affiliatePayoutAccount.create({
            data: {
                affiliateId: affiliate.userId,
                bankName: bankName,
                accountNumber: bankAccountNumber,
                accountName: bankAccountName
            }
        })
        return {error: false, message: "Successfully created affiliate bank account"}
    } catch (error) {
        console.log(error)
        return { error: true, message: "An error occured try again" }
    }
}

export async function updateAffiliateBankAccount(data: {bankAccountNumber: string, bankName: string, bankAccountName: string}) {
    try {
        const session = await auth()
        if (!session) {
            return { error: true, message: "User not logged in" }
        }
        const { bankAccountNumber, bankName, bankAccountName } = data
        if (!bankAccountNumber || !bankName || !bankAccountName) {
            return { error: true, message: "All fields are required" }
        }
        const affiliate = await prisma.affiliate.findUnique({
            where: {
                userId: session.user.id
            }
        })

        if (!affiliate) {
            return { error: true, message: "Invalid affiliate" }
        }
         await prisma.affiliatePayoutAccount.update({
            where: {affiliateId: affiliate.userId},
            data: {
                bankName: bankName,
                accountNumber: bankAccountNumber,
                accountName: bankAccountName
            }
        })
        return {error: false, message: "Successfully created affiliate bank account"}
    } catch (error) {
        console.log(error)
        return { error: true, message: "An error occured try again" }
    }
}