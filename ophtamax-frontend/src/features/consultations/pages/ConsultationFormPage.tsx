import { useMutation, useQuery } from '@tanstack/react-query'
import { type FormEvent, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { emptyOeil } from '@/api/mock/dataStore'
import { mockStore } from '@/api/mock/dataStore'
import type { ExamenOeil } from '@/api/types/entities'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PageHeader } from '@/components/common/PageHeader'
import { createConsultation } from '@/features/consultations/services/consultationService'
import { fetchPatients } from '@/features/patients/services/patientService'
import { PATHS } from '@/routes/paths'

function OeilForm({ label, color, values, onChange }: {
  label: string
  color: 'primary' | 'secondary'
  values: ExamenOeil
  onChange: (v: ExamenOeil) => void
}) {
  const ring = color === 'primary' ? 'focus:border-primary-container focus:ring-primary-container/20' : 'focus:border-secondary focus:ring-secondary/20'
  const badge = color === 'primary' ? 'bg-primary-container/10 text-primary-container' : 'bg-secondary/10 text-secondary'
  const fields: (keyof ExamenOeil)[] = ['avl', 'sphere', 'cylindre', 'axe', 'addition', 'pio']

  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
      <h3 className="mb-4 flex items-center gap-2 border-b border-surface-container-high pb-2 text-headline-sm font-semibold">
        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${badge}`}>{label}</span>
        Œil {label === 'OD' ? 'Droit' : 'Gauche'}
      </h3>
      <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
        {fields.map((f) => (
          <div key={f}>
            <label className="mb-1 block text-label-sm uppercase text-secondary">{f}</label>
            <input
              value={values[f]}
              onChange={(e) => onChange({ ...values, [f]: e.target.value })}
              className={`h-10 w-full rounded-lg border border-surface-container-highest text-center text-body-md focus:outline-none focus:ring ${ring}`}
            />
          </div>
        ))}
      </div>
      <div className="mt-3">
        <label className="mb-1 block text-label-sm text-secondary">Fond d&apos;œil</label>
        <input value={values.fond_oeil} onChange={(e) => onChange({ ...values, fond_oeil: e.target.value })} className={`w-full rounded-lg border border-surface-container-highest px-3 py-2 text-body-md focus:outline-none focus:ring ${ring}`} />
      </div>
    </div>
  )
}

export function ConsultationFormPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const preselectedPatient = searchParams.get('patient')

  const { data: patients = [] } = useQuery({ queryKey: ['patients'], queryFn: () => fetchPatients() })

  const [patientId, setPatientId] = useState(preselectedPatient ?? '')
  const [motif, setMotif] = useState('')
  const [diagnostic, setDiagnostic] = useState('')
  const [examenOd, setExamenOd] = useState<ExamenOeil>(emptyOeil())
  const [examenOg, setExamenOg] = useState<ExamenOeil>(emptyOeil())
  const [ordonnance, setOrdonnance] = useState('')
  const [prescription, setPrescription] = useState('')

  const mutation = useMutation({
    mutationFn: createConsultation,
    onSuccess: (c) => navigate(`${PATHS.consultations}/${c.id}`),
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const patient = mockStore.patients.get(patientId)
    if (!patient) return
    mutation.mutate({
      id_patient: patientId,
      patient_name: `${patient.prenom} ${patient.nom}`,
      motif,
      diagnostic,
      examen_od: examenOd,
      examen_og: examenOg,
      ordonnance,
      prescription,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-stack-lg">
      <PageHeader
        title="Nouvelle Consultation"
        subtitle="Saisie de l'examen ophtalmologique OD/OG."
        actions={
          <Link to={PATHS.consultations} className="flex items-center gap-2 text-label-md text-primary hover:underline">
            <MaterialIcon name="arrow_back" className="text-[18px]" /> Retour
          </Link>
        }
      />

      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
        <label className="mb-1 block text-label-sm text-on-surface-variant">Patient</label>
        <select required value={patientId} onChange={(e) => setPatientId(e.target.value)} className="w-full max-w-md rounded-lg border border-outline-variant px-3 py-2 text-body-md focus:border-primary focus:outline-none">
          <option value="">Sélectionner un patient</option>
          {patients.map((p) => <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>)}
        </select>
      </div>

      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
        <h3 className="mb-3 flex items-center gap-2 text-headline-sm font-semibold">
          <MaterialIcon name="description" className="text-primary" /> Motif de consultation
        </h3>
        <textarea rows={3} value={motif} onChange={(e) => setMotif(e.target.value)} placeholder="Saisissez le motif de la visite et les antécédents pertinents..." className="w-full rounded-lg border border-surface-container-highest px-3 py-2 text-body-md focus:border-primary-container focus:outline-none focus:ring focus:ring-primary-container/20" />
      </div>

      <div className="grid gap-gutter lg:grid-cols-2">
        <OeilForm label="OD" color="primary" values={examenOd} onChange={setExamenOd} />
        <OeilForm label="OG" color="secondary" values={examenOg} onChange={setExamenOg} />
      </div>

      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
        <h3 className="mb-3 text-headline-sm font-semibold">Diagnostic</h3>
        <input value={diagnostic} onChange={(e) => setDiagnostic(e.target.value)} placeholder="Rechercher CIM-10 ou texte libre..." className="w-full rounded-lg border border-surface-container-highest px-3 py-2 text-body-md focus:border-primary-container focus:outline-none focus:ring focus:ring-primary-container/20" />
      </div>

      <div className="grid gap-gutter md:grid-cols-2">
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
          <label className="mb-2 block text-label-md font-semibold">Ordonnance</label>
          <textarea rows={4} value={ordonnance} onChange={(e) => setOrdonnance(e.target.value)} className="w-full rounded-lg border border-outline-variant px-3 py-2 text-body-md" />
        </div>
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
          <label className="mb-2 block text-label-md font-semibold">Prescription lunettes</label>
          <textarea rows={4} value={prescription} onChange={(e) => setPrescription(e.target.value)} className="w-full rounded-lg border border-outline-variant px-3 py-2 text-body-md" />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" className="flex items-center gap-2 rounded-lg border border-primary-container px-6 py-2.5 text-label-md text-primary-container hover:bg-primary-container/5">
          <MaterialIcon name="print" className="text-[18px]" /> Aperçu ordonnance
        </button>
        <button type="submit" disabled={mutation.isPending || !patientId} className="flex items-center gap-2 rounded-lg bg-primary-container px-6 py-2.5 text-label-md text-white shadow-sm hover:bg-primary disabled:opacity-60">
          <MaterialIcon name="save" className="text-[18px]" />
          {mutation.isPending ? 'Enregistrement...' : 'Enregistrer la consultation'}
        </button>
      </div>
    </form>
  )
}
