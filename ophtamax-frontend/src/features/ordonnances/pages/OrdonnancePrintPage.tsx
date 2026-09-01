import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { mockStore } from '@/api/mock/dataStore'
import { fetchConsultation } from '@/features/consultations/services/consultationService'
import { PATHS } from '@/routes/paths'

export function OrdonnancePrintPage() {
  const { id } = useParams()
  const { data: c } = useQuery({ queryKey: ['consultation', id], queryFn: () => fetchConsultation(id!), enabled: Boolean(id) })
  const societe = mockStore.referentiels.societe()

  if (!c) return null

  return (
    <div>
      <div className="no-print mb-6 flex justify-between">
        <Link to={PATHS.ordonnances} className="text-primary hover:underline">← Retour</Link>
        <button type="button" onClick={() => window.print()} className="rounded-lg bg-primary px-4 py-2 text-on-primary">Imprimer</button>
      </div>
      <div className="mx-auto max-w-2xl rounded-xl border border-outline-variant bg-white p-8 shadow-sm print:border-0 print:shadow-none">
        <div className="mb-6 border-b border-outline-variant pb-4 text-center">
          <h1 className="text-headline-md font-bold text-primary">{societe.nom}</h1>
          <p className="text-body-sm text-secondary">{societe.adresse} · {societe.contact}</p>
          <p className="mt-2 text-label-md font-semibold uppercase tracking-wider text-on-surface">Ordonnance ophtalmologique</p>
        </div>
        <p className="mb-4 text-body-md"><strong>Patient :</strong> {c.patient_name}</p>
        <p className="mb-4 text-body-md"><strong>Date :</strong> {new Date(c.datecons).toLocaleDateString('fr-FR')}</p>
        <p className="mb-4 text-body-md"><strong>Diagnostic :</strong> {c.diagnostic}</p>
        <div className="mb-6 grid grid-cols-2 gap-4 text-body-sm">
          <div className="rounded-lg bg-surface-container-low p-3">
            <p className="font-semibold text-primary">OD</p>
            <p>Sph: {c.examen_od.sphere} Cyl: {c.examen_od.cylindre} Axe: {c.examen_od.axe}</p>
            <p>Add: {c.examen_od.addition}</p>
          </div>
          <div className="rounded-lg bg-surface-container-low p-3">
            <p className="font-semibold text-secondary">OG</p>
            <p>Sph: {c.examen_og.sphere} Cyl: {c.examen_og.cylindre} Axe: {c.examen_og.axe}</p>
            <p>Add: {c.examen_og.addition}</p>
          </div>
        </div>
        {c.ordonnance && <div className="mb-4"><p className="font-semibold">Traitement</p><p className="whitespace-pre-wrap">{c.ordonnance}</p></div>}
        {c.prescription && <div><p className="font-semibold">Correction optique</p><p className="whitespace-pre-wrap">{c.prescription}</p></div>}
        <div className="mt-12 text-right">
          <p className="text-body-sm text-secondary">Dr Koffi</p>
          <p className="text-label-sm">Ophtalmologiste</p>
        </div>
      </div>
    </div>
  )
}
