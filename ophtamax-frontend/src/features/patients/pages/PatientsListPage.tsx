import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { fetchPatients } from '@/features/patients/services/patientService'
import { usePermissions } from '@/hooks/usePermissions'
import { PATHS } from '@/routes/paths'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR')
}

function initials(nom: string, prenom: string) {
  return `${prenom[0] ?? ''}${nom[0] ?? ''}`.toUpperCase()
}

export function PatientsListPage() {
  const [search, setSearch] = useState('')
  const { can } = usePermissions()

  const { data: patients = [], isLoading } = useQuery({
    queryKey: ['patients', search],
    queryFn: () => fetchPatients(search),
  })

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title="Patients"
        subtitle="Gestion du dossier patient et historique des visites."
        actions={
          can('patients.create') ? (
            <Link
              to={`${PATHS.patients}/nouveau`}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-md font-semibold tracking-wide text-on-primary shadow-sm hover:bg-on-primary-fixed-variant"
            >
              <MaterialIcon name="person_add" className="text-[18px]" />
              Nouveau patient
            </Link>
          ) : undefined
        }
      />

      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="mb-1 block text-label-sm text-on-surface-variant">Recherche de patient</label>
            <div className="relative">
              <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nom, contact, date de naissance..."
                className="w-full rounded-lg border border-outline-variant bg-surface py-2 pl-10 pr-4 text-body-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead className="border-b border-outline-variant bg-surface-container-low">
            <tr>
              {['Nom complet', 'Date de naissance', 'Contact', 'Assurance', 'Dernière visite', 'Actions'].map((h) => (
                <th key={h} className={`px-4 py-3 text-label-md font-medium text-on-surface-variant ${h === 'Actions' ? 'text-right' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {isLoading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-secondary">Chargement...</td></tr>
            ) : patients.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-secondary">Aucun patient trouvé</td></tr>
            ) : (
              patients.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-surface-container-low/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-container text-label-sm font-bold text-on-secondary-fixed">
                        {initials(p.nom, p.prenom)}
                      </div>
                      <div>
                        <p className="font-medium text-on-surface">{p.prenom} {p.nom}</p>
                        <p className="text-label-sm text-secondary">{p.sexe === 'M' ? 'Homme' : 'Femme'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-body-sm">{formatDate(p.date_nais)}</td>
                  <td className="px-4 py-3 text-body-sm">{p.contact}</td>
                  <td className="px-4 py-3">
                    {p.assurance ? (
                      <StatusBadge label={p.assurance} variant="muted" />
                    ) : (
                      <span className="text-label-sm text-secondary">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-body-sm">{p.derniere_visite ? formatDate(p.derniere_visite) : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Link to={`${PATHS.patients}/${p.id}`} className="rounded-md p-1.5 text-secondary hover:bg-surface-container-highest hover:text-primary" title="Voir">
                        <MaterialIcon name="visibility" className="text-[18px]" />
                      </Link>
                      {can('patients.edit') && (
                        <Link to={`${PATHS.patients}/${p.id}/modifier`} className="rounded-md p-1.5 text-secondary hover:bg-surface-container-highest hover:text-primary" title="Modifier">
                          <MaterialIcon name="edit" className="text-[18px]" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
