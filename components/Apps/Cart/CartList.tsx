"use client"
import CartItemCard from './CartItemCard'
import Link from 'next/link'
import useCartStore from '@/stores/cartstore'
// import { getCartFromLanding } from '@/actions/cartactions'
// import { useReadLocalStorage } from 'usehooks-ts'

const CartList = () => {
    const cart = useCartStore((state) => state.cart)
    // const setCart = useCartStore((state) => state.setCart)
    // const guestId = useReadLocalStorage<string>("guestId")

    // useEffect(() => {
    //     async function checkForExistingCart() {
    //         if (guestId) {
    //             const response = await getCartFromLanding(guestId)
    //             if (response.error) {
    //                 return
    //             }
    //             const cartItems = response.cartItems
    //             if (!cartItems) {
    //                 return
    //             }
    //             setCart(cartItems)
    //         }
    //     }
    //     checkForExistingCart()
    // }, [guestId])
    if (cart.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">
                    Add some delicious meals to your cart before proceeding to checkout.
                </p>
                <Link href="/" className="text-primary hover:underline">
                    Browse our menu
                </Link>
            </div>
        )
    }
    return (
        <div className='flex flex-col items-center gap-4 w-full'>
            <div className=' flex flex-col gap-4 w-full'>
                {cart.map((item, index) => (
                    <CartItemCard item={item} key={index} />
                ))}
            </div>
        </div>
    )
}

export default CartList