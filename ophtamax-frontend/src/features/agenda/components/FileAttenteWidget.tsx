import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { StatusBadge } from '@/components/common/StatusBadge'
import { fetchFileAttente, updateFileAttenteStatut } from '@/features/agenda/services/agendaService'
import { PATHS } from '@/routes/paths'
import type { FileAttenteItem, StatutFileAttente } from '@/api/types/entities'

// ── Constantes ────────────────────────────────────────────────────────────────

const POLLING_INTERVAL_MS = 30_000 // 30 secondes

const STATUT_CONFIG: Record<
  StatutFileAttente,
  { label: string; variant: 'secondary' | 'primary' | 'success' | 'error' }
> = {
  en_attente:      { label: 'En attente',      variant: 'secondary' },
  en_consultation: { label: 'En consultation', variant: 'primary' },
  termine:         { label: 'Terminé',         variant: 'success' },
  absent:          { label: 'Absent',          variant: 'error' },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function minutesWait(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
}

// ── Composant ─────────────────────────────────────────────────────────────────

export function FileAttenteWidget() {
  const queryClient = useQueryClient()
  const today = new Date().toISOString().slice(0, 10)

  const { data: file = [], dataUpdatedAt } = useQuery({
    queryKey: ['file-attente', today],
    queryFn: () => fetchFileAttente(today),
    refetchInterval: POLLING_INTERVAL_MS,
  })

  const mutation = useMutation({
    mutationFn: ({ id, statut }: { id: string; statut: StatutFileAttente }) =>
      updateFileAttenteStatut(id, statut),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['file-attente'] }),
  })

  const actifs = file.filter((f) => f.statut !== 'termine' && f.statut !== 'absent')
  const termines = file.filter((f) => f.statut === 'termine' || f.statut === 'absent')

  const lastSync = new Date(dataUpdatedAt).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <div className="flex h-full flex-col rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
      {/* En-tête */}
      <div className="flex items-center justify-between border-b border-outline-variant px-5 py-4">
        <div>
          <h3 className="text-headline-sm font-semibold text-on-surface">File d&apos;attente</h3>
          <p className="text-label-sm text-secondary">
            {actifs.length} patient{actifs.length > 1 ? 's' : ''} en attente
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-surface-container-low px-2.5 py-1 text-label-sm text-secondary">
          <MaterialIcon name="sync" className="text-[14px]" />
          {lastSync}
        </div>
      </div>

      {/* Liste active */}
      <div className="flex-1 divide-y divide-outline-variant overflow-y-auto">
        {actifs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-secondary">
            <MaterialIcon name="people" className="text-[32px] opacity-40" />
            <p className="text-label-sm">File vide pour aujourd&apos;hui</p>
          </div>
        ) : (
          actifs.map((item, index) => <FileAttenteRow key={item.id} item={item} position={index + 1} onAction={(statut) => mutation.mutate({ id: item.id, statut })} />)
        )}
      </div>

      {/* Terminés du jour */}
      {termines.length > 0 && (
        <div className="border-t border-outline-variant px-5 py-3">
          <p className="text-label-sm text-secondary">
            <MaterialIcon name="check_circle" className="mr-1 inline text-[14px] text-success" />
            {termines.length} patient{termines.length > 1 ? 's' : ''} terminé
            {termines.length > 1 ? 's' : ''} aujourd&apos;hui
          </p>
        </div>
      )}
    </div>
  )
}

// ── Ligne file d'attente ──────────────────────────────────────────────────────

interface FileAttenteRowProps {
  item: FileAttenteItem
  position: number
  onAction: (statut: StatutFileAttente) => void
}

function FileAttenteRow({ item, position, onAction }: FileAttenteRowProps) {
  const cfg = STATUT_CONFIG[item.statut]
  const wait = minutesWait(item.heure_arrivee)

  return (
    <div className="px-5 py-4">
      <div className="mb-2.5 flex items-start gap-3">
        {/* Numéro de position */}
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-container-low text-label-sm font-bold text-secondary">
          {position}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-label-md font-semibold text-on-surface truncate">
              {item.patient_name}
            </h4>
            <StatusBadge label={cfg.label} variant={cfg.variant} />
          </div>
          <p className="text-label-sm text-secondary truncate">{item.motif}</p>
          <p className="mt-0.5 text-label-sm text-on-surface-variant">
            Arrivée : {new Date(item.heure_arrivee).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            {wait > 0 && (
              <span className={`ml-2 font-medium ${wait > 30 ? 'text-error' : 'text-secondary'}`}>
                ({wait} min d&apos;attente)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {item.statut === 'en_attente' && (
          <button
            type="button"
            onClick={() => onAction('en_consultation')}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-label-sm text-on-primary hover:bg-primary/90"
          >
            <MaterialIcon name="play_arrow" className="text-[14px]" />
            Appeler
          </button>
        )}
        {item.statut === 'en_consultation' && (
          <button
            type="button"
            onClick={() => onAction('termine')}
            className="flex items-center gap-1.5 rounded-lg bg-success px-3 py-1.5 text-label-sm text-on-primary hover:bg-success/90"
          >
            <MaterialIcon name="check" className="text-[14px]" />
            Terminer
          </button>
        )}
        {item.statut === 'en_attente' && (
          <button
            type="button"
            onClick={() => onAction('absent')}
            className="flex items-center gap-1.5 rounded-lg border border-error/30 px-3 py-1.5 text-label-sm text-error hover:bg-error/5"
          >
            <MaterialIcon name="person_off" className="text-[14px]" />
            Absent
          </button>
        )}
        <Link
          to={`${PATHS.consultations}/nouvelle?patient=${item.patient_id}`}
          className="flex items-center gap-1.5 rounded-lg border border-outline-variant px-3 py-1.5 text-label-sm text-secondary hover:bg-surface-container-low"
        >
          <MaterialIcon name="description" className="text-[14px]" />
          Consultation
        </Link>
      </div>
    </div>
  )
}
