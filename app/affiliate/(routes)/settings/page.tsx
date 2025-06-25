import ProfileInformation from "@/components/affiliate/settings/profile-information"
import PayoutSettings from "@/components/affiliate/settings/payout-settings"
// import NotificationPreferences from "@/components/affiliate/settings/notification-preferences"
import AffiliateDetails from "@/components/affiliate/settings/affiliate-details"
import DeleteAccount from "@/components/affiliate/settings/delete-account"
import { getAffiliateSettingsData } from "@/lib/affiliate-data/get-settings-data"

export default async function Settings() {
  const {totalEarnings, referralCode, affiliateDetails, bankAccount} = await getAffiliateSettingsData()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>

      {/* Profile Information */}
      <ProfileInformation initalProfileData={affiliateDetails} />

      {/* Payout Settings */}
      <PayoutSettings bankAccount={bankAccount} />
      {/* Notification Preferences */}
      {/* <NotificationPreferences /> */}

      {/* Affiliate Details */}
      <AffiliateDetails referralCode={referralCode} totalEarnings={totalEarnings} />
      {/* Danger Zone */}
     <DeleteAccount totalEarnings={totalEarnings} />
    </div>
  )
}
