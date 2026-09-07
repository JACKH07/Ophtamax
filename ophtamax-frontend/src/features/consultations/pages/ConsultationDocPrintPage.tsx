import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PrintDocumentHeader } from '@/components/common/PrintDocumentHeader'
import { fetchConsultation } from '@/features/consultations/services/consultationService'
import { PATHS } from '@/routes/paths'

export function ConsultationDocPrintPage() {
  const { id } = useParams()

  const { data: c } = useQuery({
    queryKey: ['consultation', id],
    queryFn: () => fetchConsultation(id!),
    enabled: Boolean(id),
  })

  if (!c) {
    return <div className="py-12 text-center text-secondary">Chargement...</div>
  }

  return (
    <div>
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-4">
          <Link
            to={`${PATHS.consultations}/${c.id}`}
            className="flex items-center gap-1 text-primary hover:underline"
          >
            <MaterialIcon name="arrow_back" className="text-[18px]" />
            Retour consultation
          </Link>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary"
        >
          <MaterialIcon name="print" className="text-[18px]" />
          Imprimer
        </button>
      </div>

      <div className="mx-auto max-w-2xl rounded-xl border border-outline-variant bg-white p-8 shadow-sm print:border-0 print:shadow-none">
        <PrintDocumentHeader title="Compte-rendu de consultation" />

        <div className="mb-6 grid gap-2 text-body-md">
          <p><strong>Patient :</strong> {c.patient_name || '—'}</p>
          <p><strong>Dossier :</strong> #{c.dossier_numero || '—'}</p>
          <p><strong>Date :</strong> {new Date(c.datecons).toLocaleDateString('fr-FR')}</p>
          <p><strong>Diagnostic :</strong> {c.diagnostic || '—'}</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 text-body-sm">
          <div className="rounded-lg bg-surface-container-low p-3">
            <p className="mb-1 font-semibold text-primary">OD</p>
            <p>VL AC : {c.examen_od.vl_avec || '—'}</p>
            <p>Sph {c.examen_od.sphere} / Cyl {c.examen_od.cylindre} / Axe {c.examen_od.axe}°</p>
            {c.examen_od.addition && <p>Add {c.examen_od.addition}</p>}
            <p>PIO {c.examen_od.pio || '—'} mmHg</p>
          </div>
          <div className="rounded-lg bg-surface-container-low p-3">
            <p className="mb-1 font-semibold text-secondary">OG</p>
            <p>VL AC : {c.examen_og.vl_avec || '—'}</p>
            <p>Sph {c.examen_og.sphere} / Cyl {c.examen_og.cylindre} / Axe {c.examen_og.axe}°</p>
            {c.examen_og.addition && <p>Add {c.examen_og.addition}</p>}
            <p>PIO {c.examen_og.pio || '—'} mmHg</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="font-semibold">Conduite à tenir</p>
          <p className="whitespace-pre-wrap text-body-sm">{c.conduite_a_tenir || '—'}</p>
        </div>
        {c.ordonnance && (
          <div className="mb-4">
            <p className="font-semibold">Notes de traitement</p>
            <p className="whitespace-pre-wrap">{c.ordonnance}</p>
          </div>
        )}
        {c.prescription && (
          <div className="mb-4">
            <p className="font-semibold">Notes optiques</p>
            <p className="whitespace-pre-wrap">{c.prescription}</p>
          </div>
        )}

        <div className="mt-12 text-right">
          <p className="text-body-sm text-secondary">Médecin</p>
          <p className="text-label-sm">Ophtalmologiste</p>
        </div>
      </div>
    </div>
  )
}
