import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function Layout() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)' }}>
      <Sidebar />
      <div className="lg:ml-60 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-6xl mx-auto page-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
