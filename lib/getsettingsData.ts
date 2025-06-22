import prisma from "@/db";
import { DeliveryZone, RestaurantInfo, Role, User } from "./generated/prisma";
import { PaymentSettingsType } from "@/actions/admin/settings-actions";
import { auth } from "@/auth";

export interface DeliverySettingsType {
    enableDelivery: boolean,
    enablePickup: boolean,
    defaultDeliveryFee: number,
    minimumOrderAmount: number,
    estimatedDeliveryTime: number,
    deliveryRadius: number,
    zones: DeliveryZone[]
}

export async function getPaymentSettings(): Promise<PaymentSettingsType | null> {
  const record = await prisma.setting.findUnique({
    where: { key: "payment_settings" }
  })

  if (!record) return null

  try {
    const parsed = JSON.parse(record.value) as PaymentSettingsType
    return parsed
  } catch (error) {
    console.error("Failed to parse payment_settings:", error)
    return null
  }
}

// export async function getRolePermissions(role: Role) {
//   const record = await prisma.permission.findUnique({
//     where: { role },
//   })

//   return record?.settings ?? null
// }

export type RestaurantSettingsData = {
    restaurantInfo: RestaurantInfo | null,
    deliverySettings: DeliverySettingsType | null,
    paymentSettings: PaymentSettingsType | null,
}

export async function getRestaurantSettings() {
    const restaurantInfo = await prisma.restaurantInfo.findFirst()
    const deliverySettings = await prisma.deliverySetting.findFirst({
        include: {
            zones: true
        }
    })
    const paymentSettings = await getPaymentSettings()
    const adminusers = await prisma.user.findMany({
        where: {
            role: { in: ["ADMIN", "MANAGER", "CASHIER"] }
        },
    })
    return {restaurantInfo, deliverySettings, paymentSettings, adminusers}
}

export async function getRestaurantSettingsNoAdmin():Promise<RestaurantSettingsData> {
    const restaurantInfo = await prisma.restaurantInfo.findFirst()
    const deliverySettings = await prisma.deliverySetting.findFirst({
        include: {
            zones: true
        }
    })
    const paymentSettings = await getPaymentSettings()
    return {restaurantInfo, deliverySettings, paymentSettings}
}


export async function getUser(id:string){
    const user = await prisma.user.findUnique({
        where: {
            id
        }
    })
    if(!user){
        return null
    }
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
    }
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