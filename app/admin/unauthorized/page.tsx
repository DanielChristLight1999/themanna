import { UnauthorizedPage } from "@/components/rbac/unauthorized-page"
import { Suspense } from "react"

export default function UnauthorizedRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnauthorizedPage />
    </Suspense>
  )
}
