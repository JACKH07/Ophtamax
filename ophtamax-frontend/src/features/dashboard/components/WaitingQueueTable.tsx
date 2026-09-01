import type { WaitingQueueItem } from '@/api/types/dashboard'
import { MaterialIcon } from '@/components/common/MaterialIcon'

const STATUS_LABELS: Record<WaitingQueueItem['status'], string> = {
  en_consultation: 'En consultation',
  en_attente: 'En attente',
  termine: 'Terminé',
}

const STATUS_STYLES: Record<WaitingQueueItem['status'], string> = {
  en_consultation: 'bg-primary-container text-on-primary-container',
  en_attente: 'bg-secondary-container text-on-secondary-fixed',
  termine: 'bg-surface-variant text-on-surface-variant',
}

const AVATAR_STYLES: Record<WaitingQueueItem['avatar_tone'], string> = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary-container text-on-secondary-fixed',
  surface: 'bg-surface-variant text-on-surface-variant',
  muted: 'bg-surface-container-high text-secondary',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
}

interface WaitingQueueTableProps {
  items: WaitingQueueItem[]
}

export function WaitingQueueTable({ items }: WaitingQueueTableProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
      <div className="flex items-center justify-between border-b border-outline-variant bg-surface/50 px-5 py-4">
        <h3 className="flex items-center gap-2 text-headline-sm font-semibold text-on-surface">
          <MaterialIcon name="recent_patient" className="text-primary" />
          File d&apos;attente du jour
        </h3>
        <button
          type="button"
          className="flex items-center gap-1 text-label-md font-semibold tracking-wide text-primary hover:underline"
        >
          Voir tout
          <MaterialIcon name="arrow_forward" className="text-[16px]" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low">
              <th className="w-1/3 px-5 py-3 text-label-sm font-medium uppercase tracking-wider text-secondary">
                Patient
              </th>
              <th className="px-5 py-3 text-label-sm font-medium uppercase tracking-wider text-secondary">
                Heure
              </th>
              <th className="px-5 py-3 text-label-sm font-medium uppercase tracking-wider text-secondary">
                Statut
              </th>
              <th className="px-5 py-3 text-label-sm font-medium uppercase tracking-wider text-secondary">
                Praticien
              </th>
              <th className="px-5 py-3 text-right text-label-sm font-medium uppercase tracking-wider text-secondary">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {items.map((item) => (
              <tr
                key={item.id}
                className="group transition-colors hover:bg-surface-container-low/50"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-label-md font-semibold tracking-wide ${AVATAR_STYLES[item.avatar_tone]}`}
                    >
                      {getInitials(item.patient_name)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-body-md font-medium text-on-surface">
                        {item.patient_name}
                      </span>
                      <span className="text-label-sm text-secondary">{item.reason}</span>
                    </div>
                  </div>
                </td>
                <td
                  className={`px-5 py-3 text-body-sm text-on-surface ${
                    item.status === 'termine' ? 'text-secondary line-through' : ''
                  }`}
                >
                  {item.time}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-label-sm ${STATUS_STYLES[item.status]}`}
                  >
                    {STATUS_LABELS[item.status]}
                  </span>
                </td>
                <td className="px-5 py-3 text-body-sm text-secondary">{item.practitioner}</td>
                <td className="px-5 py-3 text-right">
                  <button
                    type="button"
                    className="p-1 text-outline opacity-0 transition-all hover:text-primary group-hover:opacity-100"
                    aria-label="Actions"
                  >
                    <MaterialIcon name="more_vert" className="text-[20px]" />
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
