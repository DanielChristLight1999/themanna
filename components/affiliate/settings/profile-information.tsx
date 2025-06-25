"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Save, User, Shield, Loader2 } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { updateAffiliate, updateAffiliateUserPassword } from "@/actions/affiliate/user-actions"
import { toast } from "sonner"

const profileSchema = z.object({
    name: z.string().min(1, "Full name is required"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    phone: z.string().min(1, "Phone number is required").max(15, "Phone number must be less than 15 characters"),
})
const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters long"),
    newPassword: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters long"),
})
type passwordFormValue = z.infer<typeof passwordSchema>
type profileFormValue = z.infer<typeof profileSchema>
export default function ProfileInformation({ initalProfileData }: { initalProfileData: {name: string | null, email: string, phone: string | null} }) {
    const form = useForm<profileFormValue>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: initalProfileData.name || "",
            email: initalProfileData.email || "",
            phone: initalProfileData.phone || "",
        },
    })
    const changePasswordForm = useForm<passwordFormValue>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    })
    const onSubmitProfile = async (data: profileFormValue) => {
        const { name, email, phone } = data
        const response = await updateAffiliate({ name, email, phone })
        if (response.error) {
            toast.error("Failed to update profile: " + response.message)
            return
        }
        toast.success(response.message)
    }
    const onSubmitPassword = async (data: passwordFormValue) => {
        const { currentPassword, newPassword, confirmPassword } = data
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        if(currentPassword === newPassword) {
            toast.error("New password cannot be the same as the current password")
            return
        }
        const response = await updateAffiliateUserPassword(currentPassword, newPassword, confirmPassword)
        if (response.error) {
            toast.error("Failed to update password: " + response.message)
            return
        }
        toast.success(response.message)
        changePasswordForm.reset()
    }
    return (
        <Card className="border-emerald-200 shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                    <User className="w-5 h-5 mr-2 text-emerald-600" />
                    Profile Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitProfile)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </FormControl>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input
                                        readOnly
                                        disabled
                                        {...field}
                                        className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </FormControl>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </FormControl>
                            </FormItem>
                        )} />
                        <div className="flex items-end justify-end">
                            <Button
                                disabled={form.formState.isSubmitting || !form.formState.isValid}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                {form.formState.isSubmitting ? (
                                    <div className="flex items-center space-x-2">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        <span>Saving Profile...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Profile
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>

                <Separator />

                {/* Change Password Section */}
                <Form {...changePasswordForm}>
                    <form onSubmit={changePasswordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Shield className="w-4 h-4 mr-2 text-emerald-600" />
                            Change Password
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField control={changePasswordForm.control} name="currentPassword" render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel>Current Password Address</FormLabel>
                                    <Input
                                        type="password"
                                        {...field}
                                        className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </FormItem>
                            )} />

                            <FormField control={changePasswordForm.control} name="newPassword" render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel>New Password</FormLabel>
                                    <Input
                                        type="password"
                                        {...field}
                                        className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </FormItem>
                            )} />
                            <FormField control={changePasswordForm.control} name="confirmPassword" render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <Input
                                        type="password"
                                        {...field}
                                        className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </FormItem>
                            )} />

                        </div>
                        <Button
                            disabled={changePasswordForm.formState.isSubmitting || !changePasswordForm.formState.isValid}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            {changePasswordForm.formState.isSubmitting ? (
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    <span>Changing Password...</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Save className="w-4 h-4 mr-2" />
                                    Change Password
                                </div>
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
