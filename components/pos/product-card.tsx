"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  onAddToCart: () => void
}

export function ProductCard({ name, price, image, onAddToCart }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className=" w-full h-40">
          <Image src={image} alt={name} width={100} height={100} className="object-cover h-full w-full" />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-sm mb-2 line-clamp-2">{name}</h3>
          <div className="flex items-center justify-between">
            <span className="font-bold text-orange-600">{formatPrice(price)}</span>
            <Button size="sm" onClick={onAddToCart} className="bg-orange-600 hover:bg-orange-700">
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
