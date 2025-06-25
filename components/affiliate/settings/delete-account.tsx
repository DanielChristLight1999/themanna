"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, AlertTriangle, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { deleteAffiliate } from "@/actions/affiliate/user-actions"
import { toast } from "sonner"
import { LogOutOAuth } from "@/actions/authactions"

const DeleteAccount = ({totalEarnings}: {totalEarnings: number}) => {
    const [loading, setLoading] = useState(false)
    const handleDeleteAccount = async () => {
        setLoading(true)
        const response = await deleteAffiliate()
        if (response.error) {
            toast.error(response.message)
            setLoading(false)
        } else {
            toast.success(response.message)
            await LogOutOAuth("/auth/login")
            setLoading(false)
        }
    }
    return (
        <Card className="border-red-200 shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-red-900 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                    Danger Zone
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-red-900">Delete Account</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Once you delete your account, there is no going back. Please be certain. All your data, including
                            earnings history and referrals, will be permanently deleted.
                        </p>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Account
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your affiliate account and remove all
                                    your data from our servers, including:
                                    <br />
                                    <br />• All earnings history (₦{totalEarnings.toLocaleString()})
                                    <br />• Referral links and codes
                                    <br />• Commission records
                                    <br />• Account preferences and settings
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteAccount}
                                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span className="ml-2">Deleting...</span>
                                        </div>
                                    ) : "Yes, delete my account"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    )
}

export default DeleteAccount