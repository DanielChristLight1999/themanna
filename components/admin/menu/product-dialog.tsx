"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductForm, productFormSchema } from "./product-form"
import useUIStore from "@/stores/uistore"
import { z } from "zod"
import { createMenuItem, updateMenuItem } from "@/actions/admin/menu-actions"
import { toast } from "sonner"

import { upload } from '@vercel/blob/client'
import { useRouter } from "next/navigation"
type FileLike = {
  name: string;
  lastModified: number;
  preview: string;
};

async function uploadImages(files: (File | FileLike)[]) {
  const uploadedUrls: string[] = [];

  for (const file of files) {
    let fileName: string;
    let blob: Blob;

    if (file instanceof File) {
      fileName = file.name;
      blob = file;
    } else {
      fileName = file.name;
      blob = await fetch(file.preview).then(res => res.blob());
    }

    const response = await upload(`images/products/${fileName}`, blob, {
      access: 'public',
      handleUploadUrl: "/api/imageupload",
      
    });

    uploadedUrls.push(response.url);
  }

  return uploadedUrls;
}


export function ProductDialog({ categories, canEditProduct, canCreateProduct }: { categories: { id: number, name: string, count: number }[], canEditProduct: boolean, canCreateProduct: boolean }) {
  const open = useUIStore((state) => state.isMenuItemDialogOpen)
  const onOpenChange = useUIStore((state) => state.setIsMenuItemDialogOpen)
  const product = useUIStore((state) => state.selectedMenuItem)
  const setSelectedMenuItem = useUIStore((state) => state.setSelectedMenuItem)
  const isEditing = !!product
  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof productFormSchema>) => {
    if (!canEditProduct && !canCreateProduct) return
    console.log("Submitting product form with values:", values)
    const newFiles = values.images.filter(
      (item) => typeof item === "object"
    ) as (File | FileLike)[];
    // Upload new images
    const uploadedUrls = await uploadImages(newFiles)

    const existingUrls = values.images.filter(
      (item): item is string => typeof item === "string"
    );

    values.images = [...existingUrls, ...uploadedUrls];

    if (isEditing) {
      // Handle updating an existing product
      console.log("Updating product with values:", values)
      const response = await updateMenuItem(product?.id, values)
      if (response.error) {
        toast.error("Failed to update product: " + response.message)
        return
      }
      toast.success(response.message)
    } else {
      // Handle adding a new product
      console.log("Creating new product with values:", values)
      const response = await createMenuItem(values)
      if (response.error) {
        toast.error("Failed to create product: " + response.message)
        return
      }
      toast.success(response.message)
    }
    router.refresh()
    // Close the dialog and reset the selected item
    onOpenChange(false)
    setSelectedMenuItem(null)
  }
  const handleCancel = () => {
    onOpenChange(false)
    setSelectedMenuItem(null)
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-148 flex-col flex gap-6 overflow-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of this product in your menu."
              : "Add a new product to your restaurant menu."}
          </DialogDescription>
        </DialogHeader>

        <Tabs className="w-full">
          <TabsList className="grid w-full gap-4 grid-cols-3">
            <TabsTrigger value="details">Basic Details</TabsTrigger>
            <TabsTrigger value="inventory">Price</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>
          <ProductForm product={product} categories={categories} onSubmit={onSubmit} onCancel={handleCancel} isEditing={isEditing} />
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
