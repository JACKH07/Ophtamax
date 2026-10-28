import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { getErrorMessage } from '@/api/client'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PageHeader } from '@/components/common/PageHeader'
import { Pagination } from '@/components/common/Pagination'
import {
  addReferentiel,
  fetchReferentiel,
  removeReferentiel,
  type ReferentielKind,
} from '@/features/parametres/services/parametresService'
import { slicePage } from '@/utils/pagination'

const META: Record<
  ReferentielKind,
  { title: string; subtitle: string; addLabel: string; emptyLabel: string }
> = {
  professions: {
    title: 'Profession',
    subtitle: 'Référentiel des professions patients.',
    addLabel: 'une profession',
    emptyLabel: 'Aucune profession.',
  },
  assurances: {
    title: 'Assurance',
    subtitle: 'Référentiel des assurances / mutuelles.',
    addLabel: 'une assurance',
    emptyLabel: 'Aucune assurance.',
  },
  examens: {
    title: 'Examen',
    subtitle: 'Référentiel des examens complémentaires.',
    addLabel: 'un examen',
    emptyLabel: 'Aucun examen.',
  },
}

type ReferentielPageProps = {
  kind: ReferentielKind
}

export function ReferentielPage({ kind }: ReferentielPageProps) {
  const queryClient = useQueryClient()
  const meta = META[kind]
  const [code, setCode] = useState('')
  const [libelle, setLibelle] = useState('')
  const [page, setPage] = useState(1)

  const listQuery = useQuery({
    queryKey: ['parametres', kind],
    queryFn: () => fetchReferentiel(kind),
  })
  const paged = slicePage(listQuery.data ?? [], page)

  const addMutation = useMutation({
    mutationFn: () =>
      addReferentiel(kind, {
        code: code.trim().toUpperCase(),
        libelle: libelle.trim(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parametres', kind] })
      queryClient.invalidateQueries({ queryKey: ['referentiel', kind] })
      setCode('')
      setLibelle('')
      setPage(1)
    },
  })

  const removeMutation = useMutation({
    mutationFn: (id: string) => removeReferentiel(kind, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parametres', kind] })
      queryClient.invalidateQueries({ queryKey: ['referentiel', kind] })
    },
  })

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader title={meta.title} subtitle={meta.subtitle} />

      <form
        className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault()
          if (!code.trim() || !libelle.trim()) return
          addMutation.mutate()
        }}
      >
        <p className="mb-4 text-label-md font-semibold text-on-surface">
          Ajouter {meta.addLabel}
        </p>
        <div className="grid gap-4 md:grid-cols-[160px_1fr_auto]">
          <div>
            <label className="mb-1 block text-label-sm text-on-surface-variant">Code</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ex. COMM"
              className="w-full rounded-lg border border-outline-variant px-3 py-2 text-body-md uppercase focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-label-sm text-on-surface-variant">Libellé</label>
            <input
              value={libelle}
              onChange={(e) => setLibelle(e.target.value)}
              placeholder="Libellé"
              className="w-full rounded-lg border border-outline-variant px-3 py-2 text-body-md focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={addMutation.isPending || !code.trim() || !libelle.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary disabled:opacity-60 md:w-auto"
            >
              <MaterialIcon name="add" className="text-[18px]" />
              Ajouter
            </button>
          </div>
        </div>
        {addMutation.isError && (
          <p className="mt-3 text-label-sm text-error">{getErrorMessage(addMutation.error)}</p>
        )}
      </form>

      <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead className="border-b border-outline-variant bg-surface-container-low">
            <tr>
              <th className="px-4 py-3 text-label-md text-on-surface-variant">Code</th>
              <th className="px-4 py-3 text-label-md text-on-surface-variant">Libellé</th>
              <th className="px-4 py-3 text-label-md text-on-surface-variant">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {paged.total === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-body-sm text-secondary">
                  {meta.emptyLabel} Ajoutez {meta.addLabel} ci-dessus.
                </td>
              </tr>
            ) : (
              paged.items.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-low/50">
                  <td className="px-4 py-3 font-medium">{item.code}</td>
                  <td className="px-4 py-3">{item.libelle}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      title="Supprimer"
                      disabled={removeMutation.isPending}
                      onClick={() => {
                        if (window.confirm(`Supprimer « ${item.libelle} » ?`)) {
                          removeMutation.mutate(item.id)
                        }
                      }}
                      className="rounded-md p-1.5 text-secondary hover:bg-error-container hover:text-error disabled:opacity-50"
                    >
                      <MaterialIcon name="delete" className="text-[18px]" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination
          page={paged.page}
          perPage={paged.perPage}
          total={paged.total}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}
