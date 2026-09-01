import { Link } from 'react-router-dom'
import type { UpcomingSlot } from '@/api/types/dashboard'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PATHS } from '@/routes/paths'

interface UpcomingSlotsProps {
  slots: UpcomingSlot[]
}

export function UpcomingSlots({ slots }: UpcomingSlotsProps) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-headline-sm font-semibold text-on-surface">Prochains créneaux</h3>
        <button
          type="button"
          className="rounded-full p-1 text-secondary transition-colors hover:bg-surface-container-high"
          aria-label="Options"
        >
          <MaterialIcon name="more_horiz" className="text-[20px]" />
        </button>
      </div>

      <div className="relative flex flex-col gap-3">
        <div className="absolute bottom-2 left-1.5 top-2 w-[2px] bg-outline-variant/30" />
        {slots.map((slot) => {
          const isSecondary = slot.variant === 'secondary'
          const label = slot.patient_name
            ? `${slot.title} - ${slot.patient_name}`
            : slot.title

          return (
            <div key={slot.id} className="relative flex gap-4">
              <div
                className={`relative z-10 mt-1.5 h-3 w-3 rounded-full border-2 border-surface-container-lowest shadow-sm ${
                  isSecondary ? 'bg-secondary' : 'bg-primary'
                }`}
              />
              <div className="flex flex-1 flex-col rounded-lg border border-outline-variant/50 bg-surface-container-low/50 p-3">
                <span
                  className={`text-label-md font-semibold tracking-wide ${
                    isSecondary ? 'text-secondary' : 'text-primary'
                  }`}
                >
                  {slot.start_time} - {slot.end_time}
                </span>
                <span className="mt-1 text-body-sm text-on-surface">{label}</span>
              </div>
            </div>
          )
        })}
      </div>

      <Link
        to={PATHS.agenda}
        className="mt-4 block w-full rounded-lg border border-outline-variant py-2 text-center text-label-md font-semibold tracking-wide text-secondary transition-colors hover:bg-surface-container-low"
      >
        Ouvrir l&apos;agenda complet
      </Link>
    </div>
  )
}
