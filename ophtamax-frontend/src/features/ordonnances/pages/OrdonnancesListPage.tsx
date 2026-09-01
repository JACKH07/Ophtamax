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

  const withOrdonnance = consultations.filter((c) => c.ordonnance || c.prescription)

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader title="Ordonnances" subtitle="Ordonnances et prescriptions lunettes." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {withOrdonnance.length === 0 ? (
          <p className="col-span-full py-12 text-center text-secondary">Aucune ordonnance disponible</p>
        ) : (
          withOrdonnance.map((c) => (
            <div key={c.id} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
              <p className="font-semibold text-on-surface">{c.patient_name}</p>
              <p className="text-label-sm text-secondary">{new Date(c.datecons).toLocaleDateString('fr-FR')}</p>
              <p className="mt-2 line-clamp-2 text-body-sm">{c.prescription || c.ordonnance}</p>
              <Link to={`${PATHS.ordonnances}/${c.id}`} className="mt-4 flex items-center gap-1 text-label-md text-primary hover:underline">
                <MaterialIcon name="print" className="text-[16px]" /> Imprimer
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
