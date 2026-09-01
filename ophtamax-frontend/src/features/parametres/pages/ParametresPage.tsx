import { useState } from 'react'
import { mockStore } from '@/api/mock/dataStore'
import { PageHeader } from '@/components/common/PageHeader'

const TABS = ['Société', 'Genres', 'Professions', 'Examens', 'Assurances'] as const

export function ParametresPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Société')
  const [societe, setSociete] = useState(mockStore.referentiels.societe())

  const referentiels = {
    Genres: mockStore.referentiels.genres(),
    Professions: mockStore.referentiels.professions(),
    Examens: mockStore.referentiels.examens(),
    Assurances: mockStore.referentiels.assurances(),
  }

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader title="Paramètres" subtitle="Configuration du cabinet et référentiels." />

      <div className="flex gap-2 border-b border-outline-variant">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`border-b-2 px-4 py-2 text-label-md font-semibold transition-colors ${
              tab === t ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-on-surface'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Société' ? (
        <div className="max-w-lg rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
          {(['nom', 'adresse', 'contact', 'slogan'] as const).map((field) => (
            <div key={field} className="mb-4">
              <label className="mb-1 block text-label-sm capitalize text-on-surface-variant">{field}</label>
              <input
                value={societe[field]}
                onChange={(e) => setSociete({ ...societe, [field]: e.target.value })}
                className="w-full rounded-lg border border-outline-variant px-3 py-2 text-body-md focus:border-primary focus:outline-none"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => mockStore.referentiels.updateSociete(societe)}
            className="rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary"
          >
            Enregistrer
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
          <table className="w-full border-collapse text-left">
            <thead className="border-b border-outline-variant bg-surface-container-low">
              <tr>
                <th className="px-4 py-3 text-label-md text-on-surface-variant">Code</th>
                <th className="px-4 py-3 text-label-md text-on-surface-variant">Libellé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {referentiels[tab as keyof typeof referentiels]?.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-low/50">
                  <td className="px-4 py-3 font-medium">{item.code}</td>
                  <td className="px-4 py-3">{item.libelle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
