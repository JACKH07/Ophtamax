import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import {
  createRendezVous,
  deleteRendezVous,
  updateRendezVous,
} from '@/features/agenda/services/agendaService'
import { fetchPatients } from '@/features/patients/services/patientService'
import { fetchUsers } from '@/features/utilisateurs/services/userService'
import { formatDateFr } from '@/utils/date'
import type { RendezVous } from '@/api/types/entities'

const DEFAULT_DUREE_MIN = 30

const schema = z
  .object({
    patient_id: z.string().optional().default(''),
    patient_name: z.string().optional().default(''),
    medecin_id: z.string().min(1, 'Sélectionnez un médecin'),
    date_heure: z.string().min(1, 'Date et heure obligatoires'),
    motif: z.string().min(2, 'Motif obligatoire'),
    statut: z.enum(['planifie', 'en_attente', 'en_consultation', 'termine', 'absent']),
  })
  .superRefine((values, ctx) => {
    const name = (values.patient_name ?? '').trim()
    const id = (values.patient_id ?? '').trim()
    if (!id && name.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['patient_name'],
        message: 'Saisissez le nom du patient (ou choisissez-en un dans la liste)',
      })
    }
  })

type FormValues = z.infer<typeof schema>

interface RdvModalProps {
  rdv: RendezVous | null
  defaultDate?: string
  onClose: () => void
}

export function RdvModal({ rdv, defaultDate, onClose }: RdvModalProps) {
  const queryClient = useQueryClient()
  const [patientQuery, setPatientQuery] = useState(rdv?.patient_name ?? '')
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)

  const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: fetchUsers })
  const medecins = users.filter((u) => u.id_role === 'OPHT')
  const medecinOptions =
    medecins.length > 0
      ? medecins
      : users.filter(
          (u) =>
            u.id_role !== 'ADMIN' &&
            String(u.login_user ?? '').toLowerCase() !== 'admin',
        )

  const { data: patientMatches = [], isFetching: patientsLoading } = useQuery({
    queryKey: ['patients-search', patientQuery],
    queryFn: () => fetchPatients(patientQuery.trim()),
    enabled: suggestionsOpen && patientQuery.trim().length >= 2,
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      patient_id: rdv?.patient_id ?? '',
      patient_name: rdv?.patient_name ?? '',
      medecin_id: rdv?.medecin_id ?? (medecinOptions[0]?.id ?? ''),
      date_heure: rdv?.date_heure
        ? rdv.date_heure.slice(0, 16)
        : (defaultDate ?? new Date().toISOString().slice(0, 16)),
      motif: rdv?.motif ?? '',
      statut: rdv?.statut ?? 'planifie',
    },
  })

  useEffect(() => {
    reset({
      patient_id: rdv?.patient_id ?? '',
      patient_name: rdv?.patient_name ?? '',
      medecin_id: rdv?.medecin_id ?? (medecinOptions[0]?.id ?? ''),
      date_heure: rdv?.date_heure
        ? rdv.date_heure.slice(0, 16)
        : (defaultDate ?? new Date().toISOString().slice(0, 16)),
      motif: rdv?.motif ?? '',
      statut: rdv?.statut ?? 'planifie',
    })
    setPatientQuery(rdv?.patient_name ?? '')
  }, [rdv, defaultDate, users])

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const name = (values.patient_name || patientQuery).trim()
      const payload = {
        patient_id: values.patient_id?.trim() || '',
        patient_name: name,
        medecin_id: values.medecin_id,
        date_heure: values.date_heure,
        motif: values.motif,
        statut: values.statut,
        duree_min: rdv?.duree_min ?? DEFAULT_DUREE_MIN,
        notes: '',
      }
      return rdv ? updateRendezVous(rdv.id, payload) : createRendezVous(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] })
      queryClient.invalidateQueries({ queryKey: ['file-attente'] })
      onClose()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteRendezVous(rdv!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] })
      queryClient.invalidateQueries({ queryKey: ['file-attente'] })
      onClose()
    },
  })

  const selectedId = watch('patient_id')
  const busy = isSubmitting || mutation.isPending || deleteMutation.isPending

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xl">
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

        <form
          onSubmit={handleSubmit((values) => {
            setValue('patient_name', patientQuery.trim(), { shouldValidate: true })
            mutation.mutate({
              ...values,
              patient_name: patientQuery.trim(),
            })
          })}
          className="space-y-4 px-6 py-5"
        >
          <div className="relative">
            <label className="mb-1 block text-label-sm text-secondary">Patient *</label>
            <input type="hidden" {...register('patient_id')} />
            <input type="hidden" {...register('patient_name')} />
            <input
              value={patientQuery}
              onChange={(e) => {
                const value = e.target.value
                setPatientQuery(value)
                setValue('patient_id', '', { shouldValidate: true })
                setValue('patient_name', value, { shouldValidate: true })
                setSuggestionsOpen(true)
              }}
              onFocus={() => setSuggestionsOpen(true)}
              onBlur={() => {
                setValue('patient_name', patientQuery.trim(), { shouldValidate: true })
              }}
              placeholder="Nom du patient (recherche facultative)"
              autoComplete="off"
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.patient_name && (
              <p className="mt-1 text-label-sm text-error">{errors.patient_name.message}</p>
            )}
            {suggestionsOpen &&
              patientQuery.trim().length >= 2 &&
              !selectedId &&
              (patientsLoading || patientMatches.length > 0) && (
              <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-outline-variant bg-surface-container-lowest shadow-md">
                {patientsLoading && <li className="px-3 py-2 text-body-sm text-secondary">Recherche…</li>}
                {patientMatches.map((p) => {
                  const label = `${p.nom} ${p.prenom}`.trim() || `Patient ${p.id}`
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        className="flex w-full flex-col px-3 py-2 text-left hover:bg-surface-container"
                        onClick={() => {
                          setValue('patient_id', p.id, { shouldValidate: true })
                          setValue('patient_name', label, { shouldValidate: true })
                          setPatientQuery(label)
                          setSuggestionsOpen(false)
                        }}
                      >
                        <span className="text-body-sm text-on-surface">{label}</span>
                        <span className="text-label-sm text-secondary">
                          {[p.contact, formatDateFr(p.date_nais)].filter(Boolean).join(' · ')}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div>
            <label className="mb-1 block text-label-sm text-secondary">Médecin *</label>
            <select
              {...register('medecin_id')}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {medecinOptions.map((u) => {
                const label = `${u.nom} ${u.prenoms}`.trim() || u.fonction || 'Médecin'
                return (
                  <option key={u.id} value={u.id}>
                    {label}
                  </option>
                )
              })}
            </select>
          </div>

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

          {(mutation.isError || deleteMutation.isError) && (
            <p className="text-label-sm text-error">
              {deleteMutation.isError
                ? 'Erreur lors de la suppression.'
                : 'Erreur lors de la sauvegarde.'}
            </p>
          )}

          <div className="flex items-center justify-between gap-3 pt-2">
            {rdv ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  if (window.confirm('Supprimer ce rendez-vous ?')) {
                    deleteMutation.mutate()
                  }
                }}
                className="flex items-center gap-2 rounded-lg border border-error/30 px-4 py-2 text-label-md text-error hover:bg-error/5 disabled:opacity-50"
              >
                <MaterialIcon name="delete" className="text-[16px]" />
                {deleteMutation.isPending ? 'Suppression…' : 'Supprimer'}
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-outline-variant px-4 py-2 text-label-md text-secondary hover:bg-surface-container-low"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={busy}
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-label-md text-on-primary hover:bg-primary/90 disabled:opacity-50"
              >
                <MaterialIcon name="save" className="text-[16px]" />
                {rdv ? 'Enregistrer' : 'Créer le RDV'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
