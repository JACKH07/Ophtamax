import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PrintDocumentHeader } from '@/components/common/PrintDocumentHeader'
import { fetchPrescriptionLunettes } from '@/features/prescription-lunettes/services/prescriptionLunettesService'
import { PATHS } from '@/routes/paths'

export function PrescriptionLunettesPrintPage() {
  const { id } = useParams()

  const { data: item } = useQuery({
    queryKey: ['prescription-lunettes', id],
    queryFn: () => fetchPrescriptionLunettes(id!),
    enabled: Boolean(id),
  })

  if (!item) {
    return <div className="py-12 text-center text-secondary">Chargement...</div>
  }

  return (
    <div>
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-4">
          <Link
            to={PATHS.prescriptionLunettes}
            className="flex items-center gap-1 text-primary hover:underline"
          >
            <MaterialIcon name="arrow_back" className="text-[18px]" />
            Retour à la liste
          </Link>
          <Link
            to={`${PATHS.prescriptionLunettes}/${item.id}/modifier`}
            className="text-secondary hover:text-primary hover:underline"
          >
            Modifier
          </Link>
          <Link
            to={`${PATHS.patients}/${item.patient_id}`}
            className="text-secondary hover:text-primary hover:underline"
          >
            Fiche patient
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
        <PrintDocumentHeader title="Prescription lunettes" />

        <div className="mb-6 grid gap-2 text-body-md">
          <p><strong>Patient :</strong> {item.patient_name}</p>
          <p><strong>Date :</strong> {new Date(item.date).toLocaleDateString('fr-FR')}</p>
          <p><strong>Médecin :</strong> {item.medecin || '—'}</p>
          <p><strong>Type de verre :</strong> {item.type_verre || '—'}</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 text-body-sm">
          <div className="rounded-lg bg-surface-container-low p-3">
            <p className="mb-1 font-semibold text-primary">OD</p>
            <p>Sph {item.od_sphere || '—'} / Cyl {item.od_cylindre || '—'} / Axe {item.od_axe || '—'}°</p>
            {item.od_addition && <p>Add {item.od_addition}</p>}
          </div>
          <div className="rounded-lg bg-surface-container-low p-3">
            <p className="mb-1 font-semibold text-secondary">OG</p>
            <p>Sph {item.og_sphere || '—'} / Cyl {item.og_cylindre || '—'} / Axe {item.og_axe || '—'}°</p>
            {item.og_addition && <p>Add {item.og_addition}</p>}
          </div>
        </div>

        {item.correction && (
          <div className="mb-4">
            <p className="mb-2 font-semibold">Correction / consignes</p>
            <p className="whitespace-pre-wrap text-body-md">{item.correction}</p>
          </div>
        )}

        {item.notes && (
          <div className="mb-4">
            <p className="mb-2 font-semibold">Notes</p>
            <p className="whitespace-pre-wrap text-body-sm text-secondary">{item.notes}</p>
          </div>
        )}

        <div className="mt-12 text-right">
          <p className="text-body-sm text-secondary">{item.medecin || 'Médecin'}</p>
          <p className="text-label-sm">Ophtalmologiste</p>
        </div>
      </div>
    </div>
  )
}
