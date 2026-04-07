import { useState } from 'react'
import { FolderKanban, Plus, Edit2, Trash2, X, User } from 'lucide-react'
import { Project } from '@/types'
import { projects as initialProjects, departments } from '@/store/data'
import { cn } from '@/lib/utils'

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({ name: '', departmentId: '', manager: '' })
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [filterDept, setFilterDept] = useState<string>('')
  const [searchKeyword, setSearchKeyword] = useState('')

  const filteredProjects = projects.filter((p) => {
    const matchDept = !filterDept || p.departmentId === filterDept
    const matchSearch = !searchKeyword || 
      p.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (p.manager && p.manager.toLowerCase().includes(searchKeyword.toLowerCase()))
    return matchDept && matchSearch
  })

  const getDeptName = (deptId: string) => {
    return departments.find((d) => d.id === deptId)?.shortName || '-'
  }

  const getDeptFullName = (deptId: string) => {
    return departments.find((d) => d.id === deptId)?.name || '-'
  }

  const openAddModal = () => {
    setEditingProject(null)
    setFormData({ name: '', departmentId: departments[0]?.id || '', manager: '' })
    setShowModal(true)
  }

  const openEditModal = (project: Project) => {
    setEditingProject(project)
    setFormData({ name: project.name, departmentId: project.departmentId, manager: project.manager || '' })
    setShowModal(true)
  }

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.departmentId) return

    if (editingProject) {
      setProjects(
        projects.map((p) =>
          p.id === editingProject.id ? { ...p, ...formData } : p
        )
      )
    } else {
      const deptProjects = projects.filter((p) => p.departmentId === formData.departmentId)
      const newProject: Project = {
        id: `p${Date.now()}`,
        name: formData.name,
        departmentId: formData.departmentId,
        order: deptProjects.length + 1,
        createdAt: new Date().toISOString().split('T')[0],
        manager: formData.manager || undefined,
      }
      setProjects([...projects, newProject])
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id))
    setDeleteConfirm(null)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">项目管理</h2>
          <p className="text-slate-500 mt-1 text-sm">管理 {projects.length} 个经营项目</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          新增项目
        </button>
      </div>

      {/* Filters */}
      <div className="card flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="input w-full"
            placeholder="搜索项目名称或项目经理..."
          />
        </div>
        <div className="sm:w-48">
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="input w-full"
          >
            <option value="">全部经营单位</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.shortName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table - 移动端卡片式 */}
      <div className="card p-0">
        {/* 移动端卡片列表 */}
        <div className="lg:hidden divide-y divide-slate-100">
          {filteredProjects.map((project, idx) => (
            <div key={project.id} className="p-3 sm:p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-slate-400 text-xs">{idx + 1}</span>
                    <span className="font-medium text-slate-800 text-sm sm:text-base truncate">{project.name}</span>
                  </div>
                  <span className="badge badge-info text-xs">{getDeptFullName(project.departmentId)}</span>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(project.id)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              {project.manager && (
                <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-500 mt-2">
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  {project.manager}
                </div>
              )}
            </div>
          ))}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <FolderKanban className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>暂无数据</p>
            </div>
          )}
        </div>

        {/* 桌面端表格 */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="table min-w-[600px]">
            <thead>
              <tr>
                <th>序号</th>
                <th>项目名称</th>
                <th>所属经营单位</th>
                <th>项目经理</th>
                <th>创建时间</th>
                <th className="text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project, idx) => (
                <tr key={project.id}>
                  <td>{idx + 1}</td>
                  <td className="font-medium text-slate-800">{project.name}</td>
                  <td>
                    <span className="badge badge-info">{getDeptFullName(project.departmentId)}</span>
                  </td>
                  <td>
                    {project.manager ? (
                      <div className="flex items-center gap-1 text-slate-600">
                        <User className="w-4 h-4" />
                        {project.manager}
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="text-slate-500">{project.createdAt}</td>
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(project)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(project.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - 响应式 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 sticky top-0 bg-white">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800">
                {editingProject ? '编辑项目' : '新增项目'}
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
                <label className="label mb-2 block">项目名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input w-full"
                  placeholder="如：2026年水澄项目"
                />
              </div>
              <div>
                <label className="label mb-2 block">所属经营单位</label>
                <select
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className="input w-full"
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label mb-2 block">项目经理</label>
                <input
                  type="text"
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  className="input w-full"
                  placeholder="如：李晨"
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
              <p className="text-slate-500 text-sm">确定要删除该项目吗？此操作不可撤销。</p>
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
