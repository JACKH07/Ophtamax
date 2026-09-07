import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PrintDocumentHeader } from '@/components/common/PrintDocumentHeader'
import { fetchPrescriptionExamen } from '@/features/prescription-examen/services/prescriptionExamenService'
import { PATHS } from '@/routes/paths'

export function PrescriptionExamenPrintPage() {
  const { id } = useParams()

  const { data: item } = useQuery({
    queryKey: ['prescription-examen', id],
    queryFn: () => fetchPrescriptionExamen(id!),
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
            to={PATHS.prescriptionExamen}
            className="flex items-center gap-1 text-primary hover:underline"
          >
            <MaterialIcon name="arrow_back" className="text-[18px]" />
            Retour à la liste
          </Link>
          <Link
            to={`${PATHS.prescriptionExamen}/${item.id}/modifier`}
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
        <PrintDocumentHeader title="Prescription examen" />

        <div className="mb-6 grid gap-2 text-body-md">
          <p><strong>Patient :</strong> {item.patient_name}</p>
          <p><strong>Date :</strong> {new Date(item.date).toLocaleDateString('fr-FR')}</p>
          <p><strong>Médecin :</strong> {item.medecin || '—'}</p>
          {item.indication && <p><strong>Indication :</strong> {item.indication}</p>}
        </div>

        <div className="mb-4">
          <p className="mb-2 font-semibold">Examens prescrits</p>
          <p className="whitespace-pre-wrap text-body-md">{item.examens}</p>
        </div>

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
