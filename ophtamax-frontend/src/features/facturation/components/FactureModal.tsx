import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { createFacture } from '@/features/facturation/services/facturationService'
import { mockStore } from '@/api/mock/dataStore'

const ligneSchema = z.object({
  libelle: z.string().min(1, 'Libellé obligatoire'),
  quantite: z.number().min(1),
  prix_unitaire: z.number().min(0),
})

const schema = z.object({
  patient_id: z.string().min(1, 'Sélectionnez un patient'),
  date: z.string().min(1, 'Date obligatoire'),
  statut: z.enum(['payee', 'partielle', 'impayee']),
  mode_paiement: z.string().optional(),
  lignes: z.array(ligneSchema).min(1, 'Ajoutez au moins une ligne'),
})

type FormValues = z.infer<typeof schema>

interface FactureModalProps {
  onClose: () => void
}

function formatFcfa(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
}

export function FactureModal({ onClose }: FactureModalProps) {
  const queryClient = useQueryClient()
  const patients = mockStore.patients.list()

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      patient_id: '',
      date: new Date().toISOString().slice(0, 10),
      statut: 'payee',
      mode_paiement: 'Espèces',
      lignes: [{ libelle: 'Consultation ophtalmologique', quantite: 1, prix_unitaire: 25000 }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'lignes' })
  const lignes = watch('lignes')
  const total = (lignes ?? []).reduce(
    (s, l) => s + (Number(l.quantite) || 0) * (Number(l.prix_unitaire) || 0),
    0,
  )

  const mutation = useMutation({
    mutationFn: createFacture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['factures'] })
      queryClient.invalidateQueries({ queryKey: ['caisse'] })
      onClose()
    },
  })

  const onSubmit = (values: FormValues) => {
    mutation.mutate({
      ...values,
      lignes: values.lignes.map((l) => ({
        libelle: l.libelle,
        quantite: Number(l.quantite),
        prix_unitaire: Number(l.prix_unitaire),
      })),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-6 py-4">
          <h2 className="text-headline-sm font-semibold text-on-surface">Nouvelle facture</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-on-surface-variant hover:bg-surface-container-low"
          >
            <MaterialIcon name="close" className="text-[22px]" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1 block text-label-sm text-secondary">Patient *</label>
            <select
              {...register('patient_id')}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">— Sélectionner —</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {`${p.nom} ${p.prenom}`.trim() || `Patient ${p.id}`}
                </option>
              ))}
            </select>
            {errors.patient_id && (
              <p className="mt-1 text-label-sm text-error">{errors.patient_id.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-label-sm text-secondary">Date *</label>
              <input
                type="date"
                {...register('date')}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-label-sm text-secondary">Statut</label>
              <select
                {...register('statut')}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="payee">Payée</option>
                <option value="partielle">Partielle</option>
                <option value="impayee">Impayée</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-label-sm text-secondary">Mode de paiement</label>
            <select
              {...register('mode_paiement')}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Espèces">Espèces</option>
              <option value="CB">CB</option>
              <option value="Mobile Money">Mobile Money</option>
              <option value="Chèque">Chèque</option>
              <option value="Virement">Virement</option>
            </select>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-label-sm text-secondary">Lignes de facture *</label>
              <button
                type="button"
                onClick={() => append({ libelle: '', quantite: 1, prix_unitaire: 0 })}
                className="flex items-center gap-1 rounded-lg border border-outline-variant px-2 py-1 text-label-sm text-primary hover:bg-surface-container-low"
              >
                <MaterialIcon name="add" className="text-[16px]" />
                Ligne
              </button>
            </div>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 rounded-lg border border-outline-variant/60 p-2">
                  <input
                    placeholder="Libellé"
                    {...register(`lignes.${index}.libelle`)}
                    className="col-span-5 rounded-md border border-outline-variant bg-surface-container-low px-2 py-1.5 text-body-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <input
                    type="number"
                    min={1}
                    placeholder="Qté"
                    {...register(`lignes.${index}.quantite`, { valueAsNumber: true })}
                    className="col-span-2 rounded-md border border-outline-variant bg-surface-container-low px-2 py-1.5 text-body-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <input
                    type="number"
                    min={0}
                    step={500}
                    placeholder="Prix"
                    {...register(`lignes.${index}.prix_unitaire`, { valueAsNumber: true })}
                    className="col-span-4 rounded-md border border-outline-variant bg-surface-container-low px-2 py-1.5 text-body-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="col-span-1 flex items-center justify-center rounded-md text-error hover:bg-error/5 disabled:opacity-30"
                  >
                    <MaterialIcon name="delete" className="text-[18px]" />
                  </button>
                </div>
              ))}
            </div>
            {errors.lignes && (
              <p className="mt-1 text-label-sm text-error">
                {errors.lignes.message ?? 'Lignes invalides'}
              </p>
            )}
          </div>

          <div className="rounded-lg bg-surface-container-low px-4 py-3 text-right">
            <span className="text-label-sm text-secondary">Total TTC </span>
            <span className="text-title-sm font-bold text-on-surface">{formatFcfa(total)}</span>
          </div>

          {mutation.isError && (
            <p className="text-label-sm text-error">Erreur lors de la création de la facture.</p>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-outline-variant px-4 py-2 text-label-md text-secondary hover:bg-surface-container-low"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || mutation.isPending}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-label-md text-on-primary hover:bg-primary/90 disabled:opacity-50"
            >
              <MaterialIcon name="save" className="text-[16px]" />
              Créer la facture
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
