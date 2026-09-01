import type { TopDiagnostic } from '@/api/types/dashboard'
import { MaterialIcon } from '@/components/common/MaterialIcon'

const BAR_OPACITIES = ['bg-primary', 'bg-primary/70', 'bg-primary/50', 'bg-primary/30']

interface TopDiagnosticsProps {
  items: TopDiagnostic[]
}

export function TopDiagnostics({ items }: TopDiagnosticsProps) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-headline-sm font-semibold text-on-surface">Top diagnostics (Mois)</h3>
        <MaterialIcon name="bar_chart" className="text-secondary" />
      </div>
      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <div key={item.label} className="flex flex-col gap-1">
            <div className="flex justify-between text-body-sm">
              <span className="text-on-surface">{item.label}</span>
              <span className="font-medium text-secondary">{item.percent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
              <div
                className={`h-full rounded-full ${BAR_OPACITIES[index] ?? 'bg-primary/20'}`}
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
