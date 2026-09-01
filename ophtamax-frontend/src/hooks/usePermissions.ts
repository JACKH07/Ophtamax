import { useAuth } from '@/features/auth/hooks/useAuth'
import type { Permission, RoleCode } from '@/api/types/auth'

export function usePermissions() {
  const { hasPermission, hasRole, permissions, user } = useAuth()

  return {
    user,
    permissions,
    can: (permission: Permission) => hasPermission(permission),
    isRole: (roles: RoleCode[]) => hasRole(roles),
  }
}
