"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarClock, Mail, Phone, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { $Enums } from "@/lib/generated/prisma"
import { updateUserProfile } from "@/actions/authactions"
import AuthButton from "../common/AuthButton"
import { useRouter } from "next/navigation"

interface ProfileSummaryCardProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    role: $Enums.Role;
    createdAt: Date;
}
}

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfileSummaryCard({ user }: ProfileSummaryCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || "",
      phone: user.phone || "",
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    // In a real app, you would send this data to your API
    const response = await updateUserProfile(data);
    if (response.error) {
      toast.error(response.message)
      return
    }
    toast.success(response.message)
    setIsEditing(false)
    router.refresh()
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="border-b">
        <CardTitle className="text-xl">Profile Information</CardTitle>
        <CardDescription>View and update your personal information</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
                <span className="text-xs">(cannot be changed)</span>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <AuthButton buttonText="Save Changes" loading={form.formState.isSubmitting} className="bg-orange-600 hover:bg-orange-700" />
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="font-medium">{user.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarClock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                <p className="font-medium">{format(new Date(user.createdAt), "MMMM d, yyyy")}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {!isEditing && (
        <CardFooter className="border-t flex justify-end">
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="border-orange-200 cursor-pointer hover:bg-orange-50 hover:text-orange-700"
          >
            Edit Profile
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
