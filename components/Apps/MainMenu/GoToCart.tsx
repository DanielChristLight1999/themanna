"use client"

import { formatPrice, generateGuestId } from "@/lib/utils"
import useCartStore from "@/stores/cartstore"
import { ArrowRight, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts"
import { goToCartFromLanding } from "@/actions/cartactions"

const GoToCart = ({fromLanding = false}: { fromLanding?: boolean }) => {
    const router = useRouter()
    const cart = useCartStore((state) => state.cart)
    const [expanded, setExpanded] = useState(false)

    const total = cart.reduce((acc, item) => acc + item.quantity, 0)
    const totalPrice = cart.reduce((acc, item) => acc + item.quantity * item.price, 0)
    const bannerRef = useRef<HTMLDivElement>(null)
    const [guestId, setGuestId] = useLocalStorage("guestId", "", { initializeWithValue: true})

    const handleGotoCart = async () => {
        if (fromLanding) {
            const Id = guestId || generateGuestId()
            setGuestId(Id)
            const response = await goToCartFromLanding(cart, Id)
            if (response.error) {
                console.error(response.message)
                return
            }
            router.push(`/auth/signup?guestId=${guestId}`)
        } else {
            router.push("/orders")
        }
    }

    // Click outside to collapse
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (
                expanded &&
                bannerRef.current &&
                !bannerRef.current.contains(event.target as Node)
            ) {
                setExpanded(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("touchstart", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("touchstart", handleClickOutside)
        }
    }, [expanded])

    if (total === 0) return null

    return (
        <div className="fixed bottom-20 left-2 z-50">
            {!expanded ? (
                <motion.button
                    key="icon"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 64, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onClick={() => setExpanded(true)}
                    className="relative w-16 h-16 bg-black/80 text-white rounded-full shadow-lg flex items-center justify-center"
                >
                    <ShoppingCart className="!size-8" />
                    <span className="absolute top-1 right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {total}
                    </span>
                </motion.button>
            ) : (
                <motion.div
                    key="banner"
                    ref={bannerRef}
                    initial={{ width: 120 }}
                    animate={{ width: 400 }}
                    exit={{ width: 64 }}
                    transition={{ duration: 0.1, ease: "linear", delay: 0.1 }}
                    className="bg-green-600 text-white px-4 py-3 h-14 rounded-2xl shadow-lg flex items-center justify-between gap-2 w-[400px] cursor-pointer transition-all"
                    onClick={handleGotoCart}
                >
                    <motion.button
                        
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
                        className=" flex items-center justify-between w-full">
                            <p className="text-sm font-medium">
                                Proceed to order <strong>{total}</strong> item{total > 1 && "s"}
                            </p>
                            <h1 className="text-lg font-semibold">{formatPrice(totalPrice)}</h1>
                    </motion.button>
                    <ArrowRight className="w-5 h-5" />
                    {/* <Button
                        variant={"link"}
                        onClick={(e) => {
                            e.stopPropagation()
                            setExpanded(false)
                        }}
                        className="ml-2 text-xs"
                    >
                        Close
                    </Button> */}
                </motion.div>
            )}
        </div>
    )
}

export default GoToCart
