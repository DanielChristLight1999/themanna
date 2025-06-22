"use server"

import { auth } from "@/auth";
import { addressFormSchema } from "@/components/Apps/settings/address-book";
import prisma from "@/db";
import { z } from "zod";


export async function createNewAddress(data: z.infer<typeof addressFormSchema>) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: true, message: "Not authenticated" }
    }

    const userId = session.user.id
    try {
        const { label, street, city, state, zipCode } = data

        await prisma.address.create({
            data: {
                userId: userId,
                label: label,
                street: street,
                city: city,
                state: state,
                postalCode: zipCode,
            }
        })
        return { error: false, message: "Successfully added address" }
    } catch (error) {
        console.log(error)
        return { error: true, message: "An error occured try again" }
    }
}

export async function updateAddress(id:string, data: z.infer<typeof addressFormSchema>) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: true, message: "Not authenticated" }
    }

    const userId = session.user.id
    try {
        const { label, street, city, state, zipCode } = data

        await prisma.address.update({
            where: {
                id: id,
                userId: userId,
            },
            data: {
                label: label,
                street: street,
                city: city,
                state: state,
                postalCode: zipCode,
            }
        })
        return { error: false, message: "Successfully updated address" }
    } catch (error) {
        console.log(error)
        return { error: true, message: "An error occured try again" }
    }
}


export async function deleteAddress(id:string) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: true, message: "Not authenticated" }
    }

    const userId = session.user.id
    try {
        await prisma.address.delete({
            where: {
                id: id,
                userId: userId,
            },
        })
        return { error: false, message: "Successfully deleted address" }
    } catch (error) {
        console.log(error)
        return { error: true, message: "An error occured try again" }
    }
}

export async function setDefaultAddress(id: string) {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Not authenticated")
    }
    try {
        const existingaddress = await prisma.address.findUnique({
            where: {
                id: id,
                userId: session.user.id,
            },
        })
        if (!existingaddress) {
            return { error: true, message: "Invalid address" }
        }
        if (existingaddress.isDefault) {
            return { error: true, message: "Address is already default" }
        }

       const currentDefaultAddress = await prisma.address.findFirst({
            where: {
                userId: session.user.id,
                isDefault: true,
            },
        })

        if (currentDefaultAddress) {
            await prisma.address.update({
                where: {
                    id: currentDefaultAddress.id,
                },
                data: {
                    isDefault: false,
                },
            })
        }

        await prisma.address.update({
            where: {
                id: id,
            },
            data: {
                isDefault: true,
            },
        })

        return { error: false, message: "Successfully set address as default" }
    } catch (error) {
        console.log(error)
        return { error: true, message: "An error occured try again" }
    }
}