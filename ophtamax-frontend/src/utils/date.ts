function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function fromDate(date: Date): string {
  if (Number.isNaN(date.getTime())) return ''
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
}

/** Affiche une date au format jj/mm/aaaa. Chaîne vide si la valeur est absente. */
export function formatDateFr(value?: string | Date | null): string {
  if (!value) return ''
  if (value instanceof Date) return fromDate(value)

  const raw = value.trim()
  if (!raw) return ''

  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`

  const fr = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})/)
  if (fr) return `${fr[1]}/${fr[2]}/${fr[3]}`

  return fromDate(new Date(raw)) || raw
}

/** Convertit jj/mm/aaaa ou une date ISO en aaaa-mm-jj. Chaîne vide si incomplet. */
export function toIsoDate(value?: string | null): string {
  if (!value) return ''
  const raw = value.trim()
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`
  const fr = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (fr) return `${fr[3]}-${fr[2]}-${fr[1]}`
  return ''
}

/** Saisie guidée : n'affiche que des chiffres regroupés en jj/mm/aaaa. */
export function maskDateFr(input: string): string {
  const iso = input.trim().match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`
  const digits = input.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

/** Date jj/mm/aaaa, avec l'heure HH:mm si elle est présente. */
export function formatDateTimeFr(value?: string | Date | null): string {
  if (!value) return ''
  const date = formatDateFr(value)
  if (value instanceof Date) {
    return `${date} ${pad(value.getHours())}:${pad(value.getMinutes())}`
  }
  const time = value.match(/(\d{2}):(\d{2})/)
  return time ? `${date} ${time[1]}:${time[2]}` : date
}
