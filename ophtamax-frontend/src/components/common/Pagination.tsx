interface PaginationProps {
  page: number
  perPage: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, perPage, total, onPageChange }: PaginationProps) {
  if (total <= 0) return null

  const pageCount = Math.max(1, Math.ceil(total / perPage))
  const from = (page - 1) * perPage + 1
  const to = Math.min(page * perPage, total)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant px-4 py-3">
      <p className="text-label-sm text-secondary">
        {from}–{to} sur {total}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-outline-variant px-3 py-1.5 text-label-md text-on-surface hover:bg-surface-container-low disabled:opacity-40"
        >
          Précédent
        </button>
        <span className="text-label-sm text-secondary">
          Page {page} / {pageCount}
        </span>
        <button
          type="button"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-outline-variant px-3 py-1.5 text-label-md text-on-surface hover:bg-surface-container-low disabled:opacity-40"
        >
          Suivant
        </button>
      </div>
    </div>
  )
}
