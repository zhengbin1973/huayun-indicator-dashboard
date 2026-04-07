import { User, Bell, Menu } from 'lucide-react'
import { companyInfo } from '@/store/data'

interface HeaderProps {
  title: string
  onMenuClick: () => void
  userName: string
}

export function Header({ title, onMenuClick, userName }: HeaderProps) {
  return (
    <header className="h-14 sm:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-4 lg:px-6">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg cursor-pointer flex-shrink-0"
        >
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-base sm:text-lg font-semibold text-slate-800 truncate">{title}</h1>
        <span className="text-xs sm:text-sm text-slate-400 hidden md:inline flex-shrink-0">
          {companyInfo.year}年
        </span>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="p-2 hover:bg-slate-100 rounded-lg cursor-pointer relative hidden sm:block">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-slate-700">{userName}</div>
            <div className="text-xs text-slate-400">管理员</div>
          </div>
        </div>
      </div>
    </header>
  )
}
