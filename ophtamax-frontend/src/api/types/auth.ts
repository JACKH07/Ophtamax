export type RoleCode = 'ADMIN' | 'SEC' | 'OPHT' | 'ASS' | 'COMPTA'

export type Permission =
  | 'patients.create'
  | 'patients.edit'
  | 'patients.delete'
  | 'consultations.write'
  | 'ordonnance.print'
  | 'facturation.write'
  | 'caisse.access'
  | 'settings.manage'
  | 'users.manage'

export interface User {
  id: string
  nom: string
  prenoms: string
  login_user: string
  email: string
  id_role: RoleCode
  fonction: string
}

export interface AuthResponse {
  token: string
  user: User
  permissions: Permission[]
}

export interface ApiResponse<T> {
  data: T
  message?: string
}
