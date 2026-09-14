import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import type { SocieteInfo } from '@/api/types/entities'
import { PageHeader } from '@/components/common/PageHeader'
import { fetchSociete, updateSociete } from '@/features/parametres/services/parametresService'

const EMPTY_SOCIETE: SocieteInfo = {
  nom: '',
  adresse: '',
  contact: '',
  slogan: '',
}

export function ParametresPage() {
  const queryClient = useQueryClient()
  const [societeDraft, setSocieteDraft] = useState<SocieteInfo>(EMPTY_SOCIETE)

  const societeQuery = useQuery({
    queryKey: ['parametres', 'societe'],
    queryFn: fetchSociete,
  })

  useEffect(() => {
    if (societeQuery.data) {
      setSocieteDraft(societeQuery.data)
    }
  }, [societeQuery.data])

  const saveSocieteMutation = useMutation({
    mutationFn: updateSociete,
    onSuccess: (data) => {
      queryClient.setQueryData(['parametres', 'societe'], data)
    },
  })

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title="Paramètres"
        subtitle="Configuration générale du cabinet."
      />

      <div className="max-w-lg rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
        {(['nom', 'adresse', 'contact', 'slogan'] as const).map((field) => (
          <div key={field} className="mb-4">
            <label className="mb-1 block text-label-sm capitalize text-on-surface-variant">{field}</label>
            <input
              value={societeDraft[field]}
              onChange={(e) => setSocieteDraft({ ...societeDraft, [field]: e.target.value })}
              className="w-full rounded-lg border border-outline-variant px-3 py-2 text-body-md focus:border-primary focus:outline-none"
            />
          </div>
        ))}
        <button
          type="button"
          disabled={saveSocieteMutation.isPending}
          onClick={() => saveSocieteMutation.mutate(societeDraft)}
          className="rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary disabled:opacity-60"
        >
          Enregistrer
        </button>
      </div>
    </div>
  )
}
