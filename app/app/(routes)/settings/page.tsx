import SettingsTabs from "@/components/Apps/settings/settings-tabs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings | Restaurant Store",
  description: "Manage your account settings",
}

export default function SettingsPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <SettingsTabs />
    </div>
  )
}
