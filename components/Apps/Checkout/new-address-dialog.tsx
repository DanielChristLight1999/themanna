"use client"

import { useState } from "react"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import useUIStore from "@/stores/uistore"
import AuthButton from "../common/AuthButton"
import { createUserAddress } from "@/actions/authactions"
import { useRouter } from "next/navigation"
import { useCheckoutStore } from "@/stores/checkoutstore"

export const addressSchema = z.object({
    name: z.string().min(2, { message: "Address name must be at least 2 characters" }),
    address: z.string().min(5, { message: "Street address must be at least 5 characters" }),
    apartment: z.string().optional(),
    city: z.string().min(2, { message: "City is required" }),
    state: z.string().min(2, { message: "State is required" }),
    zipCode: z.string().min(5, { message: "ZIP code is required" }),
    isDefault: z.boolean(),
})

const formFields = [
    {
        name: 'name',
        label: 'Name',
        type: 'text',
        placeholder: 'Home, Work, etc.',
    },
    {
        name: 'address',
        label: 'Address',
        type: 'text',
        placeholder: '123 Main Street',
    },
    {
        name: 'apartment',
        label: 'Apartment/Suite (Optional)',
        type: 'text',
        placeholder: 'Apt 4B',
    },
    {
        name: 'city',
        label: 'City',
        type: 'text',
        placeholder: 'Lagos',
    },
    {
        name: 'state',
        label: 'State',
        type: 'text',
        placeholder: 'Lagos State',
    },
    {
        name: 'zipCode',
        label: 'ZIP/Postal Code',
        type: 'text',
        placeholder: '100001',
    },
    {
        name: 'isDefault',
        label: 'Set as default address',
        type: 'checkbox',
        placeholder: 'This address will be selected by default for future orders',
    },
]


export default function AddressFormDrawer() {

    const isopen = useUIStore((state) => state.isNewAddressDialogOpen)
    const setIsOpen = useUIStore((state) => state.setIsNewAddressDialogOpen)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const getuserAddresses = useCheckoutStore((state) => state.getuserAddresses)
    // const setIsOpen = useUIStore((state) => state.setIsNewAddressDialogOpen)

    const form = useForm<z.infer<typeof addressSchema>>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            name: "",
            address: "",
            apartment: "",
            city: "",
            state: "",
            zipCode: "",
            isDefault: false,
        },
    })

    const onSubmit = async (values: z.infer<typeof addressSchema>) => {
        setIsSubmitting(true)
        try {
            // Simulate API call to save address
            const response = await createUserAddress(values)
           
            if(response.error){
                toast.error(response.message)
                return
            }
            toast.success(response.message)
            // Reset form and close drawer
            form.reset()
            await getuserAddresses()
            setIsOpen(false)
        } catch (error) {
            console.error("Error adding address:", error)
            toast.error("")
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <Drawer repositionInputs={false} direction="bottom" open={isopen} onOpenChange={setIsOpen}>
            <DrawerContent >
                <div className="flex flex-col overflow-y-auto">
                    <DrawerHeader >
                        <DrawerTitle>Add New Address</DrawerTitle>
                        <DrawerDescription>Add a new delivery address to your account</DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 pb-10 overflow-y-auto">
                        <Form  {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 h-full">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Home, Work, etc." {...field} />
                                            </FormControl>
                                            <FormDescription>A name to help you identify this address</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                    
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Street Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123 Main Street" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                    
                                <FormField
                                    control={form.control}
                                    name="apartment"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Apartment/Suite (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Apt 4B" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                    
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>City</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Lagos" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                    
                                    <FormField
                                        control={form.control}
                                        name="state"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>State</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Lagos State" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                    
                                <FormField
                                    control={form.control}
                                    name="zipCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>ZIP/Postal Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder="100001" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                    
                                <FormField
                                    control={form.control}
                                    name="isDefault"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Set as default address</FormLabel>
                                                <FormDescription>This address will be selected by default for future orders</FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <AuthButton className="h-12" buttonText="Add" loading={isSubmitting}  />
                            </form>
                        </Form>
                    </div>
                </div>
                
            </DrawerContent>
        </Drawer>
    )
}


const AddressForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const setIsOpen = useUIStore((state) => state.setIsNewAddressDialogOpen)

    const form = useForm<z.infer<typeof addressSchema>>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            name: "",
            address: "",
            apartment: "",
            city: "",
            state: "",
            zipCode: "",
            isDefault: false,
        },
    })

    const onSubmit = async (values: z.infer<typeof addressSchema>) => {
        setIsSubmitting(true)
        try {
            // Simulate API call to save address
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Add the new address to the context

            // Show success message
            toast.success("")

            // Reset form and close drawer
            form.reset()
            setIsOpen(false)
        } catch (error) {
            console.error("Error adding address:", error)
            toast.error("")
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <div className="px-4 h-full">
            <Form  {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 h-full pb-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Home, Work, etc." {...field} />
                                </FormControl>
                                <FormDescription>A name to help you identify this address</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Street Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="123 Main Street" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="apartment"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Apartment/Suite (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Apt 4B" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Lagos" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Lagos State" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ZIP/Postal Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="100001" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isDefault"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Set as default address</FormLabel>
                                    <FormDescription>This address will be selected by default for future orders</FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />

                    <DrawerFooter className="px-0 pt-2">
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Address"
                            )}
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline" className="w-full">
                                Cancel
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </form>
            </Form>
        </div>
    )
}