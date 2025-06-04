"use client"

import { useMemo } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MinusIcon, PlusIcon, TrashIcon, ShoppingCartIcon, CreditCardIcon } from "lucide-react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  image?: string
}

interface PosCartProps {
  items: CartItem[]
  onUpdateItem: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onClearCart: () => void
  onCheckout: () => void
  disabled?: boolean
}

export function PosCart({
  items,
  onUpdateItem,
  onRemoveItem,
  onClearCart,
  onCheckout,
  disabled = false,
}: PosCartProps) {
  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const tax = subtotal * 0.075 // 7.5% tax
    const total = subtotal + tax
    return { subtotal, tax, total }
  }, [items])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCartIcon className="h-5 w-5" />
            <span>Cart</span>
            {totalItems > 0 && (
              <Badge variant="secondary" className="ml-2">
                {totalItems}
              </Badge>
            )}
          </div>
          {items.length > 0 && (
            <Button variant="outline" size="sm" onClick={onClearCart} disabled={disabled}>
              Clear
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      {/* Cart Items */}
      <CardContent className="flex-1 p-0">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6">
            <ShoppingCartIcon className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-center">Cart is empty</p>
            <p className="text-sm text-center">Add products to start a transaction</p>
          </div>
        ) : (
          <ScrollArea className="h-full px-6">
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="p-3">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 relative rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm leading-tight truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                      <p className="font-bold text-sm mt-1">₦{item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => onRemoveItem(item.id)}
                        disabled={disabled}
                      >
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => onUpdateItem(item.id, item.quantity - 1)}
                          disabled={disabled || item.quantity <= 1}
                        >
                          <MinusIcon className="h-3 w-3" />
                        </Button>
                        <Input
                          value={item.quantity}
                          onChange={(e) => {
                            const qty = Number.parseInt(e.target.value) || 1
                            onUpdateItem(item.id, qty)
                          }}
                          className="h-6 w-12 text-center text-xs p-1"
                          disabled={disabled}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => onUpdateItem(item.id, item.quantity + 1)}
                          disabled={disabled}
                        >
                          <PlusIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right mt-2">
                    <span className="font-bold">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>

      {/* Totals and Checkout */}
      {items.length > 0 && (
        <div className="border-t p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>₦{totals.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (7.5%):</span>
              <span>₦{totals.tax.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₦{totals.total.toLocaleString()}</span>
            </div>
          </div>
          <Button className="w-full" size="lg" onClick={onCheckout} disabled={disabled || items.length === 0}>
            <CreditCardIcon className="mr-2 h-5 w-5" />
            Checkout
          </Button>
        </div>
      )}
    </div>
  )
}
