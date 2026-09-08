import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background font-sans text-on-surface antialiased">
      <div className="no-print">
        <Sidebar />
      </div>
      <div className="ml-sidebar-width flex min-h-screen flex-col print:ml-0">
        <div className="no-print">
          <Header />
        </div>
        <main className="mx-auto flex w-full max-w-container-max-width flex-1 flex-col gap-stack-lg p-margin-page print:max-w-none print:p-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
