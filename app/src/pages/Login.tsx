import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { companyInfo } from '@/store/data'

export function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // 简单的模拟验证
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('auth', JSON.stringify({
        isAuthenticated: true,
        user: { name: '管理员', role: 'admin' },
      }))
      navigate('/dashboard')
    } else {
      setError('用户名或密码错误')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl shadow-lg mb-4">
            <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">指标管理系统</h1>
          <p className="text-blue-200 text-sm sm:text-base">{companyInfo.name}</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6 text-center">用户登录</h2>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Username */}
            <div>
              <label className="label mb-2 block">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input w-full text-base"
                placeholder="请输入用户名"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="label mb-2 block">密码</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full pr-10 text-base"
                  placeholder="请输入密码"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-12 text-base mt-2"
            >
              {loading ? '登录中...' : '登 录'}
            </button>
          </form>

          {/* Demo Hint */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 font-medium mb-1">演示账号</p>
            <p className="text-xs sm:text-sm text-blue-600">用户名：admin</p>
            <p className="text-xs sm:text-sm text-blue-600">密码：admin123</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-blue-200 text-xs sm:text-sm mt-6">
          © {new Date().getFullYear()} {companyInfo.name}
        </p>
      </div>
    </div>
  )
}
