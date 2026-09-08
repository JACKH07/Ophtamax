import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { mockStore } from '@/api/mock/dataStore'
import type { PrescriptionExamen } from '@/api/types/entities'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PrintSheet } from '@/components/common/PrintDocumentHeader'
import { fetchPrescriptionExamen } from '@/features/prescription-examen/services/prescriptionExamenService'
import { PATHS } from '@/routes/paths'

const LOGO_SRC = '/logo-kahydara.jpg'

function dotted(value?: string, min = 28) {
  const v = value?.trim()
  if (v) return v
  return '.'.repeat(min)
}

function patientAgeLabel(dateNais?: string) {
  if (!dateNais) return ''
  const d = new Date(dateNais)
  if (Number.isNaN(d.getTime())) return ''
  const age = Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000))
  return `${d.toLocaleDateString('fr-FR')}${Number.isFinite(age) ? ` (${age} ans)` : ''}`
}

function BulletinExamenBody({ item }: { item: PrescriptionExamen }) {
  const societe = mockStore.referentiels.societe()
  const patient = mockStore.patients.get(item.patient_id)
  const dateLabel = new Date(item.date).toLocaleDateString('fr-FR')
  const sexe =
    patient?.sexe === 'M' ? 'Masculin' : patient?.sexe === 'F' ? 'Féminin' : ''

  return (
    <div className="bulletin-examen text-[#1a1a1a]">
      {/* En-tête type bulletin Kahydara — logo centré */}
      <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-start gap-2 border-b-2 border-[#1e3a5f] pb-3">
        <div className="text-[9px] leading-snug text-[#444]">
          <p className="font-bold uppercase text-[#1e3a5f]">
            {societe.nom || 'Cabinet médical d\'ophtalmologie'}
          </p>
          <p className="mt-0.5 italic">Consultation des maladies des yeux</p>
          <p className="mt-1">{societe.adresse}</p>
          <p>{societe.contact}</p>
        </div>

        <div className="flex flex-col items-center px-2">
          <img
            src={LOGO_SRC}
            alt="Logo"
            className="mb-1 h-16 w-auto object-contain print:h-18"
          />
        </div>

        <div className="text-right text-[9px] leading-snug text-[#444]">
          <p className="font-bold uppercase tracking-wide text-[#1e3a5f]">
            République de Côte d&apos;Ivoire
          </p>
          <p className="italic">Union — Discipline — Travail</p>
        </div>
      </div>

      <p className="mb-5 text-center text-base font-bold uppercase tracking-wide text-[#1e3a5f]">
        Bulletin de :{' '}
        <span className="font-semibold normal-case tracking-normal underline decoration-dotted underline-offset-4">
          {item.bulletin_de || "Demande d'examen"}
        </span>
      </p>

      {/* Identification patient */}
      <div className="mb-5 space-y-2 text-sm">
        <p>
          <span className="font-bold uppercase">Nom et prénoms :</span>{' '}
          <span className="font-semibold">{dotted(item.patient_name, 40)}</span>
        </p>
        <div className="grid grid-cols-3 gap-3">
          <p>
            <span className="font-bold uppercase">Âge :</span>{' '}
            {dotted(patientAgeLabel(patient?.date_nais), 16)}
          </p>
          <p>
            <span className="font-bold uppercase">Sexe :</span> {dotted(sexe, 10)}
          </p>
          <p>
            <span className="font-bold uppercase">Service :</span>{' '}
            {dotted(item.service || patient?.contact, 14)}
          </p>
        </div>
      </div>

      <div className="mb-8 space-y-4 text-sm">
        <div>
          <p className="mb-1 font-bold uppercase">Diagnostic :</p>
          <p className="min-h-8 border-b border-dotted border-[#666] pb-1 whitespace-pre-wrap">
            {item.indication || '\u00A0'}
          </p>
        </div>
        <div>
          <p className="mb-1 font-bold uppercase">Examen demandé :</p>
          <p className="min-h-12 border-b border-dotted border-[#666] pb-1 whitespace-pre-wrap">
            {item.examens || '\u00A0'}
          </p>
        </div>
      </div>

      <div className="mt-10 flex items-end justify-between gap-6">
        <p className="text-sm">
          <span className="font-bold">Date :</span> {dateLabel}
        </p>
        <div className="text-right">
          <p className="text-sm font-semibold">{item.medecin || 'Médecin'}</p>
          <p className="text-xs text-[#555]">Ophtalmologiste</p>
          <p className="mt-1 max-w-48 text-[9px] leading-snug text-[#666]">
            {societe.nom}
          </p>
          <div className="ml-auto mt-8 h-10 w-44 border-b border-[#999]" />
          <p className="mt-1 text-[10px] uppercase tracking-wider text-[#999]">
            Signature / Cachet
          </p>
        </div>
      </div>
    </div>
  )
}

export function PrescriptionExamenPrintPage() {
  const { id } = useParams()

  const { data: item } = useQuery({
    queryKey: ['prescription-examen', id],
    queryFn: () => fetchPrescriptionExamen(id!),
    enabled: Boolean(id),
  })

  if (!item) {
    return <div className="py-12 text-center text-secondary">Chargement...</div>
  }

  return (
    <PrintSheet
      toolbar={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-4">
            <Link
              to={PATHS.prescriptionExamen}
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <MaterialIcon name="arrow_back" className="text-[18px]" />
              Retour à la liste
            </Link>
            <Link
              to={`${PATHS.prescriptionExamen}/${item.id}/modifier`}
              className="text-secondary hover:text-primary hover:underline"
            >
              Modifier
            </Link>
            <Link
              to={`${PATHS.patients}/${item.patient_id}`}
              className="text-secondary hover:text-primary hover:underline"
            >
              Fiche patient
            </Link>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary"
          >
            <MaterialIcon name="print" className="text-[18px]" />
            Imprimer
          </button>
        </div>
      }
    >
      <BulletinExamenBody item={item} />
    </PrintSheet>
  )
}
