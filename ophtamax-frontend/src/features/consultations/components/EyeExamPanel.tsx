import type { ExamenOeil } from '@/api/types/entities'
import { MaterialIcon } from '@/components/common/MaterialIcon'

interface EyeExamPanelProps {
  side: 'OD' | 'OG'
  values: ExamenOeil
  onChange: (values: ExamenOeil) => void
}

const inputClass =
  'w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

export function EyeExamPanel({ side, values, onChange }: EyeExamPanelProps) {
  const isOd = side === 'OD'
  const badgeClass = isOd
    ? 'bg-primary-container text-on-primary-container'
    : 'bg-secondary-container text-on-secondary-fixed'
  const title = isOd ? 'Œil Droit' : 'Œil Gauche'

  const set = (key: keyof ExamenOeil, value: string) => onChange({ ...values, [key]: value })

  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
      <header className="mb-5 flex items-center gap-3 border-b border-outline-variant pb-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${badgeClass}`}>
          {side}
        </span>
        <h3 className="text-headline-sm font-semibold text-on-surface">{title}</h3>
      </header>

      <div className="mb-5">
        <p className="mb-3 text-label-md font-semibold uppercase tracking-wider text-secondary">
          Acuité visuelle
        </p>
        <div className="grid grid-cols-2 gap-3">
          {([
            ['vl_sans', 'VL (Sans Corr.)'],
            ['vl_avec', 'VL (Avec Corr.)'],
            ['vp_sans', 'VP (Sans Corr.)'],
            ['vp_avec', 'VP (Avec Corr.)'],
          ] as const).map(([key, label]) => (
            <div key={key}>
              <label className="mb-1 block text-label-sm text-on-surface-variant">{label}</label>
              <input
                value={values[key]}
                onChange={(e) => set(key, e.target.value)}
                placeholder="—"
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <p className="mb-3 text-label-md font-semibold uppercase tracking-wider text-secondary">
          Réfraction &amp; tension
        </p>
        <div className="grid grid-cols-3 gap-3">
          {([
            ['sphere', 'Sphère', '+0.00'],
            ['cylindre', 'Cylindre', '-0.00'],
            ['axe', 'Axe (°)', '0'],
          ] as const).map(([key, label, placeholder]) => (
            <div key={key}>
              <label className="mb-1 block text-label-sm text-on-surface-variant">{label}</label>
              <input
                value={values[key]}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
                className={`${inputClass} text-center`}
              />
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 flex items-center gap-1 text-label-sm text-on-surface-variant">
              PIO (mmHg)
              <MaterialIcon name="info" className="text-[14px] text-outline" />
            </label>
            <input
              value={values.pio}
              onChange={(e) => set('pio', e.target.value)}
              placeholder="—"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-label-sm text-on-surface-variant">Addition</label>
            <input
              value={values.addition}
              onChange={(e) => set('addition', e.target.value)}
              placeholder="+0.00"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div>
        <p className="mb-3 text-label-md font-semibold uppercase tracking-wider text-secondary">
          Examen clinique
        </p>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-label-sm text-on-surface-variant">Segment antérieur</label>
            <textarea
              rows={2}
              value={values.segment_anterieur}
              onChange={(e) => set('segment_anterieur', e.target.value)}
              placeholder="Observations..."
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-label-sm text-on-surface-variant">Fond d&apos;œil</label>
            <textarea
              rows={2}
              value={values.fond_oeil}
              onChange={(e) => set('fond_oeil', e.target.value)}
              placeholder="Observations..."
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
