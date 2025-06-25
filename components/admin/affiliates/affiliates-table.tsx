"use client"

import { useState } from "react"
import { DataTable } from "../common/data-table"
import { ActiveAffiliateType } from "@/lib/admin-data/types"
import { ActiveAffiliateTableColumn } from "@/lib/columns/active-affiliate-table-column"

export function AffiliatesTable({affiliates}: {affiliates: ActiveAffiliateType[]}) {
  // const [selectedAffiliate, setSelectedAffiliate] = useState<any | null>(null)
  // const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // const handleViewDetails = (affiliate: any) => {
  //   setSelectedAffiliate(affiliate)
  //   setIsDetailsOpen(true)
  // }

  return (
    <div>
      <DataTable data={affiliates} columns={ActiveAffiliateTableColumn} />
    </div>
  )
}