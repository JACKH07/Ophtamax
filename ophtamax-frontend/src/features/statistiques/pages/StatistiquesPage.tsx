import { useQuery } from '@tanstack/react-query'
import { USE_MOCK } from '@/api/endpoints'
import { mockStore } from '@/api/mock/dataStore'
import { PageHeader } from '@/components/common/PageHeader'
import { TopDiagnostics } from '@/features/dashboard/components/TopDiagnostics'

async function fetchStats() {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.statistiques()
}

export function StatistiquesPage() {
  const { data: stats } = useQuery({ queryKey: ['statistiques'], queryFn: fetchStats })

  if (!stats) return <div className="py-12 text-center text-secondary">Chargement...</div>

  const maxVal = Math.max(...stats.consultations_par_mois.map((m) => m.value), 1)

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader title="Statistiques" subtitle="Rapports et indicateurs d'activité clinique." />

      <div className="grid gap-gutter md:grid-cols-4">
        {[
          { label: 'Consultations (mois)', value: stats.consultations_mois, trend: stats.consultations_evolution ? `+${stats.consultations_evolution}%` : '0%' },
          { label: 'CA mensuel', value: `${(stats.ca_mois / 1000000).toFixed(1)}M FCFA`, trend: stats.ca_evolution ? `+${stats.ca_evolution}%` : '0%' },
          { label: 'Nouveaux patients', value: stats.nouveaux_patients, trend: '' },
          { label: 'Taux occupation', value: `${stats.taux_occupation}%`, trend: '' },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <p className="text-label-md uppercase tracking-wider text-secondary">{kpi.label}</p>
            <p className="mt-2 text-display-lg font-bold">{kpi.value}</p>
            {kpi.trend && <p className="text-label-sm text-primary">{kpi.trend}</p>}
          </div>
        ))}
      </div>

      <div className="grid gap-gutter lg:grid-cols-2">
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
          <h3 className="mb-5 text-headline-sm font-semibold">Consultations par mois</h3>
          <div className="flex h-48 items-end gap-3">
            {stats.consultations_par_mois.map((m) => (
              <div key={m.mois} className="flex flex-1 flex-col items-center gap-1">
                <div className="w-full rounded-t bg-primary/80" style={{ height: `${(m.value / maxVal) * 100}%`, minHeight: 4 }} />
                <span className="text-label-sm text-secondary">{m.mois}</span>
              </div>
            ))}
          </div>
        </div>
        <TopDiagnostics items={stats.top_diagnostics} />
      </div>
    </div>
  )
}
