import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { createRendezVous, updateRendezVous } from '@/features/agenda/services/agendaService'
import { mockStore } from '@/api/mock/dataStore'
import type { RendezVous } from '@/api/types/entities'

// ── Validation ──────────────────────────────────────────────────────────────

const schema = z.object({
  patient_id: z.string().min(1, 'Sélectionnez un patient'),
  medecin_id: z.string().min(1, 'Sélectionnez un médecin'),
  date_heure: z.string().min(1, 'Date et heure obligatoires'),
  duree_min: z.number().min(5).max(120),
  motif: z.string().min(2, 'Motif obligatoire'),
  notes: z.string().optional(),
  statut: z.enum(['planifie', 'en_attente', 'en_consultation', 'termine', 'absent']),
})

type FormValues = z.infer<typeof schema>

// ── Types ────────────────────────────────────────────────────────────────────

interface RdvModalProps {
  /** Rendez-vous à modifier (null = nouveau) */
  rdv: RendezVous | null
  /** Date pré-remplie pour un nouveau RDV (clic sur un créneau) */
  defaultDate?: string
  onClose: () => void
}

// ── Composant ────────────────────────────────────────────────────────────────

export function RdvModal({ rdv, defaultDate, onClose }: RdvModalProps) {
  const queryClient = useQueryClient()

  const patients = mockStore.patients.list()
  const medecins = mockStore.users.list().filter((u) => u.id_role === 'OPHT')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      patient_id: rdv?.patient_id ?? '',
      medecin_id: rdv?.medecin_id ?? (medecins[0]?.id ?? ''),
      date_heure: rdv?.date_heure
        ? rdv.date_heure.slice(0, 16)
        : (defaultDate ?? new Date().toISOString().slice(0, 16)),
      duree_min: rdv?.duree_min ?? 30,
      motif: rdv?.motif ?? '',
      notes: rdv?.notes ?? '',
      statut: rdv?.statut ?? 'planifie',
    },
  })

  useEffect(() => {
    reset({
      patient_id: rdv?.patient_id ?? '',
      medecin_id: rdv?.medecin_id ?? (medecins[0]?.id ?? ''),
      date_heure: rdv?.date_heure
        ? rdv.date_heure.slice(0, 16)
        : (defaultDate ?? new Date().toISOString().slice(0, 16)),
      duree_min: rdv?.duree_min ?? 30,
      motif: rdv?.motif ?? '',
      notes: rdv?.notes ?? '',
      statut: rdv?.statut ?? 'planifie',
    })
  }, [rdv, defaultDate])

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload = { ...values, duree_min: Number(values.duree_min) }
      return rdv
        ? updateRendezVous(rdv.id, payload)
        : createRendezVous(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] })
      queryClient.invalidateQueries({ queryKey: ['file-attente'] })
      onClose()
    },
  })

  const onSubmit = (values: FormValues) => mutation.mutate(values)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xl">
        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
          <h2 className="text-headline-sm font-semibold text-on-surface">
            {rdv ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-on-surface-variant hover:bg-surface-container-low"
          >
            <MaterialIcon name="close" className="text-[22px]" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-5">
          {/* Patient */}
          <div>
            <label className="mb-1 block text-label-sm text-secondary">Patient *</label>
            <select
              {...register('patient_id')}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">— Sélectionner —</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nom} {p.prenom}
                </option>
              ))}
            </select>
            {errors.patient_id && (
              <p className="mt-1 text-label-sm text-error">{errors.patient_id.message}</p>
            )}
          </div>

          {/* Médecin */}
          <div>
            <label className="mb-1 block text-label-sm text-secondary">Médecin *</label>
            <select
              {...register('medecin_id')}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {medecins.map((u) => (
                <option key={u.id} value={u.id}>
                  Dr {u.nom} {u.prenoms}
                </option>
              ))}
            </select>
          </div>

          {/* Date + Durée */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-label-sm text-secondary">Date & heure *</label>
              <input
                type="datetime-local"
                {...register('date_heure')}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.date_heure && (
                <p className="mt-1 text-label-sm text-error">{errors.date_heure.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-label-sm text-secondary">Durée (min)</label>
              <select
                {...register('duree_min', { valueAsNumber: true })}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {[15, 20, 30, 45, 60, 90].map((d) => (
                  <option key={d} value={d}>
                    {d} min
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Motif */}
          <div>
            <label className="mb-1 block text-label-sm text-secondary">Motif *</label>
            <input
              type="text"
              placeholder="Ex : Consultation initiale, OCT…"
              {...register('motif')}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.motif && (
              <p className="mt-1 text-label-sm text-error">{errors.motif.message}</p>
            )}
          </div>

          {/* Statut (uniquement en mode édition) */}
          {rdv && (
            <div>
              <label className="mb-1 block text-label-sm text-secondary">Statut</label>
              <select
                {...register('statut')}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="planifie">Planifié</option>
                <option value="en_attente">En attente</option>
                <option value="en_consultation">En consultation</option>
                <option value="termine">Terminé</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="mb-1 block text-label-sm text-secondary">Notes</label>
            <textarea
              rows={2}
              placeholder="Notes ou instructions particulières…"
              {...register('notes')}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Erreur serveur */}
          {mutation.isError && (
            <p className="text-label-sm text-error">Erreur lors de la sauvegarde.</p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
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
              {rdv ? 'Enregistrer' : 'Créer le RDV'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
