import type { AuthResponse, Permission, RoleCode, User } from '@/api/types/auth'
import { getPermissionsForRole } from '@/routes/rolePermissions'

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  admin: {
    password: 'admin',
    user: {
      id: '1',
      nom: '',
      prenoms: '',
      login_user: 'admin',
      email: 'admin@ophtamax.local',
      id_role: 'ADMIN',
      fonction: 'Administrateur',
    },
  },
  secretaire: {
    password: 'secretaire',
    user: {
      id: '2',
      nom: '',
      prenoms: '',
      login_user: 'secretaire',
      email: 'sec@ophtamax.local',
      id_role: 'SEC',
      fonction: 'Secrétaire',
    },
  },
  opht: {
    password: 'opht',
    user: {
      id: '3',
      nom: '',
      prenoms: '',
      login_user: 'opht',
      email: 'opht@ophtamax.local',
      id_role: 'OPHT',
      fonction: 'Ophtalmologiste',
    },
  },
  nkahydara: {
    password: 'test',
    user: {
      id: '6',
      nom: '',
      prenoms: '',
      login_user: 'nkahydara',
      email: 'krotoum49@gmail.com',
      id_role: 'ASS',
      fonction: 'Assistante',
    },
  },
  assistant: {
    password: 'assistant',
    user: {
      id: '4',
      nom: '',
      prenoms: '',
      login_user: 'assistant',
      email: 'ass@ophtamax.local',
      id_role: 'ASS',
      fonction: 'Orthoptiste',
    },
  },
  compta: {
    password: 'compta',
    user: {
      id: '5',
      nom: '',
      prenoms: '',
      login_user: 'compta',
      email: 'compta@ophtamax.local',
      id_role: 'COMPTA',
      fonction: 'Comptable',
    },
  },
}

export function mockLogin(login: string, password: string): AuthResponse | null {
  const entry = MOCK_USERS[login.toLowerCase()]
  if (!entry || entry.password !== password) return null

  const permissions = getPermissionsForRole(entry.user.id_role)
  return {
    token: `mock-token-${entry.user.id_role}-${Date.now()}`,
    user: entry.user,
    permissions,
  }
}

export function mockMe(token: string): AuthResponse | null {
  const role = Object.keys(MOCK_USERS).find((key) => token.includes(MOCK_USERS[key].user.id_role))
  if (!role) return null
  const user = MOCK_USERS[role].user
  return {
    token,
    user,
    permissions: getPermissionsForRole(user.id_role),
  }
}

export function getMockRoles(): RoleCode[] {
  return ['ADMIN', 'SEC', 'OPHT', 'ASS', 'COMPTA']
}

export function getMockPermissions(role: RoleCode): Permission[] {
  return getPermissionsForRole(role)
}
