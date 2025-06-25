import { ColumnDef } from "@tanstack/react-table";
import { ActiveAffiliateType } from "../admin-data/types";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "../utils";


export const ActiveAffiliateTableColumn: ColumnDef<ActiveAffiliateType>[] = [
    {
        id: "affiliate",
        header: "Affiliate",
        cell: ({ row }) => {
            const { name, email } = row.original
            return (
                <div>
                    <div className="font-medium">{name || "N/A"}</div>
                    <div className="text-xs text-muted-foreground">{email}</div>
                </div>
            )
        },
    },
    {
        accessorKey: "referralCode",
        header: "Referral Code",
        cell: ({ row }) => {
            const { referralCode } = row.original
            return (
                <div className="">
                    {referralCode}
                </div>
            )
        },
    },
    {
        accessorKey: "totalreferrals",
        header: "Total Referrals",
        cell: ({ row }) => {
            const { totalreferrals } = row.original
            return (
                <div>
                    {totalreferrals}
                </div>
            )
        },
    },
    {
        accessorKey: "totalcommissions",
        header: "Total Commissions",
        cell: ({ row }) => {
            const { totalcommissions } = row.original
            return (
                <div >
                    {formatPrice(totalcommissions)}
                </div>
            )
        },
    },
    {
        accessorKey: "pendingcommissions",
        header: "Pending Commissions",
        cell: ({ row }) => {
            const { pendingcommissions } = row.original
            return (
                <div >
                    {formatPrice(pendingcommissions)}
                </div>
            )
        },

    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const { status } = row.original
            return (
                <Badge variant={status === "APPROVED" ? "outline" : "secondary"}>
                    {status}
                </Badge>
            )
        },
    },


]