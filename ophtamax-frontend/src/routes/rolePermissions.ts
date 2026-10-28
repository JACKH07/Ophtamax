import type { Permission, RoleCode } from '@/api/types/auth'

export const ROUTE_ACCESS: Record<string, RoleCode[]> = {
  '/dashboard': ['ADMIN', 'SEC', 'OPHT', 'ASS', 'COMPTA'],
  '/patients': ['ADMIN', 'SEC', 'OPHT', 'ASS', 'COMPTA'],
  '/agenda': ['ADMIN', 'SEC', 'OPHT', 'ASS'],
  '/consultations': ['ADMIN', 'SEC', 'OPHT', 'ASS'],
  '/ordonnances': ['ADMIN', 'OPHT', 'ASS'],
  '/prescription-examen': ['ADMIN', 'OPHT', 'ASS'],
  '/prescription-lunettes': ['ADMIN', 'OPHT', 'ASS'],
  '/facturation': ['ADMIN', 'SEC', 'COMPTA', 'ASS'],
  '/statistiques': ['ADMIN', 'OPHT', 'COMPTA', 'ASS'],
  '/professions': ['ADMIN', 'OPHT', 'ASS'],
  '/assurances': ['ADMIN', 'OPHT', 'ASS'],
  '/examens': ['ADMIN', 'OPHT', 'ASS'],
  '/parametres': ['ADMIN'],
  '/utilisateurs': ['ADMIN'],
}

export const ROLE_PERMISSIONS: Record<RoleCode, Permission[]> = {
  ADMIN: [
    'patients.create',
    'patients.edit',
    'patients.delete',
    'consultations.write',
    'ordonnance.print',
    'facturation.write',
    'caisse.access',
    'settings.manage',
    'users.manage',
  ],
  SEC: [
    'patients.create',
    'patients.edit',
    'caisse.access',
  ],
  OPHT: [
    'consultations.write',
    'ordonnance.print',
    'settings.manage',
  ],
  ASS: [
    'patients.create',
    'patients.edit',
    'consultations.write',
    'ordonnance.print',
    'facturation.write',
    'caisse.access',
  ],
  COMPTA: [
    'facturation.write',
    'caisse.access',
  ],
}

export function getPermissionsForRole(role: RoleCode): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}

export function canAccessRoute(role: RoleCode, path: string): boolean {
  const basePath = Object.keys(ROUTE_ACCESS).find((route) => path.startsWith(route))
  if (!basePath) return true
  return ROUTE_ACCESS[basePath].includes(role)
}

export function hasPermission(role: RoleCode, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}
