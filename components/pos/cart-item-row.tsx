"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"

interface CartItemRowProps {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
}

export function CartItemRow({ name, price, quantity, image, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    // <div className="flex items-center space-x-3 py-3 border-b">
    //   <Image src={image || "/placeholder.svg"} alt={name} width={50} height={50} className="rounded object-cover" />

    //   <div className="flex-1 min-w-0">
    //     <p className="text-sm font-medium truncate">{name}</p>
    //     <p className="text-sm text-gray-500">{formatPrice(price)}</p>
    //   </div>

    //   <div className="flex items-center space-x-2">
    //     <Button size="sm" variant="outline" onClick={() => onUpdateQuantity(quantity - 1)} disabled={quantity <= 1}>
    //       <Minus className="h-3 w-3" />
    //     </Button>

    //     <span className="w-8 text-center text-sm font-medium">{quantity}</span>

    //     <Button size="sm" variant="outline" onClick={() => onUpdateQuantity(quantity + 1)}>
    //       <Plus className="h-3 w-3" />
    //     </Button>

    //     <Button size="sm" variant="outline" onClick={onRemove} className="text-red-600 hover:text-red-700">
    //       <Trash2 className="h-3 w-3" />
    //     </Button>
    //   </div>

    //   <div className="text-sm font-medium w-20 text-right">{formatPrice(price * quantity)}</div>
    // </div>
    <div className="flex flex-col border-b  py-3 gap-2">
      <div className="flex items-center justify-between gap-4 pr-2">
        {/* Image & Info */}
        <div className="flex items-center gap-3 min-w-0 w-3/5">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            width={48}
            height={48}
            className="rounded object-cover w-12 h-12"
          />
          <div className="">
            <p className="text-sm font-medium truncate">{name}</p>
            <p className="text-xs text-muted-foreground">{formatPrice(price)}</p>
          </div>
        </div>
        <span className="text-sm font-semibold text-orange-600">{formatPrice(price * quantity)}</span>

      </div>
      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => onUpdateQuantity(quantity - 1)} disabled={quantity <= 1}>
          <Minus className="w-3 h-3" />
        </Button>
        <span className="text-sm w-6 text-center">{quantity}</span>
        <Button size="sm" variant="outline" onClick={() => onUpdateQuantity(quantity + 1)}>
          <Plus className="w-3 h-3" />
        </Button>
         <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-600"
          onClick={onRemove}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

    </div>
  )
}
