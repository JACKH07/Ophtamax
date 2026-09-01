const VARIANTS: Record<string, string> = {
  primary: 'bg-primary-container text-on-primary-container',
  secondary: 'bg-secondary-container text-on-secondary-fixed',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  muted: 'bg-surface-variant text-on-surface-variant',
  error: 'bg-error-container text-on-error-container',
}

interface StatusBadgeProps {
  label: string
  variant?: keyof typeof VARIANTS
}

export function StatusBadge({ label, variant = 'muted' }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-label-sm ${VARIANTS[variant]}`}>
      {label}
    </span>
  )
}
