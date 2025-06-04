"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PlusIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Category } from "@/lib/generated/prisma"
import { toast } from "sonner"
import { createCategory } from "@/actions/admin/menu-actions"
import { useRouter } from "next/navigation"

// // Mock data - would be replaced with actual data from API
// const categories = [
//   { id: "cat-1", name: "All Products", count: 35 },
//   { id: "cat-2", name: "Main Dishes", count: 12 },
//   { id: "cat-3", name: "Appetizers", count: 5 },
//   { id: "cat-4", name: "Soups", count: 4 },
//   { id: "cat-5", name: "Sides", count: 6 },
//   { id: "cat-6", name: "Desserts", count: 3 },
//   { id: "cat-7", name: "Beverages", count: 5 },
// ]

export function MenuCategories({categories}: { categories: { id: number, name: string, count: number }[] }) {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const router = useRouter()
  const handleAddCategory = async () => {
    if (isAddingCategory && newCategoryName.trim()) {
      // In a real app, this would call an API to add the category
      console.log("Adding category:", newCategoryName)
      const response = await createCategory(newCategoryName)
      if (response.error) {
        toast.error("Failed to create category: " + response.message)
        return
      }
      toast.success(response.message)
      router.refresh()
      setNewCategoryName("")
      setIsAddingCategory(false)
    } else {
      setIsAddingCategory(true)
    }
  }

  return (
    <Card className="h-full max-w-92">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md">Categories</CardTitle>
        <Button size="sm" variant="ghost" onClick={handleAddCategory}>
          <PlusIcon className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="w-full">
        {isAddingCategory ? (
          <div className="flex items-center gap-2 mb-4">
            <Input
              placeholder="Category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="h-8"
              autoFocus
            />
            <Button disabled={newCategoryName.trim().length <= 3} size="sm" onClick={handleAddCategory}>
              Add
            </Button>
          </div>
        ) : null}

        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-1">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                className={cn("w-full justify-start", selectedCategory === category.id.toString() && "bg-muted font-medium")}
                onClick={() => setSelectedCategory(category.id.toString())}
              >
                <span className="truncate">{category.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{category.count}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
