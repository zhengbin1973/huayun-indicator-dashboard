import { useMemo, useState } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Building2,
  FolderKanban,
  ChevronDown,
  ChevronUp,
  User,
} from 'lucide-react'
import { departments, projects, metricTargets, metricActuals, companyInfo, currentMonth } from '@/store/data'
import { formatCurrency, getStatusBadge, getStatusColor } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function DashboardPage() {
  const [showProjectDetails, setShowProjectDetails] = useState(false)
  const [selectedDeptForProjects, setSelectedDeptForProjects] = useState<string>('')

  // 计算经营单位汇总数据
  const departmentMetrics = useMemo(() => {
    return departments.map((dept) => {
      const deptTargets = metricTargets.filter(
        (t) => t.departmentId === dept.id && t.projectId === '' && t.month <= currentMonth
      )
      const deptActuals = metricActuals.filter((a) =>
        deptTargets.some((t) => t.id === a.targetId)
      )

      const getMetricData = (metricId: string) => {
        const targets = deptTargets.filter((t) => t.metricId === metricId)
        const targetSum = targets.reduce((sum, t) => sum + t.targetValue, 0)
        const actualSum = deptActuals
          .filter((a) => targets.some((t) => t.id === a.targetId))
          .reduce((sum, a) => sum + a.actualValue, 0)
        return {
          target: targetSum,
          actual: actualSum,
          rate: targetSum > 0 ? actualSum / targetSum : 0,
        }
      }

      return {
        departmentId: dept.id,
        departmentName: dept.name,
        departmentShortName: dept.shortName,
        ...getMetricData('m1'),
        profit: getMetricData('m2'),
        satisfaction: getMetricData('m3'),
      }
    })
  }, [])

  // 计算各项目指标数据
  const projectMetrics = useMemo(() => {
    const filteredProjects = selectedDeptForProjects
      ? projects.filter(p => p.departmentId === selectedDeptForProjects)
      : projects

    return filteredProjects.map((project) => {
      const projectTargets = metricTargets.filter(
        (t) => t.projectId === project.id && t.month <= currentMonth
      )
      const projectActuals = metricActuals.filter((a) =>
        projectTargets.some((t) => t.id === a.targetId)
      )

      const getMetricData = (metricId: string) => {
        const targets = projectTargets.filter((t) => t.metricId === metricId)
        const targetSum = targets.reduce((sum, t) => sum + t.targetValue, 0)
        const actualSum = projectActuals
          .filter((a) => targets.some((t) => t.id === a.targetId))
          .reduce((sum, a) => sum + a.actualValue, 0)
        return {
          target: targetSum,
          actual: actualSum,
          rate: targetSum > 0 ? actualSum / targetSum : 0,
        }
      }

      const dept = departments.find(d => d.id === project.departmentId)

      return {
        projectId: project.id,
        projectName: project.name,
        departmentId: project.departmentId,
        departmentName: dept?.shortName || '',
        manager: project.manager || '',
        ...getMetricData('m1'),
        profit: getMetricData('m2'),
        satisfaction: getMetricData('m3'),
      }
    })
  }, [selectedDeptForProjects])

  // 计算月度趋势
  const monthlyTrend = useMemo(() => {
    const months = Array.from({ length: currentMonth }, (_, i) => `${i + 1}月`)
    return months.map((month, idx) => {
      const monthNum = idx + 1
      const targets = metricTargets.filter(
        (t) => t.projectId === '' && t.metricId === 'm1' && t.month === monthNum
      )
      const actuals = metricActuals.filter((a) =>
        targets.some((t) => t.id === a.targetId)
      )
      const targetSum = targets.reduce((sum, t) => sum + t.targetValue, 0)
      const actualSum = actuals.reduce((sum, a) => sum + a.actualValue, 0)
      return {
        month,
        target: targetSum,
        actual: actualSum,
      }
    })
  }, [])

  // 统计数据
  const stats = useMemo(() => {
    const allTargets = metricTargets.filter((t) => t.projectId === '')
    const allActuals = metricActuals.filter((a) =>
      allTargets.some((t) => t.id === a.targetId)
    )

    const totalRevenue = allActuals
      .filter((a) => allTargets.find((t) => t.id === a.targetId)?.metricId === 'm1')
      .reduce((sum, a) => sum + a.actualValue, 0)
    const totalRevenueTarget = allTargets
      .filter((t) => t.metricId === 'm1')
      .reduce((sum, t) => sum + t.targetValue, 0)

    const totalProfit = allActuals
      .filter((a) => allTargets.find((t) => t.id === a.targetId)?.metricId === 'm2')
      .reduce((sum, a) => sum + a.actualValue, 0)
    const totalProfitTarget = allTargets
      .filter((t) => t.metricId === 'm2')
      .reduce((sum, t) => sum + t.targetValue, 0)

    // 项目统计
    const projectStats = {
      total: projects.length,
      completed: projectMetrics.filter(p => p.rate >= 1).length,
      near: projectMetrics.filter(p => p.rate >= 0.8 && p.rate < 1).length,
      behind: projectMetrics.filter(p => p.rate < 0.8).length,
    }

    return {
      totalRevenue,
      totalRevenueTarget,
      totalRevenueRate: totalRevenueTarget > 0 ? totalRevenue / totalRevenueTarget : 0,
      totalProfit,
      totalProfitTarget,
      totalProfitRate: totalProfitTarget > 0 ? totalProfit / totalProfitTarget : 0,
      projectCount: projects.length,
      departmentCount: departments.length,
      projectStats,
    }
  }, [projectMetrics])

  // 渲染指标卡片
  const MetricCard = ({
    title,
    icon: Icon,
    target,
    actual,
    rate,
    unit,
    color,
  }: {
    title: string
    icon: any
    target: number
    actual: number
    rate: number
    unit: string
    color: string
  }) => (
    <div className="card">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={cn('w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center', color)}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <span className={cn('text-xs sm:text-sm', getStatusBadge(rate).replace('badge-', 'bg-').replace(/-(.*)/, '/$1').replace('/', '-') + ' px-2 py-0.5 rounded-full')}>
          {rate >= 1 ? '达标' : rate >= 0.8 ? '接近' : '未达标'}
        </span>
      </div>
      <div className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">
        {unit === '万元' ? formatCurrency(actual) : `${actual.toFixed(1)}${unit}`}
      </div>
      <div className="text-xs sm:text-sm text-slate-500 mb-2 sm:mb-3">{title}</div>
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <span className="text-slate-400">
          目标: {unit === '万元' ? formatCurrency(target) : `${target}${unit}`}
        </span>
        <span className={cn('font-medium', getStatusColor(rate))}>
          {rate >= 1 ? '+' : ''}{((rate - 1) * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">经营指标总览</h2>
        <p className="text-slate-500 mt-1 text-sm">
          {companyInfo.year}年 1-{new Date().getMonth() + 1}月 累计数据
        </p>
      </div>

      {/* Stats Grid - 移动端单列，平板双列，桌面四列 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          title="营业收入"
          icon={TrendingUp}
          target={stats.totalRevenueTarget}
          actual={stats.totalRevenue}
          rate={stats.totalRevenueRate}
          unit="万元"
          color="bg-blue-600"
        />
        <MetricCard
          title="毛利润"
          icon={TrendingDown}
          target={stats.totalProfitTarget}
          actual={stats.totalProfit}
          rate={stats.totalProfitRate}
          unit="万元"
          color="bg-emerald-600"
        />
        <div className="card">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-800">{stats.departmentCount}</div>
          <div className="text-xs sm:text-sm text-slate-500 mb-2 sm:mb-3">经营单位</div>
          <div className="text-xs sm:text-sm text-slate-400">
            指标覆盖
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-500 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-800">{stats.projectCount}</div>
          <div className="text-xs sm:text-sm text-slate-500 mb-2 sm:mb-3">在管项目</div>
          <div className="text-xs sm:text-sm text-slate-400">
            达标 {stats.projectStats.completed} 个
          </div>
        </div>
      </div>

      {/* Charts Row - 移动端单列，桌面双列 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* 月度趋势 */}
        <div className="card">
          <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">营业收入月度趋势</h3>
          <div className="h-60 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#64748B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} tickFormatter={(v) => `${v}万`} />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(0)}万元`, '']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="target"
                  name="目标值"
                  stroke="#64748B"
                  fill="url(#colorTarget)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  name="实际值"
                  stroke="#2563EB"
                  fill="url(#colorActual)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 各部门营收对比 */}
        <div className="card">
          <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">各部门营业收入对比</h3>
          <div className="h-60 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentMetrics} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" stroke="#64748B" fontSize={12} tickFormatter={(v) => `${v}万`} />
                <YAxis type="category" dataKey="departmentShortName" stroke="#64748B" fontSize={12} width={60} />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(0)}万元`, '']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
                <Legend />
                <Bar dataKey="target" name="目标值" fill="#CBD5E1" radius={[0, 4, 4, 0]} />
                <Bar dataKey="actual" name="实际值" fill="#2563EB" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 经营单位明细 - 移动端使用卡片式 */}
      <div className="card">
        <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">经营单位指标明细</h3>
        
        {/* 移动端卡片式显示 */}
        <div className="lg:hidden space-y-3">
          {departmentMetrics.map((dept) => (
            <div key={dept.departmentId} className="bg-slate-50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-800 text-sm sm:text-base">{dept.departmentName}</span>
                <span className={cn('text-xs px-2 py-0.5 rounded-full', 
                  dept.rate >= 1 ? 'bg-emerald-100 text-emerald-700' : 
                  dept.rate >= 0.8 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700')}>
                  {dept.rate >= 1 ? '达标' : dept.rate >= 0.8 ? '接近' : '未达标'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400">营收：</span>
                  <span className="text-slate-600">{formatCurrency(dept.actual)}</span>
                  <span className="text-slate-400"> / {formatCurrency(dept.target)}</span>
                </div>
                <div>
                  <span className="text-slate-400">利润：</span>
                  <span className="text-slate-600">{formatCurrency(dept.profit.actual)}</span>
                  <span className="text-slate-400"> / {formatCurrency(dept.profit.target)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 桌面端表格显示 */}
        <div className="hidden lg:block table-container">
          <table className="table">
            <thead>
              <tr>
                <th>经营单位</th>
                <th className="text-right">营业收入目标</th>
                <th className="text-right">营业收入实际</th>
                <th className="text-center">完成率</th>
                <th className="text-right">毛利润目标</th>
                <th className="text-right">毛利润实际</th>
                <th className="text-center">完成率</th>
                <th className="text-center">客户满意度</th>
              </tr>
            </thead>
            <tbody>
              {departmentMetrics.map((dept) => (
                <tr key={dept.departmentId}>
                  <td className="font-medium text-slate-800">{dept.departmentName}</td>
                  <td className="text-right text-slate-600">{formatCurrency(dept.target)}</td>
                  <td className="text-right text-slate-800 font-medium">{formatCurrency(dept.actual)}</td>
                  <td className="text-center">
                    <span className={`badge ${getStatusBadge(dept.rate)}`}>
                      {dept.rate >= 1 ? '达标' : dept.rate >= 0.8 ? '接近' : '未达标'}
                    </span>
                  </td>
                  <td className="text-right text-slate-600">{formatCurrency(dept.profit.target)}</td>
                  <td className="text-right text-slate-800 font-medium">{formatCurrency(dept.profit.actual)}</td>
                  <td className="text-center">
                    <span className={`badge ${getStatusBadge(dept.profit.rate)}`}>
                      {dept.profit.rate >= 1 ? '达标' : dept.profit.rate >= 0.8 ? '接近' : '未达标'}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className={`badge ${getStatusBadge(dept.satisfaction.rate)}`}>
                      {dept.satisfaction.actual.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 项目指标明细 - 可展开 */}
      <div className="card">
        <button
          onClick={() => setShowProjectDetails(!showProjectDetails)}
          className="w-full flex items-center justify-between mb-3 sm:mb-4 cursor-pointer"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <FolderKanban className="w-5 h-5 text-blue-600" />
            <h3 className="text-base sm:text-lg font-semibold text-slate-800">项目指标完成情况</h3>
            <span className="text-xs sm:text-sm text-slate-500">
              (共 {stats.projectStats.total} 个项目)
            </span>
          </div>
          {showProjectDetails ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {showProjectDetails && (
          <>
            {/* 项目筛选 */}
            <div className="mb-3 sm:mb-4">
              <select
                value={selectedDeptForProjects}
                onChange={(e) => setSelectedDeptForProjects(e.target.value)}
                className="input w-full sm:w-64"
              >
                <option value="">全部经营单位</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

            {/* 项目完成情况统计 - 移动端单列 */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
              <div className="bg-emerald-50 rounded-lg p-2 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-emerald-600">{stats.projectStats.completed}</div>
                <div className="text-xs text-emerald-700">达标</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-2 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-amber-600">{stats.projectStats.near}</div>
                <div className="text-xs text-amber-700">接近</div>
              </div>
              <div className="bg-red-50 rounded-lg p-2 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-red-600">{stats.projectStats.behind}</div>
                <div className="text-xs text-red-700">落后</div>
              </div>
            </div>

            {/* 项目表格 - 移动端简化 */}
            <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
              <table className="table min-w-[800px] sm:min-w-full">
                <thead>
                  <tr>
                    <th>项目名称</th>
                    <th>部门/经理</th>
                    <th className="text-right">营收目标</th>
                    <th className="text-center">完成率</th>
                    <th className="text-right">利润目标</th>
                    <th className="text-center">完成率</th>
                    <th className="text-center">满意度</th>
                  </tr>
                </thead>
                <tbody>
                  {projectMetrics.map((project) => (
                    <tr key={project.projectId}>
                      <td className="font-medium text-slate-800 text-sm">{project.projectName}</td>
                      <td>
                        <div className="text-xs sm:text-sm">
                          <span className="badge badge-info text-xs">{project.departmentName}</span>
                          {project.manager && (
                            <div className="flex items-center gap-1 text-slate-500 mt-1">
                              <User className="w-3 h-3 sm:w-4 sm:h-4" />
                              {project.manager}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="text-right text-slate-600 text-sm">
                        {formatCurrency(project.target)}
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className={`badge ${getStatusBadge(project.rate)} text-xs`}>
                            {(project.rate * 100).toFixed(0)}%
                          </span>
                          <span className={`text-xs ${getStatusColor(project.rate)}`}>
                            {project.rate >= 1 ? '✓' : project.rate >= 0.8 ? '○' : '✗'}
                          </span>
                        </div>
                      </td>
                      <td className="text-right text-slate-600 text-sm">
                        {formatCurrency(project.profit.target)}
                      </td>
                      <td className="text-center">
                        <span className={`badge ${getStatusBadge(project.profit.rate)} text-xs`}>
                          {(project.profit.rate * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${getStatusBadge(project.satisfaction.rate)} text-xs`}>
                          {project.satisfaction.actual.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
