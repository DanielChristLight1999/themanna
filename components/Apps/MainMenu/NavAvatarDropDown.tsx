'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut } from 'lucide-react'
import { LogOutOAuth } from '@/actions/authactions'

export function NavAvatarDropdown({email, name}: {email: string, name: string}) {

  const handleLogout = async () => {
    await LogOutOAuth()
  }
  

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src="" alt="User Avatar" />
          <AvatarFallback className="bg-orange-100 text-orange-600 font-bold text-sm">N</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-sm text-gray-500">Account</DropdownMenuLabel>
        <DropdownMenuItem className="flex flex-col gap-1 items-start text-gray-500">
          <span className='font-bold'>{name}</span>
          <span className='text-xs'>{email}</span>
        </DropdownMenuItem>
        {/* <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push('/notifications')}>
          <Bell className="mr-2 h-4 w-4" />
          Notifications
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push('/help')}>
          <HelpCircle className="mr-2 h-4 w-4" />
          Help Center
        </DropdownMenuItem> */}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:text-red-700">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
