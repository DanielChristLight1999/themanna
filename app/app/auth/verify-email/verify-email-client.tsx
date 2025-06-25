"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Mail, Clock, CheckCircle, AlertCircle, RefreshCw, Shield, Sparkles, Star, Send } from "lucide-react"
import Link from "next/link"
import { emailVerificationSchema, type EmailVerificationFormData } from "@/lib/validations"
import { sendVerificationEmail, verifyEmailCode } from "@/actions/authactions"
import { toast } from "sonner"
import { VerificationCodeInput } from "@/components/Apps/common/verification-code-input"
import { useLocalStorage } from "usehooks-ts"

export default function VerifyEmailPage({ email }: { email: string }) {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [serverError, setServerError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [resendCooldown, setResendCooldown] = useState(0)
    const [hasCodeBeenSent, setHasCodeBeenSent] = useState(false)
    const [resendCooldownExpires, setResendCooldownExpires, removeCooldownExpires] = useLocalStorage<number>('resendCooldownExpires', 0)
    // Initialize from localStorage on mount
    useEffect(() => {
        const now = Date.now()
        if (resendCooldownExpires && resendCooldownExpires > now) {
            const remaining = Math.floor((resendCooldownExpires - now) / 1000)
            setResendCooldown(remaining)
            setHasCodeBeenSent(true)

        }
    }, [resendCooldownExpires])

    // Update countdown every second
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            removeCooldownExpires()
        }
    }, [resendCooldown, removeCooldownExpires])

    const form = useForm<EmailVerificationFormData>({
        resolver: zodResolver(emailVerificationSchema),
        defaultValues: {
            code: "",
        },
        mode: "onChange",
    })

    const handleSendVerificationCode = async () => {
        if (!email) return

        setIsSending(true)
        setServerError("")
        setSuccessMessage("")

        try {
            const response = await sendVerificationEmail(email)

            if (response.error) {
                setServerError(response.message)
                toast.error(response.message)
                setIsSending(false)
                return
            }
            setResendCooldown(60) // 60 second cooldown
            setHasCodeBeenSent(true)
            toast.success(response.message)
            setSuccessMessage(response.message)
            const expiresAt = Date.now() + 60 * 1000
            setResendCooldown(60)
            setResendCooldownExpires(expiresAt)
        } catch (error) {
            setServerError(error instanceof Error ? error.message : "Failed to send verification email")
        } finally {
            setIsSending(false)
        }
    }

    const handleResendCode = async () => {
        if (resendCooldown > 0) return
        await handleSendVerificationCode()
    }

    const onSubmit = async (data: EmailVerificationFormData) => {
        setIsLoading(true)
        setServerError("")

        try {
            const response = await verifyEmailCode(email as string, data.code)
            if (response.error) {
                setServerError(response.message)
                toast.error(response.message)
                form.setValue("code", "") // Clear code input on error
                return
            }
            setSuccessMessage("Email verified successfully! Redirecting...")
            router.replace("/")

        } catch (error) {
            setServerError(error instanceof Error ? error.message : "Verification failed. Please try again.")
            form.setValue("code", "") // Clear code input on error
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Desktop Only */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-pink-500 to-orange-500">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    {/* Floating Elements */}
                    <div className="absolute top-20 left-20 animate-float">
                        <div className="w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <div className="absolute top-40 right-32 animate-float-delayed">
                        <div className="w-12 h-12 bg-white/15 rounded-full backdrop-blur-sm flex items-center justify-center">
                            <Star className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    <div className="absolute bottom-32 left-32 animate-float">
                        <div className="w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center">
                            <Sparkles className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    {/* Geometric Shapes */}
                    <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/5 rounded-full animate-pulse" />
                    <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-white/5 rounded-lg rotate-45 animate-spin-slow" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 text-white">
                    <div className="max-w-md">
                        <h1 className="text-4xl font-bold mb-6 animate-fade-in">Secure Your Account</h1>
                        <p className="text-xl opacity-90 mb-8 animate-fade-in-delayed">
                            Verify your email address to ensure the security of your account and enable all features
                        </p>
                        <div className="flex items-center justify-center space-x-2 animate-fade-in-delayed-2">
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-white">
                <div className="w-full max-w-md">
                    {/* Mobile Header */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
                        <p className="text-gray-600">Secure your account with email verification</p>
                    </div>

                    <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                        <CardHeader className="space-y-1 pb-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <Mail className="w-8 h-8 text-pink-600" />
                                </div>
                                <CardTitle className="text-2xl font-bold text-gray-900">Verify Your Email</CardTitle>
                                <CardDescription className="text-gray-600 mt-2">
                                    We need to verify your email address
                                    <br />
                                    <span className="font-semibold text-gray-900">{email}</span>
                                </CardDescription>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Success Message Alert */}
                            {successMessage && (
                                <Alert className="bg-green-50 border-green-200 animate-fade-in">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
                                </Alert>
                            )}

                            {/* Server Error Alert */}
                            {serverError && (
                                <Alert variant="destructive" className="animate-fade-in">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{serverError}</AlertDescription>
                                </Alert>
                            )}



                            {/* Send Verification Code Section */}
                            {!hasCodeBeenSent ? (
                                <div className="text-center space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                                        <div className="w-12 h-12 bg-pink-100 rounded-full mx-auto flex items-center justify-center">
                                            <Send className="w-6 h-6 text-pink-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900">Ready to verify?</h3>
                                        <p className="text-sm text-gray-600">
                                            Click the button below to send a verification code to your email address. We&#39;ll check that this
                                            email belongs to a registered account.
                                        </p>
                                    </div>

                                    <Button
                                        onClick={handleSendVerificationCode}
                                        disabled={isSending}
                                        className="w-full h-12 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                                    >
                                        {isSending ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Sending Code...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                <Send className="w-5 h-5" />
                                                <span>Send Verification Code</span>
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    {/* Verification Code Form */}
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                            <FormField
                                                control={form.control}
                                                name="code"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-center block text-sm font-medium text-gray-700">
                                                            Enter Verification Code
                                                        </FormLabel>
                                                        <FormControl>
                                                            <VerificationCodeInput
                                                                length={6}
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                disabled={isLoading}
                                                                error={!!form.formState.errors.code}
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-center animate-fade-in" />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button
                                                type="submit"
                                                disabled={isLoading || !form.formState.isValid}
                                                className="w-full h-12 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                                            >
                                                {isLoading ? (
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        <span>Verifying...</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center space-x-2">
                                                        <CheckCircle className="w-5 h-5" />
                                                        <span>Verify Email</span>
                                                    </div>
                                                )}
                                            </Button>
                                        </form>
                                    </Form>

                                    <Separator />

                                    {/* Resend Code Section */}
                                    <div className="text-center space-y-4">
                                        <p className="text-sm text-gray-600">Didn&#39;t receive the code?</p>

                                        {resendCooldown > 0 ? (
                                            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                                                <Clock className="w-4 h-4" />
                                                <span>Resend available in {resendCooldown}s</span>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                onClick={handleResendCode}
                                                disabled={isSending}
                                                className="border-2 border-pink-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                                            >
                                                {isSending ? (
                                                    <div className="flex items-center space-x-2">
                                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                                        <span>Sending...</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center space-x-2">
                                                        <RefreshCw className="w-4 h-4" />
                                                        <span>Resend Code</span>
                                                    </div>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Help Text */}
                            <div className="text-center text-xs text-gray-500 space-y-1">
                                <p>We&#39;ll only send codes to registered email addresses.</p>
                                <p>Check your spam folder if you don&#39;t see the email.</p>
                                {hasCodeBeenSent && <p>The verification code expires in 10 minutes.</p>}
                            </div>

                            {/* Alternative Actions */}
                            <Separator />

                            <div className="text-center space-y-2">
                                <p className="text-sm text-gray-600">Need to use a different email?</p>
                                <Link
                                    href="/login"
                                    className="text-sm text-pink-600 hover:text-pink-700 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded"
                                >
                                    Sign in with different account
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Footer */}
                    <div className="mt-8 text-center text-sm text-gray-500">
                        <p>
                            Having trouble?{" "}
                            <Link
                                href="/support"
                                className="text-pink-600 hover:underline focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded"
                            >
                                Contact Support
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
