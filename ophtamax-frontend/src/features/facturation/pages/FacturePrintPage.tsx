import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import {
  PrintDocumentHeader,
  PrintLinesTable,
  PrintSheet,
  PrintSignature,
} from '@/components/common/PrintDocumentHeader'
import { fetchFacture } from '@/features/facturation/services/facturationService'
import { PATHS } from '@/routes/paths'
import { formatDateTimeFr } from '@/utils/date'

function formatFcfa(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
}

const STATUT_LABEL: Record<string, string> = {
  payee: 'Payée',
  partielle: 'Partielle',
  impayee: 'Impayée',
}

export function FacturePrintPage() {
  const { id } = useParams()

  const { data: item } = useQuery({
    queryKey: ['facture', id],
    queryFn: () => fetchFacture(id!),
    enabled: Boolean(id),
  })

  if (!item) {
    return <div className="py-12 text-center text-secondary">Chargement...</div>
  }

  const when = formatDateTimeFr(item.created_at || item.date) || '—'

  return (
    <PrintSheet
      toolbar={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to={PATHS.facturation} className="flex items-center gap-1 text-primary hover:underline">
            <MaterialIcon name="arrow_back" className="text-[18px]" />
            Retour à la facturation
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
        title="Facture"
        documentRef={item.numero}
        date={item.date}
        message="Reçu de paiement — à conserver."
        columns={[
          {
            title: 'Patient',
            lines: [<strong key="n">{item.patient_name || '—'}</strong>],
          },
          {
            title: 'Paiement',
            lines: [
              STATUT_LABEL[item.statut] ?? item.statut,
              item.mode_paiement || '—',
              when,
            ],
          },
          {
            title: 'Montant',
            lines: [<strong key="m">{formatFcfa(item.montant_ttc)}</strong>, 'TTC'],
          },
        ]}
      />

      <PrintLinesTable
        headers={['Désignation', 'Montant']}
        rows={(item.lignes ?? []).map((l) => ({
          cells: [l.libelle, formatFcfa(Number(l.prix_unitaire) || 0)],
        }))}
      />

      <div className="mt-4 flex justify-end border-t border-[#ddd] pt-3">
        <p className="text-[14px] font-semibold">
          Total TTC : {formatFcfa(item.montant_ttc)}
        </p>
      </div>

      <PrintSignature name="Caisse" />
    </PrintSheet>
  )
}
