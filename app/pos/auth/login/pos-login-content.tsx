"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Lock, Loader2, AlertCircle, Utensils } from "lucide-react"
import { LoginAdmin } from "@/actions/authactions"
import { toast } from "sonner"

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function POSLoginContent() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true)
        setError("")

        try {
            const response = await LoginAdmin(data.email, data.password)
            if (response.error) {
                toast.error(response.message)
                setError(response.message)
                return
            }
            toast.success("Successfully logged in")
            router.push("/")
        } catch (err) {
            setError("Invalid email or password. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-emerald-600"></div>
                <div className="absolute top-32 right-20 w-16 h-16 rounded-full bg-green-600"></div>
                <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full bg-emerald-500"></div>
                <div className="absolute bottom-40 right-10 w-12 h-12 rounded-full bg-green-500"></div>
                <div className="absolute top-1/2 left-1/4 w-8 h-8 rounded-full bg-emerald-400"></div>
                <div className="absolute top-1/3 right-1/3 w-6 h-6 rounded-full bg-green-400"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-6">
                        <div className="bg-emerald-600 p-4 rounded-full shadow-lg">
                            <Utensils className="h-12 w-12 text-white" />
                        </div>
                    </div>
                    <div className="mb-4">
                        <h1 className="text-4xl font-bold text-emerald-800 mb-2">The Mana</h1>
                        <div className="w-16 h-1 bg-emerald-600 mx-auto rounded-full"></div>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">POS Staff Login</h2>
                    <p className="text-gray-600">Access your cashier terminal</p>
                </div>

                {/* Login Form */}
                <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-gray-800">Welcome Back</h3>
                            <p className="text-sm text-gray-500 mt-1">Sign in to start your shift</p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* Email Field */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <Input
                                                        {...field}
                                                        type="email"
                                                        placeholder="Enter your email"
                                                        className="h-14 pl-12 text-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                                                        autoComplete="email"
                                                        autoFocus
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                {/* Password Field */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <Input
                                                        {...field}
                                                        type="password"
                                                        placeholder="Enter your password"
                                                        className="h-14 pl-12 text-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                                                        autoComplete="current-password"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                {/* Error Message */}
                                {error && (
                                    <Alert variant="destructive" className="border-red-200 bg-red-50">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription className="text-red-700">{error}</AlertDescription>
                                    </Alert>
                                )}

                                {/* Login Button */}
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-14 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Signing In...
                                        </>
                                    ) : (
                                        "Login to POS"
                                    )}
                                </Button>

                            </form>
                        </Form>

                        {/* Support Link */}
                        <div className="text-center mt-6 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                Having issues?{" "}
                                <button
                                    type="button"
                                    className="text-emerald-600 hover:text-emerald-700 font-medium underline focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded"
                                    onClick={() => alert("Please contact your manager for assistance.")}
                                >
                                    Contact your manager
                                </button>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-gray-500">
                    <p>The Mana Restaurant POS System</p>
                    <p className="mt-1">© 2024 All rights reserved</p>
                </div>
            </div>

            {/* Touch-friendly styles for mobile */}
            <style jsx global>{`
        @media (max-width: 768px) {
          input[type="email"],
          input[type="password"] {
            font-size: 16px !important; /* Prevents zoom on iOS */
          }
        }
      `}</style>
        </div>
    )
}
