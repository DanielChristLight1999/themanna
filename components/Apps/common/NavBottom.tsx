'use client'
import React from 'react'
import { Home, User, Settings, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  // { name: 'Cart', href: '/cart', icon: ShoppingCart },
  { name: 'Orders', href: '/orders', icon: ShoppingBag },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const NavBottom = () => {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-sm md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
            className={clsx(
              'flex flex-col items-center justify-center text-xs transition-colors',
              pathname === href ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
            )}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span>{name}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default NavBottom
