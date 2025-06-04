"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchIcon, PlusIcon } from "lucide-react"

interface PosProductSearchProps {
  onAddToCart: (product: any) => void
  disabled?: boolean
}

// Mock product data
const products = [
  {
    id: "PRD-001",
    name: "Jollof Rice Special",
    category: "Main Dishes",
    price: 1500,
    stock: 50,
    image: "/placeholder.svg?height=100&width=100",
    tags: ["Popular", "Spicy"],
  },
  {
    id: "PRD-002",
    name: "Suya Platter",
    category: "Appetizers",
    price: 950,
    stock: 30,
    image: "/placeholder.svg?height=100&width=100",
    tags: ["Spicy", "Gluten-Free"],
  },
  {
    id: "PRD-003",
    name: "Egusi Soup & Pounded Yam",
    category: "Main Dishes",
    price: 1850,
    stock: 25,
    image: "/placeholder.svg?height=100&width=100",
    tags: ["Traditional"],
  },
  {
    id: "PRD-004",
    name: "Pepper Soup",
    category: "Soups",
    price: 750,
    stock: 40,
    image: "/placeholder.svg?height=100&width=100",
    tags: ["Spicy", "Gluten-Free"],
  },
  {
    id: "PRD-005",
    name: "Moin Moin Deluxe",
    category: "Sides",
    price: 800,
    stock: 35,
    image: "/placeholder.svg?height=100&width=100",
    tags: ["Vegetarian"],
  },
  {
    id: "PRD-006",
    name: "Chapman",
    category: "Beverages",
    price: 750,
    stock: 60,
    image: "/placeholder.svg?height=100&width=100",
    tags: ["Non-Alcoholic"],
  },
  {
    id: "PRD-007",
    name: "Puff Puff",
    category: "Desserts",
    price: 500,
    stock: 45,
    image: "/placeholder.svg?height=100&width=100",
    tags: ["Sweet"],
  },
  {
    id: "PRD-008",
    name: "Fried Rice",
    category: "Main Dishes",
    price: 1400,
    stock: 30,
    image: "/placeholder.svg?height=100&width=100",
    tags: ["Popular"],
  },
]

const categories = ["All", "Main Dishes", "Appetizers", "Soups", "Sides", "Desserts", "Beverages"]

export function PosProductSearch({ onAddToCart, disabled = false }: PosProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      return matchesSearch && matchesCategory && product.stock > 0
    })
  }, [searchTerm, selectedCategory])

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          disabled={disabled}
        />
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="text-xs">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    disabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => !disabled && onAddToCart(product)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-square relative mb-3 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm leading-tight">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">₦{product.price.toLocaleString()}</span>
                        <Button
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (!disabled) onAddToCart(product)
                          }}
                          disabled={disabled}
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Stock: {product.stock}</span>
                        {product.tags.includes("Popular") && (
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No products found</p>
                <p className="text-sm">Try adjusting your search or category filter</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
