import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Permission, RoleCode, User } from '@/api/types/auth'
import { setAuthToken } from '@/api/client'
import { getPermissionsForRole } from '@/routes/rolePermissions'

interface AuthState {
  user: User | null
  token: string | null
  permissions: Permission[]
  isAuthenticated: boolean
  setAuth: (token: string, user: User, permissions?: Permission[]) => void
  clearAuth: () => void
  hasPermission: (permission: Permission) => boolean
  hasRole: (roles: RoleCode[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      permissions: [],
      isAuthenticated: false,

      setAuth: (token, user, permissions) => {
        sessionStorage.setItem('ophtamax_token', token)
        setAuthToken(token)
        const perms = permissions ?? getPermissionsForRole(user.id_role)
        set({
          token,
          user,
          permissions: perms,
          isAuthenticated: true,
        })
      },

      clearAuth: () => {
        sessionStorage.removeItem('ophtamax_token')
        setAuthToken(null)
        set({
          user: null,
          token: null,
          permissions: [],
          isAuthenticated: false,
        })
      },

      hasPermission: (permission) => get().permissions.includes(permission),

      hasRole: (roles) => {
        const user = get().user
        return user ? roles.includes(user.id_role) : false
      },
    }),
    {
      name: 'ophtamax-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          sessionStorage.setItem('ophtamax_token', state.token)
          setAuthToken(state.token)
        }
      },
    },
  ),
)
