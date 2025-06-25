import { createPayout } from "@/actions/admin/affiliate-actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { PendingPayoutType } from "@/lib/admin-data/types"
import { formatPrice } from "@/lib/utils"
import { useState } from "react"
import { toast } from "sonner"

const PayoutModal = ({selectedPayout, setSelectedPayout}: {selectedPayout: PendingPayoutType | null, setSelectedPayout: React.Dispatch<React.SetStateAction<PendingPayoutType | null>>}) => {
    const [payoutNote, setPayoutNote] = useState<string>("")
    const confirmPayout = async () => {
        if (selectedPayout) {
            const response = await createPayout(selectedPayout, payoutNote)
            if (response.error) {
                toast.error(response.message)
            }else {
                toast.success(response.message)
                setSelectedPayout(null)
                setPayoutNote("")
                return
            }
            setSelectedPayout(null)
        }
    }
    return (
        < Dialog open={!!selectedPayout} onOpenChange={() => setSelectedPayout(null)}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-gray-900">Confirm Payout</DialogTitle>
                    <DialogDescription>Review the payout details before confirming the transaction.</DialogDescription>
                </DialogHeader>
                {selectedPayout && (
                    <div className="grid gap-4 py-4">
                        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Affiliate:</span>
                                <span className="text-gray-900">{selectedPayout.affiliateName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Amount:</span>
                                <span className="font-semibold text-green-600">
                                    {formatPrice(selectedPayout.unpaidCommissionTotal)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Bank:</span>
                                <span className="text-gray-900">{selectedPayout.bankName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Account:</span>
                                <span className="text-gray-900">{selectedPayout.accountNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Account Name:</span>
                                <span className="text-gray-900">{selectedPayout.accountName}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="payout-note" className="text-sm font-medium text-gray-700">
                                Payout Note (Optional)
                            </label>
                            <Textarea
                                id="payout-note"
                                placeholder="Enter a note for this payout..."
                                value={payoutNote}
                                onChange={(e) => setPayoutNote(e.target.value)}
                                className="resize-none"
                            />
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => setSelectedPayout(null)}>
                        Cancel
                    </Button>
                    <Button onClick={confirmPayout} className="bg-green-600 hover:bg-green-700 text-white">
                        Confirm Payout
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}

export default PayoutModal