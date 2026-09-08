import type { ReactNode } from 'react'
import { mockStore } from '@/api/mock/dataStore'

const LOGO_SRC = '/logo-kahydara.jpg'

export type PrintMetaColumn = {
  title: string
  lines: ReactNode[]
}

type PrintDocumentHeaderProps = {
  /** Titre du document (ex. Ordonnance ophtalmologique) */
  title: string
  /** Référence affichée en haut à droite (n° dossier, n° facture…) */
  documentRef?: string
  /** Date d'émission */
  date?: string
  /** Message sous le nom de la société */
  message?: string
  /** Colonnes type facture : Patient / Détails / Médecin */
  columns?: [PrintMetaColumn, PrintMetaColumn, PrintMetaColumn]
}

/**
 * En-tête d'impression calqué sur un modèle de facture :
 * logo centré, infos société, bandeau méta, 3 colonnes.
 */
export function PrintDocumentHeader({
  title,
  documentRef,
  date,
  message,
  columns,
}: PrintDocumentHeaderProps) {
  const societe = mockStore.referentiels.societe()
  const emission = date
    ? new Date(date).toLocaleDateString('fr-FR')
    : new Date().toLocaleDateString('fr-FR')

  return (
    <header className="print-sheet-header mb-6 text-[#222]">
      {/* Logo centré */}
      <div className="mb-3 flex flex-col items-center text-center">
        <img
          src={LOGO_SRC}
          alt={societe.nom || 'Logo'}
          className="mb-2 h-20 w-auto object-contain print:h-24"
        />
        <p className="text-[11px] leading-snug text-[#555]">
          {[societe.adresse, societe.contact].filter(Boolean).join(' · ')}
        </p>
      </div>

      {/* Titre + méta à droite */}
      <div className="mb-3 flex items-end justify-between gap-4 border-b-[3px] border-[#333] pb-3">
        <div>
          <h1 className="text-lg font-bold text-[#222]">{title}</h1>
        </div>
        <div className="text-right text-sm">
          {documentRef && (
            <p className="font-semibold text-[#222]">{documentRef}</p>
          )}
          <p className="text-[#555]">
            <span className="text-[#888]">Date d&apos;émission</span>
            <br />
            {emission}
          </p>
        </div>
      </div>

      {/* Nom société + message */}
      <div className="mb-5">
        <h2 className="text-2xl font-bold tracking-tight text-[#222]">
          {societe.nom}
        </h2>
        <p className="mt-1 text-sm text-[#666]">
          {message || societe.slogan || 'Votre vision, notre priorité.'}
        </p>
      </div>

      {/* 3 colonnes type facture */}
      {columns && (
        <div className="grid grid-cols-3 gap-4 border-y border-[#ccc] py-4 text-sm">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#888]">
                {col.title}
              </p>
              <div className="space-y-0.5 text-[#333]">
                {col.lines.map((line, i) => (
                  <div key={i} className="leading-snug">
                    {line || '—'}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  )
}

type PrintSheetProps = {
  toolbar: ReactNode
  children: ReactNode
}

/** Conteneur commun des fiches à imprimer (aperçu + print). */
export function PrintSheet({ toolbar, children }: PrintSheetProps) {
  return (
    <div>
      <div className="no-print mb-6">{toolbar}</div>
      <article className="print-sheet mx-auto max-w-200 bg-white p-8 text-[#222] shadow-sm print:max-w-none print:p-0 print:shadow-none">
        {children}
        <footer className="mt-10 flex items-end justify-between border-t border-[#ddd] pt-3 text-[10px] text-[#888]">
          <p>{mockStore.referentiels.societe().nom}</p>
          <p>Page 1</p>
        </footer>
      </article>
    </div>
  )
}

type PrintLinesTableProps = {
  headers: string[]
  rows: Array<{ cells: ReactNode[]; description?: string }>
}

/** Tableau type facture (ARTICLE / QTÉ / …). */
export function PrintLinesTable({ headers, rows }: PrintLinesTableProps) {
  return (
    <table className="mt-6 w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-[#333] text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#666]">
          {headers.map((h) => (
            <th key={h} className="pb-2 pr-3 font-bold">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-[#e5e5e5] align-top">
            {row.cells.map((cell, j) => (
              <td key={j} className="py-3 pr-3">
                {j === 0 && row.description ? (
                  <div>
                    <p className="font-medium text-[#222]">{cell}</p>
                    <p className="mt-0.5 whitespace-pre-wrap text-xs text-[#777]">
                      {row.description}
                    </p>
                  </div>
                ) : (
                  cell
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

type PrintSignatureProps = {
  name?: string
  role?: string
}

export function PrintSignature({
  name = 'Médecin',
  role = 'Ophtalmologiste',
}: PrintSignatureProps) {
  return (
    <div className="mt-12 text-right">
      <p className="text-sm font-medium text-[#333]">{name || 'Médecin'}</p>
      <p className="text-xs text-[#777]">{role}</p>
      <div className="ml-auto mt-8 h-12 w-40 border-b border-[#999]" />
      <p className="mt-1 text-[10px] uppercase tracking-wider text-[#999]">Signature</p>
    </div>
  )
}
