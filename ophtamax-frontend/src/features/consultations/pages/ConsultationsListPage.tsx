import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import {
  deleteConsultation,
  fetchConsultations,
} from '@/features/consultations/services/consultationService'
import { usePermissions } from '@/hooks/usePermissions'
import { PATHS } from '@/routes/paths'

export function ConsultationsListPage() {
  const { can } = usePermissions()
  const queryClient = useQueryClient()
  const { data: consultations = [], isLoading } = useQuery({
    queryKey: ['consultations'],
    queryFn: fetchConsultations,
  })

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
                  Aucune consultation —{' '}
                  <Link to={PATHS.consultationNouvelle} className="text-primary hover:underline">
                    créer la première
                  </Link>
                </td>
              </tr>
            ) : (
              consultations.map((c) => (
                <tr key={c.id} className="hover:bg-surface-container-low/50">
                  <td className="px-4 py-3">
                    <Link
                      to={`${PATHS.patients}/${c.id_patient}`}
                      className="font-medium text-on-surface hover:text-primary"
                    >
                      {c.patient_name}
                    </Link>
                    <p className="text-label-sm text-secondary line-clamp-1">
                      {c.diagnostic || 'Consultation'}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-body-sm text-secondary">#{c.dossier_numero}</td>
                  <td className="px-4 py-3 text-body-sm">
                    {new Date(c.datecons).toLocaleDateString('fr-FR')}
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
      </div>
    </div>
  )
}
