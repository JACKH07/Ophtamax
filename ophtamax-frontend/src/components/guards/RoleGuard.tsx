import { Navigate, Outlet } from 'react-router-dom'
import { USE_MOCK } from '@/api/endpoints'
import type { RoleCode } from '@/api/types/auth'
import { PATHS } from '@/routes/paths'
import { canAccessRoute } from '@/routes/rolePermissions'
import { useAuthStore } from '@/stores/authStore'

interface RoleGuardProps {
  allowedRoles?: RoleCode[]
  pathPrefix?: string
}

/**
 * En mode démo, pas de restriction par rôle (BDD non connectée).
 */
export function RoleGuard({ allowedRoles, pathPrefix }: RoleGuardProps) {
  const user = useAuthStore((s) => s.user)

  if (USE_MOCK) {
    return <Outlet />
  }

  if (!user) {
    return <Navigate to={PATHS.login} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.id_role)) {
    return <Navigate to={PATHS.forbidden} replace />
  }

  if (pathPrefix && !canAccessRoute(user.id_role, pathPrefix)) {
    return <Navigate to={PATHS.forbidden} replace />
  }

  return <Outlet />
}
