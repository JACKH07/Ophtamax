import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background font-sans text-on-surface antialiased">
      <Sidebar />
      <div className="ml-sidebar-width flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto flex w-full max-w-container-max-width flex-1 flex-col gap-stack-lg p-margin-page">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
