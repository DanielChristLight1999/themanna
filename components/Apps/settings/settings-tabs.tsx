
import { Bell, Home, Settings } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GeneralSettings from "./general-settings"
import AddressBook from "./address-book"
// import NotificationSettings from "./notification-settings"
import { getUserAddresses } from "@/lib/getsettingsData"

export default async function SettingsTabs() {
  const addresses = await getUserAddresses()
  return (
    <Tabs defaultValue="general" className="w-full">
      <div className="flex flex-col sm:flex-row gap-4">
        <TabsList className="sm:flex-col py-1 h-fit md:py-20 md:h-96 sm:w-48 bg-muted/60">
          <TabsTrigger
            value="general"
            className="w-full justify-start gap-2 data-[state=active]:bg-emerald-900 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-950"
          >
            <Settings className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger
            value="addresses"
            className="w-full justify-start gap-2 data-[state=active]:bg-emerald-900 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-950"
          >
            <Home className="h-4 w-4" />
            <span>Address Book</span>
          </TabsTrigger>
          {/* <TabsTrigger
            value="notifications"
            className="w-full justify-start gap-2 data-[state=active]:bg-emerald-900 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-950"
          >
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger> */}
        </TabsList>
        <div className="flex-1 h-120">
          <TabsContent value="general" className="mt-0 h-full">
            <GeneralSettings />
          </TabsContent>
          <TabsContent value="addresses" className="mt-0 h-full">
            <AddressBook addresses={addresses} />
          </TabsContent>
          {/* <TabsContent value="notifications" className="mt-0 h-full">
            <NotificationSettings />
          </TabsContent> */}
        </div>
      </div>
    </Tabs>
  )
}
