"use server"

import { auth } from "@/auth";
import prisma from "@/db";
import { RestaurantInfo, Role } from "@/lib/generated/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function updateRestaurantInfo(data: RestaurantInfo) {
    try {
        const session = await auth();
        if (!session) return { error: true, message: 'Unauthorized' }
        const { id, name, description, address, phone, email, website, logo } = data

        await prisma.restaurantInfo.update({
            where: {
                id: id
            },
            data: {
                name,
                description,
                address,
                phone,
                email,
                website,
                logo,
            },
        })
        return { error: false, message: 'Restaurant info updated successfully' }
    } catch (error) {
        return { error: true, message: 'Failed to update restaurant info' }
    }

}

// export async function updateDeliverySettings(data: {
//     id: number;
//     defaultDeliveryFee: number;
//     minimumOrderAmount: number;
//     estimatedDeliveryTime: number;
//     deliveryRadius: number;
// }) {
//     try {
//         const session = await auth();
//         if (!session) return { error: true, message: 'Unauthorized' }

//         await prisma.deliverySetting.update({
//             where: { id: 1 }, // Assuming there's only one delivery setting
//             data,
//         });

//         return { error: false, message: 'Delivery settings updated successfully' };
//     } catch (error) {
//         console.error("Error updating delivery settings:", error);
//         return { error: true, message: 'Failed to update delivery settings' };
//     }
// }



// Define the schema to validate input from the frontend
const deliverySettingsSchema = z.object({
    enableDelivery: z.boolean(),
    enablePickup: z.boolean(),
    defaultDeliveryFee: z.number().min(1),
    minimumOrderAmount: z.number().min(1),
    estimatedDeliveryTime: z.number().min(1),
    deliveryRadius: z.number().min(1),
    zones: z.array(
        z.object({
            name: z.string().min(1),
            fee: z.number().min(1),
        })
    ),
})

export type DeliverySettingsInput = z.infer<typeof deliverySettingsSchema>

export async function updateDeliverySettings(input: DeliverySettingsInput) {
    const validated = deliverySettingsSchema.safeParse(input)
    if (!validated.success) {
        return { error: true, message: "Invalid input data" }
    }

    try {
        const existingSetting = await prisma.deliverySetting.findFirst({
            orderBy: { id: "asc" },
        })

        if (!existingSetting) {
            // Create new setting if not exists
            const newSetting = await prisma.deliverySetting.create({
                data: {
                    enableDelivery: input.enableDelivery,
                    enablePickup: input.enablePickup,
                    defaultDeliveryFee: input.defaultDeliveryFee,
                    minimumOrderAmount: input.minimumOrderAmount,
                    estimatedDeliveryTime: input.estimatedDeliveryTime,
                    deliveryRadius: input.deliveryRadius,
                    zones: {
                        create: input.zones,
                    },
                },
            })

            return { error: false, message: "Delivery settings created", data: newSetting }
        } else {
            // Update setting
            await prisma.deliverySetting.update({
                where: { id: existingSetting.id },
                data: {
                    enableDelivery: input.enableDelivery,
                    enablePickup: input.enablePickup,
                    defaultDeliveryFee: input.defaultDeliveryFee,
                    minimumOrderAmount: input.minimumOrderAmount,
                    estimatedDeliveryTime: input.estimatedDeliveryTime,
                    deliveryRadius: input.deliveryRadius,
                },
            })

            // Remove existing zones and recreate
            await prisma.deliveryZone.deleteMany({
                where: { settingId: existingSetting.id },
            })

            await prisma.deliveryZone.createMany({
                data: input.zones.map((zone) => ({
                    name: zone.name,
                    fee: zone.fee,
                    settingId: existingSetting.id,
                })),
            })

            return { error: false, message: "Delivery settings updated" }
        }
    } catch (err) {
        console.error("❌ Error updating delivery settings:", err)
        return { error: true, message: "Failed to update delivery settings" }
    }
}


export type PaymentSettingsType = {
    enableOnlinePayments: boolean
    enableCashPayments: boolean
    enableTransferPayments: boolean
    taxRate: number
    serviceCharge: number
}



export async function updatePaymentSettings(settings: PaymentSettingsType) {
    const session = await auth();
    if (!session) return { error: true, message: 'Unauthorized' }

    try {
        await prisma.setting.upsert({
            where: { key: "payment_settings" },
            create: {
                key: "payment_settings",
                value: JSON.stringify(settings),
                description: "Settings for available payment methods and tax config",
            },
            update: {
                value: JSON.stringify(settings),
            }
        })
        return { error: false, message: "Payment settings updated successfully" };
    } catch (error) {
        console.error("Error updating payment settings:", error);
        return { error: true, message: "Failed to update payment settings" };

    }
}
export async function getRolePermissions(role: Role) {
  const record = await prisma.permission.findUnique({ where: { role } })
  return record ? (record.settings as any) : null
}

export async function saveRolePermissions(role: Role, settings: Record<string, Record<string, boolean>>) {
  try {
    await prisma.permission.upsert({
      where: { role },
      update: { settings },
      create: { role, settings },
    })

    revalidatePath("/settings") // optional
    return { success: true, message: "Permissions saved successfully" }
  } catch (err) {
    console.error(err)
    return { error: true, message: "Failed to save permissions" }
  }
}