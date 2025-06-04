// "use client"

// import { useTransition, useState } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   Card, CardHeader, CardTitle, CardDescription,
//   CardContent, CardFooter
// } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { DateRange } from "react-day-picker"
// import { DateRangePicker } from "@/components/ui/date-range-picker"
// import { format } from "date-fns"
// import { PaymentMethod } from "@/lib/generated/prisma"
// import { generateReport } from "@/actions/admin/reports-actions"
// import { toast } from "sonner"

// export function ReportsGenerator() {
//   const [reportType, setReportType] = useState("sales")
//   const [dateRange, setDateRange] = useState<DateRange | undefined>()
//   const [location, setLocation] = useState("all")
//   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "all">("all")
//   const [include, setInclude] = useState({
//     summary: true,
//     charts: true,
//     details: true,
//   })
//   const [isPending, startTransition] = useTransition()
//   const [result, setResult] = useState<any>()

//   const handleGenerate = () => {
//     if(!dateRange || !dateRange.from || !dateRange.to) {
//       toast.error("Please select a valid date range")
//       return
//     }

//     startTransition(async () => {
//       const data = await generateReport({
//         reportType: reportType as any,
//         startDate: dateRange.from as Date,
//         endDate: dateRange.to as Date,
//         location: location === "all" ? undefined : location,
//         paymentMethod: paymentMethod === "all" ? undefined : paymentMethod,
//         includeSummary: include.summary,
//         includeCharts: include.charts,
//         includeDetails: include.details,
//       })

//       setResult(data)
//     })
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Custom Report Generator</CardTitle>
//         <CardDescription>Generate and export tailored business reports</CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         <div className="grid gap-4 sm:grid-cols-2">
//           <div className="space-y-2">
//             <Label>Report Type</Label>
//             <Select value={reportType} onValueChange={setReportType}>
//               <SelectTrigger><SelectValue placeholder="Select report type" /></SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="sales">Sales</SelectItem>
//                 <SelectItem value="products">Products</SelectItem>
//                 <SelectItem value="inventory">Inventory</SelectItem>
//                 <SelectItem value="customers">Customers</SelectItem>
//                 <SelectItem value="affiliates">Affiliates</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="space-y-2">
//             <Label>Date Range</Label>
//             <DateRangePicker value={dateRange} onChange={(range) => setDateRange(range)} />
//           </div>
//         </div>

//         <div className="grid gap-4 sm:grid-cols-2">
//           <div className="space-y-2">
//             <Label>Location</Label>
//             <Select value={location} onValueChange={setLocation}>
//               <SelectTrigger><SelectValue /></SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All</SelectItem>
//                 <SelectItem value="Lagos">Lagos</SelectItem>
//                 <SelectItem value="Abuja">Abuja</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="space-y-2">
//             <Label>Payment Method</Label>
//             <Select value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as PaymentMethod | "all")}>
//               {/* <Select value={paymentMethod} onValueChange={setPaymentMethod}> */}
//               <SelectTrigger><SelectValue /></SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All</SelectItem>
//                 <SelectItem value="CASH">Cash</SelectItem>
//                 <SelectItem value="PAYSTACK">Paystack</SelectItem>
//                 <SelectItem value="TRANSFER">Transfer</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label>Include Data</Label>
//           <div className="grid gap-2 sm:grid-cols-3">
//             {["summary", "charts", "details"].map((key) => (
//               <div key={key} className="flex items-center space-x-2">
//                 <Checkbox
//                   id={`include-${key}`}
//                   checked={include[key as keyof typeof include]}
//                   onCheckedChange={(checked) =>
//                     setInclude((prev) => ({ ...prev, [key]: checked }))
//                   }
//                 />
//                 <Label htmlFor={`include-${key}`} className="cursor-pointer capitalize">{key}</Label>
//               </div>
//             ))}
//           </div>
//         </div>
//       </CardContent>
//       <CardFooter className="flex justify-end">
//         <Button onClick={handleGenerate} disabled={isPending}>
//           {isPending ? "Generating..." : "Generate Report"}
//         </Button>
//       </CardFooter>

//       {result && (
//         <div className="p-4 text-sm bg-muted text-muted-foreground border-t">
//           <pre className="overflow-x-auto whitespace-pre-wrap">
//             {JSON.stringify(result, null, 2)}
//           </pre>
//         </div>
//       )}
//     </Card>
//   )
// }


// app/admin/reports/page.tsx

"use client"

import { useState, useTransition } from "react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { DataTable } from "../common/data-table"
import { getReportColumns } from "@/lib/columns/reportColumns"
import { generateReport } from "@/actions/admin/reports-actions"


export default function ReportsGenerator() {
  const [reportType, setReportType] = useState< "sales" | "products" | "inventory" | "customers" | "affiliates" >("sales")
  const [dateRange, setDateRange] = useState<DateRange>()
  const [isPending, startTransition] = useTransition()
  const [reportData, setReportData] = useState<any[]>([])
  const columns = getReportColumns(reportType)

  const handleGenerate = () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Please select a valid date range")
      return
    }

    startTransition(async () => {
      const res = await generateReport({
        startDate: dateRange.from as Date,
        endDate: dateRange.to as Date,
        reportType: reportType
      })
      setReportData(res.details)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Reports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Select value={reportType} onValueChange={(value) => setReportType(value as "sales" | "products" | "inventory" | "customers" | "affiliates")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Report" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="products">Products</SelectItem>
              <SelectItem value="inventory">Inventory</SelectItem>
              <SelectItem value="customers">Customers</SelectItem>
              <SelectItem value="affiliates">Affiliates</SelectItem>
            </SelectContent>
          </Select>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <Button onClick={handleGenerate} disabled={isPending}>
            {isPending ? "Generating..." : "Generate"}
          </Button>
        </div>

        {reportData.length > 0 && <DataTable columns={columns} data={reportData} />}
      </CardContent>
    </Card>
  )
}

