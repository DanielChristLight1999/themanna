// lib/permissions/check-permission.ts

import { auth } from "@/auth";
import prisma from "@/db";
import { RolePermissionSettings } from "./types";

type Modules = "orders" | "products" | "customers" | "settings"
type Actions = "view" | "create" | "update" | "delete"

type RolePermissions = {
  [key in Modules]?: {
    [action in Actions]?: boolean
  }
}

export async function canAccess({
  userId,
  module,
  action,
}: {
  userId: string
  module: Modules
  action: Actions
}): Promise<boolean> {
  // 1. Check if the user has an explicit override
  const userPerm = await prisma.userPermission.findFirst({
    where: {
      userId,
      module,
      action,
    },
  })

  if (userPerm) return true

  // 2. Get the user's role
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })

  if (!user) return false

  // 3. Fetch role-based permissions
  const rolePerm = await prisma.permission.findUnique({
    where: { role: user.role },
  })

  const settings = rolePerm?.settings as RolePermissions | undefined

  // 4. Return final access rule
  return settings?.[module]?.[action] ?? false
}


export async function assertCanAccess({
  userId,
  module,
  action,
}: {
  userId: string
  module: Modules
  action: Actions
}) {
  const allowed = await canAccess({ userId, module, action });
  if (!allowed) throw new Error("Unauthorized: Insufficient permission");
}


export async function getUserPermissions() {
  const session = await auth()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { permissions: true },
  })

  if (!user) return null

  const rolePermissions = await prisma.permission.findUnique({
    where: { role: user.role },
  })

  const roleSettings = rolePermissions?.settings as RolePermissionSettings | undefined

  const userOverrides = user.permissions.reduce((acc, perm) => {
    acc[perm.module] = {
      ...(acc[perm.module] || {}),
      [perm.action]: true,
    }
    return acc
  }, {} as RolePermissionSettings)

  // Merge role and overrides
  const merged: RolePermissionSettings = {}

  for (const module in roleSettings) {
    merged[module] = {
      ...(roleSettings[module] || {}),
      ...(userOverrides[module] || {}),
    }
  }

  return {
    role: user.role,
    permissions: merged,
  }
}
