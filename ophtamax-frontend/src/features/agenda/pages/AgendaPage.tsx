import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { fetchRendezVous, updateRdvStatut } from '@/features/agenda/services/agendaService'
import { PATHS } from '@/routes/paths'

const STATUT_MAP = {
  planifie: { label: 'Planifié', variant: 'muted' as const },
  en_attente: { label: 'En attente', variant: 'secondary' as const },
  en_consultation: { label: 'En consultation', variant: 'primary' as const },
  termine: { label: 'Terminé', variant: 'success' as const },
  absent: { label: 'Absent', variant: 'error' as const },
}

export function AgendaPage() {
  const queryClient = useQueryClient()
  const { data: rdvs = [] } = useQuery({ queryKey: ['agenda'], queryFn: fetchRendezVous })

  const mutation = useMutation({
    mutationFn: ({ id, statut }: { id: string; statut: 'en_consultation' | 'termine' }) =>
      updateRdvStatut(id, statut),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agenda'] }),
  })

  const fileAttente = rdvs.filter((r) => ['en_attente', 'en_consultation'].includes(r.statut))
  const planifies = rdvs.filter((r) => r.statut === 'planifie')

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title="Agenda"
        subtitle="Planning des rendez-vous et file d'attente du jour."
        actions={
          <button type="button" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary shadow-sm hover:bg-primary-container">
            <MaterialIcon name="calendar_add_on" className="text-[18px]" />
            Nouveau rendez-vous
          </button>
        }
      />

      <div className="grid gap-gutter lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-headline-sm font-semibold">Calendrier du jour</h3>
              <div className="flex gap-1 rounded-lg bg-surface-container-low p-1">
                <button type="button" className="rounded bg-surface-container-lowest px-4 py-1.5 text-label-md text-primary shadow-sm">Jour</button>
                <button type="button" className="rounded px-4 py-1.5 text-label-md text-on-surface-variant">Semaine</button>
              </div>
            </div>
            <div className="space-y-2">
              {planifies.map((rdv) => (
                <div key={rdv.id} className="flex items-center gap-4 rounded-lg border border-outline-variant/50 bg-surface-container-low/50 p-3">
                  <span className="text-label-md font-semibold text-primary">
                    {new Date(rdv.date_heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-on-surface">{rdv.patient_name}</p>
                    <p className="text-label-sm text-secondary">{rdv.motif} · {rdv.medecin}</p>
                  </div>
                  <StatusBadge label={STATUT_MAP[rdv.statut].label} variant={STATUT_MAP[rdv.statut].variant} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
            <div className="border-b border-outline-variant px-5 py-4">
              <h3 className="text-headline-sm font-semibold">File d&apos;attente</h3>
            </div>
            <div className="divide-y divide-outline-variant">
              {fileAttente.length === 0 ? (
                <p className="px-5 py-8 text-center text-secondary">File vide</p>
              ) : (
                fileAttente.map((rdv) => (
                  <div key={rdv.id} className="px-5 py-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h4 className="text-label-md font-semibold text-on-surface">{rdv.patient_name}</h4>
                        <p className="text-label-sm text-secondary">{rdv.motif}</p>
                      </div>
                      <StatusBadge label={STATUT_MAP[rdv.statut].label} variant={STATUT_MAP[rdv.statut].variant} />
                    </div>
                    <div className="flex gap-2">
                      {rdv.statut === 'en_attente' && (
                        <button
                          type="button"
                          onClick={() => mutation.mutate({ id: rdv.id, statut: 'en_consultation' })}
                          className="flex items-center gap-1.5 rounded-lg border border-primary/30 px-3 py-1.5 text-label-md text-primary hover:bg-primary hover:text-on-primary"
                        >
                          <MaterialIcon name="play_arrow" className="text-[16px]" />
                          Appeler
                        </button>
                      )}
                      {rdv.statut === 'en_consultation' && (
                        <button
                          type="button"
                          onClick={() => mutation.mutate({ id: rdv.id, statut: 'termine' })}
                          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-label-md text-on-primary"
                        >
                          <MaterialIcon name="check" className="text-[16px]" />
                          Terminer
                        </button>
                      )}
                      <Link to={`${PATHS.consultations}/nouvelle?patient=${rdv.patient_id}`} className="rounded-lg border border-outline-variant px-3 py-1.5 text-label-md text-secondary hover:bg-surface-container-low">
                        Consultation
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
