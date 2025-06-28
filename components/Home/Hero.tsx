"use client"
import { Button } from '../ui/button'
import { ChefHat } from 'lucide-react'
import { Badge } from '../ui/badge'
import { motion } from 'framer-motion'
import { herodata } from '@/lib/home-data/getlandingpage'
import { useLocalStorage } from 'usehooks-ts'
import { useRouter } from 'next/navigation'
import useCartStore from '@/stores/cartstore'
import { generateGuestId } from '@/lib/utils'
import { goToCartFromLanding } from '@/actions/cartactions'
  const floatingItems = [
    { emoji: "🍔", delay: 0, duration: 3, top: 12.98, left: 38.86 },
    { emoji: "🍕", delay: 0.5, duration: 4, top: 63.72, left: 11.04 },
    { emoji: "🌮", delay: 1, duration: 3.5, top: 19.15, left: 74.92 },
    { emoji: "🍟", delay: 1.5, duration: 4.5, top: 76.78, left: 34.09 },
    { emoji: "🥤", delay: 2, duration: 3, top: 48.07, left: 6.89 },
    { emoji: "🍗", delay: 2.5, duration: 4, top: 22.78, left: 40.21 },
  ]
const Hero = ({ isVisible }: { isVisible: boolean }) => {
  // Define fixed positions to avoid hydration mismatch
  const [guestId, setGuestId] = useLocalStorage("guestId", "", { initializeWithValue: true })
  const router = useRouter()
  const cart = useCartStore((state) => state.cart)

   async function handleLogin() {
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
    <section id="home" className="pt-20 pb-16 relative overflow-hidden">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-7xl font-bold">
                <span className="text-orange-500">Fast</span> <span className="text-gray-800">Food</span>
                <br />
                <span className="text-gray-800">Delivery</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                {herodata.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleLogin} size="lg" className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-4 text-lg rounded-full">
                {herodata.cta1}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-gray-700 hover:text-orange-500 px-8 py-4 text-lg"
                onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
              >
                <ChefHat className="h-5 w-5 mr-2" />
                {herodata.cta2}
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">{herodata.deliverytime.value}</div>
                <div className="text-sm text-gray-600">{herodata.deliverytime.title}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">{herodata.customerRating.value}★</div>
                <div className="text-sm text-gray-600">{herodata.customerRating.title}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">{herodata.menuitems.value}</div>
                <div className="text-sm text-gray-600">{herodata.menuitems.title}</div>
              </div>
            </div>
          </motion.div>

          <div className="relative">
            {/* Floating Food Items */}
            {floatingItems.map((item, index) => (
              <motion.div
                key={index}
                className="absolute text-4xl"
                initial={{ y: -20 }}
                animate={{ 
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: item.duration,
                  delay: item.delay,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
                style={{
                  top: `${item.top}%`,
                  left: `${item.left}%`,
                }}
              >
                {item.emoji}
              </motion.div>
            ))}

            {/* Central Paper Bag */}
            <motion.div 
              className="relative z-10 flex justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="w-80 h-80 bg-[url('/images/foodhero.svg')] bg-cover bg-center bg-no-repeat rounded-t-lg relative">
                {/* <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-32 h-8 bg-amber-400 rounded-full"></div>
                </div> */}

                {/* Badges */}
                <Badge className="absolute -top-4 -left-4 bg-red-500 text-white px-4 py-2 text-sm font-bold rounded-full">
                  Fast Food
                </Badge>
                <Badge className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 text-sm font-bold rounded-full">
                  Best in Town
                </Badge>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero