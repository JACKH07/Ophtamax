interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  subtitleClassName?: string
  icon: string
  iconBgClassName?: string
  decorativeIcon?: string
}

export function StatCard({
  title,
  value,
  subtitle,
  subtitleClassName = 'text-secondary',
  icon,
  iconBgClassName = 'bg-primary-container/50 text-primary',
  decorativeIcon,
}: StatCardProps) {
  return (
    <div className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm transition-shadow hover:shadow-md">
      {decorativeIcon && (
        <div className="pointer-events-none absolute -right-[10%] -top-[10%] text-primary opacity-[0.03] transition-transform group-hover:scale-110">
          <span className="material-symbols-outlined filled text-[120px]">{decorativeIcon}</span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-label-md font-semibold uppercase tracking-wider text-secondary">
          {title}
        </span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${iconBgClassName}`}>
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-display-lg font-bold text-on-surface">{value}</span>
        {subtitle && (
          <span className={`text-label-sm ${subtitleClassName}`}>{subtitle}</span>
        )}
      </div>
    </div>
  )
}
