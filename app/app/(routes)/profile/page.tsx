import { auth } from "@/auth"
import ChangePasswordDialog from "@/components/Apps/profile/change-password-dialog"
import ProfileSummaryCard from "@/components/Apps/profile/profile-summary-card"
import SignOutButton from "@/components/Apps/profile/sign-out-button"
import { getUser } from "@/lib/getsettingsData"
import type { Metadata } from "next"
import { redirect } from "next/navigation"


export const metadata: Metadata = {
  title: "Profile | Restaurant Store",
  description: "Manage your profile information",
}

export default async function ProfilePage() {
  // This would come from your authentication system
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login")
  }
  const user = await getUser(session.user.id)
  if (!user) {
    redirect("/auth/login")
  }
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="space-y-6">
        <ProfileSummaryCard user={user} />

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <ChangePasswordDialog />
          <SignOutButton />
        </div>
      </div>
    </div>
  )
}
