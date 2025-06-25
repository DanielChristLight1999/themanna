// lib/rbac/rbac-service.ts

export class RBACService {
  static mergePermissions(
    roleSettings: Record<string, any>,
    userOverrides: Record<string, Record<string, boolean>>
  ) {
    const merged = { ...roleSettings }

    for (const mod in userOverrides) {
      merged[mod] = {
        ...(merged[mod] || {}),
        ...userOverrides[mod],
      }
    }

    return merged
  }

  static hasPermission(
    permissions: Record<string, any>,
    mod: string,
    action: string
  ): boolean {
    return permissions?.[mod]?.[action] ?? false
  }
}
