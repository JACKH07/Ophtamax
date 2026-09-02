import { USE_MOCK } from '@/api/endpoints'
import type { Permission, RoleCode } from '@/api/types/auth'
import { useAuth } from '@/features/auth/hooks/useAuth'

export function usePermissions() {
  const { hasPermission, hasRole, permissions, user } = useAuth()

  return {
    user,
    permissions,
    // En mode démo sans session : accès complet pour parcourir l'UI
    can: (permission: Permission) => (USE_MOCK && !user ? true : hasPermission(permission)),
    isRole: (roles: RoleCode[]) => (USE_MOCK && !user ? true : hasRole(roles)),
  }
}
