"use client"

import { useState } from "react"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { EyeIcon, MoreHorizontalIcon, SearchIcon } from "lucide-react"

// Mock data - would be replaced with actual data from API
const affiliates = [
  {
    id: "AFF-001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+234 812 345 6789",
    referralCode: "JOHNDOE10",
    totalReferrals: 28,
    totalCommission: 45000,
    pendingCommission: 12500,
    status: "ACTIVE",
    joinDate: "2023-01-15",
  },
  {
    id: "AFF-002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+234 803 456 7890",
    referralCode: "JANESMITH15",
    totalReferrals: 42,
    totalCommission: 68000,
    pendingCommission: 15000,
    status: "ACTIVE",
    joinDate: "2023-02-10",
  },
  {
    id: "AFF-003",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    phone: "+234 705 678 9012",
    referralCode: "MIKEJ20",
    totalReferrals: 15,
    totalCommission: 24000,
    pendingCommission: 8000,
    status: "INACTIVE",
    joinDate: "2023-03-05",
  },
  {
    id: "AFF-004",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "+234 908 765 4321",
    referralCode: "SARAHW25",
    totalReferrals: 35,
    totalCommission: 56000,
    pendingCommission: 18000,
    status: "ACTIVE",
    joinDate: "2023-01-20",
  },
  {
    id: "AFF-005",
    name: "David Okafor",
    email: "david.okafor@example.com",
    phone: "+234 812 345 6789",
    referralCode: "DAVIDO30",
    totalReferrals: 22,
    totalCommission: 35000,
    pendingCommission: 10000,
    status: "ACTIVE",
    joinDate: "2023-02-25",
  },
]

export function AffiliatesTable() {
  const [selectedAffiliate, setSelectedAffiliate] = useState<any | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const handleViewDetails = (affiliate: any) => {
    setSelectedAffiliate(affiliate)
    setIsDetailsOpen(true)
  }

  return (
    <p>Table</p>
  )
}
    // <>
    //   <Card>
    //     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //       <CardTitle className="text-xl">Active Affiliates</CardTitle>
    //       <div className="relative w-64">
    //         <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
    //         <Input
    //           type="search"
    //           placeholder="Search affiliates..."
    //           className="pl-8 w-full"
    //         />
    //       </div>
    //     </CardHeader>
    //     <CardContent className="p-0">
    //       <Table>
    //         <TableHeader>
    //           <TableRow>
    //             <TableHead>Affiliate</TableHead>
    //             <TableHead>Referral Code</TableHead>
    //             <TableHead>Referrals</TableHead>
    //             <TableHead>Commission</TableHead>
    //             <TableHead>Status</TableHead>
    //             <TableHead className="text-right">Actions</TableHead>
    //           </TableRow>
    //         </TableHeader>
    //         <TableBody>
    //           {affiliates.map((affiliate) => (
    //             <TableRow key={affiliate.id}>
    //               <TableCell>
    //                 <div>
    //                   <div className="font-medium">{affiliate.name}</div>
    //                   <div className="text-xs text-muted-foreground">{affiliate.email}</div>
    //                 </div>
    //               </TableCell>
    //               <TableCell>{affiliate.referralCode}</TableCell>
    //               <TableCell>{affiliate.totalReferrals}</TableCell>
    //               <TableCell>₦{affiliate.totalCommission.toLocaleString()}</TableCell>
    //               <TableCell>
    //                 <Badge variant={affiliate.status === "ACTIVE" ? "success" : "secondary"}>
    //                   {affiliate.status}
    //                 </Badge>
    //               </TableCell>
    //               <TableCell className="text-right">
    //                 <div className="flex justify-end gap-2">
    //                   <Button variant="ghost" size="icon" onClick={() => handleViewDetails(affiliate)}>
    //                     <EyeIcon className="h-4 w-4" />
    //                   </Button>
    //                   <DropdownMenu>
    //                     <DropdownMenuTrigger asChild>
    //                       <Button variant="ghost" size="icon">
    //                         <MoreHorizontalIcon className="h-4 w-4" />
    //                       </Button>
    //                     </DropdownMenuTrigger>
    //                     <DropdownMenuContent align="end">
    //                       <DropdownMenuItem>View Referrals</DropdownMenuItem>
    //                       <DropdownMenuItem>Process Commission</DropdownMenuItem>
    //                       <DropdownMenuItem>Edit Details</DropdownMenuItem>
    //                       {affiliate.status === "ACTIVE" ? (
    //                         <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
    //                       ) : (
    //                         <DropdownMenuItem>Activate</DropdownMenuItem>
    //                       )}
    //                     \
