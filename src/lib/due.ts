import { daysFromToday, addDays } from './date'
import type { Shot } from '../types'

export type DueStatus = 'overdue' | 'soon' | 'later' | 'none'

export interface DueInfo {
  shot: Shot
  /** 下次应做的日期；不重复的项为 null */
  nextDate: string | null
  /** 距今天的天数，负数为逾期 */
  daysLeft: number
  status: DueStatus
}

/** 30 天内算「快到了」 */
const SOON_WINDOW_DAYS = 30

export function computeDue(shot: Shot): DueInfo {
  if (shot.intervalDays <= 0) {
    return { shot, nextDate: null, daysLeft: 0, status: 'none' }
  }
  const nextDate = addDays(shot.date, shot.intervalDays)
  const daysLeft = daysFromToday(nextDate)
  const status: DueStatus =
    daysLeft < 0 ? 'overdue' : daysLeft <= SOON_WINDOW_DAYS ? 'soon' : 'later'
  return { shot, nextDate, daysLeft, status }
}

/**
 * 同一个名称的项目可能记了多次（去年打过、今年又打过），
 * 到期提醒只应该看最近那一次，否则会一直显示去年的逾期。
 */
export function latestPerName(shots: Shot[]): Shot[] {
  const byKey = new Map<string, Shot>()
  for (const s of shots) {
    const key = `${s.kind}::${s.name}`
    const prev = byKey.get(key)
    if (!prev || s.date > prev.date) byKey.set(key, s)
  }
  return [...byKey.values()]
}

/** 需要提醒的项目，按紧急程度排序 */
export function upcomingDues(shots: Shot[]): DueInfo[] {
  return latestPerName(shots)
    .map(computeDue)
    .filter((d) => d.status === 'overdue' || d.status === 'soon')
    .sort((a, b) => a.daysLeft - b.daysLeft)
}

export const DUE_STYLE: Record<DueStatus, { chip: string; text: string }> = {
  overdue: { chip: 'bg-berry-300/40 text-berry-500', text: 'text-berry-500' },
  soon: { chip: 'bg-peach-300/40 text-peach-500', text: 'text-peach-500' },
  later: { chip: 'bg-mint-300/40 text-mint-700', text: 'text-mint-700' },
  none: { chip: 'bg-cream-300 text-cocoa-600', text: 'text-cocoa-600' },
}
