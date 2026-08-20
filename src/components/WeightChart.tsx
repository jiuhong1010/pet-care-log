import { useMemo } from 'react'
import { axisDate } from '../lib/date'
import type { WeightEntry } from '../types'
import { EmptyHint } from './ui'

/**
 * 手写的体重折线图。不引图表库是刻意的：只需要一条线 + 圆点，
 * 引 recharts 会让首屏体积翻倍，而这是个要在小红书链接里秒开的页面。
 */
export function WeightChart({ entries }: { entries: WeightEntry[] }) {
  const sorted = useMemo(
    () => [...entries].sort((a, b) => a.date.localeCompare(b.date)),
    [entries],
  )

  if (sorted.length === 0) {
    return <EmptyHint emoji="🎈" title="还没有体重记录" hint="记两次以上就能看出胖了还是瘦了" />
  }

  const W = 320
  const H = 160
  const PAD_X = 12
  const PAD_TOP = 16
  const PAD_BOTTOM = 26

  const kgs = sorted.map((e) => e.kg)
  const maxKg = Math.max(...kgs)
  const minKg = Math.min(...kgs)
  // 上下各留一点余量，且避免所有点相同时除以 0
  const span = maxKg - minKg
  const pad = span === 0 ? Math.max(maxKg * 0.1, 0.2) : span * 0.2
  const top = maxKg + pad
  const bottom = Math.max(minKg - pad, 0)
  const range = top - bottom || 1

  const xOf = (i: number) =>
    sorted.length === 1
      ? W / 2
      : PAD_X + (i * (W - PAD_X * 2)) / (sorted.length - 1)
  const yOf = (kg: number) =>
    PAD_TOP + ((top - kg) / range) * (H - PAD_TOP - PAD_BOTTOM)

  const points = sorted.map((e, i) => ({ x: xOf(i), y: yOf(e.kg), entry: e }))
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath =
    points.length > 1
      ? `${linePath} L${points[points.length - 1].x},${H - PAD_BOTTOM} L${points[0].x},${H - PAD_BOTTOM} Z`
      : ''

  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  const delta = Number((last.kg - first.kg).toFixed(2))

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-40 w-full"
        role="img"
        aria-label={`体重变化图，从 ${first.kg} 公斤到 ${last.kg} 公斤`}
      >
        {areaPath ? <path d={areaPath} fill="rgba(168, 219, 197, 0.28)" /> : null}
        <path
          d={linePath}
          fill="none"
          stroke="#6FBFA0"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p) => (
          <g key={p.entry.id}>
            <circle cx={p.x} cy={p.y} r="4.5" fill="#FFFDFA" stroke="#4A9B7C" strokeWidth="2" />
          </g>
        ))}
        {/* 只标首尾日期，中间点标签在手机上会糊成一团 */}
        <text x={points[0].x} y={H - 8} fontSize="10" fill="#B99A82" textAnchor="start">
          {axisDate(first.date)}
        </text>
        {points.length > 1 ? (
          <text
            x={points[points.length - 1].x}
            y={H - 8}
            fontSize="10"
            fill="#B99A82"
            textAnchor="end"
          >
            {axisDate(last.date)}
          </text>
        ) : null}
      </svg>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
        <span className="chip bg-mint-300/40 text-mint-700">最新 {last.kg} kg</span>
        {sorted.length > 1 ? (
          <span
            className={`chip ${
              delta > 0
                ? 'bg-peach-300/40 text-peach-500'
                : delta < 0
                  ? 'bg-sky-300/40 text-sky-500'
                  : 'bg-cream-300 text-cocoa-600'
            }`}
          >
            {delta > 0 ? `比第一次重了 ${delta} kg` : delta < 0 ? `比第一次轻了 ${-delta} kg` : '和第一次一样'}
          </span>
        ) : null}
      </div>
    </div>
  )
}
