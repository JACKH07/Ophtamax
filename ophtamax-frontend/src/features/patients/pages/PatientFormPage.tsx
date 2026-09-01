import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PageHeader } from '@/components/common/PageHeader'
import { patientSchema, type PatientFormValues } from '@/features/patients/schemas/patientSchema'
import { createPatient, fetchPatient, updatePatient } from '@/features/patients/services/patientService'
import { PATHS } from '@/routes/paths'

const ASSURANCES = ['', 'MCI', 'MUNASSUR', 'OLEA']

export function PatientFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: patient } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => fetchPatient(id!),
    enabled: isEdit,
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: { sexe: 'M', assurance: '', antecedents: '', profession: '', contact: '', nom: '', prenom: '', date_nais: '' },
  })

  useEffect(() => {
    if (patient) {
      reset({
        nom: patient.nom,
        prenom: patient.prenom,
        sexe: patient.sexe,
        date_nais: patient.date_nais,
        profession: patient.profession,
        contact: patient.contact,
        assurance: patient.assurance,
        antecedents: patient.antecedents,
      })
    }
  }, [patient, reset])

  const mutation = useMutation({
    mutationFn: (data: PatientFormValues) =>
      isEdit ? updatePatient(id!, data) : createPatient(data),
    onSuccess: (p) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      navigate(`${PATHS.patients}/${p.id}`)
    },
  })

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title={isEdit ? 'Modifier le patient' : 'Nouveau patient'}
        subtitle="Informations personnelles et antécédents médicaux."
        actions={
          <Link to={PATHS.patients} className="flex items-center gap-2 text-label-md text-primary hover:underline">
            <MaterialIcon name="arrow_back" className="text-[18px]" />
            Retour à la liste
          </Link>
        }
      />

      <form
        onSubmit={handleSubmit((d) => mutation.mutate(d))}
        className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm"
      >
        <div className="grid gap-5 md:grid-cols-2">
          {([
            ['nom', 'Nom', 'text'],
            ['prenom', 'Prénom', 'text'],
            ['date_nais', 'Date de naissance', 'date'],
            ['contact', 'Contact', 'tel'],
            ['profession', 'Profession', 'text'],
          ] as const).map(([field, label, type]) => (
            <div key={field}>
              <label className="mb-1 block text-label-sm text-on-surface-variant">{label}</label>
              <input type={type} className="w-full rounded-lg border border-outline-variant px-3 py-2 text-body-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" {...register(field)} />
              {errors[field] && <p className="mt-1 text-label-sm text-error">{errors[field]?.message}</p>}
            </div>
          ))}
          <div>
            <label className="mb-1 block text-label-sm text-on-surface-variant">Sexe</label>
            <select className="w-full rounded-lg border border-outline-variant px-3 py-2 text-body-md focus:border-primary focus:outline-none" {...register('sexe')}>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-label-sm text-on-surface-variant">Assurance</label>
            <select className="w-full rounded-lg border border-outline-variant px-3 py-2 text-body-md focus:border-primary focus:outline-none" {...register('assurance')}>
              <option value="">Aucune</option>
              {ASSURANCES.filter(Boolean).map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-label-sm text-on-surface-variant">Antécédents</label>
            <textarea rows={3} className="w-full rounded-lg border border-outline-variant px-3 py-2 text-body-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" {...register('antecedents')} />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Link to={PATHS.patients} className="rounded-lg border border-outline-variant px-4 py-2 text-label-md text-secondary hover:bg-surface-container-low">Annuler</Link>
          <button type="submit" disabled={mutation.isPending} className="rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary hover:bg-on-primary-fixed-variant disabled:opacity-60">
            {mutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}
