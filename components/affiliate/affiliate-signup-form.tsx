"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Loader2, Mail, Lock, AlertCircle, CheckCircle, User, Phone, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { signupSchema } from "@/lib/validations"
import { formatPhoneNumber } from "@/lib/phone-utils"
import Link from "next/link"
import { Checkbox } from "../ui/checkbox"
import { PasswordStrength } from "../Apps/common/password-strength"
import { createAffiliate } from "@/actions/affiliate/user-actions"

// Zod validation schema
// const signupSchema = z.object({
//   email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
//   password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
// })

type SignupFormValues = z.infer<typeof signupSchema>

export function AffiliateSignupForm() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [signupSuccess, setSignupSuccess] = useState(false)
    const [signupError, setsignupError] = useState<string | null>(null)

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            firstName: "",
            phone: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            acceptTerms: false,
        },
        mode: "onChange",
    })



    const watchedPassword = form.watch("password")

    const handlePhoneChange = (value: string) => {
        const formatted = formatPhoneNumber(value)
        form.setValue("phone", formatted, { shouldValidate: true })
    }

    const onSubmit = async (data: SignupFormValues) => {
        setIsLoading(true)
        setsignupError("")
        const response = await createAffiliate(data)
        if (response.error) {
            toast.error(response.message)
            setSignupSuccess(true)
            setIsLoading(false)
            return
        }

        toast.success(response.message);
        router.push("/success")
    }

    return (
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-semibold text-center text-slate-900">Sign In</CardTitle>
                <CardDescription className="text-center text-slate-600">
                    Enter your credentials to access the affiliate panel
                </CardDescription>
            </CardHeader>

            <CardContent>
                {/* Success Message */}
                {signupSuccess && (
                    <Alert className="mb-6 border-emerald-200 bg-emerald-50">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                        <AlertDescription className="text-emerald-800">
                            Request submitted to Admin...check email
                        </AlertDescription>
                    </Alert>
                )}

                {/* Error Message */}
                {signupError && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">{signupError}</AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name Field */}
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">First Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <Input
                                                {...field}
                                                type="text"
                                                placeholder="Enter your first name"
                                                className="pl-10 h-12 border-2 transition-all duration-200 focus:border-pink-400 focus:ring-pink-400"
                                                aria-describedby={form.formState.errors.firstName ? "firstName-error" : undefined}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage id="firstName-error" className="animate-fade-in" />
                                </FormItem>
                            )}
                        />

                        {/* Last Name Field */}
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">Last Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <Input
                                                {...field}
                                                type="text"
                                                placeholder="Enter your last name"
                                                className="pl-10 h-12 border-2 transition-all duration-200 focus:border-pink-400 focus:ring-pink-400"
                                                aria-describedby={form.formState.errors.lastName ? "lastName-error" : undefined}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage id="lastName-error" className="animate-fade-in" />
                                </FormItem>
                            )}
                        />
                        {/* Phone Field */}
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">Phone Number</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <Input
                                                {...field}
                                                type="tel"
                                                placeholder="+234 812 345 6789"
                                                onChange={(e) => handlePhoneChange(e.target.value)}
                                                className="pl-10 h-12 border-2 transition-all duration-200 focus:border-pink-400 focus:ring-pink-400"
                                                aria-describedby={form.formState.errors.phone ? "phone-error" : undefined}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage id="phone-error" className="animate-fade-in" />
                                </FormItem>
                            )}
                        />


                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-slate-700">Email Address</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                {...field}
                                                type="email"
                                                autoComplete="email"
                                                placeholder="john.doe@example.com"
                                                className="pl-10 h-12 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                disabled={isLoading || signupSuccess}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password Field */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <Input
                                                {...field}
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Create a password"
                                                className="pl-10 pr-10 h-12 border-2 transition-all duration-200 focus:border-pink-400 focus:ring-pink-400"
                                                aria-describedby={form.formState.errors.password ? "password-error" : "password-strength"}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage id="password-error" className="animate-fade-in" />
                                    {watchedPassword && <PasswordStrength password={watchedPassword} className="mt-2" />}
                                </FormItem>
                            )}
                        />

                        {/* Confirm Password Field */}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">Confirm Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <Input
                                                {...field}
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirm your password"
                                                className="pl-10 pr-10 h-12 border-2 transition-all duration-200 focus:border-pink-400 focus:ring-pink-400"
                                                aria-describedby={
                                                    form.formState.errors.confirmPassword ? "confirm-password-error" : undefined
                                                }
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage id="confirm-password-error" className="animate-fade-in" />
                                </FormItem>
                            )}
                        />

                        {/* Terms and Conditions */}
                        <FormField
                            control={form.control}
                            name="acceptTerms"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            aria-describedby={form.formState.errors.acceptTerms ? "terms-error" : undefined}
                                        />
                                    </FormControl>
                                    <div className="space-y-1">
                                        <FormLabel className="text-sm text-gray-600 block leading-relaxed">
                                            I agree to the{" "}
                                            <Link
                                                href="/terms"
                                                className="text-pink-600 hover:underline focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded"
                                            >
                                                Terms of Service
                                            </Link>{" "}
                                            and{" "}
                                            <Link
                                                href="/privacy"
                                                className="text-pink-600 hover:underline focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded"
                                            >
                                                Privacy Policy
                                            </Link>
                                        </FormLabel>
                                        <FormMessage id="terms-error" className="animate-fade-in" />
                                    </div>
                                </FormItem>
                            )}
                        />


                        {/* Submit Button */}
                        {/* <Button
                            type="submit"
                            disabled={isLoading || signupSuccess ||!form.formState.isValid}
                            className="w-full h-12 text-base font-medium bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing In...
                                </>
                            ) : signupSuccess ? (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Success!
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button> */}
                        <Button
                            type="submit"
                            disabled={isLoading || !form.formState.isValid}
                            className="w-full h-12 text-base font-medium bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Creating Account...</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <span>Create Account</span>
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="pt-6">
              <div className="text-center w-full">
                <p className="text-sm text-gray-600">
                  Don&#39;t have an account?{" "}
                  <Link
                    href="/auth/signup"
                    className="font-semibold text-pink-600 hover:text-pink-700 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </CardFooter>
        </Card>
    )
}
