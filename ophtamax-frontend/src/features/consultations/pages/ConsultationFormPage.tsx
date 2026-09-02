import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { dossierNumero, emptyOeil, mockStore } from '@/api/mock/dataStore'
import type { ExamenOeil, Patient } from '@/api/types/entities'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { EyeExamPanel } from '@/features/consultations/components/EyeExamPanel'
import {
  createConsultation,
  fetchConsultation,
  updateConsultation,
  type ConsultationFormData,
} from '@/features/consultations/services/consultationService'
import { fetchPatients } from '@/features/patients/services/patientService'
import { PATHS } from '@/routes/paths'

function patientAge(dateNais: string): number {
  return Math.floor((Date.now() - new Date(dateNais).getTime()) / (365.25 * 24 * 3600 * 1000))
}

function formatNow(): string {
  return new Date().toLocaleString('fr-FR', {
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
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

  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: () => fetchPatients(),
  })

  const { data: existing } = useQuery({
    queryKey: ['consultation', id],
    queryFn: () => fetchConsultation(id!),
    enabled: isEdit,
  })

  const [patientId, setPatientId] = useState(preselectedPatient ?? '')
  const [motif, setMotif] = useState('')
  const [diagnostic, setDiagnostic] = useState('')
  const [examenOd, setExamenOd] = useState<ExamenOeil>(emptyOeil())
  const [examenOg, setExamenOg] = useState<ExamenOeil>(emptyOeil())
  const [ordonnance, setOrdonnance] = useState('')
  const [prescription, setPrescription] = useState('')
  const [conduite, setConduite] = useState('')
  const [rdvDate, setRdvDate] = useState('')
  const [rdvDelai, setRdvDelai] = useState('Dans 1 mois')

  useEffect(() => {
    if (!existing) return
    setPatientId(existing.id_patient)
    setMotif(existing.motif)
    setDiagnostic(existing.diagnostic)
    setExamenOd(existing.examen_od)
    setExamenOg(existing.examen_og)
    setOrdonnance(existing.ordonnance)
    setPrescription(existing.prescription)
    setConduite(existing.conduite_a_tenir)
    setRdvDate(existing.prochain_rdv_date)
    setRdvDelai(existing.prochain_rdv_delai || 'Dans 1 mois')
  }, [existing])

  const selectedPatient: Patient | undefined = useMemo(
    () => patients.find((p) => p.id === patientId) ?? mockStore.patients.get(patientId),
    [patients, patientId],
  )

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
      motif,
      diagnostic,
      examen_od: examenOd,
      examen_og: examenOg,
      ordonnance,
      prescription,
      conduite_a_tenir: conduite,
      prochain_rdv_date: rdvDate,
      prochain_rdv_delai: rdvDelai,
      statut,
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const payload = buildPayload('terminee')
    if (!payload) return
    mutation.mutate(payload)
  }

  const goPrintOrdonnance = () => {
    const payload = buildPayload('terminee')
    if (!payload) return
    mutation.mutate(payload, {
      onSuccess: (c) => navigate(`${PATHS.ordonnances}/${c.id}?type=ordonnance`),
    })
  }

  const goPrintCompteRendu = () => {
    const payload = buildPayload('terminee')
    if (!payload) return
    mutation.mutate(payload, {
      onSuccess: (c) => navigate(`${PATHS.ordonnances}/${c.id}?type=compte-rendu`),
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
                    <p className="text-label-sm text-secondary">
                      {patientAge(selectedPatient.date_nais)} ans · Dossier #{dossierNumero(selectedPatient.id)}
                    </p>
                  </div>
                </Link>
                {!isEdit && (
                  <button
                    type="button"
                    onClick={() => setPatientId('')}
                    className="ml-2 rounded-md p-1 text-secondary hover:bg-surface-container-high hover:text-primary"
                    title="Changer de patient"
                  >
                    <MaterialIcon name="swap_horiz" className="text-[20px]" />
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-3 max-w-md">
                <label className="mb-1 block text-label-sm text-on-surface-variant">Patient</label>
                <select
                  required
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Sélectionner un patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.prenom} {p.nom}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <p className="text-label-md capitalize text-secondary">{formatNow()}</p>
        </div>
      </div>

      {/* Motif & Anamnèse — phase 1 texte libre */}
      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-headline-sm font-semibold text-on-surface">
          <MaterialIcon name="assignment" className="text-primary" />
          Motif &amp; Anamnèse
        </h3>
        <label className="mb-1 block text-label-sm text-on-surface-variant">Description détaillée</label>
        <textarea
          rows={4}
          value={motif}
          onChange={(e) => setMotif(e.target.value)}
          placeholder="Saisissez le motif de la visite et les antécédents pertinents..."
          className={inputClass}
        />
      </section>

      {/* Examen structuré OD / OG — phase 2 */}
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
                type="date"
                value={rdvDate}
                onChange={(e) => setRdvDate(e.target.value)}
                className={inputClass}
              />
              <select
                value={rdvDelai}
                onChange={(e) => setRdvDelai(e.target.value)}
                className={`${inputClass} max-w-[160px]`}
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

        <div className="mb-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-label-sm text-on-surface-variant">Ordonnance (médicaments)</label>
            <textarea
              rows={3}
              value={ordonnance}
              onChange={(e) => setOrdonnance(e.target.value)}
              placeholder="Traitement prescrit..."
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-label-sm text-on-surface-variant">Prescription optique</label>
            <textarea
              rows={3}
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              placeholder="Correction optique / lunettes..."
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-body-sm text-on-surface-variant">
          <MaterialIcon name="info" className="shrink-0 text-primary" />
          <p>
            Pensez à générer l&apos;ordonnance si une correction optique a été prescrite lors de cette consultation.
          </p>
        </div>
      </section>

      {/* Barre d'actions sticky */}
      <div className="fixed bottom-0 left-sidebar-width right-0 z-10 border-t border-outline-variant bg-surface-container-lowest/95 px-margin-page py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-container-max-width flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            disabled={!patientId || mutation.isPending}
            onClick={goPrintCompteRendu}
            className="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-label-md font-semibold text-on-surface hover:bg-surface-container-low disabled:opacity-50"
          >
            <MaterialIcon name="picture_as_pdf" className="text-[18px]" />
            Compte-rendu PDF
          </button>
          <button
            type="button"
            disabled={!patientId || mutation.isPending}
            onClick={goPrintOrdonnance}
            className="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-label-md font-semibold text-on-surface hover:bg-surface-container-low disabled:opacity-50"
          >
            <MaterialIcon name="prescriptions" className="text-[18px]" />
            Générer ordonnance
          </button>
          <button
            type="submit"
            disabled={!patientId || mutation.isPending}
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
