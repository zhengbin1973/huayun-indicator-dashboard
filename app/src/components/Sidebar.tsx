import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { companyInfo } from '@/store/data'

const menuItems = [
  { path: '/dashboard', label: '数据看板', icon: LayoutDashboard },
  { path: '/departments', label: '经营单位管理', icon: Building2 },
  { path: '/projects', label: '项目管理', icon: FolderKanban },
  { path: '/metrics', label: '指标管理', icon: TrendingUp },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  onLogout: () => void
  isMobile?: boolean
}

export function Sidebar({ collapsed, onToggle, onLogout, isMobile = false }: SidebarProps) {
  const location = useLocation()

  return (
    <aside
      className={cn(
        'h-full bg-slate-900 text-white flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        isMobile && 'w-72'
      )}
    >
      {/* Logo */}
      <div className="h-14 sm:h-16 flex items-center px-3 sm:px-4 border-b border-slate-700">
        <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="font-semibold text-sm truncate">华云电力</div>
              <div className="text-xs text-slate-400 truncate hidden sm:block">指标管理系统</div>
            </div>
          )}
        </div>
        {isMobile && (
          <button
            onClick={onToggle}
            className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer ml-auto"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        )}
      </div>

      {/* Company Name - 桌面端显示 */}
      {!collapsed && !isMobile && (
        <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-slate-700">
          <div className="text-xs text-slate-400 truncate">{companyInfo.name}</div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-3 sm:py-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={isMobile ? onToggle : undefined}
              className={cn(
                'flex items-center gap-3 mx-2 sm:mx-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700 p-2">
        <button
          onClick={onLogout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors cursor-pointer',
            'text-slate-300 hover:bg-slate-800 hover:text-white'
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">退出登录</span>}
        </button>
        {!isMobile && (
          <button
            onClick={onToggle}
            className={cn(
              'flex items-center gap-3 w-full mt-1 px-3 py-2.5 rounded-lg transition-colors cursor-pointer',
              'text-slate-400 hover:bg-slate-800 hover:text-white'
            )}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 flex-shrink-0" />
            ) : (
              <ChevronLeft className="w-5 h-5 flex-shrink-0" />
            )}
            {!collapsed && <span className="text-sm">收起</span>}
          </button>
        )}
      </div>
    </aside>
  )
}
