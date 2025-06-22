import { auth } from '@/auth'
import { NavAvatarDropdown } from './NavAvatarDropDown'
import TopNavLinks from './TopNavLinks'

export default async function TopNav() {
  const session = await auth()
  return (
    <header className="items-center flex justify-between px-8 py-8 w-full md:max-w-2/3 bg-white border-b">
      {/* Brand / Logo */}
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-orange-600">🍽️ The Manna</span>
      </div>
      {/* Center Nav Links */}
      <TopNavLinks />

      {/* Right Side: Avatar or Auth UI */}
      <div className="flex items-center space-x-3">
        <NavAvatarDropdown email={session?.user?.email as string} name={session?.user?.name as string} />
      </div>
    </header>
  )
}
