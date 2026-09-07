import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { mockStore } from '@/api/mock/dataStore'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PageHeader } from '@/components/common/PageHeader'
import {
  createPrescriptionLunettes,
  fetchPrescriptionLunettes,
  updatePrescriptionLunettes,
} from '@/features/prescription-lunettes/services/prescriptionLunettesService'
import { PATHS } from '@/routes/paths'

const inputClass =
  'w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

const emptyForm = {
  patientId: '',
  date: new Date().toISOString().slice(0, 10),
  correction: '',
  od_sphere: '+0.00',
  od_cylindre: '-0.00',
  od_axe: '0',
  od_addition: '',
  og_sphere: '+0.00',
  og_cylindre: '-0.00',
  og_axe: '0',
  og_addition: '',
  type_verre: 'Verres unifocaux VL',
  medecin: '',
  notes: '',
}

export function PrescriptionLunettesFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const patients = mockStore.patients.list()

  const { data: existing } = useQuery({
    queryKey: ['prescription-lunettes', id],
    queryFn: () => fetchPrescriptionLunettes(id!),
    enabled: isEdit,
  })

  const [form, setForm] = useState(emptyForm)
  const set = (key: keyof typeof emptyForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  useEffect(() => {
    if (!existing) return
    setForm({
      patientId: existing.patient_id,
      date: existing.date.slice(0, 10),
      correction: existing.correction,
      od_sphere: existing.od_sphere,
      od_cylindre: existing.od_cylindre,
      od_axe: existing.od_axe,
      od_addition: existing.od_addition,
      og_sphere: existing.og_sphere,
      og_cylindre: existing.og_cylindre,
      og_axe: existing.og_axe,
      og_addition: existing.og_addition,
      type_verre: existing.type_verre,
      medecin: existing.medecin,
      notes: existing.notes,
    })
  }, [existing])

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        patient_id: form.patientId,
        date: form.date,
        correction: form.correction,
        od_sphere: form.od_sphere,
        od_cylindre: form.od_cylindre,
        od_axe: form.od_axe,
        od_addition: form.od_addition,
        og_sphere: form.og_sphere,
        og_cylindre: form.og_cylindre,
        og_axe: form.og_axe,
        og_addition: form.og_addition,
        type_verre: form.type_verre,
        medecin: form.medecin,
        notes: form.notes,
      }
      return isEdit
        ? updatePrescriptionLunettes(id!, payload)
        : createPrescriptionLunettes(payload)
    },
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions-lunettes'] })
      queryClient.invalidateQueries({ queryKey: ['prescription-lunettes', item.id] })
      navigate(`${PATHS.prescriptionLunettes}/${item.id}`)
    },
  })

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title={isEdit ? 'Modifier la prescription lunettes' : 'Nouvelle prescription lunettes'}
        subtitle="Module indépendant des consultations."
        actions={
          <Link
            to={PATHS.prescriptionLunettes}
            className="flex items-center gap-2 text-label-md text-primary hover:underline"
          >
            <MaterialIcon name="arrow_back" className="text-[18px]" />
            Retour à la liste
          </Link>
        }
      />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!form.patientId) return
          mutation.mutate()
        }}
        className="max-w-3xl space-y-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-label-sm text-secondary">Patient *</label>
          <select
            required
            value={form.patientId}
            onChange={(e) => set('patientId', e.target.value)}
            className={inputClass}
          >
            <option value="">— Sélectionner —</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {`${p.nom} ${p.prenom}`.trim() || `Patient ${p.id}`}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-label-sm text-secondary">Date *</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-label-sm text-secondary">Médecin</label>
            <input
              value={form.medecin}
              onChange={(e) => set('medecin', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-label-sm text-secondary">Type de verre</label>
          <select
            value={form.type_verre}
            onChange={(e) => set('type_verre', e.target.value)}
            className={inputClass}
          >
            <option>Verres unifocaux VL</option>
            <option>Verres unifocaux VP</option>
            <option>Verres progressifs</option>
            <option>Verres bifocaux</option>
            <option>Lentilles</option>
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-outline-variant p-4">
            <p className="mb-3 text-label-md font-semibold text-primary">Œil Droit (OD)</p>
            <div className="grid grid-cols-2 gap-2">
              {([
                ['od_sphere', 'Sphère'],
                ['od_cylindre', 'Cylindre'],
                ['od_axe', 'Axe'],
                ['od_addition', 'Addition'],
              ] as const).map(([key, label]) => (
                <div key={key}>
                  <label className="mb-1 block text-label-sm text-secondary">{label}</label>
                  <input value={form[key]} onChange={(e) => set(key, e.target.value)} className={inputClass} />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-outline-variant p-4">
            <p className="mb-3 text-label-md font-semibold text-secondary">Œil Gauche (OG)</p>
            <div className="grid grid-cols-2 gap-2">
              {([
                ['og_sphere', 'Sphère'],
                ['og_cylindre', 'Cylindre'],
                ['og_axe', 'Axe'],
                ['og_addition', 'Addition'],
              ] as const).map(([key, label]) => (
                <div key={key}>
                  <label className="mb-1 block text-label-sm text-secondary">{label}</label>
                  <input value={form[key]} onChange={(e) => set(key, e.target.value)} className={inputClass} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-label-sm text-secondary">Correction / consignes</label>
          <textarea
            rows={3}
            value={form.correction}
            onChange={(e) => set('correction', e.target.value)}
            placeholder="Ex : Lunettes VL, port permanent..."
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-label-sm text-secondary">Notes</label>
          <textarea
            rows={2}
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            to={PATHS.prescriptionLunettes}
            className="rounded-lg border border-outline-variant px-4 py-2 text-label-md text-secondary hover:bg-surface-container-low"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-label-md text-on-primary disabled:opacity-50"
          >
            <MaterialIcon name="save" className="text-[16px]" />
            {mutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}
