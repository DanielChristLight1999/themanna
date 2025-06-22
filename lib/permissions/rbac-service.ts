// lib/rbac/rbac-service.ts

export class RBACService {
  static mergePermissions(
    roleSettings: Record<string, any>,
    userOverrides: Record<string, Record<string, boolean>>
  ) {
    const merged = { ...roleSettings }

    for (const module in userOverrides) {
      merged[module] = {
        ...(merged[module] || {}),
        ...userOverrides[module],
      }
    }

    return merged
  }

  static hasPermission(
    permissions: Record<string, any>,
    module: string,
    action: string
  ): boolean {
    return permissions?.[module]?.[action] ?? false
  }
}
