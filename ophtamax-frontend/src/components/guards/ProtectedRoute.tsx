import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { USE_MOCK } from '@/api/endpoints'
import { PATHS } from '@/routes/paths'
import { useAuthStore } from '@/stores/authStore'

/**
 * En mode démo (sans BDD / API), les pages sont accessibles sans connexion.
 * Quand VITE_USE_MOCK=false, l'auth Laravel est requise.
 */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()

  if (USE_MOCK) {
    return <Outlet />
  }

  if (!isAuthenticated) {
    return <Navigate to={PATHS.login} state={{ from: location }} replace />
  }

  return <Outlet />
}
