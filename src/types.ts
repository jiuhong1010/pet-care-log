export type Species = 'cat' | 'dog' | 'other'

export interface Pet {
  id: string
  name: string
  species: Species
  /** 生日，YYYY-MM-DD；未知时为空串 */
  birthday: string
  /** emoji 头像 */
  avatar: string
  createdAt: string
}

/** 疫苗与驱虫共用一套结构：都是「做过一次，下次该什么时候」 */
export type ShotKind = 'vaccine' | 'deworm'

export interface Shot {
  id: string
  petId: string
  kind: ShotKind
  /** 名称，如「猫三联」「体内驱虫」 */
  name: string
  /** 实际接种/服用日期 YYYY-MM-DD */
  date: string
  /** 间隔天数，用于推算下次日期；0 表示不再重复 */
  intervalDays: number
  /** 医院/品牌等备注 */
  note: string
}

export interface WeightEntry {
  id: string
  petId: string
  date: string
  /** 千克 */
  kg: number
}

export interface MedEntry {
  id: string
  petId: string
  name: string
  dosage: string
  startDate: string
  /** 空串表示仍在用 */
  endDate: string
  note: string
}

export interface VisitEntry {
  id: string
  petId: string
  date: string
  hospital: string
  /** 医生说了什么 —— 这是最常被忘记、也最需要随时调出来的内容 */
  diagnosis: string
  note: string
}

/** 首屏那一句询问的回答，用于验证需求 */
export interface SurveyAnswer {
  /** 现在用什么记录 */
  currentMethod: string
  /** 提交时间 */
  answeredAt: string
}

export interface Feedback {
  id: string
  text: string
  createdAt: string
}

export interface AppData {
  version: number
  pets: Pet[]
  shots: Shot[]
  weights: WeightEntry[]
  meds: MedEntry[]
  visits: VisitEntry[]
  survey: SurveyAnswer | null
  feedbacks: Feedback[]
}

export const EMPTY_DATA: AppData = {
  version: 1,
  pets: [],
  shots: [],
  weights: [],
  meds: [],
  visits: [],
  survey: null,
  feedbacks: [],
}

export const SPECIES_LABEL: Record<Species, string> = {
  cat: '猫',
  dog: '狗',
  other: '其他',
}

/** 常见疫苗与驱虫的预设间隔，作为新增时的默认值（仍可手改） */
export interface ShotPreset {
  name: string
  kind: ShotKind
  intervalDays: number
  species: Species[]
}

export const SHOT_PRESETS: ShotPreset[] = [
  { name: '猫三联', kind: 'vaccine', intervalDays: 365, species: ['cat'] },
  { name: '狂犬疫苗', kind: 'vaccine', intervalDays: 365, species: ['cat', 'dog'] },
  { name: '狗四联', kind: 'vaccine', intervalDays: 365, species: ['dog'] },
  { name: '狗二联', kind: 'vaccine', intervalDays: 365, species: ['dog'] },
  { name: '体内驱虫', kind: 'deworm', intervalDays: 90, species: ['cat', 'dog', 'other'] },
  { name: '体外驱虫', kind: 'deworm', intervalDays: 30, species: ['cat', 'dog', 'other'] },
]
