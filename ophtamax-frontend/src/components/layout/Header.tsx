import { MaterialIcon } from '@/components/common/MaterialIcon'

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-outline-variant bg-surface px-margin-page">
      <div />
      <div className="flex items-center gap-4">
        <div className="relative rounded-lg transition-all focus-within:ring-2 focus-within:ring-primary/20">
          <MaterialIcon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-secondary"
          />
          <input
            type="search"
            placeholder="Rechercher..."
            className="w-[240px] rounded-lg border border-outline-variant bg-surface-container-lowest py-2 pl-10 pr-4 text-body-sm text-on-surface focus:border-primary focus:outline-none"
          />
        </div>
        <button
          type="button"
          className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
          aria-label="Notifications"
        >
          <MaterialIcon name="notifications" />
        </button>
        <button
          type="button"
          className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
          aria-label="Aide"
        >
          <MaterialIcon name="help_outline" />
        </button>
      </div>
    </header>
  )
}
