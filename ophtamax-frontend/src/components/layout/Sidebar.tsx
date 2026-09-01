import { NavLink } from 'react-router-dom'
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
  { label: 'Facturation', path: PATHS.facturation, icon: 'receipt_long' },
  { label: 'Statistiques', path: PATHS.statistiques, icon: 'analytics' },
  { label: 'Paramètres', path: PATHS.parametres, icon: 'settings' },
  { label: 'Utilisateurs', path: PATHS.utilisateurs, icon: 'person_add' },
]

function canSeeNav(role: RoleCode, path: string): boolean {
  const allowed = ROUTE_ACCESS[path]
  return allowed ? allowed.includes(role) : true
}

export function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const role = user?.id_role ?? 'SEC'
  const visibleItems = NAV_ITEMS.filter((item) => canSeeNav(role, item.path))

  const displayName = user
    ? user.id_role === 'OPHT'
      ? `Dr ${user.nom}`
      : `${user.prenoms} ${user.nom}`
    : ''

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

      {user && (
        <div className="mt-auto border-t border-outline-variant px-2 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-primary/10 text-label-md font-semibold text-primary">
              {user.prenoms.charAt(0)}{user.nom.charAt(0)}
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-label-md font-semibold tracking-wide text-on-surface">
                {displayName}
              </span>
              <span className="truncate text-label-sm text-secondary">{user.fonction}</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
