import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import type { ExamenOeil } from '@/api/types/entities'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { fetchConsultation } from '@/features/consultations/services/consultationService'
import { usePermissions } from '@/hooks/usePermissions'
import { PATHS } from '@/routes/paths'

function EyeSummary({ label, examen }: { label: string; examen: ExamenOeil }) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
      <h4 className="mb-4 text-headline-sm font-semibold text-primary">{label}</h4>
      <div className="mb-4">
        <p className="mb-2 text-label-md uppercase tracking-wider text-secondary">Acuité</p>
        <dl className="grid grid-cols-2 gap-2 text-body-sm">
          <div><dt className="text-secondary">VL SC</dt><dd className="font-medium">{examen.vl_sans || '—'}</dd></div>
          <div><dt className="text-secondary">VL AC</dt><dd className="font-medium">{examen.vl_avec || '—'}</dd></div>
          <div><dt className="text-secondary">VP SC</dt><dd className="font-medium">{examen.vp_sans || '—'}</dd></div>
          <div><dt className="text-secondary">VP AC</dt><dd className="font-medium">{examen.vp_avec || '—'}</dd></div>
        </dl>
      </div>
      <div className="mb-4">
        <p className="mb-2 text-label-md uppercase tracking-wider text-secondary">Réfraction</p>
        <p className="text-body-sm">
          Sph {examen.sphere || '—'} · Cyl {examen.cylindre || '—'} · Axe {examen.axe || '—'}°
          {examen.addition ? ` · Add ${examen.addition}` : ''}
        </p>
        <p className="mt-1 text-body-sm">PIO : {examen.pio || '—'} mmHg</p>
      </div>
      <div>
        <p className="mb-1 text-label-md uppercase tracking-wider text-secondary">Examen clinique</p>
        <p className="text-body-sm"><span className="text-secondary">SA :</span> {examen.segment_anterieur || '—'}</p>
        <p className="text-body-sm"><span className="text-secondary">FO :</span> {examen.fond_oeil || '—'}</p>
      </div>
    </div>
  )
}

export function ConsultationDetailPage() {
  const { id } = useParams()
  const { can } = usePermissions()
  const { data: c, isLoading } = useQuery({
    queryKey: ['consultation', id],
    queryFn: () => fetchConsultation(id!),
    enabled: Boolean(id),
  })

  if (isLoading || !c) {
    return <div className="py-12 text-center text-secondary">Chargement...</div>
  }

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title={`Consultation — ${c.patient_name}`}
        subtitle={`${new Date(c.datecons).toLocaleString('fr-FR')} · Dossier #${c.dossier_numero}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              to={`${PATHS.patients}/${c.id_patient}`}
              className="flex items-center gap-2 rounded-lg border border-outline-variant px-4 py-2 text-label-md text-secondary hover:bg-surface-container-low"
            >
              <MaterialIcon name="person" className="text-[18px]" />
              Fiche patient
            </Link>
            {can('consultations.write') && (
              <Link
                to={`${PATHS.consultations}/${c.id}/modifier`}
                className="flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-label-md text-primary hover:bg-primary/5"
              >
                <MaterialIcon name="edit" className="text-[18px]" />
                Modifier
              </Link>
            )}
            <Link
              to={`${PATHS.consultations}/${c.id}/documents`}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary"
            >
              <MaterialIcon name="picture_as_pdf" className="text-[18px]" />
              Compte-rendu
            </Link>
          </div>
        }
      />

      <StatusBadge
        label={c.statut === 'terminee' ? 'Terminée' : 'Brouillon'}
        variant={c.statut === 'terminee' ? 'success' : 'warning'}
      />

      <div className="grid gap-gutter md:grid-cols-2">
        <EyeSummary label="OD — Œil Droit" examen={c.examen_od} />
        <EyeSummary label="OG — Œil Gauche" examen={c.examen_og} />
      </div>

      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
        <h3 className="mb-3 text-headline-sm font-semibold">Conclusion &amp; Suivi</h3>
        <p className="text-label-sm text-secondary">Diagnostic</p>
        <p className="mb-3 text-body-md font-medium">{c.diagnostic || '—'}</p>
        <p className="text-label-sm text-secondary">Conduite à tenir</p>
        <p className="mb-3 whitespace-pre-wrap text-body-md">{c.conduite_a_tenir || '—'}</p>
        <p className="text-label-sm text-secondary">Prochain RDV</p>
        <p className="text-body-md">
          {c.prochain_rdv_date
            ? `${new Date(c.prochain_rdv_date).toLocaleDateString('fr-FR')} (${c.prochain_rdv_delai})`
            : c.prochain_rdv_delai || '—'}
        </p>
      </div>

      {(c.ordonnance || c.prescription) && (
        <div className="grid gap-gutter md:grid-cols-2">
          {c.ordonnance && (
            <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
              <h4 className="mb-2 font-semibold">Notes de traitement</h4>
              <p className="whitespace-pre-wrap text-body-sm">{c.ordonnance}</p>
            </div>
          )}
          {c.prescription && (
            <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
              <h4 className="mb-2 font-semibold">Notes optiques</h4>
              <p className="whitespace-pre-wrap text-body-sm">{c.prescription}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
