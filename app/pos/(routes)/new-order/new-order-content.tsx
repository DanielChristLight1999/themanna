"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ShoppingCart } from "lucide-react"
import { ProductCard } from "@/components/pos/product-card"
import { CartItemRow } from "@/components/pos/cart-item-row"
import { PaymentModal } from "@/components/pos/payment-modal"
import { usePOSStore } from "@/stores/usePOSStore"
import { toast } from "sonner"
import { CompleteOrder, savePendingOrder, updateSavedOrder } from "@/actions/pos/session-actions"
import { useRouter } from "next/navigation"
import { formatPrice } from "@/lib/utils"
import { ReceiptModal, ReceiptProps } from "@/components/pos/receipt"

interface NewOrderContentProps {
  products: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
    };
    image: string;
    price: number;
    description: string | null;
  }[],
  availableCategories: {
    id: string;
    name: string;
  }[],
  resumeId?: string
}


export function NewOrderContent({ products, availableCategories, resumeId }: NewOrderContentProps) {
  const cart = usePOSStore((state) => state.cart)
  const sessionId = usePOSStore((state) => state.sessionId)
  const cashierName = usePOSStore((state) => state.cashierName)
  const addtoCart = usePOSStore((state) => state.addToCart)
  const updateQuantity = usePOSStore((state) => state.updateQuantity)
  const removeFromCart = usePOSStore((state) => state.removeFromCart)
  const completeOrder = usePOSStore((state) => state.completeOrder)
  const [lastCompletedOrder, setLastCompletedOrder] = useState<ReceiptProps["order"] | null>(null)

  // const completeOrder = usePOSStore((state) => state.completeOrder)
  const clearCart = usePOSStore((state) => state.clearCart)
  const [activeCategory, setActiveCategory] = useState(availableCategories[0].id)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax


  const handleSaveOrderForLater = async () => {
    console.log("Saving order for later...")
    setLoading(true)
    // const cart = usePOSStore.getState().cart

    if (!sessionId || cart.length === 0) {
      setLoading(false)
      return toast.error(`Cannot save. Missing session or empty cart. ${sessionId} ${cart.length}`)
    }

    const response = resumeId ? await updateSavedOrder(resumeId, cart) : await savePendingOrder({
      sessionId,
      cart,
    })

    if (response.error) {
      toast.error(response.message)
    } else {
      toast.success(response.message)
    }
    clearCart() // Clear cart after saving
    setLoading(false)
    router.replace("/new-order")
  }

  const handleAddToCart = (product: any) => {
    addtoCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQuantity(id, quantity)
  }

  const handleRemoveItem = (id: string) => {
    removeFromCart(id)
  }

  const handleCompleteOrder = async (paymentMethod: "CASH" | "TRANSFER" | "PAYSTACK", paidAmount: number, sessionId: string, changeGiven?: number) => {
    const response = await CompleteOrder(cart, sessionId, paymentMethod, paidAmount, resumeId);

    if (response.error || !response.order) {
      toast.error(response.message || "Failed to complete order")
      return
    }
    toast.success("Payment completed successfully")
    const order = response.order
    const orderData = {
      id: order.id,
      items: cart.map( item => ({
        product: {
          id: parseInt(item.id),
          name: item.name,
          price: item.price,
        },
        quantity: item.quantity,
      })),
      subtotal: subtotal,
      taxAmount: order.taxAmount || 0,
      totalAmount: order.totalAmount,
      payment: {method: paymentMethod},
      placedAt: order.placedAt,
      cashierName: cashierName,
      changeGiven: changeGiven || 0,
    }
    completeOrder(paymentMethod)
    setLastCompletedOrder(orderData)
    setShowReceipt(true)
  }
  

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Products Section */}
      {/* <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="foods">Foods</TabsTrigger>
                <TabsTrigger value="beverages">Beverages</TabsTrigger>
                <TabsTrigger value="pastries">Pastries</TabsTrigger>
                <TabsTrigger value="wines">Wines</TabsTrigger>
              </TabsList>

              {Object.entries(products).map(([category, products]) => (
                <TabsContent key={category} value={category} className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                      <ProductCard key={product.id} {...product} onAddToCart={() => handleAddToCart(product)} />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div> */}

      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={availableCategories[0].id} value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="grid w-full grid-cols-4">
                {availableCategories.map((cat) => (
                  <TabsTrigger key={cat.id} value={cat.id}>
                    {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>

              {availableCategories.map((category) => {
                const filtered = products.filter((p) =>
                  p.category.name.toLowerCase() === category.name.toLowerCase()
                )
                return (
                  <TabsContent key={category.id} value={category.id} className="mt-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filtered.map((product) => (
                        <ProductCard
                          key={product.id}
                          {...product}
                          onAddToCart={() => handleAddToCart(product)}
                        />
                      ))}
                      {filtered.length === 0 && (
                        <p className="col-span-full text-sm text-muted-foreground">No products in this category.</p>
                      )}
                    </div>
                  </TabsContent>
                )
              })}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Cart Section */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Order Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            <div className="flex-1 overflow-auto">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No items in cart</p>
                </div>
              ) : (
                <div className="h-96 space-y-2">
                  {cart.map((item) => (
                    <CartItemRow
                      key={item.id}
                      {...item}
                      image={item.image || "/images/placeholder.svg"}
                      onUpdateQuantity={(quantity) => handleUpdateQuantity(item.id, quantity)}
                      onRemove={() => handleRemoveItem(item.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t pt-4 mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (8%):</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span className="text-orange-600">{formatPrice(total)}</span>
                </div>
                <Button variant="secondary" className="w-full mt-2 hover:bg-gray-200 cursor-pointer" onClick={handleSaveOrderForLater}>
                  {loading ? <Loader2 className="animate-spin mr-2" /> : "Save Order for Later"}
                </Button>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 cursor-pointer" onClick={() => setShowPaymentModal(true)}>
                  Complete Order
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <PaymentModal
        onPaymentComplete={handleCompleteOrder}
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        total={total}
      />

      {lastCompletedOrder && (
        <ReceiptModal
          isOpen={showReceipt}
          onClose={() => setShowReceipt(false)}
          order={lastCompletedOrder}
        />
      )}
    </div>
  )
}
