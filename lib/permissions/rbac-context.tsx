// lib/permissions/rbac-context.tsx
"use client"

import { createContext, useContext } from "react"
import { RolePermissionSettings } from "./types"

const RBACContext = createContext<RolePermissionSettings | null>(null)

export function RBACProvider({
  children,
  permissions,
}: {
  children: React.ReactNode
  permissions: RolePermissionSettings | undefined | null
}) {
  return <RBACContext.Provider value={permissions || null}>{children}</RBACContext.Provider>
}

export function useRBAC() {
  const context = useContext(RBACContext)
  if (!context) throw new Error("useRBAC must be used within RBACProvider")
  return context
}
