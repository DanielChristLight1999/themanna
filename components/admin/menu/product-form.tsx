"use client"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MenuItem } from "@/lib/columns/productsTableColumn";
import { ImageUploader } from "./image-uploader";
import AuthButton from "@/components/Apps/common/AuthButton";
import { useForm } from "react-hook-form";

interface ProductFormProps {
    product: MenuItem | null;
    categories: { id: number, name: string, count: number }[];
    onSubmit: (values: z.infer<typeof productFormSchema>) => void;
    onCancel: () => void;
    isEditing: boolean;
}

export const productFormSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Product description is required"),
    categoryId: z.coerce.number().min(1, "Category is required"), // Changed to number
    price: z.coerce.number().min(1, "Price is required"),
    cost: z.coerce.number().min(1, "Cost is required"),
    stock: z.coerce.number().min(0, "Stock must be at least 0"),
    lowStockAlert: z.coerce.number().min(0, "Low stock alert must be at least 0").optional(),
    sku: z.string().optional(),
    images: z.array(z.any()).min(1, "At least one image is required"),
});


export function ProductForm({
    product,
    categories,
    onSubmit,
    isEditing,
}: ProductFormProps) {
    const form = useForm<z.infer<typeof productFormSchema>>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: product?.name || "",
            description: product?.description || "",
            categoryId: product?.category.id || 0, // Changed to number 
            price: product?.price || 0,
            cost: product?.costPrice || 0,
            stock: product?.inventory?.quantity || 0,
            lowStockAlert: product?.inventory?.lowStockAlert || 0,
            sku: product?.sku || "",
            images: product?.images?.map((img) => img.url) || [],
        },

    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} >
                {/* Details Tab */}
                <TabsContent value="details" className="space-y-4 pt-4">
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col items-start gap-4 w-full">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Product Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Jollof Rice Special" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value.toString()}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent className="w-full">
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id} value={category.id.toString()}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Describe the product..." rows={4} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </TabsContent>

                {/* Inventory Tab */}
                <TabsContent value="inventory" className="space-y-4 mb-6 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SKU</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., RICE-001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stock</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g., 100" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control} name="lowStockAlert"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Low Stock Alert</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g., 10" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g., 2000" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cost"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cost</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g., 1500" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </TabsContent>

                {/* Images Tab */}
                <TabsContent value="images" className="space-y-4 mb-6 pt-4">
                    <ImageUploader name="images" />
                </TabsContent>


                <AuthButton buttonText={isEditing ? "Update Product" : "Add Product"} loading={form.formState.isSubmitting} />
            </form>
        </Form>
    );
}
