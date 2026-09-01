import { useQuery } from '@tanstack/react-query'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { fetchCaisseJour, fetchFactures } from '@/features/facturation/services/facturationService'

const STATUT: Record<string, { label: string; variant: 'success' | 'warning' | 'error' }> = {
  payee: { label: 'Payée', variant: 'success' },
  partielle: { label: 'Partielle', variant: 'warning' },
  impayee: { label: 'Impayée', variant: 'error' },
}

function formatFcfa(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
}

export function FacturationPage() {
  const { data: factures = [] } = useQuery({ queryKey: ['factures'], queryFn: fetchFactures })
  const { data: caisse } = useQuery({ queryKey: ['caisse'], queryFn: fetchCaisseJour })

  const totalImpaye = factures.filter((f) => f.statut === 'impayee').reduce((s, f) => s + f.montant_ttc, 0)

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title="Facturation & Caisse"
        subtitle="Gestion des factures et encaissements."
        actions={
          <button type="button" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-md text-on-primary shadow-sm hover:bg-primary-container">
            <MaterialIcon name="add" className="text-[18px]" /> Nouvelle facture
          </button>
        }
      />

      <div className="grid gap-gutter md:grid-cols-3">
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
          <p className="text-label-md uppercase tracking-wider text-secondary">Recette du jour</p>
          <p className="mt-2 text-display-lg font-bold">{formatFcfa(caisse?.total ?? 0)}</p>
        </div>
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
          <p className="text-label-md uppercase tracking-wider text-secondary">Factures du jour</p>
          <p className="mt-2 text-display-lg font-bold">{caisse?.count ?? 0}</p>
        </div>
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
          <p className="text-label-md uppercase tracking-wider text-secondary">Impayés</p>
          <p className="mt-2 text-display-lg font-bold text-error">{formatFcfa(totalImpaye)}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
        <div className="border-b border-outline-variant px-5 py-4">
          <h3 className="text-headline-sm font-semibold">Factures récentes</h3>
        </div>
        <table className="w-full border-collapse text-left">
          <thead className="border-b border-outline-variant bg-surface-container-low">
            <tr>
              {['N° Facture', 'Patient', 'Date', 'Montant TTC', 'Statut', 'Paiement', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-label-md text-on-surface-variant">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {factures.map((f) => (
              <tr key={f.id} className="hover:bg-surface-container-low/50">
                <td className="px-4 py-3 font-medium text-primary">{f.numero}</td>
                <td className="px-4 py-3">{f.patient_name}</td>
                <td className="px-4 py-3 text-body-sm">{new Date(f.date).toLocaleDateString('fr-FR')}</td>
                <td className="px-4 py-3 font-medium">{formatFcfa(f.montant_ttc)}</td>
                <td className="px-4 py-3"><StatusBadge label={STATUT[f.statut].label} variant={STATUT[f.statut].variant} /></td>
                <td className="px-4 py-3 text-body-sm">{f.mode_paiement ?? '—'}</td>
                <td className="px-4 py-3">
                  <button type="button" className="rounded-md p-1.5 text-secondary hover:bg-surface-container hover:text-primary">
                    <MaterialIcon name="print" className="text-[18px]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
