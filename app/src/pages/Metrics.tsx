import { useState, useMemo } from 'react'
import { TrendingUp, Edit2, X, Check, Plus, Trash2, TrendingDown, Users, Target } from 'lucide-react'
import { departments, projects, metrics as initialMetrics, metricTargets as initialTargets, metricActuals as initialActuals, currentYear, currentMonth } from '@/store/data'
import { formatCurrency, getStatusBadge } from '@/lib/utils'
import { Metric } from '@/types'
import { cn } from '@/lib/utils'

type MetricView = 'department' | 'project'
type TabView = 'data' | 'config'

export function MetricsPage() {
  const [view, setView] = useState<MetricView>('department')
  const [tabView, setTabView] = useState<TabView>('data')
  const [selectedDept, setSelectedDept] = useState<string>('')
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [editingCell, setEditingCell] = useState<{ type: 'target' | 'actual'; id: string } | null>(null)
  const [editValue, setEditValue] = useState('')
  const [metricTargets, setMetricTargets] = useState(initialTargets)
  const [metricActuals, setMetricActuals] = useState(initialActuals)
  const [metricList, setMetricList] = useState<Metric[]>(initialMetrics)
  
  // 指标配置相关状态
  const [showMetricModal, setShowMetricModal] = useState(false)
  const [editingMetric, setEditingMetric] = useState<Metric | null>(null)
  const [metricForm, setMetricForm] = useState({ name: '', unit: '', higherIsBetter: true })
  const [deleteMetricConfirm, setDeleteMetricConfirm] = useState<string | null>(null)

  const months = Array.from({ length: currentMonth }, (_, i) => i + 1)

  // 筛选后的数据
  const filteredTargets = useMemo(() => {
    return metricTargets.filter((t) => {
      if (view === 'department') {
        const matchDept = !selectedDept || t.departmentId === selectedDept
        return matchDept && t.projectId === ''
      } else {
        const matchDept = !selectedDept || t.departmentId === selectedDept
        const matchProject = !selectedProject || t.projectId === selectedProject
        return matchDept && matchProject && t.projectId !== ''
      }
    })
  }, [metricTargets, view, selectedDept, selectedProject])

  const getTargets = (itemId: string, metricId: string) => {
    return filteredTargets.filter((t) => {
      if (view === 'department') return t.departmentId === itemId && t.metricId === metricId
      return t.projectId === itemId && t.metricId === metricId
    })
  }

  const getActual = (targetId: string) => {
    return metricActuals.find((a) => a.targetId === targetId)
  }

  const handleEdit = (type: 'target' | 'actual', id: string, currentValue: number) => {
    setEditingCell({ type, id })
    setEditValue(currentValue.toString())
  }

  const handleSave = () => {
    if (!editingCell) return
    const value = parseFloat(editValue)
    if (isNaN(value)) return

    if (editingCell.type === 'target') {
      setMetricTargets(
        metricTargets.map((t) =>
          t.id === editingCell.id ? { ...t, targetValue: value } : t
        )
      )
    } else {
      const existing = metricActuals.find((a) => a.targetId === editingCell.id)
      if (existing) {
        setMetricActuals(
          metricActuals.map((a) =>
            a.targetId === editingCell.id ? { ...a, actualValue: value, updatedAt: new Date().toISOString().split('T')[0] } : a
          )
        )
      }
    }
    setEditingCell(null)
  }

  const items = view === 'department'
    ? departments.filter((d) => !selectedDept || d.id === selectedDept)
    : projects.filter((p) => {
        const matchDept = !selectedDept || p.departmentId === selectedDept
        const matchProject = !selectedProject || p.id === selectedProject
        return matchDept && matchProject
      })

  const getItemName = (item: any) => {
    return view === 'department' ? item.name : item.name
  }

  const getItemDept = (item: any) => {
    if (view === 'department') return ''
    return departments.find((d) => d.id === item.departmentId)?.shortName || ''
  }

  // 指标配置相关函数
  const openAddMetric = () => {
    setEditingMetric(null)
    setMetricForm({ name: '', unit: '万元', higherIsBetter: true })
    setShowMetricModal(true)
  }

  const openEditMetric = (metric: Metric) => {
    setEditingMetric(metric)
    setMetricForm({ name: metric.name, unit: metric.unit, higherIsBetter: metric.higherIsBetter })
    setShowMetricModal(true)
  }

  const handleMetricSubmit = () => {
    if (!metricForm.name.trim()) return

    if (editingMetric) {
      setMetricList(metricList.map(m => 
        m.id === editingMetric.id 
          ? { ...m, ...metricForm }
          : m
      ))
    } else {
      const newMetric: Metric = {
        id: `m${Date.now()}`,
        ...metricForm
      }
      setMetricList([...metricList, newMetric])
    }
    setShowMetricModal(false)
  }

  const handleDeleteMetric = (id: string) => {
    setMetricList(metricList.filter(m => m.id !== id))
    setMetricTargets(metricTargets.filter(t => t.metricId !== id))
    setMetricActuals(metricActuals.filter(a => {
      const target = metricTargets.find(t => t.id === a.targetId)
      return target?.metricId !== id
    }))
    setDeleteMetricConfirm(null)
  }

  const getMetricIcon = (index: number) => {
    const icons = [TrendingUp, TrendingDown, Users, Target]
    return icons[index % icons.length]
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">指标管理</h2>
          <p className="text-slate-500 mt-1 text-sm">编辑指标目标值与实际完成值</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setTabView('data'); setView('department') }}
            className={cn(
              'px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer',
              tabView === 'data'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            数据管理
          </button>
          <button
            onClick={() => setTabView('config')}
            className={cn(
              'px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer',
              tabView === 'config'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            指标配置
          </button>
        </div>
      </div>

      {/* 指标配置页面 */}
      {tabView === 'config' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex justify-end">
            <button onClick={openAddMetric} className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              新增指标
            </button>
          </div>

          {/* 指标列表 - 移动端单列，桌面多列 */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {metricList.map((metric, index) => {
              const Icon = getMetricIcon(index)
              return (
                <div key={metric.id} className="card">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditMetric(metric)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4 text-slate-500" />
                      </button>
                      <button
                        onClick={() => setDeleteMetricConfirm(metric.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-800 text-sm sm:text-base lg:text-lg mb-2">{metric.name}</h3>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-slate-500">
                    <div className="flex justify-between">
                      <span>单位：</span>
                      <span className="text-slate-700">{metric.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>性质：</span>
                      <span className="text-slate-700">
                        {metric.higherIsBetter ? '越高越好' : '越低越好'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {metricList.length === 0 && (
            <div className="card text-center py-8 sm:py-12">
              <Target className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-sm sm:text-base">暂无指标，请点击右上角添加</p>
            </div>
          )}
        </div>
      )}

      {/* 数据管理页面 */}
      {tabView === 'data' && (
        <>
          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setView('department')}
              className={cn(
                'px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer',
                view === 'department'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              经营单位
            </button>
            <button
              onClick={() => setView('project')}
              className={cn(
                'px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer',
                view === 'project'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              项目
            </button>
          </div>

          {/* Filters */}
          <div className="card flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="sm:w-48">
              <select
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value)
                  if (view === 'project') setSelectedProject('')
                }}
                className="input w-full"
              >
                <option value="">全部经营单位</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            {view === 'project' && (
              <div className="sm:w-48">
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="input w-full"
                >
                  <option value="">全部项目</option>
                  {projects
                    .filter((p) => !selectedDept || p.departmentId === selectedDept)
                    .map((proj) => (
                      <option key={proj.id} value={proj.id}>{proj.name}</option>
                    ))}
                </select>
              </div>
            )}
          </div>

          {/* Metric Tables - 移动端水平滚动 */}
          <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
            <div className="min-w-[800px] sm:min-w-0">
              {metricList.map((metric, index) => {
                const Icon = getMetricIcon(index)
                return (
                  <div key={metric.id} className="card mb-4">
                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 text-sm sm:text-base">{metric.name}</h3>
                        <p className="text-xs sm:text-sm text-slate-500">单位：{metric.unit}</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
                      <table className="table min-w-[600px]">
                        <thead>
                          <tr>
                            <th className="w-40">{view === 'department' ? '经营单位' : '项目'}</th>
                            {months.map((m) => (
                              <th key={m} colSpan={3} className="text-center border-x border-slate-200 text-xs sm:text-sm">
                                {currentYear}年{m}月
                              </th>
                            ))}
                          </tr>
                          <tr>
                            <th></th>
                            {months.map((m) => (
                              <th key={m} className="text-center text-xs text-slate-500">目标</th>
                            ))}
                            {months.map((m) => (
                              <th key={`a-${m}`} className="text-center text-xs text-slate-500">实际</th>
                            ))}
                            {months.map((m) => (
                              <th key={`r-${m}`} className="text-center text-xs text-slate-500">完成率</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item) => {
                            const targets = getTargets(view === 'department' ? item.id : item.id, metric.id)
                            return (
                              <tr key={item.id}>
                                <td className="font-medium text-slate-800 text-sm">
                                  <div className="truncate max-w-[120px]">{getItemName(item)}</div>
                                  {view === 'project' && (
                                    <div className="text-xs text-slate-400">{getItemDept(item)}</div>
                                  )}
                                </td>
                                {months.map((m) => {
                                  const target = targets.find((t) => t.month === m)
                                  const actual = target ? getActual(target.id) : null
                                  const rate = target && actual && target.targetValue > 0
                                    ? actual.actualValue / target.targetValue : 0

                                  return (
                                    <>
                                      <td key={`t-${m}`} className="text-center text-xs sm:text-sm">
                                        {target ? (
                                          editingCell?.type === 'target' && editingCell.id === target.id ? (
                                            <div className="flex items-center justify-center gap-1">
                                              <input
                                                type="number"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="input w-16 sm:w-20 text-center py-1 text-xs sm:text-sm"
                                                autoFocus
                                              />
                                              <button
                                                onClick={handleSave}
                                                className="p-1 text-emerald-600 cursor-pointer"
                                              >
                                                <Check className="w-4 h-4" />
                                              </button>
                                              <button
                                                onClick={() => setEditingCell(null)}
                                                className="p-1 text-slate-400 cursor-pointer"
                                              >
                                                <X className="w-4 h-4" />
                                              </button>
                                            </div>
                                          ) : (
                                            <button
                                              onClick={() => handleEdit('target', target.id, target.targetValue)}
                                              className="hover:bg-slate-100 px-1 sm:px-2 py-1 rounded cursor-pointer"
                                            >
                                              {metric.unit === '%' ? `${target.targetValue}%` : formatCurrency(target.targetValue)}
                                            </button>
                                          )
                                        ) : '-'}
                                      </td>
                                      <td key={`a-${m}`} className="text-center text-xs sm:text-sm">
                                        {target && actual ? (
                                          editingCell?.type === 'actual' && editingCell.id === target.id ? (
                                            <div className="flex items-center justify-center gap-1">
                                              <input
                                                type="number"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="input w-16 sm:w-20 text-center py-1 text-xs sm:text-sm"
                                                autoFocus
                                              />
                                              <button
                                                onClick={handleSave}
                                                className="p-1 text-emerald-600 cursor-pointer"
                                              >
                                                <Check className="w-4 h-4" />
                                              </button>
                                              <button
                                                onClick={() => setEditingCell(null)}
                                                className="p-1 text-slate-400 cursor-pointer"
                                              >
                                                <X className="w-4 h-4" />
                                              </button>
                                            </div>
                                          ) : (
                                            <button
                                              onClick={() => handleEdit('actual', target.id, actual.actualValue)}
                                              className="hover:bg-slate-100 px-1 sm:px-2 py-1 rounded cursor-pointer font-medium"
                                            >
                                              {metric.unit === '%' ? `${actual.actualValue.toFixed(1)}%` : formatCurrency(actual.actualValue)}
                                            </button>
                                          )
                                        ) : '-'}
                                      </td>
                                      <td key={`r-${m}`} className="text-center">
                                        {rate > 0 && (
                                          <span className={`badge ${getStatusBadge(rate)} text-xs`}>
                                            {(rate * 100).toFixed(0)}%
                                          </span>
                                        )}
                                      </td>
                                    </>
                                  )
                                })}
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tips */}
          <div className="card bg-blue-50 border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2 text-sm sm:text-base">使用说明</h4>
            <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
              <li>• 点击目标值或实际值可直接编辑</li>
              <li>• 完成率自动计算，颜色表示达标状态</li>
              <li>• 绿色表示达标（≥100%），黄色表示接近（80%-100%），红色表示未达标（&lt;80%）</li>
            </ul>
          </div>
        </>
      )}

      {/* 指标配置弹窗 - 响应式 */}
      {showMetricModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 sticky top-0 bg-white">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800">
                {editingMetric ? '编辑指标' : '新增指标'}
              </h3>
              <button
                onClick={() => setShowMetricModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="label mb-2 block">指标名称</label>
                <input
                  type="text"
                  value={metricForm.name}
                  onChange={(e) => setMetricForm({ ...metricForm, name: e.target.value })}
                  className="input w-full"
                  placeholder="如：营业收入"
                />
              </div>
              <div>
                <label className="label mb-2 block">单位</label>
                <select
                  value={metricForm.unit}
                  onChange={(e) => setMetricForm({ ...metricForm, unit: e.target.value })}
                  className="input w-full"
                >
                  <option value="万元">万元</option>
                  <option value="%">百分比 (%)</option>
                  <option value="次">次数</option>
                  <option value="人">人数</option>
                </select>
              </div>
              <div>
                <label className="label mb-2 block">指标性质</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={metricForm.higherIsBetter}
                      onChange={() => setMetricForm({ ...metricForm, higherIsBetter: true })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-slate-700">越高越好</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!metricForm.higherIsBetter}
                      onChange={() => setMetricForm({ ...metricForm, higherIsBetter: false })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-slate-700">越低越好</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t border-slate-200 sticky bottom-0 bg-white">
              <button onClick={() => setShowMetricModal(false)} className="btn-secondary flex-1">
                取消
              </button>
              <button onClick={handleMetricSubmit} className="btn-primary flex-1">
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 删除指标确认 */}
      {deleteMetricConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">确认删除指标</h3>
              <p className="text-slate-500 text-sm">确定要删除该指标吗？此操作将同时删除所有相关的目标值和实际值数据，且不可撤销。</p>
            </div>
            <div className="flex gap-3 p-4 border-t border-slate-200">
              <button onClick={() => setDeleteMetricConfirm(null)} className="btn-secondary flex-1">
                取消
              </button>
              <button onClick={() => handleDeleteMetric(deleteMetricConfirm)} className="btn-primary flex-1 bg-red-600 hover:bg-red-700">
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
