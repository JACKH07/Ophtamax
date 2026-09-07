import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { deleteUser, fetchUsers } from '@/features/utilisateurs/services/userService'
import { usePermissions } from '@/hooks/usePermissions'

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrateur',
  SEC: 'Secrétaire',
  OPHT: 'Ophtalmologiste',
  ASS: 'Assistant',
  COMPTA: 'Comptable',
}

export function UtilisateursListPage() {
  const { can } = usePermissions()
  const queryClient = useQueryClient()
  const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: fetchUsers })

  const removeMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title="Utilisateurs"
        subtitle="Gestion des comptes et rôles."
        actions={
          <button type="button" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary shadow-sm">
            <MaterialIcon name="person_add" className="text-[18px]" /> Nouvel utilisateur
          </button>
        }
      />
      <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead className="border-b border-outline-variant bg-surface-container-low">
            <tr>
              {['Nom', 'Identifiant', 'Email', 'Rôle', 'Fonction', 'Statut', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-label-md text-on-surface-variant">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {users.map((u) => {
              const label = `${u.prenoms} ${u.nom}`.trim() || u.login_user
              return (
                <tr key={u.id} className="hover:bg-surface-container-low/50">
                  <td className="px-4 py-3 font-medium">{label}</td>
                  <td className="px-4 py-3 text-body-sm">{u.login_user}</td>
                  <td className="px-4 py-3 text-body-sm">{u.email}</td>
                  <td className="px-4 py-3">
                    <StatusBadge label={ROLE_LABELS[u.id_role] ?? u.id_role} variant="primary" />
                  </td>
                  <td className="px-4 py-3 text-body-sm">{u.fonction}</td>
                  <td className="px-4 py-3">
                    <StatusBadge label={u.actif ? 'Actif' : 'Inactif'} variant={u.actif ? 'success' : 'muted'} />
                  </td>
                  <td className="px-4 py-3">
                    {can('users.manage') && (
                      <button
                        type="button"
                        title="Supprimer"
                        disabled={removeMutation.isPending}
                        onClick={() => {
                          if (window.confirm(`Supprimer l'utilisateur « ${label} » ?`)) {
                            removeMutation.mutate(u.id)
                          }
                        }}
                        className="rounded-md p-1.5 text-secondary hover:bg-error-container hover:text-error disabled:opacity-50"
                      >
                        <MaterialIcon name="delete" className="text-[18px]" />
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
