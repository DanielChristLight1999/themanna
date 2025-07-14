"use server"
import { auth } from "@/auth"
import { FormDataFlyer } from "@/components/admin/ads/add-flyer-modal"
import prisma from "@/db"

export async function createFlyer(data: FormDataFlyer) {

    const session = await auth();
    if (!session) {
        return { error: true, message: "Not authenticated", data: null }
    }

    try {
        const flyer = await prisma.flyerAd.create({
            data,
        })
        return { error: false, message: "Flyer ad has been created successfully", data: flyer }
    } catch (error) {
        console.error("Error creating flyer:", error)
        return { error: true, message: "Failed to create flyer ad", data: null }
    }

}


export async function updateFlyer(id: number, flyer: FormDataFlyer) {
    try {
        const session = await auth()
        if (!session) {
            return { error: true, message: "Not authenticated", data: null }
        }
        const updatedFlyer = await prisma.flyerAd.update({
            where: {
                id: id
            },
            data: {
                title: flyer.title,
                imageUrl: flyer.imageUrl,
                linkUrl: flyer.linkUrl,
                position: flyer.position,
                isActive: flyer.isActive,
                expiresAt: flyer.expiresAt,
            }
        })
        return { error: false, message: "Flyer ad has been updated successfully", data: updatedFlyer }
    } catch (error) {
        console.error("Error updating flyer:", error)
        return { error: true, message: "Failed to update flyer ad", data: null }
    }
}

export async function deleteFlyer(id: number) {
    try {
        const session = await auth()
        if (!session) {
            return { error: true, message: "Not authenticated", data: null }
        }
        const deletedFlyer = await prisma.flyerAd.delete({
            where: {
                id: id
            }
        })
        return { error: false, message: "Flyer ad has been deleted successfully", data: deletedFlyer }
    } catch (error) {
        console.error("Error deleting flyer:", error)
        return { error: true, message: "Failed to delete flyer ad", data: null }
    }
}


export async function toggleFlyerActive(id: number, isActive: boolean) {
    try {
        const session = await auth()
        if (!session) {
            return { error: true, message: "Not authenticated", data: null }
        }
        const updatedFlyer = await prisma.flyerAd.update({
            where: {
                id: id
            },
            data: {
                isActive: isActive
            }
        })
        return { error: false, message: "Flyer ad has been updated successfully", data: updatedFlyer }
    } catch (error) {
        console.error("Error updating flyer:", error)
        return { error: true, message: "Failed to update flyer ad", data: null }
    }
}