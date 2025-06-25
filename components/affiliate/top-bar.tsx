import { SidebarTrigger } from "@/components/ui/sidebar"
import ProfileDropdown from "./profile-dropdown"
import { getAffiliateSettingsData } from "@/lib/affiliate-data/get-settings-data"
import { formatPrice } from "@/lib/utils"

export async function TopBar() {
  const {totalEarnings, affiliateDetails} = await getAffiliateSettingsData()
  return (
    <header className="border-b border-emerald-200 bg-white/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="text-emerald-600 hover:bg-emerald-50" />
        </div>

        <div className="flex items-center space-x-4">
          {/* Earnings Summary */}
          <div className="hidden sm:flex items-center space-x-4 text-sm">
            <div className="text-right">
              <p className="text-gray-600">Total Earnings</p>
              <p className="font-bold text-emerald-600">{formatPrice(totalEarnings)}</p>
            </div>
          </div>

          {/* Notifications */}
          {/* <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-emerald-50 hover:text-emerald-600">
            <Bell className="h-5 w-5" />
          </Button> */}

          {/* Profile Dropdown */}
          <ProfileDropdown name={affiliateDetails.name || ""} />
          
        </div>
      </div>
    </header>
  )
}
