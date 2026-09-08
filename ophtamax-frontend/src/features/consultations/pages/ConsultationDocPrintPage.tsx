import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import {
  PrintDocumentHeader,
  PrintLinesTable,
  PrintSheet,
  PrintSignature,
} from '@/components/common/PrintDocumentHeader'
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
    <PrintSheet
      toolbar={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to={`${PATHS.consultations}/${c.id}`}
            className="flex items-center gap-1 text-primary hover:underline"
          >
            <MaterialIcon name="arrow_back" className="text-[18px]" />
            Retour consultation
          </Link>
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
        title="Consultation"
        documentRef={c.dossier_numero ? `Dossier nº ${c.dossier_numero}` : undefined}
        date={c.datecons}
        message="Fiche clinique ophtalmologique."
        columns={[
          {
            title: 'Patient',
            lines: [
              <strong key="n">{c.patient_name || '—'}</strong>,
              c.dossier_numero ? `Dossier #${c.dossier_numero}` : '—',
            ],
          },
          {
            title: 'Détails',
            lines: [
              c.diagnostic || 'Consultation',
              c.prochain_rdv_delai
                ? `Prochain RDV : ${c.prochain_rdv_delai}`
                : '—',
            ],
          },
          {
            title: 'Médecin',
            lines: ['Ophtalmologiste', 'Cabinet Kahydara'],
          },
        ]}
      />

      <PrintLinesTable
        headers={['Article', 'OD', 'OG']}
        rows={[
          {
            cells: [
              'Acuité VL (avec corr.)',
              c.examen_od.vl_avec || '—',
              c.examen_og.vl_avec || '—',
            ],
          },
          {
            cells: [
              'Réfraction',
              `Sph ${c.examen_od.sphere} / Cyl ${c.examen_od.cylindre} / ${c.examen_od.axe}°`,
              `Sph ${c.examen_og.sphere} / Cyl ${c.examen_og.cylindre} / ${c.examen_og.axe}°`,
            ],
            description: [
              c.examen_od.addition ? `OD Add ${c.examen_od.addition}` : '',
              c.examen_og.addition ? `OG Add ${c.examen_og.addition}` : '',
            ]
              .filter(Boolean)
              .join(' · '),
          },
          {
            cells: [
              'PIO (mmHg)',
              c.examen_od.pio || '—',
              c.examen_og.pio || '—',
            ],
          },
          {
            cells: ['Conduite à tenir', c.conduite_a_tenir || '—', ''],
          },
        ]}
      />

      <PrintSignature />
    </PrintSheet>
  )
}
