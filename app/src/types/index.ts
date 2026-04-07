export interface Department {
  id: string
  name: string
  shortName: string
  order: number
  createdAt: string
}

export interface Project {
  id: string
  name: string
  departmentId: string
  order: number
  createdAt: string
  manager?: string
}

export interface Metric {
  id: string
  name: string
  unit: string
  higherIsBetter: boolean
}

export interface MetricTarget {
  id: string
  departmentId: string
  projectId: string
  metricId: string
  year: number
  month: number
  targetValue: number
}

export interface MetricActual {
  id: string
  targetId: string
  actualValue: number
  updatedAt: string
}

export interface DashboardData {
  departmentMetrics: DepartmentMetric[]
  projectMetrics: ProjectMetric[]
  monthlyTrend: MonthlyTrend[]
}

export interface DepartmentMetric {
  departmentId: string
  departmentName: string
  departmentShortName: string
  revenue: { target: number; actual: number; rate: number }
  profit: { target: number; actual: number; rate: number }
  satisfaction: { target: number; actual: number; rate: number }
}

export interface ProjectMetric {
  projectId: string
  projectName: string
  departmentId: string
  departmentName: string
  revenue: { target: number; actual: number; rate: number }
  profit: { target: number; actual: number; rate: number }
  satisfaction: { target: number; actual: number; rate: number }
}

export interface MonthlyTrend {
  month: string
  revenue: { target: number; actual: number }
  profit: { target: number; actual: number }
}

export interface AuthState {
  isAuthenticated: boolean
  user: { name: string; role: string } | null
}
