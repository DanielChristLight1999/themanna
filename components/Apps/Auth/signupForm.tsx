"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, Phone } from "lucide-react"
import Link from "next/link"
import { signupSchema, type SignupFormData } from "@/lib/validations"
import { PasswordStrength } from "../common/password-strength"
import { formatPhoneNumber } from "@/lib/phone-utils"
import { toast } from "sonner"
import { SignupUser, VerifyPhone } from "@/actions/authactions"
import { useRouter } from "next/navigation"

export default function SignupForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState("")
    const router = useRouter()

    const form = useForm<SignupFormData>({
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

    const onSubmit = async (data: SignupFormData) => {
        setIsLoading(true)
        setServerError("")
        const isValidPhone = await VerifyPhone(data.phone);

        if (isValidPhone.error || !isValidPhone.valid) {
            toast.error(isValidPhone.message)
            setServerError(isValidPhone.message)
            setIsLoading(false)
            return
        }
        const response = await SignupUser(data.email, data.password, data.confirmPassword, data.firstName, data.lastName, data.phone)
        if (response.error) {
            toast.error(response.message)
            setServerError(response.message)
            setIsLoading(false)
            return
        }

        toast.success(response.message);
        router.push("/")
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-white">
                <div className="w-full max-w-md">
                    {/* Mobile Header */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-600">Join us today</p>
                    </div>

                    <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                        <CardHeader className="space-y-1 pb-6">
                            <CardTitle className="text-2xl font-bold text-center text-gray-900">Sign Up</CardTitle>
                            <CardDescription className="text-center text-gray-600">
                                Create your account to get started
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Server Error Alert */}
                            {serverError && (
                                <Alert variant="destructive" className="animate-fade-in">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{serverError}</AlertDescription>
                                </Alert>
                            )}

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                                <FormLabel className="text-sm font-medium text-gray-700">Email Address</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                        <Input
                                                            {...field}
                                                            type="email"
                                                            placeholder="Enter your email"
                                                            className="pl-10 h-12 border-2 transition-all duration-200 focus:border-pink-400 focus:ring-pink-400"
                                                            aria-describedby={form.formState.errors.email ? "email-error" : undefined}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage id="email-error" className="animate-fade-in" />
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
                                    <Button
                                        type="submit"
                                        disabled={isLoading || !form.formState.isValid}
                                        className="w-full h-12 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
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
                                    Already have an account?{" "}
                                    <Link
                                        href="/auth/login"
                                        className="font-semibold text-pink-600 hover:text-pink-700 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded"
                                    >
                                        Sign in here
                                    </Link>
                                </p>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* Right Side - Desktop Only */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-bl from-orange-400 via-orange-500 to-pink-500">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    {/* Content Overlay */}
                    <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 text-white">
                        <div className="max-w-md">
                            <h1 className="text-4xl font-bold mb-6 animate-fade-in">Join Our Community!</h1>
                            <p className="text-xl opacity-90 mb-8 animate-fade-in-delayed">
                                Create your account and start your journey with us today
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
