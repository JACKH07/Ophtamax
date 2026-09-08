import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import {
  PrintDocumentHeader,
  PrintLinesTable,
  PrintSheet,
  PrintSignature,
} from '@/components/common/PrintDocumentHeader'
import { fetchOrdonnance } from '@/features/ordonnances/services/ordonnanceService'
import { PATHS } from '@/routes/paths'

export function OrdonnancePrintPage() {
  const { id } = useParams()

  const { data: item } = useQuery({
    queryKey: ['ordonnance', id],
    queryFn: () => fetchOrdonnance(id!),
    enabled: Boolean(id),
  })

  if (!item) {
    return <div className="py-12 text-center text-secondary">Chargement...</div>
  }

  return (
    <PrintSheet
      toolbar={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-4">
            <Link to={PATHS.ordonnances} className="flex items-center gap-1 text-primary hover:underline">
              <MaterialIcon name="arrow_back" className="text-[18px]" />
              Retour à la liste
            </Link>
            <Link
              to={`${PATHS.ordonnances}/${item.id}/modifier`}
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
      }
    >
      <PrintDocumentHeader
        title="Ordonnance ophtalmologique"
        documentRef={`ORD-${item.id.slice(0, 8).toUpperCase()}`}
        date={item.date}
        message="Ordonnance à présenter en pharmacie."
        columns={[
          {
            title: 'Patient',
            lines: [
              <strong key="n">{item.patient_name || '—'}</strong>,
              item.diagnostic ? `Diagnostic : ${item.diagnostic}` : '—',
            ],
          },
          {
            title: 'Détails',
            lines: ['Ordonnance médicale', item.notes || 'Sans instruction particulière'],
          },
          {
            title: 'Médecin',
            lines: [item.medecin || '—', 'Ophtalmologiste'],
          },
        ]}
      />

      <PrintLinesTable
        headers={['Article / Traitement', 'Posologie']}
        rows={[
          {
            cells: ['Traitement prescrit', 'Selon prescription'],
            description: item.contenu || '—',
          },
        ]}
      />

      <PrintSignature name={item.medecin} />
    </PrintSheet>
  )
}
