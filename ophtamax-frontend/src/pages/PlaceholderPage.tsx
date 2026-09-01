interface PlaceholderPageProps {
  title: string
  description?: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-12 text-center">
      <h1 className="text-headline-sm font-semibold text-on-surface">{title}</h1>
      <p className="mt-2 text-body-md text-secondary">
        {description ?? 'Module en cours de développement (lot suivant).'}
      </p>
    </div>
  )
}
