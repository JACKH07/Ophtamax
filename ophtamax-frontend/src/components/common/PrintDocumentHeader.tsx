import { mockStore } from '@/api/mock/dataStore'

const LOGO_SRC = '/logo-kahydara.jpg'

type PrintDocumentHeaderProps = {
  title: string
}

export function PrintDocumentHeader({ title }: PrintDocumentHeaderProps) {
  const societe = mockStore.referentiels.societe()

  return (
    <div className="mb-6 border-b border-outline-variant pb-4 text-center">
      <img
        src={LOGO_SRC}
        alt="New Cabinet Médical d'Ophtalmologie Kahydara"
        className="mx-auto mb-3 h-24 w-auto object-contain print:h-28"
      />
      {(societe.adresse || societe.contact) && (
        <p className="text-body-sm text-secondary">
          {[societe.adresse, societe.contact].filter(Boolean).join(' · ')}
        </p>
      )}
      <p className="mt-2 text-label-md font-semibold uppercase tracking-wider text-on-surface">
        {title}
      </p>
    </div>
  )
}
