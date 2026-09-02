import { useQuery } from '@tanstack/react-query'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { mockStore } from '@/api/mock/dataStore'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { fetchConsultation } from '@/features/consultations/services/consultationService'
import { PATHS } from '@/routes/paths'

export function OrdonnancePrintPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') === 'compte-rendu' ? 'compte-rendu' : 'ordonnance'
  const isCompteRendu = type === 'compte-rendu'

  const { data: c } = useQuery({
    queryKey: ['consultation', id],
    queryFn: () => fetchConsultation(id!),
    enabled: Boolean(id),
  })
  const societe = mockStore.referentiels.societe()

  if (!c) {
    return <div className="py-12 text-center text-secondary">Chargement...</div>
  }

  return (
    <div>
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-4">
          <Link to={`${PATHS.consultations}/${c.id}`} className="flex items-center gap-1 text-primary hover:underline">
            <MaterialIcon name="arrow_back" className="text-[18px]" />
            Retour consultation
          </Link>
          <Link to={`${PATHS.patients}/${c.id_patient}`} className="text-secondary hover:text-primary hover:underline">
            Fiche patient
          </Link>
        </div>
        <div className="flex gap-2">
          <Link
            to={`${PATHS.ordonnances}/${c.id}?type=ordonnance`}
            className={`rounded-lg px-3 py-2 text-label-md ${!isCompteRendu ? 'bg-primary text-on-primary' : 'border border-outline-variant'}`}
          >
            Ordonnance
          </Link>
          <Link
            to={`${PATHS.ordonnances}/${c.id}?type=compte-rendu`}
            className={`rounded-lg px-3 py-2 text-label-md ${isCompteRendu ? 'bg-primary text-on-primary' : 'border border-outline-variant'}`}
          >
            Compte-rendu
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary"
          >
            <MaterialIcon name="print" className="text-[18px]" />
            Imprimer
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-2xl rounded-xl border border-outline-variant bg-white p-8 shadow-sm print:border-0 print:shadow-none">
        <div className="mb-6 border-b border-outline-variant pb-4 text-center">
          <h1 className="text-headline-md font-bold text-primary">{societe.nom}</h1>
          <p className="text-body-sm text-secondary">{societe.adresse} · {societe.contact}</p>
          <p className="mt-2 text-label-md font-semibold uppercase tracking-wider text-on-surface">
            {isCompteRendu ? 'Compte-rendu de consultation' : 'Ordonnance ophtalmologique'}
          </p>
        </div>

        <div className="mb-6 grid gap-2 text-body-md">
          <p><strong>Patient :</strong> {c.patient_name}</p>
          <p><strong>Dossier :</strong> #{c.dossier_numero}</p>
          <p><strong>Date :</strong> {new Date(c.datecons).toLocaleDateString('fr-FR')}</p>
          <p><strong>Diagnostic :</strong> {c.diagnostic || '—'}</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 text-body-sm">
          <div className="rounded-lg bg-surface-container-low p-3">
            <p className="mb-1 font-semibold text-primary">OD</p>
            <p>VL AC : {c.examen_od.vl_avec || '—'}</p>
            <p>Sph {c.examen_od.sphere} / Cyl {c.examen_od.cylindre} / Axe {c.examen_od.axe}°</p>
            {c.examen_od.addition && <p>Add {c.examen_od.addition}</p>}
            <p>PIO {c.examen_od.pio || '—'} mmHg</p>
          </div>
          <div className="rounded-lg bg-surface-container-low p-3">
            <p className="mb-1 font-semibold text-secondary">OG</p>
            <p>VL AC : {c.examen_og.vl_avec || '—'}</p>
            <p>Sph {c.examen_og.sphere} / Cyl {c.examen_og.cylindre} / Axe {c.examen_og.axe}°</p>
            {c.examen_og.addition && <p>Add {c.examen_og.addition}</p>}
            <p>PIO {c.examen_og.pio || '—'} mmHg</p>
          </div>
        </div>

        {isCompteRendu && (
          <>
            <div className="mb-4">
              <p className="font-semibold">Motif &amp; anamnèse</p>
              <p className="whitespace-pre-wrap text-body-sm">{c.motif || '—'}</p>
            </div>
            <div className="mb-4">
              <p className="font-semibold">Conduite à tenir</p>
              <p className="whitespace-pre-wrap text-body-sm">{c.conduite_a_tenir || '—'}</p>
            </div>
          </>
        )}

        {c.ordonnance && (
          <div className="mb-4">
            <p className="font-semibold">Traitement / Ordonnance</p>
            <p className="whitespace-pre-wrap">{c.ordonnance}</p>
          </div>
        )}
        {c.prescription && (
          <div className="mb-4">
            <p className="font-semibold">Correction optique</p>
            <p className="whitespace-pre-wrap">{c.prescription}</p>
          </div>
        )}

        {(c.prochain_rdv_date || c.prochain_rdv_delai) && (
          <p className="mt-4 text-body-sm text-secondary">
            Prochain RDV :{' '}
            {c.prochain_rdv_date
              ? new Date(c.prochain_rdv_date).toLocaleDateString('fr-FR')
              : c.prochain_rdv_delai}
          </p>
        )}

        <div className="mt-12 text-right">
          <p className="text-body-sm text-secondary">Dr Koffi</p>
          <p className="text-label-sm">Ophtalmologiste</p>
        </div>
      </div>
    </div>
  )
}
