"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { EllipsisVertical, PlusIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { createCategory, deleteCategory } from "@/actions/admin/menu-actions"
import { useRouter } from "next/navigation"
import useUIStore from "@/stores/uistore"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ConfirmDeleteDialog from "../common/confirm-delete-dialog"
import EditCategoryDialog from "./edit-category-dialog"

export function MenuCategories({ categories }: { categories: { id: number, name: string, count: number }[] }) {
  const setSelectedCategory = useUIStore((state) => state.setSelectedCategory)
  const selectedCategory = useUIStore((state) => state.selectedCategory)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [editCategoryName, setEditCategoryName] = useState("")
  const [loading, setLoading] = useState(false)
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false)
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false)
  const onCancelEdit = () => {
    setSelectedCategory("");
    setEditCategoryName("");
    setIsEditCategoryDialogOpen(false);
  }
  const onCancelDelete = () => {
    setSelectedCategory("");
    setIsConfirmDeleteDialogOpen(false);
  }
  const onConfirmDelete = async () => {
    if (!selectedCategory) return;
    setLoading(true);
    const response = await deleteCategory(parseInt(selectedCategory));
    if (response.error) {
      toast.error(response.message);
      return;
    }
    toast.success("Category deleted successfully");
    setSelectedCategory("");
    setIsConfirmDeleteDialogOpen(false);
    setLoading(false);
  }
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
    <div className="w-full max-w-80">
      <Card className="h-full  w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md">Categories</CardTitle>
          <Button size="sm" variant="ghost" onClick={handleAddCategory}>
            <PlusIcon className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="w-full flex flex-col">
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

          <div className="w-full h-[calc(100vh-300px)] space-y-1 flex flex-col  gap-2">
            <Button
              variant="ghost"
              className={cn("", selectedCategory === "" && "bg-muted font-medium")}
              onClick={() => setSelectedCategory("")}
            >
              <span className="truncate">All</span>
              <span className="ml-auto text-xs text-muted-foreground">{categories.reduce((acc, curr) => acc + curr.count, 0)}</span>
            </Button>
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between w-full ">
                <Button
                  variant="ghost"
                  className={cn("flex-1 ", selectedCategory === category.id.toString() && "bg-muted font-medium")}
                  onClick={() => setSelectedCategory(category.id.toString())}
                >
                  <span className="truncate">{category.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{category.count}</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size={"icon"} variant={"ghost"}>
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => {
                      setEditCategoryName(category.name);
                      setSelectedCategory(category.id.toString());
                      setIsEditCategoryDialogOpen(true);
                    }}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setSelectedCategory(category.id.toString());
                      setIsConfirmDeleteDialogOpen(true);
                    }} variant="destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <ConfirmDeleteDialog message="This will delete the category and all the products under it. This action cannot be undone." isOpen={isConfirmDeleteDialogOpen} setisOpen={setIsConfirmDeleteDialogOpen} loading={loading} onCancel={onCancelDelete} onConfirm={onConfirmDelete} />
      {editCategoryName && selectedCategory ? <EditCategoryDialog id={parseInt(selectedCategory)} name={editCategoryName} isOpen={isEditCategoryDialogOpen} onClose={onCancelEdit} /> : ""}
    </div>
  )
}
