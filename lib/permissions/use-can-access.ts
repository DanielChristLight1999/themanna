// lib/permissions/use-can-access.ts
import { useRBAC } from "./rbac-context"
import type { ModuleName, ActionType } from "./types"

export function useCanAccess(module: ModuleName, action: ActionType): boolean {
  const permissions = useRBAC()
  return permissions?.[module]?.[action] ?? false
}
