import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PageHeader } from '@/components/common/PageHeader'
import { fetchConsultations } from '@/features/consultations/services/consultationService'
import { PATHS } from '@/routes/paths'

export function OrdonnancesListPage() {
  const { data: consultations = [] } = useQuery({
    queryKey: ['consultations'],
    queryFn: fetchConsultations,
  })

  const withDocs = consultations.filter((c) => c.ordonnance || c.prescription || c.diagnostic)

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title="Ordonnances"
        subtitle="Ordonnances, prescriptions optiques et comptes-rendus."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {withDocs.length === 0 ? (
          <p className="col-span-full py-12 text-center text-secondary">Aucun document disponible</p>
        ) : (
          withDocs.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm"
            >
              <p className="font-semibold text-on-surface">{c.patient_name}</p>
              <p className="text-label-sm text-secondary">
                {new Date(c.datecons).toLocaleDateString('fr-FR')} · Dossier #{c.dossier_numero}
              </p>
              <p className="mt-2 text-body-sm font-medium">{c.diagnostic || 'Consultation'}</p>
              <p className="mt-1 line-clamp-2 text-body-sm text-secondary">
                {c.prescription || c.ordonnance || c.conduite_a_tenir}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to={`${PATHS.ordonnances}/${c.id}?type=ordonnance`}
                  className="flex items-center gap-1 text-label-md text-primary hover:underline"
                >
                  <MaterialIcon name="print" className="text-[16px]" /> Ordonnance
                </Link>
                <Link
                  to={`${PATHS.ordonnances}/${c.id}?type=compte-rendu`}
                  className="flex items-center gap-1 text-label-md text-secondary hover:text-primary hover:underline"
                >
                  <MaterialIcon name="picture_as_pdf" className="text-[16px]" /> Compte-rendu
                </Link>
                <Link
                  to={`${PATHS.consultations}/${c.id}`}
                  className="flex items-center gap-1 text-label-md text-secondary hover:text-primary hover:underline"
                >
                  Voir
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
