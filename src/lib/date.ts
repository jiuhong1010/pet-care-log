/**
 * 日期工具。全部按「本地日历日」计算，不引入时区偏移 —— 疫苗到期只关心哪一天，
 * 用 UTC 或 Date 直接相减会在夏令时/时区边界上差一天。
 */

/** 把 Date 转成本地的 YYYY-MM-DD */
export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayISO(): string {
  return toISODate(new Date())
}

/** 解析 YYYY-MM-DD 为本地零点的 Date；非法输入返回 null */
export function parseISODate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (!m) return null
  const y = Number(m[1])
  const mo = Number(m[2])
  const d = Number(m[3])
  const dt = new Date(y, mo - 1, d)
  // 排除 2 月 30 日这类会被 Date 静默滚动的输入
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null
  return dt
}

export function addDays(iso: string, days: number): string {
  const d = parseISODate(iso)
  if (!d) return iso
  d.setDate(d.getDate() + days)
  return toISODate(d)
}

/** b - a，以天为单位；任一非法返回 0 */
export function daysBetween(a: string, b: string): number {
  const da = parseISODate(a)
  const db = parseISODate(b)
  if (!da || !db) return 0
  // 用两个本地零点的时间戳相减，再四舍五入抵消夏令时造成的 ±1 小时
  return Math.round((db.getTime() - da.getTime()) / 86400000)
}

/** 距今天还有多少天（负数表示已过期） */
export function daysFromToday(iso: string): number {
  return daysBetween(todayISO(), iso)
}

/** 人类可读的相对日期 */
export function humanizeDueDays(days: number): string {
  if (days === 0) return '就是今天'
  if (days === 1) return '明天'
  if (days === -1) return '昨天就该做了'
  if (days > 0) {
    if (days < 30) return `还有 ${days} 天`
    const months = Math.round(days / 30)
    return `还有约 ${months} 个月`
  }
  const overdue = -days
  if (overdue < 30) return `已逾期 ${overdue} 天`
  const months = Math.round(overdue / 30)
  return `已逾期约 ${months} 个月`
}

/** 由生日推算年龄描述 */
export function describeAge(birthday: string): string {
  const d = parseISODate(birthday)
  if (!d) return ''
  const days = daysFromToday(birthday) * -1
  if (days < 0) return ''
  if (days < 31) return `${days} 天`
  const totalMonths = Math.floor(days / 30.44)
  if (totalMonths < 12) return `${totalMonths} 个月`
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  return months === 0 ? `${years} 岁` : `${years} 岁 ${months} 个月`
}

/**
 * 格式化为「3月5日」这类短日期。
 * 不是今年的日期会带上年份 —— 否则「上次 7月1日 · 下次 7月1日」会让人以为是同一天。
 */
export function shortDate(iso: string): string {
  const d = parseISODate(iso)
  if (!d) return iso
  const md = `${d.getMonth() + 1}月${d.getDate()}日`
  const thisYear = new Date().getFullYear()
  return d.getFullYear() === thisYear ? md : `${d.getFullYear()}年${md}`
}

/** 图表轴用的极简日期「7/1」，不带年份以免在窄屏溢出 */
export function axisDate(iso: string): string {
  const d = parseISODate(iso)
  if (!d) return iso
  return `${d.getMonth() + 1}/${d.getDate()}`
}
