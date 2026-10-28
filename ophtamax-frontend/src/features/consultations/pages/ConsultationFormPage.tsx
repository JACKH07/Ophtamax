import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type FormEvent, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { dossierNumero, emptyOeil } from '@/api/mock/dataStore'
import type { ExamenOeil, Patient } from '@/api/types/entities'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { EyeExamPanel } from '@/features/consultations/components/EyeExamPanel'
import {
  createConsultation,
  fetchConsultation,
  updateConsultation,
  type ConsultationFormData,
} from '@/features/consultations/services/consultationService'
import { fetchPatient, fetchPatients } from '@/features/patients/services/patientService'
import { PATHS } from '@/routes/paths'
import { formatDateFr, formatDateTimeFr, maskDateFr, toIsoDate } from '@/utils/date'

function patientAge(dateNais: string): number {
  return Math.floor((Date.now() - new Date(dateNais).getTime()) / (365.25 * 24 * 3600 * 1000))
}

function formatNow(): string {
  return formatDateTimeFr(new Date())
}

const RDV_OPTIONS = ['Dans 1 mois', 'Dans 3 mois', 'Dans 6 mois', 'Dans 1 an', 'Selon besoin']

const inputClass =
  'w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

export function ConsultationFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const preselectedPatient = searchParams.get('patient')

  const [patientQuery, setPatientQuery] = useState('')
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const [patientError, setPatientError] = useState('')
  const presetApplied = useRef(false)

  const { data: patientMatches = [], isFetching: patientsLoading } = useQuery({
    queryKey: ['patients-search', patientQuery],
    queryFn: () => fetchPatients(patientQuery.trim()),
    enabled: suggestionsOpen && patientQuery.trim().length >= 2,
  })

  const { data: existing } = useQuery({
    queryKey: ['consultation', id],
    queryFn: () => fetchConsultation(id!),
    enabled: isEdit,
  })

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [diagnostic, setDiagnostic] = useState('')
  const [examenOd, setExamenOd] = useState<ExamenOeil>(emptyOeil())
  const [examenOg, setExamenOg] = useState<ExamenOeil>(emptyOeil())
  const [conduite, setConduite] = useState('')
  const [rdvDate, setRdvDate] = useState('')
  const [rdvDelai, setRdvDelai] = useState('Dans 1 mois')

  useEffect(() => {
    if (!existing) return
    setDiagnostic(existing.diagnostic)
    setExamenOd(existing.examen_od)
    setExamenOg(existing.examen_og)
    setConduite(existing.conduite_a_tenir)
    setRdvDate(formatDateFr(existing.prochain_rdv_date))
    setRdvDelai(existing.prochain_rdv_delai || 'Dans 1 mois')
  }, [existing])

  const presetId = existing?.id_patient || (!isEdit ? preselectedPatient : '') || ''

  const { data: presetPatient } = useQuery({
    queryKey: ['patient', presetId],
    queryFn: () => fetchPatient(presetId),
    enabled: Boolean(presetId),
  })

  useEffect(() => {
    if (!presetPatient || presetApplied.current) return
    presetApplied.current = true
    setSelectedPatient(presetPatient)
    setPatientQuery(`${presetPatient.nom} ${presetPatient.prenom}`.trim())
  }, [presetPatient])

  const mutation = useMutation({
    mutationFn: (data: ConsultationFormData) =>
      isEdit ? updateConsultation(id!, data) : createConsultation(data),
    onSuccess: (c) => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] })
      queryClient.invalidateQueries({ queryKey: ['consultation', c.id] })
      queryClient.invalidateQueries({ queryKey: ['patient', c.id_patient] })
      navigate(`${PATHS.consultations}/${c.id}`)
    },
  })

  const buildPayload = (statut: 'brouillon' | 'terminee'): ConsultationFormData | null => {
    if (!selectedPatient) return null
    return {
      id_patient: selectedPatient.id,
      patient_name: `${selectedPatient.prenom} ${selectedPatient.nom}`,
      dossier_numero: dossierNumero(selectedPatient.id),
      diagnostic,
      examen_od: examenOd,
      examen_og: examenOg,
      ordonnance: '',
      prescription: '',
      conduite_a_tenir: conduite,
      prochain_rdv_date: toIsoDate(rdvDate),
      prochain_rdv_delai: rdvDelai,
      statut,
    }
  }

  const clearPatient = () => {
    setSelectedPatient(null)
    setPatientQuery('')
    setPatientError('')
    setSuggestionsOpen(false)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!selectedPatient) {
      setPatientError('Choisissez un patient dans la liste')
      return
    }
    const payload = buildPayload('terminee')
    if (!payload) return
    setPatientError('')
    mutation.mutate(payload)
  }

  const goPrintCompteRendu = () => {
    if (!selectedPatient) {
      setPatientError('Choisissez un patient dans la liste')
      return
    }
    const payload = buildPayload('terminee')
    if (!payload) return
    setPatientError('')
    mutation.mutate(payload, {
      onSuccess: (c) => navigate(`${PATHS.consultations}/${c.id}/documents`),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex flex-col gap-stack-lg pb-24">
      <div className="flex flex-col gap-2">
        <p className="text-label-sm text-secondary">
          <Link to={PATHS.consultations} className="hover:text-primary">Consultation</Link>
          {' > '}
          <span className="text-on-surface">Saisie</span>
        </p>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <h2 className="text-display-lg font-semibold text-on-surface">
              {isEdit ? 'Modifier la consultation' : 'Nouvelle Consultation'}
            </h2>
            {selectedPatient ? (
              <div className="mt-3 inline-flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 shadow-sm">
                <Link
                  to={`${PATHS.patients}/${selectedPatient.id}`}
                  className="flex items-center gap-3 transition-colors hover:opacity-80"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MaterialIcon name="person" />
                  </div>
                  <div>
                    <p className="text-body-md font-semibold text-on-surface">
                      {selectedPatient.prenom} {selectedPatient.nom}
                    </p>
                    <p className="text-label-sm text-primary">Patient sélectionné</p>
                    <p className="text-label-sm text-secondary">
                      {patientAge(selectedPatient.date_nais)} ans · Dossier #{dossierNumero(selectedPatient.id)}
                    </p>
                  </div>
                </Link>
                {!isEdit && (
                  <button
                    type="button"
                    onClick={clearPatient}
                    className="ml-2 rounded-md p-1 text-secondary hover:bg-surface-container-high hover:text-primary"
                    title="Changer de patient"
                  >
                    <MaterialIcon name="swap_horiz" className="text-[20px]" />
                  </button>
                )}
              </div>
            ) : (
              <div className="relative mt-3 max-w-md">
                <label className="mb-1 block text-label-sm text-on-surface-variant">Patient</label>
                <div className="relative">
                  <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                  <input
                    value={patientQuery}
                    onChange={(e) => {
                      setPatientQuery(e.target.value)
                      setSelectedPatient(null)
                      setPatientError('')
                      setSuggestionsOpen(true)
                    }}
                    onFocus={() => setSuggestionsOpen(true)}
                    placeholder="Saisir le nom, le prénom ou le contact"
                    autoComplete="off"
                    className={`${inputClass} pl-10`}
                  />
                </div>
                {patientError ? (
                  <p className="mt-1 text-label-sm text-error">{patientError}</p>
                ) : patientQuery.trim().length > 0 && patientQuery.trim().length < 2 ? (
                  <p className="mt-1 text-label-sm text-secondary">Saisissez au moins 2 caractères</p>
                ) : null}
                {suggestionsOpen && patientQuery.trim().length >= 2 && (
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
                              setSelectedPatient(p)
                              setPatientQuery(label)
                              setPatientError('')
                              setSuggestionsOpen(false)
                            }}
                          >
                            <span className="text-body-md text-on-surface">{label}</span>
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
            )}
          </div>
          <p className="text-label-md capitalize text-secondary">{formatNow()}</p>
        </div>
      </div>

      {/* Examen structuré OD / OG */}
      <div className="grid gap-gutter lg:grid-cols-2">
        <EyeExamPanel side="OD" values={examenOd} onChange={setExamenOd} />
        <EyeExamPanel side="OG" values={examenOg} onChange={setExamenOg} />
      </div>

      {/* Conclusion & Suivi */}
      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-headline-sm font-semibold text-on-surface">
          <MaterialIcon name="clinical_notes" className="text-primary" />
          Conclusion &amp; Suivi
        </h3>

        <div className="mb-4">
          <label className="mb-1 block text-label-sm text-on-surface-variant">Diagnostic</label>
          <div className="relative">
            <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              value={diagnostic}
              onChange={(e) => setDiagnostic(e.target.value)}
              placeholder="Rechercher CIM-10 ou texte libre..."
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        <div className="mb-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-label-sm text-on-surface-variant">
              Prochain rendez-vous recommandé
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                placeholder="jj/mm/aaaa"
                maxLength={10}
                value={rdvDate}
                onChange={(e) => setRdvDate(maskDateFr(e.target.value))}
                className={inputClass}
              />
              <select
                value={rdvDelai}
                onChange={(e) => setRdvDelai(e.target.value)}
                className={`${inputClass} max-w-40`}
              >
                {RDV_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-label-sm text-on-surface-variant">Conduite à tenir (CAT)</label>
          <textarea
            rows={3}
            value={conduite}
            onChange={(e) => setConduite(e.target.value)}
            placeholder="Plan de traitement, conseils, suivi..."
            className={inputClass}
          />
        </div>
      </section>

      {/* Barre d'actions sticky */}
      <div className="fixed bottom-0 left-sidebar-width right-0 z-10 border-t border-outline-variant bg-surface-container-lowest/95 px-margin-page py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-container-max-width flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={goPrintCompteRendu}
            className="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-label-md font-semibold text-on-surface hover:bg-surface-container-low disabled:opacity-50"
          >
            <MaterialIcon name="picture_as_pdf" className="text-[18px]" />
            Compte-rendu PDF
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-label-md font-semibold text-on-primary shadow-sm hover:bg-on-primary-fixed-variant disabled:opacity-50"
          >
            <MaterialIcon name="save" className="text-[18px]" />
            {mutation.isPending ? 'Enregistrement...' : 'Enregistrer la consultation'}
          </button>
        </div>
      </div>
    </form>
  )
}
