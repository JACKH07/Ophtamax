import { Link } from 'react-router-dom'
import { PATHS } from '@/routes/paths'

export function ForbiddenPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-display-lg font-bold text-primary">403</p>
      <h1 className="mt-4 text-headline-sm font-semibold text-on-surface">Accès refusé</h1>
      <p className="mt-2 text-body-md text-secondary">
        Vous n&apos;avez pas les permissions nécessaires pour accéder à cette page.
      </p>
      <Link
        to={PATHS.dashboard}
        className="mt-6 rounded-lg bg-primary px-4 py-2 text-label-md font-semibold tracking-wide text-on-primary hover:bg-primary/90"
      >
        Retour au tableau de bord
      </Link>
    </div>
  )
}
