import type { Metadata } from "next"
import { PosInterface } from "@/components/admin/pos/pos-interface"

export const metadata: Metadata = {
  title: "Point of Sale | The Mana Restaurant Admin",
  description: "Point of Sale system for The Mana Restaurant",
}

export default function PosPage() {
  return <PosInterface />
}
