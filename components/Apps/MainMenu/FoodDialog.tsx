"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import useUIStore, { FoodItem } from "@/stores/uistore"
import Image from "next/image"
import { useMediaQuery } from "usehooks-ts"
import { LoaderCircleIcon, Minus, Plus, Star } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { addToCart } from "@/actions/cartactions"
import { toast } from "sonner"
import useCartStore from "@/stores/cartstore"
import { useRouter } from "next/navigation"

const FoodDialog = () => {
  const open = useUIStore((state) => state.isFoodDialogOpen)
  const setOpen = useUIStore((state) => state.setIsFoodDialogOpen)
  const currentFoodItem = useUIStore((state) => state.currentFoodItem)
  const isloading = useUIStore((state) => state.isLoading)
  const setIsLoading = useUIStore((state) => state.setIsLoading)
  const cartItem = useCartStore((state) => state.getItem(currentFoodItem?.id))
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (!currentFoodItem) return null
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <FoodDisplay fooditem={currentFoodItem} />
        </DialogContent>
      </Dialog>
    )
  }
  const handleAddToCart = async () => {
    setIsLoading(true)
    const response = await addToCart(parseInt(currentFoodItem.id));
    if (response.error) {
      toast.error(response.message)
    } else {
      toast.success(response.message)
      useCartStore.setState((state) => ({
        cart: [...state.cart.filter((item) => item.productId !== currentFoodItem.id), ...[{ image:currentFoodItem.image, name: currentFoodItem.name, productId: currentFoodItem.id, quantity: (cartItem?.quantity ?? 0) + 1, price: currentFoodItem.price }]]
      }))
    }
    setIsLoading(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="pb-4">
        <DrawerHeader>
            <DrawerTitle hidden>Add to Cart</DrawerTitle>
        </DrawerHeader>
        <FoodDisplay fooditem={currentFoodItem} isMobile />
        <DrawerFooter className="pt-2">
            {cartItem ? (
              <div className="flex ml-4 items-center gap-2">
                <Button disabled={isloading} size={"icon"}>
                  <Minus/>
                </Button>
                {isloading ? <LoaderCircleIcon className="animate-spin" /> : <span className="text-lg font-semibold">{cartItem.quantity}</span>}
                <Button disabled={isloading} size={"icon"} onClick={handleAddToCart}>
                  <Plus />
                </Button>
              </div>
            ) : (
              <Button disabled={isloading} className="h-12 bg-pink-500" onClick={handleAddToCart}>
                {isloading ? <LoaderCircleIcon className="animate-spin" /> : "Add to Cart"}
              </Button>
            )}
          <DrawerClose asChild>
            <Button className="h-12" variant="ghost">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
export default FoodDialog

const FoodDisplay = ({
  fooditem,
  isMobile = false,
}: {
  fooditem: FoodItem
  isMobile?: boolean
}) => {
  return (
    <div className={isMobile ? "p-4" : "p-6"}>
      <div className="w-full h-60 relative">
        <Image
          fill
          src={fooditem.image || "/images/defaultfoodimage.png"}
          alt={fooditem.name}
          className="object-cover w-full h-full rounded-md"
        />
      </div>

      <div className="mt-4 px-4 space-y-2">
        <h1 className="text-2xl font-semibold">{fooditem.name}</h1>
        {/* <div className="flex items-center gap-2 text-yellow-500 text-sm">
          <Star className="w-4 h-4 fill-yellow-500" />
          <span>{fooditem.rating} / 5</span>
        </div> */}
        <p className="text-gray-600">{fooditem.description}</p>
        <p className="text-lg font-medium text-green-600">{formatPrice(fooditem.price)}</p>
      </div>

      {!isMobile && (
        <div className="mt-6 flex justify-end px-4">
          <Button>Add to Cart - ${fooditem.price}</Button>
        </div>
      )}
    </div>
  )
}
