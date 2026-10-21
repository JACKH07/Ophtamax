import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { mockStore } from '@/api/mock/dataStore'
import type { Patient } from '@/api/types/entities'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PageHeader } from '@/components/common/PageHeader'
import { fetchPatients } from '@/features/patients/services/patientService'
import {
  createPrescriptionExamen,
  fetchPrescriptionExamen,
  updatePrescriptionExamen,
} from '@/features/prescription-examen/services/prescriptionExamenService'
import { PATHS } from '@/routes/paths'

const inputClass =
  'w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

export function PrescriptionExamenFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const examensRef = mockStore.referentiels.examens()
  const [patientQuery, setPatientQuery] = useState('')
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const [patientError, setPatientError] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const { data: patientMatches = [], isFetching: patientsLoading } = useQuery({
    queryKey: ['patients-search', patientQuery],
    queryFn: () => fetchPatients(patientQuery.trim()),
    enabled: suggestionsOpen && patientQuery.trim().length >= 2,
  })

  const { data: existing } = useQuery({
    queryKey: ['prescription-examen', id],
    queryFn: () => fetchPrescriptionExamen(id!),
    enabled: isEdit,
  })

  const [patientId, setPatientId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [bulletinDe, setBulletinDe] = useState("Demande d'examen")
  const [examens, setExamens] = useState('')
  const [diagnostic, setDiagnostic] = useState('')
  const [service, setService] = useState('')
  const [medecin, setMedecin] = useState('')

  useEffect(() => {
    if (!existing) return
    setPatientQuery(existing.patient_name ?? '')
    setPatientId(existing.patient_id)
    setDate(existing.date.slice(0, 10))
    setBulletinDe(existing.bulletin_de || "Demande d'examen")
    setExamens(existing.examens)
    setDiagnostic(existing.indication)
    setService(existing.service || '')
    setMedecin(existing.medecin)
  }, [existing])

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        patient_id: patientId,
        date,
        examens,
        indication: diagnostic,
        bulletin_de: bulletinDe,
        service,
        medecin,
        notes: '',
      }
      return isEdit
        ? updatePrescriptionExamen(id!, payload)
        : createPrescriptionExamen(payload)
    },
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions-examen'] })
      queryClient.invalidateQueries({ queryKey: ['prescription-examen', item.id] })
      navigate(`${PATHS.prescriptionExamen}/${item.id}`)
    },
  })

  const addExamen = (libelle: string) => {
    setExamens((prev) =>
      prev.includes(libelle) ? prev : prev.trim() ? `${prev}\n${libelle}` : libelle,
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-stack-lg">
      <PageHeader
        title={isEdit ? 'Modifier la demande d\'examen' : 'Nouvelle demande d\'examen'}
        actions={
          <Link
            to={PATHS.prescriptionExamen}
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
          if (!patientId) {
            setPatientError('Choisissez un patient dans la liste')
            return
          }
          if (!examens.trim()) return
          setPatientError('')
          mutation.mutate()
        }}
        className="flex w-full flex-1 flex-col gap-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm"
      >
        <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-1 block text-label-sm text-secondary">Bulletin de</label>
          <input
            value={bulletinDe}
            onChange={(e) => setBulletinDe(e.target.value)}
            placeholder="Demande d'examen"
            className={inputClass}
          />
        </div>

        <div className="relative">
          <label className="mb-1 block text-label-sm text-secondary">Patient *</label>
          <div className="relative">
            <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              required
              value={patientQuery}
              onChange={(e) => {
                setPatientQuery(e.target.value)
                setPatientId('')
                setSelectedPatient(null)
                setPatientError('')
                setSuggestionsOpen(true)
              }}
              onFocus={() => setSuggestionsOpen(true)}
              placeholder="Saisir le nom du patient"
              autoComplete="off"
              className={`${inputClass} pl-10`}
            />
          </div>
          {patientError ? (
            <p className="mt-1 text-label-sm text-error">{patientError}</p>
          ) : patientId ? (
            <p className="mt-1 text-label-sm text-primary">
              Patient sélectionné
              {selectedPatient
                ? ` · ${selectedPatient.sexe === 'M' ? 'Masculin' : 'Féminin'}${
                    selectedPatient.date_nais
                      ? ` · Né(e) le ${new Date(selectedPatient.date_nais).toLocaleDateString('fr-FR')}`
                      : ''
                  }`
                : ''}
            </p>
          ) : patientQuery.trim().length > 0 && patientQuery.trim().length < 2 ? (
            <p className="mt-1 text-label-sm text-secondary">Saisissez au moins 2 caractères</p>
          ) : null}
          {suggestionsOpen && patientQuery.trim().length >= 2 && !patientId && (
            <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-outline-variant bg-surface-container-lowest shadow-md">
              {patientsLoading && (
                <li className="px-3 py-2 text-body-md text-secondary">Recherche…</li>
              )}
              {!patientsLoading && patientMatches.length === 0 && (
                <li className="px-3 py-2 text-body-md text-secondary">Aucun patient trouvé</li>
              )}
              {patientMatches.map((p) => {
                const label = `${p.nom} ${p.prenom}`.trim() || `Patient ${p.id}`
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      className="flex w-full flex-col px-3 py-2 text-left hover:bg-surface-container"
                      onClick={() => {
                        setPatientId(p.id)
                        setSelectedPatient(p)
                        setPatientQuery(label)
                        setPatientError('')
                        setSuggestionsOpen(false)
                        if (p.contact && !service) setService(p.contact)
                      }}
                    >
                      <span className="text-body-md text-on-surface">{label}</span>
                      <span className="text-label-sm text-secondary">
                        {[p.contact, p.date_nais].filter(Boolean).join(' · ')}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

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
          <label className="mb-1 block text-label-sm text-secondary">Service / Contact</label>
          <input
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="Tél. / service"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-label-sm text-secondary">Médecin</label>
          <input
            value={medecin}
            onChange={(e) => setMedecin(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-label-sm text-secondary">Diagnostic</label>
          <input
            value={diagnostic}
            onChange={(e) => setDiagnostic(e.target.value)}
            placeholder="Ex : Glaucome"
            className={inputClass}
          />
        </div>
        </div>

        <div className="flex min-h-48 flex-1 flex-col">
          <label className="mb-1 block text-label-sm text-secondary">Examen demandé *</label>
          <div className="mb-2 flex flex-wrap gap-2">
            {examensRef.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => addExamen(ex.libelle)}
                className="rounded-full border border-outline-variant px-3 py-1 text-label-sm text-secondary hover:border-primary hover:text-primary"
              >
                + {ex.libelle}
              </button>
            ))}
          </div>
          <textarea
            required
            value={examens}
            onChange={(e) => setExamens(e.target.value)}
            placeholder="Ex : Champ visuel automatisé"
            className={`${inputClass} min-h-48 flex-1 resize-y`}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            to={PATHS.prescriptionExamen}
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
