import { useState } from 'react'
import { Plus, Edit2, Trash2, X, FolderKanban, Building2 } from 'lucide-react'
import { Department } from '@/types'
import { departments as initialDepartments, projects } from '@/store/data'
import { cn } from '@/lib/utils'

export function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)
  const [showModal, setShowModal] = useState(false)
  const [editingDept, setEditingDept] = useState<Department | null>(null)
  const [formData, setFormData] = useState({ name: '', shortName: '' })
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const openAddModal = () => {
    setEditingDept(null)
    setFormData({ name: '', shortName: '' })
    setShowModal(true)
  }

  const openEditModal = (dept: Department) => {
    setEditingDept(dept)
    setFormData({ name: dept.name, shortName: dept.shortName })
    setShowModal(true)
  }

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.shortName.trim()) return

    if (editingDept) {
      setDepartments(
        departments.map((d) =>
          d.id === editingDept.id ? { ...d, ...formData } : d
        )
      )
    } else {
      const newDept: Department = {
        id: `d${Date.now()}`,
        name: formData.name,
        shortName: formData.shortName,
        order: departments.length + 1,
        createdAt: new Date().toISOString().split('T')[0],
      }
      setDepartments([...departments, newDept])
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    const relatedProjects = projects.filter((p) => p.departmentId === id)
    if (relatedProjects.length > 0) {
      alert(`该部门下有 ${relatedProjects.length} 个项目，无法删除`)
      return
    }
    setDepartments(departments.filter((d) => d.id !== id))
    setDeleteConfirm(null)
  }

  const getProjectCount = (deptId: string) => {
    return projects.filter((p) => p.departmentId === deptId).length
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">经营单位管理</h2>
          <p className="text-slate-500 mt-1 text-sm">管理公司下属四个经营单位</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          新增经营单位
        </button>
      </div>

      {/* Table - 移动端卡片式 */}
      <div className="card p-0">
        {/* 移动端卡片列表 */}
        <div className="lg:hidden divide-y divide-slate-100">
          {departments.map((dept, idx) => (
            <div key={dept.id} className="p-3 sm:p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium text-slate-800 text-sm sm:text-base">{dept.name}</div>
                  <span className="badge badge-info mt-1 text-xs">{dept.shortName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(dept)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4 text-blue-600" />
                  </button>
                  {getProjectCount(dept.id) === 0 && (
                    <button
                      onClick={() => setDeleteConfirm(dept.id)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <FolderKanban className="w-3 h-3 sm:w-4 sm:h-4" />
                  {getProjectCount(dept.id)} 个项目
                </span>
                <span>创建于 {dept.createdAt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 桌面端表格 */}
        <div className="hidden lg:block table-container">
          <table className="table">
            <thead>
              <tr>
                <th>序号</th>
                <th>经营单位名称</th>
                <th>简称</th>
                <th>项目数量</th>
                <th>创建时间</th>
                <th className="text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept, idx) => (
                <tr key={dept.id}>
                  <td>{idx + 1}</td>
                  <td className="font-medium text-slate-800">{dept.name}</td>
                  <td>
                    <span className="badge badge-info">{dept.shortName}</span>
                  </td>
                  <td>
                    <span className="flex items-center gap-1 text-slate-600">
                      <FolderKanban className="w-4 h-4" />
                      {getProjectCount(dept.id)} 个项目
                    </span>
                  </td>
                  <td className="text-slate-500">{dept.createdAt}</td>
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(dept)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      {getProjectCount(dept.id) === 0 && (
                        <button
                          onClick={() => setDeleteConfirm(dept.id)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - 响应式全屏/居中 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 sticky top-0 bg-white">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800">
                {editingDept ? '编辑经营单位' : '新增经营单位'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="label mb-2 block">单位名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input w-full"
                  placeholder="如：楼宇事业部"
                />
              </div>
              <div>
                <label className="label mb-2 block">简称</label>
                <input
                  type="text"
                  value={formData.shortName}
                  onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                  className="input w-full"
                  placeholder="如：楼宇"
                />
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t border-slate-200 sticky bottom-0 bg-white">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                取消
              </button>
              <button onClick={handleSubmit} className="btn-primary flex-1">
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">确认删除</h3>
              <p className="text-slate-500 text-sm">确定要删除该经营单位吗？此操作不可撤销。</p>
            </div>
            <div className="flex gap-3 p-4 border-t border-slate-200">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1">
                取消
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn-primary flex-1 bg-red-600 hover:bg-red-700">
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
