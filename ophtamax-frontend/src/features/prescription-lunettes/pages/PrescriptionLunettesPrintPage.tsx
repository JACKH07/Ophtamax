import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { mockStore } from '@/api/mock/dataStore'
import type { PrescriptionLunettes } from '@/api/types/entities'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PrintSheet } from '@/components/common/PrintDocumentHeader'
import { fetchPrescriptionLunettes } from '@/features/prescription-lunettes/services/prescriptionLunettesService'
import { PATHS } from '@/routes/paths'

const LOGO_SRC = '/logo-kahydara.jpg'

function AxisDiagram({ side }: { side: 'D' | 'G' }) {
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 110" className="h-24 w-full max-w-55" aria-hidden>
        {/* Arc type ordonnance optique : 180° — 90° — 0° */}
        <polyline
          fill="none"
          stroke="#1e3a5f"
          strokeWidth="2.5"
          points="20,85 20,55 100,20 180,55 180,85"
        />
        <line x1="20" y1="85" x2="40" y2="85" stroke="#1e3a5f" strokeWidth="2" />
        <line x1="160" y1="85" x2="180" y2="85" stroke="#1e3a5f" strokeWidth="2" />
        <text x="8" y="100" fontSize="11" fill="#1e3a5f">
          180°
        </text>
        <text x="88" y="14" fontSize="11" fill="#1e3a5f">
          90°
        </text>
        <text x="168" y="100" fontSize="11" fill="#1e3a5f">
          0°
        </text>
      </svg>
      <p className="mt-1 text-2xl font-bold text-[#1e3a5f]">{side}</p>
    </div>
  )
}

function Check({ checked, label }: { checked: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-[#222]">
      <span
        className={`inline-flex h-4 w-4 items-center justify-center border-2 border-[#1e3a5f] text-[10px] font-bold ${
          checked ? 'bg-[#1e3a5f] text-white' : 'bg-white'
        }`}
      >
        {checked ? '✓' : ''}
      </span>
      {label}
    </div>
  )
}

function cell(v?: string) {
  return v && v.trim() ? v : ''
}

function vpSphere(item: PrescriptionLunettes, side: 'od' | 'og') {
  const dedicated = side === 'od' ? item.od_vp_sphere : item.og_vp_sphere
  if (dedicated?.trim()) return dedicated
  const addition = side === 'od' ? item.od_addition : item.og_addition
  return addition?.trim() ? addition : ''
}

function OrdonnanceLunettesBody({ item }: { item: PrescriptionLunettes }) {
  const societe = mockStore.referentiels.societe()
  const dateLabel = new Date(item.date).toLocaleDateString('fr-FR')
  const foyer = (item.type_foyer || '').toLowerCase()
  const traitements = item.traitements ?? []

  const isSimple =
    foyer === 'simple' ||
    (!foyer && /unifocal|simple/i.test(item.type_verre || ''))
  const isDouble =
    foyer === 'double' || /bifocal|double/i.test(item.type_verre || '')
  const isProgressif =
    foyer === 'progressif' || /progressif/i.test(item.type_verre || '')

  return (
    <div className="ordonnance-lunettes text-[#1a1a1a]">
      {/* En-tête : logo centré + infos cabinet */}
      <div className="mb-2 flex flex-col items-center text-center">
        <img
          src={LOGO_SRC}
          alt={societe.nom}
          className="mb-2 h-16 w-auto object-contain print:h-20"
        />
        <p className="text-xl font-bold tracking-wide text-[#1e3a5f]">{societe.nom}</p>
        {societe.slogan && (
          <p className="text-sm italic text-[#555]">{societe.slogan}</p>
        )}
        <p className="mt-1 text-xs leading-relaxed text-[#444]">
          {[societe.adresse, societe.contact].filter(Boolean).join(' · ')}
        </p>
      </div>

      <p className="mb-4 text-right text-sm text-[#333]">
        Abidjan, le {dateLabel}
      </p>

      <h1 className="mb-4 text-center text-2xl font-bold uppercase tracking-[0.2em] text-[#1e3a5f] underline decoration-2 underline-offset-4">
        Ordonnance
      </h1>

      <p className="mb-6 text-base">
        <span className="font-medium">M/Mme </span>
        <span className="inline-block min-w-[70%] border-b border-[#333] px-2 pb-0.5 font-semibold">
          {item.patient_name?.trim() || '\u00A0'.repeat(40)}
        </span>
      </p>

      {/* Schémas axes D / G */}
      <div className="mb-4 grid grid-cols-2 gap-6 border-y border-[#1e3a5f]/40 py-4">
        <AxisDiagram side="D" />
        <AxisDiagram side="G" />
      </div>

      {/* Tableau VL / VP */}
      <table className="mb-6 w-full border-collapse border-2 border-[#1e3a5f] text-center text-xs">
        <thead>
          <tr className="bg-[#1e3a5f]/5">
            <th className="border border-[#1e3a5f] p-1.5" rowSpan={2} />
            <th className="border border-[#1e3a5f] p-1.5" colSpan={3}>
              D
            </th>
            <th className="border border-[#1e3a5f] p-1.5" colSpan={3}>
              G
            </th>
            <th className="border border-[#1e3a5f] p-1.5 align-middle" rowSpan={2}>
              DISTANCE
              <br />
              interpupillaire
            </th>
          </tr>
          <tr className="bg-[#1e3a5f]/5">
            {(['AXE', 'Cylindre', 'Sphère', 'AXE', 'Cylindre', 'Sphère'] as const).map((h, i) => (
              <th key={`${h}-${i}`} className="border border-[#1e3a5f] p-1.5 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-[#1e3a5f] px-2 py-3 text-left text-[10px] font-bold uppercase">
              Vision
              <br />
              de loin
            </td>
            <td className="border border-[#1e3a5f] p-2">{cell(item.od_axe)}</td>
            <td className="border border-[#1e3a5f] p-2">{cell(item.od_cylindre)}</td>
            <td className="border border-[#1e3a5f] p-2">{cell(item.od_sphere)}</td>
            <td className="border border-[#1e3a5f] p-2">{cell(item.og_axe)}</td>
            <td className="border border-[#1e3a5f] p-2">{cell(item.og_cylindre)}</td>
            <td className="border border-[#1e3a5f] p-2">{cell(item.og_sphere)}</td>
            <td className="border border-[#1e3a5f] p-2 align-middle" rowSpan={2}>
              {cell(item.distance_interpupillaire)}
            </td>
          </tr>
          <tr>
            <td className="border border-[#1e3a5f] px-2 py-3 text-left text-[10px] font-bold uppercase">
              Vision
              <br />
              de près
            </td>
            <td className="border border-[#1e3a5f] p-2">
              {cell(item.od_vp_axe || item.od_axe)}
            </td>
            <td className="border border-[#1e3a5f] p-2">
              {cell(item.od_vp_cylindre || item.od_cylindre)}
            </td>
            <td className="border border-[#1e3a5f] p-2">{vpSphere(item, 'od')}</td>
            <td className="border border-[#1e3a5f] p-2">
              {cell(item.og_vp_axe || item.og_axe)}
            </td>
            <td className="border border-[#1e3a5f] p-2">
              {cell(item.og_vp_cylindre || item.og_cylindre)}
            </td>
            <td className="border border-[#1e3a5f] p-2">{vpSphere(item, 'og')}</td>
          </tr>
        </tbody>
      </table>

      {/* Options foyer / traitements */}
      <div className="mb-8 grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <Check checked={isSimple} label="Simple foyer" />
          <Check checked={isDouble} label="Double foyer" />
          <Check checked={isProgressif} label="Progressif" />
        </div>
        <div className="space-y-2">
          <Check checked={traitements.includes('Protogray')} label="Protogray" />
          <Check checked={traitements.includes('Anti-reflet')} label="Anti-reflet" />
          <Check checked={traitements.includes('Teinte A')} label="Teinte A" />
          <Check checked={traitements.includes('Teinte AB')} label="Teinte AB" />
        </div>
      </div>

      {item.correction && (
        <div className="mb-6 text-sm text-[#444]">
          <p>
            <span className="font-semibold">Consignes : </span>
            {item.correction}
          </p>
        </div>
      )}

      <div className="mt-10 text-right">
        <p className="text-sm font-medium">{item.medecin || 'Médecin'}</p>
        <p className="text-xs text-[#666]">Ophtalmologiste</p>
        <div className="ml-auto mt-8 h-10 w-40 border-b border-[#999]" />
        <p className="mt-1 text-[10px] uppercase tracking-wider text-[#999]">Signature</p>
      </div>
    </div>
  )
}

export function PrescriptionLunettesPrintPage() {
  const { id } = useParams()

  const { data: item } = useQuery({
    queryKey: ['prescription-lunettes', id],
    queryFn: () => fetchPrescriptionLunettes(id!),
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
              to={PATHS.prescriptionLunettes}
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <MaterialIcon name="arrow_back" className="text-[18px]" />
              Retour à la liste
            </Link>
            <Link
              to={`${PATHS.prescriptionLunettes}/${item.id}/modifier`}
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
      <OrdonnanceLunettesBody item={item} />
    </PrintSheet>
  )
}
