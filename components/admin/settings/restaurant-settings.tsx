"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, UploadIcon } from "lucide-react"
import { RestaurantInfo } from "@/lib/generated/prisma"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { upload } from "@vercel/blob/client"
import { updateRestaurantInfo } from "@/actions/admin/settings-actions"
import { toast } from "sonner"
import AuthButton from "@/components/Apps/common/AuthButton"
import { RolePermissionSettings } from "@/lib/permissions/types"

export const restaurantInfoSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().min(1),
  website: z.string().min(1),
  logo: z.instanceof(File).optional().refine((file) => file?.type.startsWith("image/"), "Invalid file type. Please upload an image."),

})

async function uploadImage(file: (File)) {
  let fileName: string;
  let blob: Blob;

  fileName = file.name;
  blob = file;

  // else {
  //   fileName = file.name;
  //   blob = await fetch(file.preview).then(res => res.blob());
  // }

  const response = await upload(`images/products/${fileName}`, blob, {
    access: 'public',
    handleUploadUrl: "/api/imageupload",

  });
  console.log("response", response)
  return response.url;
}

export function RestaurantSettings({ restaurant, permissions }: { restaurant: RestaurantInfo, permissions: RolePermissionSettings }) {
  const canUpdateSettings = permissions?.settings?.update ?? false
  const [previewLogo, setPreviewLogo] = useState<string | null>(restaurant.logo || null)

  const form = useForm<z.infer<typeof restaurantInfoSchema>>({
    resolver: zodResolver(restaurantInfoSchema),
    defaultValues: {
      name: restaurant.name,
      description: restaurant.description,
      address: restaurant.address,
      phone: restaurant.phone,
      email: restaurant.email,
      website: restaurant.website,
      logo: undefined,
    }
  })
  const handleLogoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Update form data
      form.setValue("logo", file)

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setPreviewLogo(previewUrl)

      // Clean up the URL when component unmounts or when a new file is selected
      return () => URL.revokeObjectURL(previewUrl)
    }
  }, [form])
  const onSubmit = async (data: z.infer<typeof restaurantInfoSchema>) => {
    if (!canUpdateSettings) return
    const updateData = {
      ...restaurant,
      name: data.name,
      description: data.description,
      address: data.address,
      phone: data.phone,
      email: data.email,
      website: data.website,
    }
    if (data.logo) {
      const imageurl = await uploadImage(data.logo)
      updateData.logo = imageurl
    }
    const response = await updateRestaurantInfo(updateData)
    if (response.error) {
      toast.error(response.message)
      return
    }
    toast.success(response.message)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Restaurant Information</CardTitle>
          <CardDescription>Update your restaurant&#39;s basic information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Restaurant Name</FormLabel>
                    <FormControl>
                      <Input disabled={!canUpdateSettings} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input disabled={!canUpdateSettings} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input disabled={!canUpdateSettings} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="website" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input disabled={!canUpdateSettings} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input disabled={!canUpdateSettings} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea disabled={!canUpdateSettings} rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />


              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Restaurant Logo</FormLabel>
                    <div className="flex items-center gap-4">
                      <Card className="w-[100px] h-[100px] px-2 flex items-center justify-center relative overflow-hidden">
                        {previewLogo ? (
                          <Image
                            src={previewLogo}
                            alt="Restaurant logo preview"
                            width={80}
                            height={80}
                            className="object-cover w-full"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <ImageIcon className="h-8 w-8 mb-1" />
                            <span className="text-xs">No logo</span>
                          </div>
                        )}
                      </Card>
                      <div>
                        <Input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                          ref={field.ref}
                          disabled={!canUpdateSettings}
                        />
                        <Label htmlFor="logo-upload">
                          <Button disabled={!canUpdateSettings} variant="outline" className="gap-2" asChild>
                            <div>
                              <UploadIcon className="h-4 w-4" />
                              Upload Logo
                            </div>
                          </Button>
                        </Label>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AuthButton disabled={!canUpdateSettings} buttonText="Save Changes" loading={form.formState.isSubmitting} />
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
          <CardDescription>Set your restaurant's opening and closing times</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(restaurantInfo.openingHours).map(([day, hours]) => (
              <div key={day} className="grid grid-cols-3 gap-4 items-center">
                <Label className="capitalize">{day}</Label>
                <TimeInput
                  value={hours.open}
                  onChange={(value) =>
                    setRestaurantInfo({
                      ...restaurantInfo,
                      openingHours: {
                        ...restaurantInfo.openingHours,
                        [day]: { ...hours, open: value },
                      },
                    })
                  }
                />
                <TimeInput
                  value={hours.close}
                  onChange={(value) =>
                    setRestaurantInfo({
                      ...restaurantInfo,
                      openingHours: {
                        ...restaurantInfo.openingHours,
                        [day]: { ...hours, close: value },
                      },
                    })
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card> */}
    </div>
  )
}
