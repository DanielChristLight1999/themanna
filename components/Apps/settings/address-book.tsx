"use client"

import { useState } from "react"
import { Edit, Loader2, MapPin, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Address } from "@/lib/generated/prisma"
import { createNewAddress, deleteAddress, setDefaultAddress, updateAddress } from "@/actions/settingsactions"
import { useRouter } from "next/navigation"

// interface Address {
//   id: string
//   label: string
//   street: string
//   city: string
//   state: string
//   zipCode: string
//   isDefault: boolean
// }

export const addressFormSchema = z.object({
  label: z.string().min(1, { message: "Label is required." }),
  street: z.string().min(1, { message: "Street address is required." }),
  city: z.string().min(1, { message: "City is required." }),
  state: z.string().min(1, { message: "State is required." }),
  zipCode: z.string().min(5, { message: "Valid ZIP code is required." }),
})

type AddressFormValues = z.infer<typeof addressFormSchema>

export default function AddressBook({ addresses }: { addresses: Address[] }) {
  // const [addresses, setAddresses] = useState<Address[]>(addressesdata)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const router = useRouter()
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      label: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  })

 async function onSubmit(data: AddressFormValues) {
    if (editingAddress) {
      // Update existing address
      const response = await updateAddress(editingAddress.id, data)
      if (response.error) {
        toast.error(response.message)
        return
      }
      toast.success(response.message)      
    } else {
      // Add new address
      const response = await createNewAddress(data)
      if (response.error) {
        toast.error(response.message)
        return
      }
      toast.success(response.message)
    }

    setIsAddingAddress(false)
    setEditingAddress(null)
    form.reset()
    router.refresh()
  }

  function handleEdit(address: Address) {
    setEditingAddress(address)
    form.reset({
      label: address.label,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.postalCode as string,
    })
    setIsAddingAddress(true)
  }

  async function handleDelete(id: string) {
    const response = await deleteAddress(id)
    if (response.error) {
      toast.error(response.message)
      return
    }
    toast.success(response.message)
    router.refresh()
  }

  async function handleSetDefault(id: string) {
    const response = await setDefaultAddress(id)
    if (response.error) {
      toast.error(response.message)
      return
    }
    toast.success(response.message)
    router.refresh()
  }

  return (
    <Card className="h-full">
      <CardHeader className="border-b flex flex-row items-center justify-between">
        <div>
          <CardTitle>Address Book</CardTitle>
          <CardDescription>Manage your delivery addresses</CardDescription>
        </div>
        <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-1 h-4 w-4" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
              <DialogDescription>
                {editingAddress ? "Update your address information below." : "Enter the details for your new address."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Label</FormLabel>
                      <FormControl>
                        <Input placeholder="Home, Work, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
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
                          <Input placeholder="City" {...field} />
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
                          <Input placeholder="State" {...field} />
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
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input placeholder="12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddingAddress(false)
                      setEditingAddress(null)
                      form.reset()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                    {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : ""}
                    {editingAddress ? "Update Address" : "Add Address"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="pt-6">
        {addresses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="mx-auto h-8 w-8 mb-2 opacity-50" />
            <p>No addresses saved yet.</p>
            <p className="text-sm">Add an address to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`p-4 rounded-lg border ${address.isDefault ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/30" : ""}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{address.label}</h3>
                      {address.isDefault && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full dark:bg-emerald-900/50 dark:text-emerald-300">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{address.street}</p>
                    <p className="text-sm text-muted-foreground">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(address)} className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(address.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
                {!address.isDefault && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => handleSetDefault(address.id)}
                    className="mt-2 h-auto p-0 text-emerald-600 hover:text-emerald-700"
                  >
                    Set as default
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
