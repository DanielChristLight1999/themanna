"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserIcon } from "lucide-react"

interface PosSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onStartSession: (cashierName: string) => void
}

// Mock cashier data
const cashiers = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Mike Johnson" },
  { id: "4", name: "Sarah Williams" },
]

export function PosSessionDialog({ open, onOpenChange, onStartSession }: PosSessionDialogProps) {
  const [selectedCashier, setSelectedCashier] = useState("")
  const [customCashier, setCustomCashier] = useState("")
  const [useCustomName, setUseCustomName] = useState(false)

  const handleStartSession = () => {
    const cashierName = useCustomName ? customCashier : selectedCashier
    if (cashierName.trim()) {
      onStartSession(cashierName)
      onOpenChange(false)
      // Reset form
      setSelectedCashier("")
      setCustomCashier("")
      setUseCustomName(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Start POS Session
          </DialogTitle>
          <DialogDescription>Select or enter the cashier name to start a new POS session.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Cashier</Label>
            <Select
              value={selectedCashier}
              onValueChange={(value) => {
                setSelectedCashier(value)
                setUseCustomName(false)
              }}
              disabled={useCustomName}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a cashier" />
              </SelectTrigger>
              <SelectContent>
                {cashiers.map((cashier) => (
                  <SelectItem key={cashier.id} value={cashier.name}>
                    {cashier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-center">
            <span className="text-sm text-muted-foreground">or</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-cashier">Enter Custom Name</Label>
            <Input
              id="custom-cashier"
              placeholder="Enter cashier name"
              value={customCashier}
              onChange={(e) => {
                setCustomCashier(e.target.value)
                setUseCustomName(!!e.target.value)
                if (e.target.value) setSelectedCashier("")
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleStartSession} disabled={!selectedCashier && !customCashier.trim()}>
            Start Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
