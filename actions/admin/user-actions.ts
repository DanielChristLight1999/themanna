"use server"

import { auth } from "@/auth"
import { adminformSchema } from "@/components/admin/settings/user-roles-settings"
import prisma from "@/db"
import { hashPassword } from "@/lib/utils"
import { z } from "zod"


export async function createUser(data: z.infer<typeof adminformSchema>) {
    const session = await auth()
    if (!session) return { error: true, message: 'Unauthorized' }

    try {
        
        const { name, email, role, password } = data
        const passwordHash = hashPassword(password)
        await prisma.user.create({
            data: {
                name:name,
                email: email,
                passwordHash: passwordHash,
                role: role,
            },
        })
        return {error: false, message: "User created successfully"}
    } catch (error) {
        console.log(error)
        return { error: true, message: "Failed to create user"}
    }
}