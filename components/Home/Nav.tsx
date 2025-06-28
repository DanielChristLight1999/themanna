"use client"
import { ChefHat, LogIn, User } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from 'usehooks-ts'
import useCartStore from '@/stores/cartstore'
import { generateGuestId } from '@/lib/utils'
import { goToCartFromLanding } from '@/actions/cartactions'

const Nav = () => {
  const router = useRouter()
  const cart = useCartStore(state => state.cart)
  const [guestId, setGuestId] = useLocalStorage<string>("guestId", "", { initializeWithValue: true });

  async function handleLogin() {
    if (cart.length > 0) {
      const Id = guestId || generateGuestId()
      setGuestId(Id)
      const response = await goToCartFromLanding(cart, Id)
      if (response.error) {
        console.error(response.message)
        return
      }
      router.push(`https://app.themannafood.com/auth/login?guestId=${guestId}`)
    }else {
      router.push("https://app.themannafood.com/auth/login")
    }
  }

  async function handleSignup() {
    if (cart.length > 0) {
      const Id = guestId || generateGuestId()
      setGuestId(Id)
      const response = await goToCartFromLanding(cart, Id)
      if (response.error) {
        console.error(response.message)
        return
      }
      router.push(`https://app.themannafood.com/auth/signup?guestId=${guestId}`)
    }else {
      router.push("https://app.themannafood.com/auth/signup")
    }
  }


  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-orange-100">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ChefHat className="h-8 w-8 text-orange-500" />
          <span className="text-2xl font-bold text-gray-800">The Manna</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="#home" className="text-gray-700 hover:text-orange-500 transition-colors">
            Home
          </Link>
          <Link href="#menu" className="text-gray-700 hover:text-orange-500 transition-colors">
            Menu
          </Link>
          <Link href="#about" className="text-gray-700 hover:text-orange-500 transition-colors">
            About
          </Link>
          <Link href="#contact" className="text-gray-700 hover:text-orange-500 transition-colors">
            Contact
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleLogin}
            variant="outline"
            size="sm"
            className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white bg-transparent"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Login
          </Button>
          <Button onClick={handleSignup} size="sm" className="bg-orange-500 hover:bg-orange-600">

            <User className="h-4 w-4 mr-2" />
            Sign Up
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Nav