// lib/rbac/types.ts

import { User } from "../generated/prisma"

export type UserRole = "ADMIN" | "MANAGER" | "CASHIER" | "CUSTOMER" | "AFFILIATE"

export type ModuleName = "orders" | "products" | "customers" | "affiliates" | "settings" | "inventory"

export type ActionType = "view" | "create" | "update" | "delete"

// export type RolePermissionSettings = {
//   [module in ModuleName]?: {
//     [action in ActionType]?: boolean
//   }
// }

export type RolePermissionSettings = {
  [module: string]: {
    [action: string]: boolean
  }
}


export interface RBACContextType {
  permissions: RolePermissionSettings
  isLoading: boolean
  user: User | null
  hasPermission: (module: ModuleName, action: ActionType) => boolean
}

type UserWithoutPermissions = Omit<User, 'permissions'> | null;
