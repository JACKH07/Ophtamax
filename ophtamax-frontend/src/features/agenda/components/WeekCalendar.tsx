import type { RendezVous } from '@/api/types/entities'

// ── Constantes ────────────────────────────────────────────────────────────────

const HOURS = Array.from({ length: 13 }, (_, i) => i + 7) // 7h → 19h
const SLOT_HEIGHT_PX = 60 // 1 heure = 60 px

const STATUT_STYLE: Record<
  RendezVous['statut'],
  { bg: string; border: string; text: string; label: string }
> = {
  planifie:        { bg: 'bg-primary/10',    border: 'border-primary/30',    text: 'text-primary',        label: 'Planifié' },
  en_attente:      { bg: 'bg-secondary/10',  border: 'border-secondary/30',  text: 'text-secondary',      label: 'En attente' },
  en_consultation: { bg: 'bg-success/10',    border: 'border-success/30',    text: 'text-success',        label: 'En consultation' },
  termine:         { bg: 'bg-outline/10',    border: 'border-outline/30',    text: 'text-on-surface-variant', label: 'Terminé' },
  absent:          { bg: 'bg-error/10',      border: 'border-error/30',      text: 'text-error',          label: 'Absent' },
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface WeekCalendarProps {
  view: 'week' | 'day'
  currentDate: Date
  rdvs: RendezVous[]
  onSlotClick: (date: string) => void
  onRdvClick: (rdv: RendezVous) => void
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getWeekDays(date: Date): Date[] {
  const start = new Date(date)
  const day = start.getDay()
  // Lundi = 0
  const monday = day === 0 ? -6 : 1 - day
  start.setDate(start.getDate() + monday)
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString()
}

function rdvTopOffset(dateStr: string): number {
  const d = new Date(dateStr)
  const minutes = (d.getHours() - 7) * 60 + d.getMinutes()
  return (minutes / 60) * SLOT_HEIGHT_PX
}

function rdvHeight(duree: number): number {
  return Math.max((duree / 60) * SLOT_HEIGHT_PX, 24)
}

// ── Composant ────────────────────────────────────────────────────────────────

export function WeekCalendar({ view, currentDate, rdvs, onSlotClick, onRdvClick }: WeekCalendarProps) {
  const days = view === 'week' ? getWeekDays(currentDate) : [currentDate]
  const today = new Date()
  const totalHeight = HOURS.length * SLOT_HEIGHT_PX

  return (
    <div className="overflow-auto rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
      {/* En-tête jours */}
      <div
        className="sticky top-0 z-10 grid border-b border-outline-variant bg-surface-container-lowest"
        style={{ gridTemplateColumns: `56px repeat(${days.length}, 1fr)` }}
      >
        <div className="border-r border-outline-variant" />
        {days.map((day) => {
          const isToday = isSameDay(day, today)
          return (
            <div
              key={day.toISOString()}
              className={`flex flex-col items-center py-2 text-label-sm ${isToday ? 'text-primary' : 'text-secondary'}`}
            >
              <span className="text-[11px] uppercase tracking-wide">
                {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
              </span>
              <span
                className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-label-md font-semibold ${
                  isToday ? 'bg-primary text-on-primary' : ''
                }`}
              >
                {day.getDate()}
              </span>
            </div>
          )
        })}
      </div>

      {/* Grille horaire */}
      <div
        className="relative grid"
        style={{ gridTemplateColumns: `56px repeat(${days.length}, 1fr)`, height: `${totalHeight}px` }}
      >
        {/* Colonne des heures */}
        <div className="relative border-r border-outline-variant">
          {HOURS.map((h) => (
            <div
              key={h}
              className="absolute right-2 text-[11px] text-on-surface-variant"
              style={{ top: `${(h - 7) * SLOT_HEIGHT_PX - 6}px` }}
            >
              {String(h).padStart(2, '0')}h
            </div>
          ))}
        </div>

        {/* Colonnes par jour */}
        {days.map((day) => {
          const dayStr = day.toISOString().slice(0, 10)
          const dayRdvs = rdvs.filter((r) => r.date_heure.startsWith(dayStr))

          return (
            <div key={day.toISOString()} className="relative border-r border-outline-variant/40">
              {/* Lignes des heures */}
              {HOURS.map((h) => (
                <div
                  key={h}
                  className="absolute inset-x-0 border-t border-outline-variant/25 cursor-pointer hover:bg-primary/5"
                  style={{ top: `${(h - 7) * SLOT_HEIGHT_PX}px`, height: `${SLOT_HEIGHT_PX}px` }}
                  onClick={() => {
                    const d = new Date(day)
                    d.setHours(h, 0, 0, 0)
                    onSlotClick(d.toISOString().slice(0, 16))
                  }}
                />
              ))}

              {/* Rendez-vous */}
              {dayRdvs.map((rdv) => {
                const style = STATUT_STYLE[rdv.statut]
                return (
                  <button
                    key={rdv.id}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onRdvClick(rdv) }}
                    className={`absolute inset-x-1 overflow-hidden rounded-md border-l-4 px-2 py-1 text-left shadow-sm transition-transform hover:scale-[1.02] ${style.bg} ${style.border} ${style.text}`}
                    style={{
                      top: `${rdvTopOffset(rdv.date_heure)}px`,
                      height: `${rdvHeight(rdv.duree_min)}px`,
                    }}
                  >
                    <p className="text-[11px] font-bold leading-tight truncate">
                      {new Date(rdv.date_heure).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      {rdv.patient_name}
                    </p>
                    {rdv.duree_min >= 30 && (
                      <p className="text-[10px] truncate opacity-80">{rdv.motif}</p>
                    )}
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
