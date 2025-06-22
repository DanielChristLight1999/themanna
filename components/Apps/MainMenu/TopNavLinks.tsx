"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingBag, User, Settings } from 'lucide-react'
import clsx from 'clsx'

const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Orders', href: '/orders', icon: ShoppingBag },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
]
const TopNavLinks = () => {
    const pathname = usePathname()
    return (
        <nav className="md:flex hidden items-center space-x-8">
            {navItems.map(({ name, href, icon: Icon }) => (
                <Link
                    key={name}
                    href={href}
                    className={clsx(
                        'flex items-center space-x-2 font-medium transition-colors',
                        pathname === href
                            ? 'text-orange-600 border-b-2 border-orange-600 pb-1'
                            : 'text-gray-600 hover:text-orange-500'
                    )}
                >
                    <Icon className="h-4 w-4" />
                    <span>{name}</span>
                </Link>
            ))}
        </nav>
    )
}

export default TopNavLinks