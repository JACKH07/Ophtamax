import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Permission, RoleCode, User } from '@/api/types/auth'
import { setAuthToken } from '@/api/client'
import { getPermissionsForRole } from '@/routes/rolePermissions'

/** Durée max de session depuis le login (30 minutes). */
export const SESSION_MAX_MS = 30 * 60 * 1000

const AUTH_STORAGE_KEY = 'ophtamax-auth'

interface AuthState {
  user: User | null
  token: string | null
  permissions: Permission[]
  isAuthenticated: boolean
  /** Horodatage ms du login — déconnexion auto 30 min après. */
  sessionStartedAt: number | null
  setAuth: (token: string, user: User, permissions?: Permission[]) => void
  clearAuth: () => void
  hasPermission: (permission: Permission) => boolean
  hasRole: (roles: RoleCode[]) => boolean
}

function wipeAuthStorage() {
  try {
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem(AUTH_STORAGE_KEY)
    sessionStorage.removeItem('ophtamax_token')
    localStorage.removeItem('ophtamax_token')
  } catch {
    // ignore
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      permissions: [],
      isAuthenticated: false,
      sessionStartedAt: null,

      setAuth: (token, user, permissions) => {
        setAuthToken(token)
        const perms = permissions ?? getPermissionsForRole(user.id_role)
        set({
          token,
          user,
          permissions: perms,
          isAuthenticated: true,
          sessionStartedAt: Date.now(),
        })
      },

      clearAuth: () => {
        setAuthToken(null)
        wipeAuthStorage()
        set({
          user: null,
          token: null,
          permissions: [],
          isAuthenticated: false,
          sessionStartedAt: null,
        })
      },

      hasPermission: (permission) => get().permissions.includes(permission),

      hasRole: (roles) => {
        const user = get().user
        return user ? roles.includes(user.id_role) : false
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
        sessionStartedAt: state.sessionStartedAt,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state?.token || !state.isAuthenticated) {
          setAuthToken(null)
          return
        }
        const started = state.sessionStartedAt
        if (!started || Date.now() - started >= SESSION_MAX_MS) {
          state.clearAuth()
          return
        }
        setAuthToken(state.token)
      },
    },
  ),
)
