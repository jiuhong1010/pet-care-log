import { EMPTY_DATA, type AppData } from '../types'

const KEY = 'pet-care-log.v1'

/** 生成 id：优先用 crypto.randomUUID，回退到时间戳+随机数 */
export function newId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/**
 * 读取本地数据。任何异常（隐私模式禁用 storage、JSON 损坏、结构不符）
 * 都退回空数据而不是抛错 —— 用户不该因为一次损坏的写入就打不开页面。
 */
export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...EMPTY_DATA }
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return { ...EMPTY_DATA }
    const d = parsed as Partial<AppData>
    return {
      version: 1,
      pets: Array.isArray(d.pets) ? d.pets : [],
      shots: Array.isArray(d.shots) ? d.shots : [],
      weights: Array.isArray(d.weights) ? d.weights : [],
      meds: Array.isArray(d.meds) ? d.meds : [],
      visits: Array.isArray(d.visits) ? d.visits : [],
      survey: d.survey ?? null,
      feedbacks: Array.isArray(d.feedbacks) ? d.feedbacks : [],
    }
  } catch {
    return { ...EMPTY_DATA }
  }
}

/** 写入本地数据；返回是否成功，便于界面提示「无法保存」 */
export function saveData(data: AppData): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

/** 导出为 JSON 文件下载，作为用户自己的备份手段 */
export function exportData(data: AppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `毛毛档案备份-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
