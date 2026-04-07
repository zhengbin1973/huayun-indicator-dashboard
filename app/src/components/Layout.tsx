import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

const pageTitles: Record<string, string> = {
  '/dashboard': '数据看板',
  '/departments': '经营单位管理',
  '/projects': '项目管理',
  '/metrics': '指标管理',
}

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const location = useLocation()
  const title = pageTitles[location.pathname] || '指标管理系统'

  const handleLogout = () => {
    localStorage.removeItem('auth')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - 移动端全屏覆盖 */}
      <div className={`
        fixed inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        lg:hidden
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar
          collapsed={false}
          onToggle={() => setMobileSidebarOpen(false)}
          onLogout={handleLogout}
          isMobile
        />
      </div>

      {/* Desktop Sidebar */}
      <div className={`
        hidden lg:block fixed inset-y-0 left-0 z-40
        transition-all duration-300
        ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}
      `}>
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={handleLogout}
          isMobile={false}
        />
      </div>

      {/* Main Content */}
      <div
        className={`
          transition-all duration-300
          lg:ml-64 lg:${sidebarCollapsed ? 'ml-16' : 'ml-64'}
          min-h-screen flex flex-col
        `}
      >
        <Header
          title={title}
          onMenuClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          userName="管理员"
        />
        <main className="p-3 sm:p-4 lg:p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
