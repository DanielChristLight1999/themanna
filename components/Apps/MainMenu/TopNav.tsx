import { auth } from '@/auth'
import { NavAvatarDropdown } from './NavAvatarDropDown'
import TopNavLinks from './TopNavLinks'
import Link from 'next/link'
import Image from 'next/image'

export default async function TopNav() {
  const session = await auth()
  return (
    <header className="items-center flex justify-between px-8 py-8 w-full md:max-w-2/3 bg-white border-b">
      {/* Brand / Logo */}
      <Link href={"/"} className="">
        <Image src={"/images/themanalogonew.png"} alt="logo" width={150} height={150} />
      </Link>
      {/* Center Nav Links */}
      <TopNavLinks />

      {/* Right Side: Avatar or Auth UI */}
      <div className="flex items-center space-x-3">
        <NavAvatarDropdown email={session?.user?.email as string} name={session?.user?.name as string} />
      </div>
    </header>
  )
}
