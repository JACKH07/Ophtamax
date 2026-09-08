import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { StatCard } from '@/features/dashboard/components/StatCard'
import { TopDiagnostics } from '@/features/dashboard/components/TopDiagnostics'
import { UpcomingSlots } from '@/features/dashboard/components/UpcomingSlots'
import { WaitingQueueTable } from '@/features/dashboard/components/WaitingQueueTable'
import {
  fetchDashboardSummary,
  fetchTopDiagnostics,
  fetchUpcomingSlots,
  fetchWaitingQueue,
} from '@/features/dashboard/services/dashboardService'
import { PATHS } from '@/routes/paths'

function formatCurrency(amount: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(amount)} FCFA`
}

export function DashboardPage() {
  const summaryQuery = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: fetchDashboardSummary,
  })

  const queueQuery = useQuery({
    queryKey: ['dashboard', 'waiting-queue'],
    queryFn: () => fetchWaitingQueue(),
  })

  const slotsQuery = useQuery({
    queryKey: ['dashboard', 'upcoming-slots'],
    queryFn: () => fetchUpcomingSlots(),
  })

  const diagnosticsQuery = useQuery({
    queryKey: ['dashboard', 'top-diagnostics'],
    queryFn: fetchTopDiagnostics,
  })

  const summary = summaryQuery.data

  return (
    <>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-display-lg font-semibold text-on-surface">Tableau de bord</h2>
          <p className="mt-1 text-body-md text-secondary">
            Vue d&apos;ensemble de l&apos;activité clinique de la journée.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={PATHS.agenda}
            className="flex items-center gap-2 rounded-lg border border-primary bg-surface-container-lowest px-4 py-2.5 text-label-md font-semibold tracking-wide text-primary shadow-sm transition-colors hover:bg-primary/5"
          >
            <MaterialIcon name="calendar_add_on" className="text-[18px]" />
            + Nouveau rendez-vous
          </Link>
          <Link
            to={`${PATHS.patients}/nouveau`}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-md font-semibold tracking-wide text-on-primary shadow-sm transition-colors hover:bg-primary/90"
          >
            <MaterialIcon name="person_add" className="text-[18px]" />
            + Nouveau patient
          </Link>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Consultations du jour"
            value={summary.consultations_today}
            subtitle={`+${summary.consultations_planned} prévus`}
            subtitleClassName="text-primary"
            icon="medical_services"
            decorativeIcon="visibility"
          />
          <StatCard
            title="Patients en attente"
            value={summary.patients_waiting}
            subtitle={`Moy. ${summary.average_wait_minutes}min`}
            icon="hourglass_empty"
            iconBgClassName="bg-secondary-container/50 text-on-secondary-fixed"
          />
          <StatCard
            title="Recette du jour (caisse)"
            value={formatCurrency(summary.revenue_today)}
            subtitle={summary.revenue_status}
            subtitleClassName="text-primary"
            icon="payments"
            iconBgClassName="bg-surface-variant text-on-surface-variant"
          />
          <StatCard
            title="Nouveaux patients (sem.)"
            value={summary.new_patients_week}
            subtitle={`+${summary.new_patients_trend_percent}% vs sem. pr.`}
            icon="group_add"
          />
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-gutter lg:grid-cols-12">
        <div className="lg:col-span-8">
          {queueQuery.data && <WaitingQueueTable items={queueQuery.data} />}
        </div>
        <div className="flex flex-col gap-stack-lg lg:col-span-4">
          {slotsQuery.data && <UpcomingSlots slots={slotsQuery.data} />}
          {diagnosticsQuery.data && <TopDiagnostics items={diagnosticsQuery.data} />}
        </div>
      </div>
    </>
  )
}
