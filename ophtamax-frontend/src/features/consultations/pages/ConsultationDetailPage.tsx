import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PageHeader } from '@/components/common/PageHeader'
import { fetchConsultation } from '@/features/consultations/services/consultationService'
import { PATHS } from '@/routes/paths'

export function ConsultationDetailPage() {
  const { id } = useParams()
  const { data: c, isLoading } = useQuery({
    queryKey: ['consultation', id],
    queryFn: () => fetchConsultation(id!),
    enabled: Boolean(id),
  })

  if (isLoading || !c) return <div className="py-12 text-center text-secondary">Chargement...</div>

  const renderOeil = (label: string, examen: typeof c.examen_od) => (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
      <h4 className="mb-3 font-semibold text-primary">{label}</h4>
      <dl className="grid grid-cols-3 gap-2 text-body-sm">
        {Object.entries(examen).map(([k, v]) => (
          <div key={k}><dt className="text-label-sm uppercase text-secondary">{k}</dt><dd className="font-medium">{v || '—'}</dd></div>
        ))}
      </dl>
    </div>
  )

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title={`Consultation — ${c.patient_name}`}
        subtitle={new Date(c.datecons).toLocaleString('fr-FR')}
        actions={
          <div className="flex gap-2">
            <Link to={`${PATHS.ordonnances}/${c.id}`} className="flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-label-md text-primary hover:bg-primary/5">
              <MaterialIcon name="print" className="text-[18px]" /> Imprimer ordonnance
            </Link>
            <Link to={PATHS.consultations} className="text-label-md text-secondary hover:underline">Retour</Link>
          </div>
        }
      />
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
        <p className="text-label-sm text-secondary">Motif</p>
        <p className="text-body-md">{c.motif || '—'}</p>
        <p className="mt-3 text-label-sm text-secondary">Diagnostic</p>
        <p className="text-body-md font-medium">{c.diagnostic || '—'}</p>
      </div>
      <div className="grid gap-gutter md:grid-cols-2">
        {renderOeil('OD — Œil Droit', c.examen_od)}
        {renderOeil('OG — Œil Gauche', c.examen_og)}
      </div>
      {(c.ordonnance || c.prescription) && (
        <div className="grid gap-gutter md:grid-cols-2">
          {c.ordonnance && <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5"><h4 className="mb-2 font-semibold">Ordonnance</h4><p className="whitespace-pre-wrap text-body-sm">{c.ordonnance}</p></div>}
          {c.prescription && <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5"><h4 className="mb-2 font-semibold">Prescription</h4><p className="whitespace-pre-wrap text-body-sm">{c.prescription}</p></div>}
        </div>
      )}
    </div>
  )
}
