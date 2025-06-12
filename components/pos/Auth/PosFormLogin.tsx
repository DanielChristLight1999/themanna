"use client"

import { LoginAdmin } from "@/actions/authactions"
import ReusableAuthForm from "@/components/Apps/AuthForm"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { z } from "zod"

const schema = z.object({
    email: z.string().email({message: "Valid email is required"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters"})
})
const fields = [
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
]
const defaultValues = {
    email: "",
    password: "",
}
const PosFormLogin = () => {
    const router = useRouter()
    async function onSubmit(values: z.infer<typeof schema>) {
        const response = await LoginAdmin(values.email, values.password)
        if (response.error) {
            toast.error(response.message)
            return
        }
        toast.success("Successfully logged in")
        router.push("/")
    }
    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <h1 className="text-center text-4xl font-bold">POS Login</h1>
            <ReusableAuthForm className="h-fit max-w-xl w-full border-none" googleLogin={false} type="login" defaultValues={defaultValues} fields={fields} onSubmit={onSubmit} schema={schema} />
        </div>
    )
}

export default PosFormLogin