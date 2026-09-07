import { NavLink } from 'react-router-dom'
import { USE_MOCK } from '@/api/endpoints'
import type { RoleCode } from '@/api/types/auth'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PATHS } from '@/routes/paths'
import { ROUTE_ACCESS } from '@/routes/rolePermissions'
import { useAuthStore } from '@/stores/authStore'

interface NavItem {
  label: string
  path: string
  icon: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Tableau de bord', path: PATHS.dashboard, icon: 'dashboard' },
  { label: 'Patients', path: PATHS.patients, icon: 'group' },
  { label: 'Agenda', path: PATHS.agenda, icon: 'calendar_today' },
  { label: 'Consultations', path: PATHS.consultations, icon: 'medical_services' },
  { label: 'Ordonnances', path: PATHS.ordonnances, icon: 'description' },
  { label: 'Prescription examen', path: PATHS.prescriptionExamen, icon: 'biotech' },
  { label: 'Prescription Lunettes', path: PATHS.prescriptionLunettes, icon: 'visibility' },
  { label: 'Facturation', path: PATHS.facturation, icon: 'receipt_long' },
  { label: 'Statistiques', path: PATHS.statistiques, icon: 'analytics' },
  { label: 'Paramètres', path: PATHS.parametres, icon: 'settings' },
  { label: 'Utilisateurs', path: PATHS.utilisateurs, icon: 'person_add' },
]

function canSeeNav(role: RoleCode, path: string): boolean {
  if (USE_MOCK) return true
  const allowed = ROUTE_ACCESS[path]
  return allowed ? allowed.includes(role) : true
}

export function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const role = user?.id_role ?? 'ADMIN'
  const visibleItems = NAV_ITEMS.filter((item) => canSeeNav(role, item.path))

  const displayName = user
    ? (user.fonction || user.login_user)
    : 'Mode démo'

  const displayRole = user?.fonction ?? 'Sans connexion BDD'

  return (
    <nav className="fixed left-0 top-0 z-20 flex h-full w-sidebar-width flex-col border-r border-outline-variant bg-surface-container-lowest px-4 py-6 shadow-sm">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
          <MaterialIcon name="visibility" filled className="text-[24px]" />
        </div>
        <div>
          <h1 className="text-headline-md font-bold text-primary">Ophtamax</h1>
          <p className="text-label-sm text-secondary">Management Platform</p>
        </div>
      </div>

      <NavLink
        to={`${PATHS.consultations}/nouvelle`}
        className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-primary-container px-4 py-3 text-label-md font-semibold text-on-primary-container shadow-sm transition-colors hover:bg-primary hover:text-on-primary"
      >
        <MaterialIcon name="add" className="text-[18px]" />
        Nouvelle Consultation
      </NavLink>

      <ul className="flex flex-1 flex-col gap-1">
        {visibleItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-label-md font-semibold tracking-wide transition-all duration-200 ease-in-out active:scale-95 ${
                  isActive
                    ? 'border-l-4 border-primary bg-secondary-container text-on-secondary-container'
                    : 'text-secondary hover:bg-surface-container-high'
                }`
              }
            >
              <MaterialIcon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="mt-auto border-t border-outline-variant px-2 pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-primary/10 text-label-md font-semibold text-primary">
            {user?.login_user?.charAt(0).toUpperCase() ?? 'D'}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-label-md font-semibold tracking-wide text-on-surface">
              {displayName}
            </span>
            <span className="truncate text-label-sm text-secondary">{displayRole}</span>
          </div>
        </div>
        {USE_MOCK && (
          <NavLink
            to={PATHS.login}
            className="mt-3 flex items-center gap-2 text-label-sm text-secondary hover:text-primary"
          >
            <MaterialIcon name="login" className="text-[16px]" />
            Page connexion
          </NavLink>
        )}
      </div>
    </nav>
  )
}
