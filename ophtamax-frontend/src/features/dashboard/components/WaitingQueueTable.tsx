import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { WaitingQueueItem } from '@/api/types/dashboard'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PATHS } from '@/routes/paths'
import { formatDateTimeFr } from '@/utils/date'

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

const STATUT_RDV_LABELS: Record<string, string> = {
  planifie: 'Planifié',
  en_attente: 'En attente',
  en_consultation: 'En consultation',
  termine: 'Terminé',
  absent: 'Absent',
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
  const [selected, setSelected] = useState<WaitingQueueItem | null>(null)
  const [menuId, setMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuId) return
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuId(null)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [menuId])

  return (
    <>
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant bg-surface/50 px-5 py-4">
          <h3 className="flex items-center gap-2 text-headline-sm font-semibold text-on-surface">
            <MaterialIcon name="recent_patient" className="text-primary" />
            File d&apos;attente du jour
          </h3>
          <Link
            to={PATHS.agenda}
            className="flex items-center gap-1 text-label-md font-semibold tracking-wide text-primary hover:underline"
          >
            Voir tout
            <MaterialIcon name="arrow_forward" className="text-[16px]" />
          </Link>
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
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-body-sm text-secondary">
                    Aucun rendez-vous pour aujourd&apos;hui
                  </td>
                </tr>
              )}
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
                  <td className="relative px-5 py-3 text-right">
                    <div
                      className="inline-block"
                      ref={menuId === item.id ? menuRef : undefined}
                    >
                      <button
                        type="button"
                        className="p-1 text-outline transition-all hover:text-primary group-hover:opacity-100 sm:opacity-0"
                        aria-label="Actions"
                        onClick={() =>
                          setMenuId((prev) => (prev === item.id ? null : item.id))
                        }
                      >
                        <MaterialIcon name="more_vert" className="text-[20px]" />
                      </button>
                      {menuId === item.id && (
                        <div className="absolute right-5 z-20 mt-1 w-52 rounded-lg border border-outline-variant bg-surface-container-lowest py-1 shadow-md">
                          <button
                            type="button"
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-body-sm text-on-surface hover:bg-surface-container"
                            onClick={() => {
                              setSelected(item)
                              setMenuId(null)
                            }}
                          >
                            <MaterialIcon name="event" className="text-[18px] text-primary" />
                            Voir le rendez-vous
                          </button>
                          {item.patient_id ? (
                            <Link
                              to={`${PATHS.patients}/${item.patient_id}`}
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-body-sm text-on-surface hover:bg-surface-container"
                              onClick={() => setMenuId(null)}
                            >
                              <MaterialIcon name="person" className="text-[18px] text-primary" />
                              Fiche patient
                            </Link>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <RdvDetailModal item={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}

function RdvDetailModal({
  item,
  onClose,
}: {
  item: WaitingQueueItem
  onClose: () => void
}) {
  const statutKey = item.statut_rdv || item.status
  const statutLabel = STATUT_RDV_LABELS[statutKey] || STATUS_LABELS[item.status]
  const medecin = item.medecin || item.practitioner || '—'
  const motif = item.motif || item.reason || '—'
  const when = item.date_heure
    ? formatDateTimeFr(item.date_heure)
    : item.time || '—'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xl">
        <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
          <h2 className="text-headline-sm font-semibold text-on-surface">
            Détail du rendez-vous
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-on-surface-variant hover:bg-surface-container-low"
          >
            <MaterialIcon name="close" className="text-[22px]" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full text-label-md font-semibold ${AVATAR_STYLES[item.avatar_tone]}`}
            >
              {getInitials(item.patient_name)}
            </div>
            <div>
              <p className="text-body-md font-semibold text-on-surface">{item.patient_name}</p>
              <p className="text-label-sm text-secondary">Patient</p>
            </div>
          </div>

          <dl className="grid gap-3 rounded-xl border border-outline-variant bg-surface-container-low/40 p-4 text-body-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-secondary">Date &amp; heure</dt>
              <dd className="font-medium text-on-surface text-right">{when}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-secondary">Motif</dt>
              <dd className="font-medium text-on-surface text-right">{motif}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-secondary">Médecin</dt>
              <dd className="font-medium text-on-surface text-right">{medecin}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-secondary">Durée</dt>
              <dd className="font-medium text-on-surface text-right">
                {item.duree_min ?? 30} min
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-secondary">Statut</dt>
              <dd>
                <span
                  className={`inline-flex items-center rounded-md px-2 py-1 text-label-sm ${STATUS_STYLES[item.status]}`}
                >
                  {statutLabel}
                </span>
              </dd>
            </div>
            {item.notes ? (
              <div className="flex justify-between gap-4">
                <dt className="text-secondary">Notes</dt>
                <dd className="font-medium text-on-surface text-right">{item.notes}</dd>
              </div>
            ) : null}
          </dl>

          <div className="flex flex-wrap justify-end gap-2 pt-1">
            {item.patient_id ? (
              <Link
                to={`${PATHS.patients}/${item.patient_id}`}
                className="rounded-lg border border-outline-variant px-4 py-2 text-label-md text-secondary hover:bg-surface-container-low"
              >
                Fiche patient
              </Link>
            ) : null}
            <Link
              to={PATHS.agenda}
              className="rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary hover:bg-primary/90"
            >
              Ouvrir l&apos;agenda
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-outline-variant px-4 py-2 text-label-md text-secondary hover:bg-surface-container-low"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
