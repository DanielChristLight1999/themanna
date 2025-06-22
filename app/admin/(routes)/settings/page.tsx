import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RestaurantSettings } from "@/components/admin/settings/restaurant-settings"
import { DeliverySettings } from "@/components/admin/settings/delivery-settings"
import { PaymentSettings } from "@/components/admin/settings/payment-settings"
import { UserRolesSettings } from "@/components/admin/settings/user-roles-settings"
import { DeliverySettingsType, getRestaurantSettings } from "@/lib/getsettingsData"
import { RestaurantInfo } from "@/lib/generated/prisma"
import { PaymentSettingsType } from "@/actions/admin/settings-actions"
import { auth } from "@/auth"
import { getUserPermissions } from "@/lib/permissions/check-permissions"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Settings | The Mana Restaurant Admin",
  description: "Configure settings for The Mana Restaurant",
}

export default async function SettingsPage() {
    const session = await auth()
    if (!session?.user) return redirect("/auth/login")
    const access = await getUserPermissions()
    const canViewSettings = access?.permissions?.settings?.view
    if (!canViewSettings) return redirect("/unauthorized")

  const {restaurantInfo, deliverySettings, paymentSettings, adminusers} = await getRestaurantSettings()
  return (
    <div className="flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="restaurant" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
        </TabsList>
        <TabsContent value="restaurant" className="pt-6">
          <RestaurantSettings permissions={access?.permissions} restaurant={restaurantInfo as RestaurantInfo} />
        </TabsContent>
        <TabsContent value="delivery" className="pt-6">
          <DeliverySettings permissions={access?.permissions} deliverySettings={deliverySettings as DeliverySettingsType} />
        </TabsContent>
        <TabsContent value="payment" className="pt-6">
          <PaymentSettings permissions={access?.permissions} initialSettings={paymentSettings as PaymentSettingsType} />
        </TabsContent>
        <TabsContent value="users" className="pt-6">
          <UserRolesSettings currentUserpermissions={access.permissions} adminusers={adminusers} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
