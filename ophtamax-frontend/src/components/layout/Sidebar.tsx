import { NavLink, useNavigate } from 'react-router-dom'
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

interface NavGroup {
  title: string
  items: NavItem[]
}

const DASHBOARD_ITEM: NavItem = {
  label: 'Tableau de bord',
  path: PATHS.dashboard,
  icon: 'dashboard',
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Activité',
    items: [
      { label: 'Patients', path: PATHS.patients, icon: 'group' },
      { label: 'Consultations', path: PATHS.consultations, icon: 'medical_services' },
      { label: 'Ordonnances', path: PATHS.ordonnances, icon: 'description' },
      { label: 'Prescription examen', path: PATHS.prescriptionExamen, icon: 'biotech' },
      { label: 'Prescription Lunettes', path: PATHS.prescriptionLunettes, icon: 'visibility' },
      { label: 'Facturation', path: PATHS.facturation, icon: 'receipt_long' },
    ],
  },
  {
    title: 'Organisation',
    items: [
      { label: 'Agenda', path: PATHS.agenda, icon: 'calendar_today' },
      { label: 'Statistiques', path: PATHS.statistiques, icon: 'analytics' },
      { label: 'Utilisateurs', path: PATHS.utilisateurs, icon: 'person_add' },
      { label: 'Paramètres', path: PATHS.parametres, icon: 'settings' },
    ],
  },
]

function canSeeNav(role: RoleCode, path: string): boolean {
  if (USE_MOCK) return true
  const allowed = ROUTE_ACCESS[path]
  return allowed ? allowed.includes(role) : true
}

function NavItemLink({ item }: { item: NavItem }) {
  return (
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
  )
}

export function Sidebar() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const role = user?.id_role ?? 'ADMIN'

  const showDashboard = canSeeNav(role, DASHBOARD_ITEM.path)
  const visibleGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => canSeeNav(role, item.path)),
  })).filter((group) => group.items.length > 0)

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

      <button
        type="button"
        onClick={() => navigate(PATHS.consultationNouvelle)}
        className="mb-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary-container px-4 py-3 text-label-md font-semibold text-on-primary-container shadow-sm transition-colors hover:bg-primary hover:text-on-primary"
      >
        <MaterialIcon name="add" className="text-[18px]" />
        Nouvelle Consultation
      </button>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto">
        {showDashboard && (
          <ul className="flex flex-col gap-1">
            <li>
              <NavItemLink item={DASHBOARD_ITEM} />
            </li>
          </ul>
        )}

        {visibleGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-on-surface-variant/70">
              {group.title}
            </p>
            <ul className="flex flex-col gap-1">
              {group.items.map((item) => (
                <li key={item.path}>
                  <NavItemLink item={item} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

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
      </div>
    </nav>
  )
}
