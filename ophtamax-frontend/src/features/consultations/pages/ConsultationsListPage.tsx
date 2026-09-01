import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { fetchConsultations } from '@/features/consultations/services/consultationService'
import { usePermissions } from '@/hooks/usePermissions'
import { PATHS } from '@/routes/paths'

export function ConsultationsListPage() {
  const { can } = usePermissions()
  const { data: consultations = [] } = useQuery({ queryKey: ['consultations'], queryFn: fetchConsultations })

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title="Consultations"
        subtitle="Examens ophtalmologiques et diagnostics."
        actions={
          can('consultations.write') ? (
            <Link to={`${PATHS.consultations}/nouvelle`} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary shadow-sm">
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
              {['Patient', 'Date', 'Diagnostic', 'Statut', 'Actions'].map((h) => (
                <th key={h} className={`px-4 py-3 text-label-md text-on-surface-variant ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {consultations.map((c) => (
              <tr key={c.id} className="hover:bg-surface-container-low/50">
                <td className="px-4 py-3 font-medium">{c.patient_name}</td>
                <td className="px-4 py-3 text-body-sm">{new Date(c.datecons).toLocaleDateString('fr-FR')}</td>
                <td className="px-4 py-3 text-body-sm">{c.diagnostic || '—'}</td>
                <td className="px-4 py-3"><StatusBadge label={c.statut === 'terminee' ? 'Terminée' : 'Brouillon'} variant={c.statut === 'terminee' ? 'success' : 'warning'} /></td>
                <td className="px-4 py-3 text-right">
                  <Link to={`${PATHS.consultations}/${c.id}`} className="text-label-md text-primary hover:underline">Voir</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
