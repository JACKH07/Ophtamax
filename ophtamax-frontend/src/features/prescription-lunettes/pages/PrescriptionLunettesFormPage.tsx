import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PageHeader } from '@/components/common/PageHeader'
import { fetchPatients } from '@/features/patients/services/patientService'
import {
  createPrescriptionLunettes,
  fetchPrescriptionLunettes,
  updatePrescriptionLunettes,
} from '@/features/prescription-lunettes/services/prescriptionLunettesService'
import { PATHS } from '@/routes/paths'
import { formatDateFr } from '@/utils/date'

const inputClass =
  'w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

const FOYER_OPTIONS = [
  { value: 'simple', label: 'Simple foyer' },
  { value: 'double', label: 'Double foyer' },
  { value: 'progressif', label: 'Progressif' },
] as const

const TRAITEMENT_OPTIONS = ['Protogray', 'Anti-reflet', 'Teinte A', 'Teinte AB'] as const

const emptyForm = {
  patientId: '',
  date: new Date().toISOString().slice(0, 10),
  correction: '',
  od_sphere: '+0.00',
  od_cylindre: '-0.00',
  od_axe: '0',
  od_addition: '',
  od_vp_sphere: '',
  od_vp_cylindre: '',
  od_vp_axe: '',
  og_sphere: '+0.00',
  og_cylindre: '-0.00',
  og_axe: '0',
  og_addition: '',
  og_vp_sphere: '',
  og_vp_cylindre: '',
  og_vp_axe: '',
  distance_interpupillaire: '',
  type_foyer: 'simple',
  traitements: [] as string[],
  type_verre: 'Verres unifocaux VL',
  medecin: '',
}

function foyerToTypeVerre(foyer: string): string {
  if (foyer === 'double') return 'Verres bifocaux'
  if (foyer === 'progressif') return 'Verres progressifs'
  return 'Verres unifocaux VL'
}

function typeVerreToFoyer(type: string): string {
  const t = type.toLowerCase()
  if (t.includes('bifocal') || t.includes('double')) return 'double'
  if (t.includes('progressif')) return 'progressif'
  return 'simple'
}

export function PrescriptionLunettesFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [patientQuery, setPatientQuery] = useState('')
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const [patientError, setPatientError] = useState('')

  const { data: patientMatches = [], isFetching: patientsLoading } = useQuery({
    queryKey: ['patients-search', patientQuery],
    queryFn: () => fetchPatients(patientQuery.trim()),
    enabled: suggestionsOpen && patientQuery.trim().length >= 2,
  })

  const { data: existing } = useQuery({
    queryKey: ['prescription-lunettes', id],
    queryFn: () => fetchPrescriptionLunettes(id!),
    enabled: isEdit,
  })

  const [form, setForm] = useState(emptyForm)
  const set = (key: keyof typeof emptyForm, value: string | string[]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const toggleTraitement = (label: string) => {
    setForm((prev) => ({
      ...prev,
      traitements: prev.traitements.includes(label)
        ? prev.traitements.filter((t) => t !== label)
        : [...prev.traitements, label],
    }))
  }

  useEffect(() => {
    if (!existing) return
    setPatientQuery(existing.patient_name ?? '')
    setForm({
      patientId: existing.patient_id,
      date: existing.date.slice(0, 10),
      correction: existing.correction,
      od_sphere: existing.od_sphere,
      od_cylindre: existing.od_cylindre,
      od_axe: existing.od_axe,
      od_addition: existing.od_addition,
      od_vp_sphere: existing.od_vp_sphere ?? '',
      od_vp_cylindre: existing.od_vp_cylindre ?? '',
      od_vp_axe: existing.od_vp_axe ?? '',
      og_sphere: existing.og_sphere,
      og_cylindre: existing.og_cylindre,
      og_axe: existing.og_axe,
      og_addition: existing.og_addition,
      og_vp_sphere: existing.og_vp_sphere ?? '',
      og_vp_cylindre: existing.og_vp_cylindre ?? '',
      og_vp_axe: existing.og_vp_axe ?? '',
      distance_interpupillaire: existing.distance_interpupillaire ?? '',
      type_foyer: existing.type_foyer || typeVerreToFoyer(existing.type_verre),
      traitements: existing.traitements ?? [],
      type_verre: existing.type_verre,
      medecin: existing.medecin,
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
        od_vp_sphere: form.od_vp_sphere,
        od_vp_cylindre: form.od_vp_cylindre,
        od_vp_axe: form.od_vp_axe,
        og_sphere: form.og_sphere,
        og_cylindre: form.og_cylindre,
        og_axe: form.og_axe,
        og_addition: form.og_addition,
        og_vp_sphere: form.og_vp_sphere,
        og_vp_cylindre: form.og_vp_cylindre,
        og_vp_axe: form.og_vp_axe,
        distance_interpupillaire: form.distance_interpupillaire,
        type_foyer: form.type_foyer,
        traitements: form.traitements,
        type_verre: foyerToTypeVerre(form.type_foyer),
        medecin: form.medecin,
        notes: '',
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

  const vlFields = (
    [
      ['sphere', 'Sphère'],
      ['cylindre', 'Cylindre'],
      ['axe', 'Axe'],
    ] as const
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-stack-lg">
      <PageHeader
        title={isEdit ? 'Modifier la prescription lunettes' : 'Nouvelle prescription lunettes'}
        subtitle="Modèle ordonnance optique (VL / VP)."
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
          if (!form.patientId) {
            setPatientError('Choisissez un patient dans la liste')
            return
          }
          setPatientError('')
          mutation.mutate()
        }}
        className="flex w-full flex-1 flex-col gap-5 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm"
      >
        <div className="relative">
          <label className="mb-1 block text-label-sm text-secondary">Patient *</label>
          <div className="relative">
            <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              required
              value={patientQuery}
              onChange={(e) => {
                setPatientQuery(e.target.value)
                set('patientId', '')
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
          ) : form.patientId ? (
            <p className="mt-1 text-label-sm text-primary">Patient sélectionné</p>
          ) : patientQuery.trim().length > 0 && patientQuery.trim().length < 2 ? (
            <p className="mt-1 text-label-sm text-secondary">Saisissez au moins 2 caractères</p>
          ) : null}
          {suggestionsOpen && patientQuery.trim().length >= 2 && !form.patientId && (
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
                        set('patientId', p.id)
                        setPatientQuery(label)
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

        <div className="grid flex-1 gap-5 xl:grid-cols-2">
        {/* Vision de loin */}
        <div className="rounded-lg border border-outline-variant p-4">
          <p className="mb-3 text-label-md font-semibold uppercase tracking-wide text-primary">
            Vision de loin
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-label-sm font-semibold">Œil Droit (D)</p>
              <div className="grid grid-cols-3 gap-2">
                {vlFields.map(([key, label]) => (
                  <div key={`od-${key}`}>
                    <label className="mb-1 block text-label-sm text-secondary">{label}</label>
                    <input
                      value={form[`od_${key}` as keyof typeof form] as string}
                      onChange={(e) => set(`od_${key}` as keyof typeof emptyForm, e.target.value)}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-label-sm font-semibold">Œil Gauche (G)</p>
              <div className="grid grid-cols-3 gap-2">
                {vlFields.map(([key, label]) => (
                  <div key={`og-${key}`}>
                    <label className="mb-1 block text-label-sm text-secondary">{label}</label>
                    <input
                      value={form[`og_${key}` as keyof typeof form] as string}
                      onChange={(e) => set(`og_${key}` as keyof typeof emptyForm, e.target.value)}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Vision de près */}
        <div className="rounded-lg border border-outline-variant p-4">
          <p className="mb-3 text-label-md font-semibold uppercase tracking-wide text-primary">
            Vision de près
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-label-sm font-semibold">Œil Droit (D)</p>
              <div className="grid grid-cols-3 gap-2">
                {([
                  ['od_vp_sphere', 'Sphère'],
                  ['od_vp_cylindre', 'Cylindre'],
                  ['od_vp_axe', 'Axe'],
                ] as const).map(([key, label]) => (
                  <div key={key}>
                    <label className="mb-1 block text-label-sm text-secondary">{label}</label>
                    <input value={form[key]} onChange={(e) => set(key, e.target.value)} className={inputClass} />
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <label className="mb-1 block text-label-sm text-secondary">Addition (OD)</label>
                <input
                  value={form.od_addition}
                  onChange={(e) => set('od_addition', e.target.value)}
                  className={inputClass}
                  placeholder="+0.00"
                />
              </div>
            </div>
            <div>
              <p className="mb-2 text-label-sm font-semibold">Œil Gauche (G)</p>
              <div className="grid grid-cols-3 gap-2">
                {([
                  ['og_vp_sphere', 'Sphère'],
                  ['og_vp_cylindre', 'Cylindre'],
                  ['og_vp_axe', 'Axe'],
                ] as const).map(([key, label]) => (
                  <div key={key}>
                    <label className="mb-1 block text-label-sm text-secondary">{label}</label>
                    <input value={form[key]} onChange={(e) => set(key, e.target.value)} className={inputClass} />
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <label className="mb-1 block text-label-sm text-secondary">Addition (OG)</label>
                <input
                  value={form.og_addition}
                  onChange={(e) => set('og_addition', e.target.value)}
                  className={inputClass}
                  placeholder="+0.00"
                />
              </div>
            </div>
          </div>
        </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-label-sm text-secondary">Distance interpupillaire</label>
            <input
              value={form.distance_interpupillaire}
              onChange={(e) => set('distance_interpupillaire', e.target.value)}
              className={inputClass}
              placeholder="Ex : 62 mm"
            />
          </div>
          <div>
            <p className="mb-2 text-label-sm font-semibold text-secondary">Type de foyer</p>
            <div className="space-y-2">
              {FOYER_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-body-sm">
                  <input
                    type="radio"
                    name="type_foyer"
                    checked={form.type_foyer === opt.value}
                    onChange={() => set('type_foyer', opt.value)}
                    className="accent-primary"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-label-sm font-semibold text-secondary">Traitements</p>
            <div className="space-y-2">
              {TRAITEMENT_OPTIONS.map((label) => (
                <label key={label} className="flex cursor-pointer items-center gap-2 text-body-sm">
                  <input
                    type="checkbox"
                    checked={form.traitements.includes(label)}
                    onChange={() => toggleTraitement(label)}
                    className="accent-primary"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex min-h-24 flex-1 flex-col">
          <label className="mb-1 block text-label-sm text-secondary">Correction / consignes</label>
          <textarea
            value={form.correction}
            onChange={(e) => set('correction', e.target.value)}
            placeholder="Ex : Port permanent..."
            className={`${inputClass} min-h-24 flex-1 resize-y`}
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
