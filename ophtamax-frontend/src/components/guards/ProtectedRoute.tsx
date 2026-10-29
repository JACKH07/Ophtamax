import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { USE_MOCK } from '@/api/endpoints'
import { PATHS } from '@/routes/paths'
import { useAuthStore } from '@/stores/authStore'

/**
 * En mode démo (sans BDD / API), les pages sont accessibles sans connexion.
 * Quand VITE_USE_MOCK=false, l'authentification backend est requise.
 * Attend la réhydratation sessionStorage pour ne pas déconnecter au F5.
 */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()
  const [hydrated, setHydrated] = useState(() => useAuthStore.persist.hasHydrated())

  useEffect(() => {
    setHydrated(useAuthStore.persist.hasHydrated())
    return useAuthStore.persist.onFinishHydration(() => setHydrated(true))
  }, [])

  if (USE_MOCK) {
    return <Outlet />
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-secondary">
        Chargement…
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={PATHS.login} state={{ from: location }} replace />
  }

  return <Outlet />
}
