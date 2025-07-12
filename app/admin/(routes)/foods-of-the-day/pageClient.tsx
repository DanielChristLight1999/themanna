"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, Loader2, Plus, Search, X } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { Product, FoodOfTheDay, Category, ProductImage } from "@/lib/generated/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { addFoodOfTheDay, removeFoodOfTheDay } from "@/actions/admin/food-of-the-day-actions"

export type Featured = FoodOfTheDay & {
  product: Product & {
    category: Category
    images: ProductImage[]
  }
}

type ProductNew = Product & { category: Category; images: ProductImage[] }

export default function FoodsOfTheDayPage({
  products,
  initialFeaturedProducts,
}: {
  products: ProductNew[]
  initialFeaturedProducts: Featured[]
}) {
  const [featuredProducts, setFeaturedProducts] = useState<Featured[]>(initialFeaturedProducts)
  const [selectedProduct, setSelectedProduct] = useState<ProductNew | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [open, setOpen] = useState(false)

  const availableProducts = products.filter(
    (p) => !featuredProducts.some((f) => f.product.id === p.id),
  )

  const filteredProducts = availableProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddProduct = async () => {
    if (!selectedProduct) return
    setIsAdding(true)

    try {
      // TODO: Replace with actual API call
      const response = await addFoodOfTheDay(selectedProduct.id)
        if(!response.success || response.food === null){
          toast.error(response.message)
          return
        }
      setFeaturedProducts((prev) => [...prev, response.food])
      setSelectedProduct(null)
      setSearchQuery("")
      setOpen(false)

      toast.success(`${selectedProduct.name} added to today’s featured foods.`)
    } catch {
      toast.error("Failed to add product.")
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemoveProduct = async (productId: number) => {
    const target = featuredProducts.find((f) => f.product.id === productId)
    if (!target) return

    try {
      // TODO: Replace with actual API call
      const response = await removeFoodOfTheDay(productId)
      if(!response.success){
        toast.error(response.message)
        return
      }
      setFeaturedProducts((prev) => prev.filter((f) => f.product.id !== productId))

      toast.success(`${target.product.name} removed.`)
    } catch {
      toast.error("Failed to remove product.")
    }
  }

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(), "EEEE, MMMM d, yyyy")}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Foods of the Day</h1>
          <p className="text-muted-foreground">Feature products for today and manage visibility.</p>
        </div>

        {/* Add Product */}
        <Card>
          <CardHeader>
            <CardTitle>Add Featured Product</CardTitle>
            <CardDescription>Select a product to feature as today’s food of the day.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-80 justify-between">
                    {selectedProduct ? selectedProduct.name : "Select a product..."}
                    <Search className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search products..." onValueChange={setSearchQuery} />
                    <CommandList>
                      <CommandEmpty>No products found.</CommandEmpty>
                      <CommandGroup>
                        {filteredProducts.map((product) => (
                          <CommandItem
                            key={product.id}
                            value={product.name}
                            onSelect={() => {
                              setSelectedProduct(product)
                              setOpen(false)
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <Image
                                src={product.images[0]?.url || "/placeholder.svg"}
                                alt={product.name}
                                width={32}
                                height={32}
                                className="rounded object-cover"
                              />
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  ₦{product.price} • {product.category?.name}
                                </div>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <Button
                onClick={handleAddProduct}
                disabled={!selectedProduct || isAdding}
                className="sm:w-auto"
              >
                {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Add Product
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Featured Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Featured Products</span>
              <Badge variant="secondary">{featuredProducts.length} featured</Badge>
            </CardTitle>
            <CardDescription>Products currently featured today.</CardDescription>
          </CardHeader>
          <CardContent>
            {featuredProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No featured products today. Add some above.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {featuredProducts.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Image
                            src={item.product.images[0]?.url || "/placeholder.svg"}
                            alt={item.product.name}
                            width={48}
                            height={48}
                            className="rounded object-cover"
                          />
                          <span className="font-medium">{item.product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.product.category.name}</TableCell>
                      <TableCell>₦{item.product.price}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveProduct(item.product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
