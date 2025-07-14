"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Calendar, Upload, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { FlyerAd } from "@/lib/generated/prisma"
import { toast } from "sonner"
import { updateFlyer } from "@/actions/admin/ads-actions"

// interface FlyerAd {
//   id: number
//   title: string
//   imageUrl: string
//   linkUrl?: string
//   isActive: boolean
//   position: "top" | "middle" | "footer"
//   createdAt: Date
//   expiresAt?: Date
// }

interface EditFlyerModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    flyer: FlyerAd
    onSubmit: (flyer: FlyerAd) => void
}

const formSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
    imageUrl: z.string().min(1, "Image URL is required").url("Please enter a valid URL"),
    linkUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    position: z.enum(["top", "middle", "footer"], {
        required_error: "Please select a position",
    }),
    isActive: z.boolean(),
    expiresAt: z.date().optional(),
})

type FormData = z.infer<typeof formSchema>

export function EditFlyerModal({ open, onOpenChange, flyer, onSubmit }: EditFlyerModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<FormData, any, FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            imageUrl: "",
            linkUrl: "",
            position: "top",
            isActive: true,
            expiresAt: undefined,
        },
    })

    // Update form when flyer changes
    useEffect(() => {
        if (flyer && open) {
            form.reset({
                title: flyer.title,
                imageUrl: flyer.imageUrl,
                linkUrl: flyer.linkUrl || "",
                position: flyer.position,
                isActive: flyer.isActive,
                expiresAt: flyer.expiresAt || undefined,
            })
        }
    }, [flyer, open, form])

    const handleSubmit = async (data: FormData) => {
        setIsSubmitting(true)

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500))
            const response = await updateFlyer(flyer.id, data)
            if (response.error || !response.data) {
                toast.error("Failed to update flyer: " + response.message)
                return
            }
            onSubmit(response.data)
            toast.success(response.message)
            onOpenChange(false)
        } catch (error) {
            console.error("Error updating flyer:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // In a real app, you would upload to a service like Cloudinary or AWS S3
            const mockUrl = `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(file.name)}`
            form.setValue("imageUrl", mockUrl)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Flyer</DialogTitle>
                    <DialogDescription>Update the flyer advertisement details.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="grid gap-4">
                            {/* Title */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter flyer title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Image Upload */}
                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image</FormLabel>
                                        <FormControl>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Input placeholder="Enter image URL or upload file" {...field} />
                                                    <div className="relative">
                                                        <Input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageUpload}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        />
                                                        <Button type="button" variant="outline" size="sm">
                                                            <Upload className="h-4 w-4 mr-2" />
                                                            Upload
                                                        </Button>
                                                    </div>
                                                </div>
                                                {field.value && (
                                                    <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                                                        <img
                                                            src={field.value || "/placeholder.svg"}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            className="absolute top-2 right-2"
                                                            onClick={() => form.setValue("imageUrl", "")}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Link URL */}
                            <FormField
                                control={form.control}
                                name="linkUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Link URL</FormLabel>
                                        <FormControl>
                                            <Input type="url" placeholder="https://example.com" {...field} />
                                        </FormControl>
                                        <FormDescription>Optional URL to redirect users when they click the flyer</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Position */}
                            <FormField
                                control={form.control}
                                name="position"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Position</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select position" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="top">Top</SelectItem>
                                                <SelectItem value="middle">Middle</SelectItem>
                                                <SelectItem value="footer">Footer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>Choose where the flyer will be displayed on the page</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Expiration Date */}
                            <FormField
                                control={form.control}
                                name="expiresAt"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Expiration Date</FormLabel>
                                        <div className="flex items-center gap-2">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "flex-1 pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground",
                                                            )}
                                                        >
                                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <CalendarComponent
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => date < new Date()}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {field.value && (
                                                <Button type="button" variant="outline" size="sm" onClick={() => field.onChange(undefined)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                        <FormDescription>Optional expiration date for the flyer</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Active Status */}
                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Active</FormLabel>
                                            <FormDescription>Make this flyer visible to users</FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Updating..." : "Update Flyer"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
