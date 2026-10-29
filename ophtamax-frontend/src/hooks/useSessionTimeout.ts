import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout as logoutRequest } from '@/features/auth/services/authService'
import { SESSION_MAX_MS, useAuthStore } from '@/stores/authStore'
import { PATHS } from '@/routes/paths'

/** Vérifie l'expiration toutes les 15 s (plus fiable qu'un seul setTimeout de 30 min). */
const CHECK_EVERY_MS = 15_000

/**
 * Déconnexion automatique 30 minutes après le login,
 * même en cas d'activité. Survít au F5 via sessionStartedAt.
 */
export function useSessionTimeout(enabled = true) {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const sessionStartedAt = useAuthStore((s) => s.sessionStartedAt)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const expiredRef = useRef(false)

  useEffect(() => {
    if (!enabled || !isAuthenticated) return

    expiredRef.current = false

    const expire = () => {
      if (expiredRef.current) return
      expiredRef.current = true
      void logoutRequest().catch(() => undefined)
      clearAuth()
      navigate(PATHS.login, { replace: true })
    }

    const check = () => {
      const started = useAuthStore.getState().sessionStartedAt
      if (!started || Date.now() - started >= SESSION_MAX_MS) {
        expire()
      }
    }

    check()
    const id = window.setInterval(check, CHECK_EVERY_MS)

    return () => window.clearInterval(id)
  }, [enabled, isAuthenticated, sessionStartedAt, clearAuth, navigate])
}
