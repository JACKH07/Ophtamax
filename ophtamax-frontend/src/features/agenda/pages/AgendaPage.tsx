import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PageHeader } from '@/components/common/PageHeader'
import { WeekCalendar } from '@/features/agenda/components/WeekCalendar'
import { RdvModal } from '@/features/agenda/components/RdvModal'
import { FileAttenteWidget } from '@/features/agenda/components/FileAttenteWidget'
import { fetchRendezVous } from '@/features/agenda/services/agendaService'
import type { RendezVous } from '@/api/types/entities'

// ── Constantes ────────────────────────────────────────────────────────────────

const NOMS_MOIS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

// ── Composant principal ───────────────────────────────────────────────────────

export function AgendaPage() {
  // ── État de navigation ──
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [view, setView] = useState<'week' | 'day'>('week')

  // ── État modal ──
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRdv, setSelectedRdv] = useState<RendezVous | null>(null)
  const [defaultSlot, setDefaultSlot] = useState<string | undefined>(undefined)

  // ── Données ──
  const { data: rdvs = [] } = useQuery({
    queryKey: ['agenda'],
    queryFn: () => fetchRendezVous(),
    refetchInterval: 60_000,
  })

  // ── Navigation ──────────────────────────────────────────────────────────────

  function navigate(direction: -1 | 1) {
    const d = new Date(currentDate)
    if (view === 'week') d.setDate(d.getDate() + direction * 7)
    else d.setDate(d.getDate() + direction)
    setCurrentDate(d)
  }

  function goToday() {
    setCurrentDate(new Date())
  }

  const navLabel =
    view === 'day'
      ? currentDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      : (() => {
          const start = new Date(currentDate)
          const day = start.getDay()
          const monday = day === 0 ? -6 : 1 - day
          start.setDate(start.getDate() + monday)
          const end = new Date(start)
          end.setDate(start.getDate() + 5)
          if (start.getMonth() === end.getMonth()) {
            return `${start.getDate()} – ${end.getDate()} ${NOMS_MOIS[start.getMonth()]} ${start.getFullYear()}`
          }
          return `${start.getDate()} ${NOMS_MOIS[start.getMonth()]} – ${end.getDate()} ${NOMS_MOIS[end.getMonth()]} ${end.getFullYear()}`
        })()

  // ── Gestion modal ──────────────────────────────────────────────────────────

  function openNewRdv(dateStr?: string) {
    setSelectedRdv(null)
    setDefaultSlot(dateStr)
    setModalOpen(true)
  }

  function openEditRdv(rdv: RendezVous) {
    setSelectedRdv(rdv)
    setDefaultSlot(undefined)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setSelectedRdv(null)
  }

  // ── Mini-calendrier (panel gauche) ─────────────────────────────────────────

  const miniMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const miniDays = (() => {
    const days: (Date | null)[] = []
    const firstDow = (miniMonthStart.getDay() + 6) % 7 // lundi = 0
    for (let i = 0; i < firstDow; i++) days.push(null)
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), d))
    }
    return days
  })()

  const today = new Date()

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title="Agenda"
        subtitle="Calendrier des rendez-vous et file d'attente du jour."
        actions={
          <button
            type="button"
            onClick={() => openNewRdv()}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary shadow-sm hover:bg-primary/90"
          >
            <MaterialIcon name="calendar_add_on" className="text-[18px]" />
            Nouveau RDV
          </button>
        }
      />

      <div className="grid gap-gutter lg:grid-cols-12">
        {/* ── Colonne gauche : mini-calendrier + légende ── */}
        <aside className="lg:col-span-2 space-y-4">
          {/* Mini-calendrier */}
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                className="rounded-full p-1 hover:bg-surface-container-low"
              >
                <MaterialIcon name="chevron_left" className="text-[18px]" />
              </button>
              <span className="text-label-sm font-semibold text-on-surface">
                {NOMS_MOIS[currentDate.getMonth()].slice(0, 3)} {currentDate.getFullYear()}
              </span>
              <button
                type="button"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                className="rounded-full p-1 hover:bg-surface-container-low"
              >
                <MaterialIcon name="chevron_right" className="text-[18px]" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {['L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
                <div key={i} className="text-center text-[10px] font-medium text-secondary py-1">{d}</div>
              ))}
              {miniDays.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} />
                const isToday = day.toDateString() === today.toDateString()
                const isSel = day.toDateString() === currentDate.toDateString()
                const hasRdv = rdvs.some((r) => r.date_heure.startsWith(day.toISOString().slice(0, 10)))
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => { setCurrentDate(day); setView('day') }}
                    className={`relative flex h-6 w-full items-center justify-center rounded-full text-[11px] transition-colors ${
                      isSel && !isToday ? 'bg-primary/20 text-primary font-semibold' :
                      isToday ? 'bg-primary text-on-primary font-bold' :
                      'text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    {day.getDate()}
                    {hasRdv && !isSel && !isToday && (
                      <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary/60" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Légende statuts */}
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-3 shadow-sm">
            <p className="mb-2 text-label-sm font-semibold text-secondary">Légende</p>
            {[
              { color: 'bg-primary/30', label: 'Planifié' },
              { color: 'bg-secondary/30', label: 'En attente' },
              { color: 'bg-success/30', label: 'En consultation' },
              { color: 'bg-outline/30', label: 'Terminé' },
              { color: 'bg-error/30', label: 'Absent' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2 py-0.5">
                <span className={`h-2.5 w-2.5 rounded-sm ${color}`} />
                <span className="text-label-sm text-on-surface-variant">{label}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Calendrier principal ── */}
        <div className="lg:col-span-7 space-y-3">
          {/* Barre de navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-container-low"
              >
                <MaterialIcon name="chevron_left" className="text-[20px]" />
              </button>
              <button
                type="button"
                onClick={() => navigate(1)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-container-low"
              >
                <MaterialIcon name="chevron_right" className="text-[20px]" />
              </button>
              <span className="ml-2 text-title-sm font-semibold text-on-surface">{navLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToday}
                className="rounded-lg border border-outline-variant px-3 py-1.5 text-label-md text-secondary hover:bg-surface-container-low"
              >
                Aujourd&apos;hui
              </button>
              <div className="flex rounded-lg border border-outline-variant bg-surface-container-low p-0.5">
                {(['day', 'week'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setView(v)}
                    className={`rounded px-3 py-1.5 text-label-md transition-colors ${
                      view === v
                        ? 'bg-surface-container-lowest text-primary shadow-sm'
                        : 'text-secondary hover:text-on-surface'
                    }`}
                  >
                    {v === 'day' ? 'Jour' : 'Semaine'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Calendrier */}
          <WeekCalendar
            view={view}
            currentDate={currentDate}
            rdvs={rdvs}
            onSlotClick={(date) => openNewRdv(date)}
            onRdvClick={(rdv) => openEditRdv(rdv)}
          />
        </div>

        {/* ── File d'attente ── */}
        <div className="lg:col-span-3">
          <FileAttenteWidget />
        </div>
      </div>

      {/* Modal CRUD */}
      {modalOpen && (
        <RdvModal
          rdv={selectedRdv}
          defaultDate={defaultSlot}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
