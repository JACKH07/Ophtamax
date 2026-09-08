import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from '@/components/guards/ProtectedRoute'
import { RoleGuard } from '@/components/guards/RoleGuard'
import { AgendaPage } from '@/features/agenda/pages/AgendaPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { ConsultationDetailPage } from '@/features/consultations/pages/ConsultationDetailPage'
import { ConsultationDocPrintPage } from '@/features/consultations/pages/ConsultationDocPrintPage'
import { ConsultationFormPage } from '@/features/consultations/pages/ConsultationFormPage'
import { ConsultationsListPage } from '@/features/consultations/pages/ConsultationsListPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { FacturationPage } from '@/features/facturation/pages/FacturationPage'
import { OrdonnanceFormPage } from '@/features/ordonnances/pages/OrdonnanceFormPage'
import { OrdonnancePrintPage } from '@/features/ordonnances/pages/OrdonnancePrintPage'
import { OrdonnancesListPage } from '@/features/ordonnances/pages/OrdonnancesListPage'
import { ParametresPage } from '@/features/parametres/pages/ParametresPage'
import { PatientDetailPage } from '@/features/patients/pages/PatientDetailPage'
import { PatientFormPage } from '@/features/patients/pages/PatientFormPage'
import { PatientsListPage } from '@/features/patients/pages/PatientsListPage'
import { PrescriptionExamenFormPage } from '@/features/prescription-examen/pages/PrescriptionExamenFormPage'
import { PrescriptionExamenListPage } from '@/features/prescription-examen/pages/PrescriptionExamenListPage'
import { PrescriptionExamenPrintPage } from '@/features/prescription-examen/pages/PrescriptionExamenPrintPage'
import { PrescriptionLunettesFormPage } from '@/features/prescription-lunettes/pages/PrescriptionLunettesFormPage'
import { PrescriptionLunettesListPage } from '@/features/prescription-lunettes/pages/PrescriptionLunettesListPage'
import { PrescriptionLunettesPrintPage } from '@/features/prescription-lunettes/pages/PrescriptionLunettesPrintPage'
import { StatistiquesPage } from '@/features/statistiques/pages/StatistiquesPage'
import { UtilisateursListPage } from '@/features/utilisateurs/pages/UtilisateursListPage'
import { ForbiddenPage } from '@/pages/ForbiddenPage'
import { PATHS } from '@/routes/paths'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.login} element={<LoginPage />} />
        <Route path={PATHS.forbidden} element={<ForbiddenPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to={PATHS.dashboard} replace />} />
            <Route path={PATHS.dashboard} element={<DashboardPage />} />

            <Route element={<RoleGuard pathPrefix={PATHS.patients} />}>
              <Route path={PATHS.patients} element={<PatientsListPage />} />
              <Route path={`${PATHS.patients}/nouveau`} element={<PatientFormPage />} />
              <Route path={`${PATHS.patients}/:id/modifier`} element={<PatientFormPage />} />
              <Route path={`${PATHS.patients}/:id`} element={<PatientDetailPage />} />
            </Route>

            <Route element={<RoleGuard pathPrefix={PATHS.agenda} />}>
              <Route path={PATHS.agenda} element={<AgendaPage />} />
            </Route>

            <Route element={<RoleGuard pathPrefix={PATHS.consultations} />}>
              <Route path={PATHS.consultations} element={<Outlet />}>
                <Route index element={<ConsultationsListPage />} />
                <Route path="nouvelle" element={<ConsultationFormPage />} />
                <Route path=":id/modifier" element={<ConsultationFormPage />} />
                <Route path=":id/documents" element={<ConsultationDocPrintPage />} />
                <Route path=":id" element={<ConsultationDetailPage />} />
              </Route>
            </Route>

            <Route element={<RoleGuard pathPrefix={PATHS.ordonnances} />}>
              <Route path={PATHS.ordonnances} element={<OrdonnancesListPage />} />
              <Route path={`${PATHS.ordonnances}/nouvelle`} element={<OrdonnanceFormPage />} />
              <Route path={`${PATHS.ordonnances}/:id/modifier`} element={<OrdonnanceFormPage />} />
              <Route path={`${PATHS.ordonnances}/:id`} element={<OrdonnancePrintPage />} />
            </Route>

            <Route element={<RoleGuard pathPrefix={PATHS.prescriptionExamen} />}>
              <Route path={PATHS.prescriptionExamen} element={<PrescriptionExamenListPage />} />
              <Route path={`${PATHS.prescriptionExamen}/nouvelle`} element={<PrescriptionExamenFormPage />} />
              <Route path={`${PATHS.prescriptionExamen}/:id/modifier`} element={<PrescriptionExamenFormPage />} />
              <Route path={`${PATHS.prescriptionExamen}/:id`} element={<PrescriptionExamenPrintPage />} />
            </Route>

            <Route element={<RoleGuard pathPrefix={PATHS.prescriptionLunettes} />}>
              <Route path={PATHS.prescriptionLunettes} element={<PrescriptionLunettesListPage />} />
              <Route path={`${PATHS.prescriptionLunettes}/nouvelle`} element={<PrescriptionLunettesFormPage />} />
              <Route path={`${PATHS.prescriptionLunettes}/:id/modifier`} element={<PrescriptionLunettesFormPage />} />
              <Route path={`${PATHS.prescriptionLunettes}/:id`} element={<PrescriptionLunettesPrintPage />} />
            </Route>

            <Route element={<RoleGuard pathPrefix={PATHS.facturation} />}>
              <Route path={PATHS.facturation} element={<FacturationPage />} />
            </Route>

            <Route element={<RoleGuard pathPrefix={PATHS.statistiques} />}>
              <Route path={PATHS.statistiques} element={<StatistiquesPage />} />
            </Route>

            <Route element={<RoleGuard pathPrefix={PATHS.parametres} />}>
              <Route path={PATHS.parametres} element={<ParametresPage />} />
            </Route>

            <Route element={<RoleGuard pathPrefix={PATHS.utilisateurs} />}>
              <Route path={PATHS.utilisateurs} element={<UtilisateursListPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={PATHS.dashboard} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
