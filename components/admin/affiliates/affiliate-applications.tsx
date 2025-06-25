"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckIcon, Loader2, XIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { PendingApplicationsType } from "@/lib/admin-data/types"
import { format } from "date-fns"
import { approveAffiliate, rejectAffiliate } from "@/actions/admin/affiliate-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Mock data - would be replaced with actual data from API
// const applications = [
//   {
//     id: "APP-001",
//     name: "Michael Adebayo",
//     email: "michael.adebayo@example.com",
//     phone: "+234 812 345 6789",
//     date: "2023-05-20",
//     status: "PENDING",
//     message: "I have a large social media following and would love to promote your restaurant.",
//   },
//   {
//     id: "APP-002",
//     name: "Chioma Eze",
//     email: "chioma.eze@example.com",
//     phone: "+234 803 456 7890",
//     date: "2023-05-19",
//     status: "PENDING",
//     message: "Food blogger with 10k+ followers on Instagram. I'd like to join your affiliate program.",
//   },
//   {
//     id: "APP-003",
//     name: "Tunde Bakare",
//     email: "tunde.bakare@example.com",
//     phone: "+234 705 678 9012",
//     date: "2023-05-18",
//     status: "PENDING",
//     message: "I run a local food delivery service and would like to partner with your restaurant.",
//   },
// ]

export function AffiliateApplications({applications}: {applications: PendingApplicationsType[]}) {
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null)
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const router = useRouter()

  const toggleExpand = (id: string) => {
    if (expandedApplication === id) {
      setExpandedApplication(null)
    } else {
      setExpandedApplication(id)
    }
  }

  const handleApprove = async (id: string) => {
    setIsApproving(true)
    const response = await approveAffiliate(id)
    if (response.error) {
      toast.error(response.message)
      return
    }
    toast.success(response.message)
    setExpandedApplication(null)
    router.refresh()
    setIsApproving(false)
  }
  const handleReject = async (id: string) => {
    setIsRejecting(true)
    const response = await rejectAffiliate(id)
    if (response.error) {
      toast.error(response.message)
      return
    }
    toast.success(response.message)
    setExpandedApplication(null)
    router.refresh()
    setIsRejecting(false)
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Pending Applications</span>
          <Badge variant="secondary">{applications.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-4">
            {applications.length > 0 ? (
              applications.map((application) => (
                <div key={application.id} className="space-y-3">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleExpand(application.id)}
                  >
                    <div>
                      <h3 className="font-medium">{application.name}</h3>
                      <p className="text-xs text-muted-foreground">{format(application.date, "dd/MM/yyyy")}</p>
                    </div>
                    <Badge variant="outline">New</Badge>
                  </div>

                  {expandedApplication === application.id && (
                    <div className="space-y-3 pl-2 border-l-2 border-muted">
                      <div className="text-sm space-y-1">
                        <p className="text-muted-foreground">Email: {application.email}</p>
                        <Link href={`tel:${application.phone}`} className="text-blue-600 hover:underline">
                          Phone: {application.phone}
                        </Link>
                      </div>
                      {/* <p className="text-sm">{application.message}</p> */}
                      <div className="flex gap-2">
                        <Button onClick={() => handleApprove(application.id)} size="sm" className="gap-1">
                         {isApproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckIcon className="h-4 w-4" /> }
                          {isApproving ? "Approving..." : "Approve"}
                        </Button>
                        <Button onClick={() => handleReject(application.id)} size="sm" variant="outline" className="gap-1">
                          {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XIcon className="h-4 w-4" /> }
                          {isRejecting ? "Rejecting..." : "Reject"}
                        </Button>
                      </div>
                    </div>
                  )}
                  <Separator />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">No pending applications</div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
