import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { PageHeader } from '@/components/common/PageHeader'
import {
  deletePrescriptionExamen,
  fetchPrescriptionsExamen,
} from '@/features/prescription-examen/services/prescriptionExamenService'
import { PATHS } from '@/routes/paths'

export function PrescriptionExamenListPage() {
  const queryClient = useQueryClient()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data: items = [] } = useQuery({
    queryKey: ['prescriptions-examen'],
    queryFn: fetchPrescriptionsExamen,
  })

  const deleteMutation = useMutation({
    mutationFn: deletePrescriptionExamen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions-examen'] })
      setDeletingId(null)
    },
  })

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title="Prescription examen"
        subtitle="Demandes d'examens complémentaires"
        actions={
          <Link
            to={`${PATHS.prescriptionExamen}/nouvelle`}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-md text-on-primary shadow-sm hover:bg-primary/90"
          >
            <MaterialIcon name="add" className="text-[18px]" />
            Nouvelle prescription
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 ? (
          <p className="col-span-full py-12 text-center text-secondary">
            Aucune prescription examen. Créez-en une depuis ce module.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm"
            >
              <p className="font-semibold text-on-surface">{item.patient_name}</p>
              <p className="text-label-sm text-secondary">
                {new Date(item.date).toLocaleDateString('fr-FR')} · {item.medecin || '—'}
              </p>
              {item.indication && (
                <p className="mt-2 text-body-sm font-medium">{item.indication}</p>
              )}
              <p className="mt-1 line-clamp-3 whitespace-pre-line text-body-sm text-secondary">
                {item.examens}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to={`${PATHS.prescriptionExamen}/${item.id}`}
                  className="flex items-center gap-1 text-label-md text-primary hover:underline"
                >
                  <MaterialIcon name="print" className="text-[16px]" /> Imprimer
                </Link>
                <Link
                  to={`${PATHS.prescriptionExamen}/${item.id}/modifier`}
                  className="flex items-center gap-1 text-label-md text-secondary hover:text-primary hover:underline"
                >
                  Modifier
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setDeletingId(item.id)
                    deleteMutation.mutate(item.id)
                  }}
                  disabled={deleteMutation.isPending && deletingId === item.id}
                  className="flex items-center gap-1 text-label-md text-error hover:underline disabled:opacity-50"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
