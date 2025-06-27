"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { LoaderCircleIcon, Minus, Plus } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import useCartStore from "@/stores/cartstore"

const FoodDialog = () => {
  const open = useUIStore((state) => state.isFoodDialogOpen)
  const setOpen = useUIStore((state) => state.setIsFoodDialogOpen)
  const currentFoodItem = useUIStore((state) => state.currentFoodItem)
  const isloading = useUIStore((state) => state.isLoading)
  const cartItem = useCartStore((state) => state.getItem(currentFoodItem?.id))
  const increment = useCartStore((state) => state.increment)
  const decrement = useCartStore((state) => state.decrement)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  
  const handleIncrement = () => {
    const data = {
      productId: currentFoodItem?.id,
      name: currentFoodItem?.name,
      image: currentFoodItem?.image,
      price: currentFoodItem?.price,
    }
    increment(data)
  }

  if (!currentFoodItem) return null
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>

        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          <DialogHeader hidden className="p-0">
            <DialogTitle >Food Item Details</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative w-full h-full min-h-[300px]">
              <Image
                src={currentFoodItem.image || "/images/defaultfoodimage.png"}
                alt={currentFoodItem.name}
                fill
                className="object-cover h-full w-full"
              />
            </div>

            <div className="p-6 flex flex-col justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">{currentFoodItem.name}</h1>
                {currentFoodItem.description && (
                  <p className="text-gray-600 mb-4">{currentFoodItem.description}</p>
                )}
                <p className="text-xl font-semibold text-green-600 mb-4">
                  {formatPrice(currentFoodItem.price)}
                </p>
              </div>

              <div className="flex items-center justify-between mt-6">
                {cartItem ? (
                  <div className="flex items-center gap-2">
                    <Button onClick={() => decrement(cartItem.productId)} disabled={isloading} size="icon">
                      <Minus />
                    </Button>
                    {isloading ? (
                      <LoaderCircleIcon className="animate-spin" />
                    ) : (
                      <span className="text-lg font-semibold">{cartItem.quantity}</span>
                    )}
                    <Button disabled={isloading} size="icon" onClick={handleIncrement}>
                      <Plus />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleIncrement}
                    disabled={isloading}
                    className="h-12 px-6 bg-pink-500 hover:bg-pink-600"
                  >
                    {isloading ? (
                      <LoaderCircleIcon className="animate-spin" />
                    ) : (
                      `Add to Cart`
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>

        {/* <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <FoodDisplay fooditem={currentFoodItem} />
        </DialogContent> */}
      </Dialog>
    )
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
              <Button onClick={() => decrement(cartItem.productId)} disabled={isloading} size={"icon"}>
                <Minus />
              </Button>
              {isloading ? <LoaderCircleIcon className="animate-spin" /> : <span className="text-lg font-semibold">{cartItem.quantity}</span>}
              <Button disabled={isloading} size={"icon"} onClick={handleIncrement}>
                <Plus />
              </Button>
            </div>
          ) : (
            <Button disabled={isloading} className="h-12 bg-pink-500" onClick={handleIncrement}>
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
