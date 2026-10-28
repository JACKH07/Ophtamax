import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PageHeader } from '@/components/common/PageHeader'
import { Pagination } from '@/components/common/Pagination'
import { StatusBadge } from '@/components/common/StatusBadge'
import { FactureModal } from '@/features/facturation/components/FactureModal'
import {
  deleteFacture,
  fetchCaisseJour,
  fetchFactures,
} from '@/features/facturation/services/facturationService'
import { formatDateTimeFr } from '@/utils/date'
import { PATHS } from '@/routes/paths'

const STATUT: Record<string, { label: string; variant: 'success' | 'warning' | 'error' }> = {
  payee: { label: 'Payée', variant: 'success' },
  partielle: { label: 'Partielle', variant: 'warning' },
  impayee: { label: 'Impayée', variant: 'error' },
}

function formatFcfa(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
}

export function FacturationPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()
  const { data } = useQuery({ queryKey: ['factures', page], queryFn: () => fetchFactures(page) })
  const { data: caisse } = useQuery({ queryKey: ['caisse'], queryFn: fetchCaisseJour })
  const factures = data?.items ?? []
  const totalImpaye =
    data?.impayes ??
    factures.filter((f) => f.statut === 'impayee').reduce((s, f) => s + f.montant_ttc, 0)

  const removeMutation = useMutation({
    mutationFn: deleteFacture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['factures'] })
      queryClient.invalidateQueries({ queryKey: ['caisse'] })
    },
  })

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title="Facturation & Caisse"
        subtitle="Gestion des factures et encaissements."
        actions={
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-md text-on-primary shadow-sm hover:bg-primary-container"
          >
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
        {factures.length === 0 ? (
          <p className="px-5 py-10 text-center text-secondary">
            Aucune facture. Cliquez sur « Nouvelle facture » pour en créer une.
          </p>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead className="border-b border-outline-variant bg-surface-container-low">
              <tr>
                {['N° Facture', 'Patient', 'Date / heure', 'Montant TTC', 'Statut', 'Paiement', 'Actions'].map(
                  (h) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-label-md text-on-surface-variant ${h === 'Actions' ? 'text-right' : ''}`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {factures.map((f) => (
                <tr key={f.id} className="hover:bg-surface-container-low/50">
                  <td className="px-4 py-3 font-medium text-primary">
                    <Link to={`${PATHS.facturation}/${f.id}`} className="hover:underline">
                      {f.numero}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{f.patient_name || '—'}</td>
                  <td className="px-4 py-3 text-body-sm">
                    {formatDateTimeFr(f.created_at || f.date) || '—'}
                  </td>
                  <td className="px-4 py-3 font-medium">{formatFcfa(f.montant_ttc)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge label={STATUT[f.statut].label} variant={STATUT[f.statut].variant} />
                  </td>
                  <td className="px-4 py-3 text-body-sm">{f.mode_paiement ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`${PATHS.facturation}/${f.id}`}
                        title="Imprimer"
                        className="rounded-md p-1.5 text-secondary hover:bg-surface-container hover:text-primary"
                      >
                        <MaterialIcon name="print" className="text-[18px]" />
                      </Link>
                      <button
                        type="button"
                        title="Supprimer"
                        disabled={removeMutation.isPending}
                        onClick={() => {
                          if (window.confirm(`Supprimer la facture « ${f.numero} » ?`)) {
                            removeMutation.mutate(f.id)
                          }
                        }}
                        className="rounded-md p-1.5 text-secondary hover:bg-error-container hover:text-error disabled:opacity-50"
                      >
                        <MaterialIcon name="delete" className="text-[18px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination page={page} perPage={data?.perPage ?? 10} total={data?.total ?? 0} onPageChange={setPage} />
      </div>

      {modalOpen && <FactureModal onClose={() => setModalOpen(false)} />}
    </div>
  )
}
