"use server"

import { productFormSchema } from "@/components/admin/menu/product-form"
import prisma from "@/db"
import { MenuItem } from "@/lib/columns/productsTableColumn"
import { z } from "zod"
import { del } from "@vercel/blob"
import { auth } from "@/auth"


export async function getMenuItems(): Promise<MenuItem[]> {
    const data = await prisma.product.findMany({
        where: {
            deletedAt: null,
            isActive: true
        },
        orderBy: {
            createdAt: "desc"
        },
        select: {
            id: true,
            name: true,
            category: { select: { name: true, id: true } },
            costPrice: true,
            price: true,
            sku: true,
            images: { select: { url: true } },
            description: true,
            inventory: { select: { lowStockAlert: true, quantity: true } }
        }
    })

    return data
}


export async function getCategories() {
    const data = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            createdAt: true,
            _count: true
        }
    })
    const categories = data.map((category) => ({
        id: category.id,
        name: category.name,
        count: category._count.products || 0,
     }))
    return categories
}

// export async function updateMenuItem(id: number, data: MenuItem) {
//     const product = await prisma.product.update({
//         where: {
//             id: id,
//         },
//         data: { 
//             name: data.name,
//             price: data.price,
//             sku: data.sku,
//             description: data.description,
//             categoryId: data.category.id,
//             images: {
//                 deleteMany: {},
//                 create: data.images.map((image) => ({ url: image.url })),
//             },
//             inventory: {
//                 update: {
//                     lowStockAlert: data.inventory?.lowStockAlert,
//                     quantity: data.inventory?.quantity,
//                 },
//             },
//         },
//     })
//     return product
// }

export async function updateMenuItem(id: number, data: z.infer<typeof productFormSchema>) {
    try {
        console.log("Updating menu item with ID:", id, "and data:", data);
        // const validatedData = productFormSchema.safeParse(data);
        // if (!validatedData.success) {
        //     console.error("Validation failed:", validatedData.error);
        //     return { error: true, message: validatedData.error.message };
        // }

        const { name, description, categoryId, price, cost, stock, lowStockAlert, sku, images } = data;


        const existingProduct = await prisma.product.findUnique({
            where: { id },
            include: { images: true, inventory: true }
        });

        if (!existingProduct) {
            console.error("Product not found with ID:", id);
            return { error: true, message: "Product not found" };
        }
        const existingImages = existingProduct.images

        const imageUrls: string[] = images
        const deletedImages = existingImages.filter(oldImage => !imageUrls.includes(oldImage.url))
        const newImageUrls = imageUrls.filter(url => !existingImages.some(img => img.url === url));

        // Delete images that are no longer in the form
        if (deletedImages.length > 0) {
            await Promise.allSettled(deletedImages.map(image => del(image.url)))
        }


        await prisma.$transaction([
            prisma.productImage.deleteMany({
                where: {
                    productId: id,
                    url: {
                        in: deletedImages.map(image => image.url)
                    }
                }
            }),
            prisma.product.update({
                where: { id },
                data: {
                    name: name,
                    description: description,
                    categoryId: categoryId,
                    price: price,
                    costPrice: cost,
                    sku: sku,
                    inventory: {
                        update: {
                            lowStockAlert: lowStockAlert,
                            quantity: stock,
                        },
                    },
                }
            })
        ])
        // Add new images (done separately to avoid transaction conflicts)
        console.log("Adding new images:", newImageUrls);
        if (newImageUrls.length > 0) {
            await prisma.productImage.createMany({
                data: newImageUrls.map(url => ({
                    url,
                    productId: id
                }))
            });
        }

        return { error: false, message: "Product updated successfully" };
    } catch (error) {
        console.error("Error updating product:", error);
        return { error: true, message: "Failed to update product" };
    }

}



export async function createMenuItem(data: z.infer<typeof productFormSchema>) {
  try {
    const validatedData = productFormSchema.safeParse(data)
    if (!validatedData.success) {
      console.error("Validation failed:", validatedData.error)
      return { error: true, message: validatedData.error.message }
    }

    const { name, description, categoryId, price, cost, stock, lowStockAlert, sku, images } = validatedData.data
    const skuData = sku || await generateExpressiveSku(name)
    await prisma.product.create({
      data: {
        name:name,
        description: description,
        categoryId: categoryId,
        price: price,
        costPrice: cost,
        sku: skuData,
        images: {
          createMany: {
            data: images.map(url => ({ url })),
          },
        },
        inventory: {
          create: {
            quantity: stock,
            lowStockAlert,
          },
        },
      },
    })

    return { error: false, message: 'Product created successfully' }
  } catch (err) {
    console.error("Create menu item error:", err)
    return { error: true, message: 'Failed to create product' }
  }
}

export async function deleteMenuItem(id: number) {
  try {
    const session = await auth();
    if (!session) return { error: true, message: 'Unauthorized' }
    await prisma.product.update({
      where: { id },
      data: {deletedAt: new Date(), isActive: false}
    })
    return { error: false, message: 'Product deleted successfully' }
  } catch (err) {
    console.error("Delete menu item error:", err)
    return { error: true, message: 'Failed to delete product' }
  }
}

export async function createCategory(name: string) {
  try {
    const category = await prisma.category.create({
      data: {
        name,
      },
    })
    return { error: false, message: 'Category created successfully' }
  } catch (err) {
    console.error("Create category error:", err)
    return { error: true, message: 'Failed to create category' }
  }
}

export async function generateExpressiveSku(productName: string): Promise<string> {
  // Extract up to the first two words, trimmed and uppercased
  const words = productName.trim().toUpperCase().split(/\s+/).slice(0, 2)

  // Create a 4-letter code for each word (or pad if shorter)
  const codeParts = words.map(word => word.slice(0, 4).padEnd(4, "X"))

  const base = codeParts.join("-") // e.g., "CHIK-TIKK"
  let sku: string = ""
  let exists = true

  while (exists) {
    const suffix = Math.floor(1000 + Math.random() * 9000) // Random 4-digit number
    sku = `${base}-${suffix}` // e.g., "CHIK-TIKK-3821"

    const product = await prisma.product.findUnique({
      where: { sku },
      select: { id: true },
    })

    exists = !!product
  }

  return sku
}
