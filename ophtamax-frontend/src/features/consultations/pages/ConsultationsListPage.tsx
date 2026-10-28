import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PageHeader } from '@/components/common/PageHeader'
import { Pagination } from '@/components/common/Pagination'
import { StatusBadge } from '@/components/common/StatusBadge'
import {
  deleteConsultation,
  fetchConsultations,
} from '@/features/consultations/services/consultationService'
import { usePermissions } from '@/hooks/usePermissions'
import { PATHS } from '@/routes/paths'
import { formatDateFr } from '@/utils/date'

export function ConsultationsListPage() {
  const { can } = usePermissions()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading } = useQuery({
    queryKey: ['consultations', search, page],
    queryFn: () => fetchConsultations(page, undefined, search),
  })
  const consultations = data?.items ?? []

  const removeMutation = useMutation({
    mutationFn: deleteConsultation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['consultations'] }),
  })

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title="Consultations"
        subtitle="Examens ophtalmologiques et diagnostics."
        actions={
          can('consultations.write') ? (
            <Link
              to={PATHS.consultationNouvelle}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-md font-semibold text-on-primary shadow-sm hover:bg-on-primary-fixed-variant"
            >
              <MaterialIcon name="add" className="text-[18px]" />
              Nouvelle consultation
            </Link>
          ) : undefined
        }
      />

      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="mb-1 block text-label-sm text-on-surface-variant">
              Recherche de patient
            </label>
            <div className="relative">
              <MaterialIcon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                placeholder="Nom du patient, diagnostic…"
                className="w-full rounded-lg border border-outline-variant bg-surface py-2 pl-10 pr-4 text-body-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead className="border-b border-outline-variant bg-surface-container-low">
            <tr>
              {['Patient', 'Dossier', 'Date', 'Diagnostic', 'Statut', 'Actions'].map((h) => (
                <th
                  key={h}
                  className={`px-4 py-3 text-label-md text-on-surface-variant ${h === 'Actions' ? 'text-right' : ''}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-secondary">Chargement...</td>
              </tr>
            ) : consultations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-secondary">
                  {search.trim()
                    ? 'Aucune consultation pour cette recherche'
                    : (
                      <>
                        Aucune consultation —{' '}
                        <Link to={PATHS.consultationNouvelle} className="text-primary hover:underline">
                          créer la première
                        </Link>
                      </>
                    )}
                </td>
              </tr>
            ) : (
              consultations.map((c) => (
                <tr key={c.id} className="hover:bg-surface-container-low/50">
                  <td className="px-4 py-3">
                    {c.id_patient ? (
                      <Link
                        to={`${PATHS.patients}/${c.id_patient}`}
                        className="font-medium text-on-surface hover:text-primary"
                      >
                        {c.patient_name}
                      </Link>
                    ) : (
                      <span className="font-medium text-on-surface">{c.patient_name}</span>
                    )}
                    <p className="text-label-sm text-secondary line-clamp-1">
                      {c.diagnostic || 'Consultation'}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-body-sm text-secondary">#{c.dossier_numero}</td>
                  <td className="px-4 py-3 text-body-sm">
                    {formatDateFr(c.datecons) || '—'}
                  </td>
                  <td className="px-4 py-3 text-body-sm">{c.diagnostic || '—'}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      label={c.statut === 'terminee' ? 'Terminée' : 'Brouillon'}
                      variant={c.statut === 'terminee' ? 'success' : 'warning'}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link
                        to={`${PATHS.consultations}/${c.id}`}
                        className="rounded-md p-1.5 text-secondary hover:bg-surface-container-highest hover:text-primary"
                        title="Voir"
                      >
                        <MaterialIcon name="visibility" className="text-[18px]" />
                      </Link>
                      {can('consultations.write') && (
                        <Link
                          to={`${PATHS.consultations}/${c.id}/modifier`}
                          className="rounded-md p-1.5 text-secondary hover:bg-surface-container-highest hover:text-primary"
                          title="Modifier"
                        >
                          <MaterialIcon name="edit" className="text-[18px]" />
                        </Link>
                      )}
                      <Link
                        to={`${PATHS.consultations}/${c.id}/documents`}
                        className="rounded-md p-1.5 text-secondary hover:bg-surface-container-highest hover:text-primary"
                        title="Compte-rendu"
                      >
                        <MaterialIcon name="print" className="text-[18px]" />
                      </Link>
                      {can('consultations.write') && (
                        <button
                          type="button"
                          title="Supprimer"
                          onClick={() => {
                            if (window.confirm('Supprimer cette consultation ?')) {
                              removeMutation.mutate(c.id)
                            }
                          }}
                          className="rounded-md p-1.5 text-secondary hover:bg-error-container hover:text-error"
                        >
                          <MaterialIcon name="delete" className="text-[18px]" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination page={page} perPage={data?.perPage ?? 10} total={data?.total ?? 0} onPageChange={setPage} />
      </div>
    </div>
  )
}
