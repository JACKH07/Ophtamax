import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { mockStore } from '@/api/mock/dataStore'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PageHeader } from '@/components/common/PageHeader'
import {
  createOrdonnance,
  fetchOrdonnance,
  updateOrdonnance,
} from '@/features/ordonnances/services/ordonnanceService'
import { PATHS } from '@/routes/paths'

const inputClass =
  'w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

export function OrdonnanceFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const patients = mockStore.patients.list()

  const { data: existing } = useQuery({
    queryKey: ['ordonnance', id],
    queryFn: () => fetchOrdonnance(id!),
    enabled: isEdit,
  })

  const [patientId, setPatientId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [contenu, setContenu] = useState('')
  const [diagnostic, setDiagnostic] = useState('')
  const [medecin, setMedecin] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!existing) return
    setPatientId(existing.patient_id)
    setDate(existing.date.slice(0, 10))
    setContenu(existing.contenu)
    setDiagnostic(existing.diagnostic)
    setMedecin(existing.medecin)
    setNotes(existing.notes)
  }, [existing])

  const mutation = useMutation({
    mutationFn: () => {
      const payload = { patient_id: patientId, date, contenu, diagnostic, medecin, notes }
      return isEdit ? updateOrdonnance(id!, payload) : createOrdonnance(payload)
    },
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: ['ordonnances'] })
      queryClient.invalidateQueries({ queryKey: ['ordonnance', item.id] })
      navigate(`${PATHS.ordonnances}/${item.id}`)
    },
  })

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title={isEdit ? 'Modifier l\'ordonnance' : 'Nouvelle ordonnance'}
        actions={
          <Link
            to={PATHS.ordonnances}
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
          if (!patientId || !contenu.trim()) return
          mutation.mutate()
        }}
        className="max-w-2xl space-y-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-label-sm text-secondary">Patient *</label>
          <select
            required
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
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
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-label-sm text-secondary">Médecin</label>
            <input value={medecin} onChange={(e) => setMedecin(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-label-sm text-secondary">Diagnostic</label>
          <input
            value={diagnostic}
            onChange={(e) => setDiagnostic(e.target.value)}
            placeholder="Diagnostic associé"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-label-sm text-secondary">Ordonnance (médicaments) *</label>
          <textarea
            required
            rows={5}
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            placeholder="Traitement prescrit..."
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-label-sm text-secondary">Notes</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Instructions particulières..."
            className={inputClass}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            to={PATHS.ordonnances}
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
