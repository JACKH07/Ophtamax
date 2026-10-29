import { Outlet } from 'react-router-dom'
import { useSessionTimeout } from '@/hooks/useSessionTimeout'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  useSessionTimeout(true)

  return (
    <div className="h-screen overflow-hidden bg-background font-sans text-on-surface antialiased print:h-auto print:overflow-visible">
      <div className="no-print">
        <Sidebar />
      </div>
      <div className="ml-sidebar-width flex h-screen min-h-0 flex-col print:ml-0 print:h-auto">
        <div className="no-print shrink-0">
          <Header />
        </div>
        <main className="mx-auto flex min-h-0 w-full max-w-container-max-width flex-1 flex-col gap-stack-lg overflow-y-auto p-margin-page print:max-w-none print:overflow-visible print:p-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
