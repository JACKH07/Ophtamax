import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from '@/components/guards/ProtectedRoute'
import { RoleGuard } from '@/components/guards/RoleGuard'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { ForbiddenPage } from '@/pages/ForbiddenPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
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
              <Route path={PATHS.patients} element={<PlaceholderPage title="Patients" />} />
              <Route path={`${PATHS.patients}/nouveau`} element={<PlaceholderPage title="Nouveau patient" />} />
            </Route>

            <Route element={<RoleGuard pathPrefix={PATHS.agenda} />}>
              <Route path={PATHS.agenda} element={<PlaceholderPage title="Agenda" />} />
            </Route>

            <Route element={<RoleGuard pathPrefix={PATHS.consultations} />}>
              <Route path={PATHS.consultations} element={<PlaceholderPage title="Consultations" />} />
            </Route>

            <Route element={<RoleGuard pathPrefix={PATHS.ordonnances} />}>
              <Route path={PATHS.ordonnances} element={<PlaceholderPage title="Ordonnances" />} />
            </Route>

            <Route element={<RoleGuard pathPrefix={PATHS.facturation} />}>
              <Route path={PATHS.facturation} element={<PlaceholderPage title="Facturation" />} />
            </Route>

            <Route element={<RoleGuard pathPrefix={PATHS.statistiques} />}>
              <Route path={PATHS.statistiques} element={<PlaceholderPage title="Statistiques" />} />
            </Route>

            <Route element={<RoleGuard pathPrefix={PATHS.parametres} />}>
              <Route path={PATHS.parametres} element={<PlaceholderPage title="Paramètres" />} />
            </Route>

            <Route element={<RoleGuard pathPrefix={PATHS.utilisateurs} />}>
              <Route path={PATHS.utilisateurs} element={<PlaceholderPage title="Utilisateurs" />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={PATHS.dashboard} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
