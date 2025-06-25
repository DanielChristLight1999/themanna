"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, CreditCard, Loader2 } from "lucide-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { createAffiliateBankAccount, updateAffiliateBankAccount } from "@/actions/affiliate/user-actions"
import { toast } from "sonner"

const payoutFormSchema = z.object({
    bankAccountName: z.string().min(1, "Bank Account Name is required"),
    bankName: z.string().min(1, "Bank Name is required"),
    bankAccountNumber: z.string().min(1, "Bank Account Number is required"),
})

type PayoutFormValues = z.infer<typeof payoutFormSchema>

const nigerianBanks = [
    "Access Bank",
    "Fidelity Bank",
    "First Bank of Nigeria",
    "Guaranty Trust Bank",
    "United Bank for Africa",
    "Zenith Bank",
    "Stanbic IBTC Bank",
    "Sterling Bank",
    "Union Bank",
    "Wema Bank",
    "FCMB",
    "Heritage Bank",
    "Keystone Bank",
    "Polaris Bank",
    "Unity Bank",
]

interface PayoutSettingsProps {
    bankAccount: {
        accountNumber: string,
        bankName: string,
        accountName: string
    } | null
}
const PayoutSettings = ({ bankAccount }: PayoutSettingsProps) => {
    const form = useForm<PayoutFormValues>({
        resolver: zodResolver(payoutFormSchema),
        defaultValues: {
            bankAccountName: bankAccount?.accountName || "",
            bankName: bankAccount?.bankName || "",
            bankAccountNumber: bankAccount?.accountNumber || "",
        },
    })
    const onSubmit = async (values: PayoutFormValues) => {
        if (bankAccount) {
            const response = await updateAffiliateBankAccount(values)
            if (response.error) {
                toast.error("Failed to update payout settings: " + response.message)
                return
            }
            toast.success(response.message)
        }
        else {
            const response = await createAffiliateBankAccount(values)
            if (response.error) {
                toast.error("Failed to update payout settings: " + response.message)
                return
            }
            toast.success(response.message)
        }
    }

    return (
        <Card className="border-emerald-200 shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-emerald-600" />
                    Payout Settings
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="bankAccountName" render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel>Bank Account Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                    </FormControl>
                                    <FormMessage className="animate-fade-in" />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="bankName" render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel>Bank Name</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500">
                                                <SelectValue placeholder="Select your bank" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {nigerianBanks.map((bank) => (
                                                    <SelectItem key={bank} value={bank}>
                                                        {bank}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage className="animate-fade-in" />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="bankAccountNumber" render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel>Bank Account Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                                            maxLength={10}
                                        />
                                    </FormControl>
                                    <FormMessage className="animate-fade-in" />
                                </FormItem>
                            )} />

                        </div>

                        <div className="flex justify-end">
                            <Button
                                disabled={form.formState.isSubmitting || !form.formState.isValid}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                {form.formState.isSubmitting ? (
                                    <div className="flex items-center space-x-2">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        <span>Saving Payout Settings...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Payout Settings
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

export default PayoutSettings