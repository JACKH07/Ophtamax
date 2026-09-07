import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { mockStore } from '@/api/mock/dataStore'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { fetchPatient } from '@/features/patients/services/patientService'
import { usePermissions } from '@/hooks/usePermissions'
import { PATHS } from '@/routes/paths'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function PatientDetailPage() {
  const { id } = useParams()
  const { can } = usePermissions()

  const { data: patient, isLoading } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => fetchPatient(id!),
    enabled: Boolean(id),
  })

  const consultations = id ? mockStore.consultations.byPatient(id) : []

  if (isLoading || !patient) {
    return <div className="py-12 text-center text-secondary">Chargement...</div>
  }

  const age = Math.floor((Date.now() - new Date(patient.date_nais).getTime()) / (365.25 * 24 * 3600 * 1000))

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title={`${patient.prenom} ${patient.nom}`}
        subtitle={`${age} ans · ${patient.sexe === 'M' ? 'Homme' : 'Femme'} · ${patient.contact}`}
        actions={
          <div className="flex gap-2">
            {can('consultations.write') && (
              <Link to={`${PATHS.consultations}/nouvelle?patient=${patient.id}`} className="flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-label-md text-primary hover:bg-primary/5">
                <MaterialIcon name="medical_services" className="text-[18px]" />
                Nouvelle consultation
              </Link>
            )}
            {can('patients.edit') && (
              <Link to={`${PATHS.patients}/${patient.id}/modifier`} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary">
                <MaterialIcon name="edit" className="text-[18px]" />
                Modifier
              </Link>
            )}
          </div>
        }
      />

      <div className="grid gap-gutter lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <h3 className="mb-4 text-headline-sm font-semibold text-on-surface">Informations</h3>
            <dl className="space-y-3 text-body-sm">
              <div><dt className="text-label-sm text-secondary">Date de naissance</dt><dd className="font-medium">{formatDate(patient.date_nais)}</dd></div>
              <div><dt className="text-label-sm text-secondary">Profession</dt><dd className="font-medium">{patient.profession}</dd></div>
              <div><dt className="text-label-sm text-secondary">Assurance</dt><dd>{patient.assurance ? <StatusBadge label={patient.assurance} /> : '—'}</dd></div>
              <div><dt className="text-label-sm text-secondary">Antécédents</dt><dd className="font-medium">{patient.antecedents || 'Aucun'}</dd></div>
            </dl>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
            <div className="border-b border-outline-variant px-5 py-4">
              <h3 className="text-headline-sm font-semibold text-on-surface">Historique des consultations</h3>
            </div>
            {consultations.length === 0 ? (
              <p className="px-5 py-8 text-center text-secondary">Aucune consultation enregistrée</p>
            ) : (
              <ul className="divide-y divide-outline-variant">
                {consultations.map((c) => (
                  <li key={c.id} className="flex items-center justify-between px-5 py-4 hover:bg-surface-container-low/50">
                    <div>
                      <p className="font-medium text-on-surface">{c.diagnostic || 'Consultation'}</p>
                      <p className="text-label-sm text-secondary">{formatDate(c.datecons)}</p>
                    </div>
                    <Link to={`${PATHS.consultations}/${c.id}`} className="text-label-md text-primary hover:underline">Voir</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
