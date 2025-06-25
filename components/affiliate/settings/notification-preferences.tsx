"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { zodResolver } from "@hookform/resolvers/zod"
import { Bell, Loader2, Save } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const notificationSchema = z.object({
    commissionEmail: z.boolean(),
    referralEmail: z.boolean(),
})

type NotificationPreferencesFormValues = z.infer<typeof notificationSchema>
const NotificationPreferences = () => {
    const form = useForm<NotificationPreferencesFormValues>({
        resolver: zodResolver(notificationSchema),
        defaultValues: {
            commissionEmail: true,
            referralEmail: true,
        },
    })
    return (
        <Card className="border-emerald-200 shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-emerald-600" />
                    Notification Preferences
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <Form {...form}>
                    <form className="space-y-4">
                        <FormField control={form.control} name="commissionEmail" render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                        Commission Notifications
                                    </FormLabel>
                                    <p className="text-sm text-gray-600">Notify me via email when I earn a commission</p>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-emerald-600"
                                    />
                                </FormControl>
                                <FormMessage className="animate-fade-in" />
                            </FormItem>
                        )} />
                        <Separator />
                        <FormField control={form.control} name="referralEmail" render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <FormLabel htmlFor="referralEmail" className="text-base">
                                        Referral Notifications
                                    </FormLabel>
                                    <p className="text-sm text-gray-600">Notify me via email when someone uses my referral code</p>
                                </div>
                                <FormControl>
                                    <Switch
                                        id="referralEmail"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-emerald-600"
                                    />
                                </FormControl>
                                <FormMessage className="animate-fade-in" />
                            </FormItem>
                        )} />

                        <div className="flex justify-end">
                            <Button
                                disabled={form.formState.isSubmitting || !form.formState.isValid}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                {form.formState.isSubmitting ? (
                                    <div className="flex items-center space-x-2">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        <span>Saving Preferences...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Preferences
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>

                </Form>

            </CardContent>
        </Card>
    )
}

export default NotificationPreferences