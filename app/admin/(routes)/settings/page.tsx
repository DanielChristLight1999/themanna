import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RestaurantSettings } from "@/components/admin/settings/restaurant-settings"
import { DeliverySettings } from "@/components/admin/settings/delivery-settings"
import { PaymentSettings } from "@/components/admin/settings/payment-settings"
import { UserRolesSettings } from "@/components/admin/settings/user-roles-settings"

export const metadata: Metadata = {
  title: "Settings | The Mana Restaurant Admin",
  description: "Configure settings for The Mana Restaurant",
}

export default function SettingsPage() {
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
          <RestaurantSettings />
        </TabsContent>
        <TabsContent value="delivery" className="pt-6">
          <DeliverySettings />
        </TabsContent>
        <TabsContent value="payment" className="pt-6">
          <PaymentSettings />
        </TabsContent>
        <TabsContent value="users" className="pt-6">
          <UserRolesSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
