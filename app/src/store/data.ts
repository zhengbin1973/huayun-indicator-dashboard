import { Department, Project, Metric, MetricTarget, MetricActual } from '@/types'

// 经营单位数据
export const departments: Department[] = [
  { id: 'd1', name: '经营发展部', shortName: '经营发展', order: 1, createdAt: '2024-01-01' },
  { id: 'd2', name: '楼宇服务事业部', shortName: '楼宇', order: 2, createdAt: '2024-01-01' },
  { id: 'd3', name: '营商服务事业部', shortName: '营商', order: 3, createdAt: '2024-01-01' },
  { id: 'd4', name: '供应链管理分公司', shortName: '供应链', order: 4, createdAt: '2024-01-01' },
]

// 项目数据（来自Excel）
export const projects: Project[] = [
  // 经营发展部 (1个项目)
  { id: 'p1', name: '2026年房屋租赁项目', departmentId: 'd1', order: 1, createdAt: '2024-01-01', manager: '李晨' },
  
  // 楼宇服务事业部 (6个项目)
  { id: 'p2', name: '2026年水澄项目', departmentId: 'd2', order: 1, createdAt: '2024-01-15', manager: '袁俊杰' },
  { id: 'p3', name: '2026年财院项目', departmentId: 'd2', order: 2, createdAt: '2024-01-15', manager: '李婷' },
  { id: 'p4', name: '2026年特迅项目', departmentId: 'd2', order: 3, createdAt: '2024-02-01', manager: '徐艺轩' },
  { id: 'p5', name: '2026年科创中心项目', departmentId: 'd2', order: 4, createdAt: '2024-02-15', manager: '李斌' },
  { id: 'p6', name: '2026年抽蓄及空调项目', departmentId: 'd2', order: 5, createdAt: '2024-03-01', manager: '杨剑' },
  { id: 'p7', name: '2026年超市项目', departmentId: 'd2', order: 6, createdAt: '2024-03-15', manager: '杜楠尔' },
  
  // 营商服务事业部 (7个项目)
  { id: 'p8', name: '2026年档案服务（杭丽金衢项目）', departmentId: 'd3', order: 1, createdAt: '2024-01-10', manager: '周红英' },
  { id: 'p9', name: '2026年档案服务（嘉温舟台甬项目）', departmentId: 'd3', order: 2, createdAt: '2024-01-20', manager: '滕金虎' },
  { id: 'p10', name: '2026年档案服务（绍湖项目）', departmentId: 'd3', order: 3, createdAt: '2024-02-05', manager: '杨雯怡' },
  { id: 'p11', name: '2026年档案服务（库特抽项目）', departmentId: 'd3', order: 4, createdAt: '2024-02-20', manager: '蔡颖颖' },
  { id: 'p12', name: '2026年文印项目', departmentId: 'd3', order: 5, createdAt: '2024-03-05', manager: '宋姗' },
  { id: 'p13', name: '2026年培训项目1', departmentId: 'd3', order: 6, createdAt: '2024-03-10', manager: '傅增云' },
  { id: 'p14', name: '2026年培训项目2', departmentId: 'd3', order: 7, createdAt: '2024-03-15', manager: '吴珍叶' },
  
  // 供应链管理分公司 (4个项目)
  { id: 'p15', name: '2026年疗休养服务项目', departmentId: 'd4', order: 1, createdAt: '2024-01-05', manager: '李薇' },
  { id: 'p16', name: '2026年电商与技术服务项目', departmentId: 'd4', order: 2, createdAt: '2024-01-25', manager: '潘馨' },
  { id: 'p17', name: '2026年商贸、食品及工会服务项目', departmentId: 'd4', order: 3, createdAt: '2024-02-10', manager: '方小武' },
  { id: 'p18', name: '2026年兰慕咖啡项目', departmentId: 'd4', order: 4, createdAt: '2024-02-25', manager: '董至伟' },
]

// 指标定义
export const metrics: Metric[] = [
  { id: 'm1', name: '营业收入', unit: '万元', higherIsBetter: true },
  { id: 'm2', name: '毛利润', unit: '万元', higherIsBetter: true },
  { id: 'm3', name: '客户满意度', unit: '%', higherIsBetter: true },
]

// 2026年各月数据
export const currentYear = 2026
export const currentMonth = 12

// 项目毛利基础档目标（来自Excel，单位：万元）
const projectProfitTargets: Record<string, number> = {
  'p1': 2531,   // 房屋租赁
  'p2': 654,    // 水澄
  'p3': 200,    // 财院
  'p4': 150,    // 特迅
  'p5': 530,    // 科创
  'p6': 100,    // 抽蓄
  'p7': 100,    // 超市
  'p8': 337,    // 档案杭丽
  'p9': 346,    // 档案嘉温
  'p10': 167,   // 档案绍湖
  'p11': 25,    // 档案库特
  'p12': 7,     // 文印
  'p13': 130,   // 培训1
  'p14': 154,   // 培训2
  'p15': 59,    // 疗休养
  'p16': 498,   // 电商
  'p17': 91,    // 商贸
  'p18': 16,    // 兰慕
}

// 部门毛利基础档目标（来自Excel，单位：万元）
const deptProfitTargets: Record<string, number> = {
  'd1': 2531,   // 经营发展部
  'd2': 900,    // 楼宇
  'd3': 1166,   // 营商
  'd4': 664,    // 供应链
}

// 部门满意度目标（来自Excel）
const deptSatisfactionTargets: Record<string, number> = {
  'd2': 89.7,   // 楼宇
  'd3': 83,     // 营商
  'd4': 30,     // 供应链
}

// 项目满意度目标（来自Excel）
const projectSatisfactionTargets: Record<string, number> = {
  'p2': 71,   // 水澄
  'p3': 72,   // 财院
  'p4': 80.5, // 特迅
  'p5': 60,   // 科创
  'p6': 60,   // 抽蓄
  'p7': 66,   // 超市
}

// 月度分配因子（全年累计100%）
const monthFactors: Record<number, number> = {
  1: 0.06,   // 6%
  2: 0.07,   // 7%
  3: 0.08,   // 8%
  4: 0.09,   // 9%
  5: 0.09,   // 9%
  6: 0.10,   // 10%
  7: 0.10,   // 10%
  8: 0.10,   // 10%
  9: 0.10,   // 10%
  10: 0.08,  // 8%
  11: 0.07,  // 7%
  12: 0.06,  // 6%
}

// 生成目标数据
function generateTargetData() {
  const data: MetricTarget[] = []
  
  // 经营单位目标
  for (const dept of departments) {
    const baseProfit = deptProfitTargets[dept.id] || 500
    const baseRevenue = baseProfit * 3.5  // 营收约是毛利的3.5倍
    const satisfaction = deptSatisfactionTargets[dept.id] || 80
    
    for (let month = 1; month <= currentMonth; month++) {
      const monthFactor = monthFactors[month] || 0.08
      data.push(
        { 
          id: `t-${dept.id}-m1-${month}`, 
          departmentId: dept.id, 
          projectId: '', 
          metricId: 'm1', 
          year: currentYear, 
          month, 
          targetValue: Math.round(baseRevenue * monthFactor) 
        },
        { 
          id: `t-${dept.id}-m2-${month}`, 
          departmentId: dept.id, 
          projectId: '', 
          metricId: 'm2', 
          year: currentYear, 
          month, 
          targetValue: Math.round(baseProfit * monthFactor) 
        },
        { 
          id: `t-${dept.id}-m3-${month}`, 
          departmentId: dept.id, 
          projectId: '', 
          metricId: 'm3', 
          year: currentYear, 
          month, 
          targetValue: satisfaction 
        }
      )
    }
  }
  
  // 项目目标
  for (const project of projects) {
    const baseProfit = projectProfitTargets[project.id] || 100
    const baseRevenue = baseProfit * 3.5
    const satisfaction = projectSatisfactionTargets[project.id] || 80
    
    for (let month = 1; month <= currentMonth; month++) {
      const monthFactor = monthFactors[month] || 0.08
      data.push(
        { 
          id: `t-${project.id}-m1-${month}`, 
          departmentId: project.departmentId, 
          projectId: project.id, 
          metricId: 'm1', 
          year: currentYear, 
          month, 
          targetValue: Math.round(baseRevenue * monthFactor) 
        },
        { 
          id: `t-${project.id}-m2-${month}`, 
          departmentId: project.departmentId, 
          projectId: project.id, 
          metricId: 'm2', 
          year: currentYear, 
          month, 
          targetValue: Math.round(baseProfit * monthFactor) 
        },
        { 
          id: `t-${project.id}-m3-${month}`, 
          departmentId: project.departmentId, 
          projectId: project.id, 
          metricId: 'm3', 
          year: currentYear, 
          month, 
          targetValue: satisfaction 
        }
      )
    }
  }
  
  return data
}

export const metricTargets: MetricTarget[] = generateTargetData()

// 实际完成数据（带随机波动，模拟真实情况）
function generateActualData(targets: MetricTarget[]): MetricActual[] {
  return targets.map(t => {
    const baseActual = t.targetValue
    // 模拟实际完成情况：大部分项目达标，部分超额
    const variance = 0.85 + Math.random() * 0.35
    const actualValue = baseActual * variance
    
    return {
      id: `a-${t.id}`,
      targetId: t.id,
      actualValue: Math.round(actualValue * 100) / 100,
      updatedAt: `${currentYear}-${String(t.month).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    }
  })
}

export const metricActuals: MetricActual[] = generateActualData(metricTargets)

// 公司信息
export const companyInfo = {
  name: '浙江华云电力企业服务有限公司',
  year: currentYear,
  totalProjects: projects.length,
  totalDepartments: departments.length,
}
