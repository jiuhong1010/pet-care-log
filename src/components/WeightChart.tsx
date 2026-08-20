import { useMemo } from 'react'
import { axisDate } from '../lib/date'
import type { WeightEntry } from '../types'
import { EmptyState } from './ui'
import { UiIcon } from './UiIcon'

/**
 * 手写体重折线图。不引图表库：只需要一条线加圆点，
 * recharts 会让首屏体积翻倍，而这个页面要在链接里秒开。
 * 配色跟随 currentColor / CSS 变量，所以深色模式自动正确。
 */
export function WeightChart({ entries }: { entries: WeightEntry[] }) {
  const sorted = useMemo(
    () => [...entries].sort((a, b) => a.date.localeCompare(b.date)),
    [entries],
  )

  if (sorted.length === 0) {
    return (
      <EmptyState
        icon={<UiIcon name="chart" size={34} weight="regular" />}
        title="还没有体重记录"
        hint="记两次以上就能看出趋势"
      />
    )
  }

  const W = 320
  const H = 150
  const PAD_X = 14
  const PAD_TOP = 14
  const PAD_BOTTOM = 24

  const kgs = sorted.map((e) => e.kg)
  const maxKg = Math.max(...kgs)
  const minKg = Math.min(...kgs)
  const span = maxKg - minKg
  const pad = span === 0 ? Math.max(maxKg * 0.1, 0.2) : span * 0.2
  const top = maxKg + pad
  const bottom = Math.max(minKg - pad, 0)
  const range = top - bottom || 1

  const xOf = (i: number) =>
    sorted.length === 1 ? W / 2 : PAD_X + (i * (W - PAD_X * 2)) / (sorted.length - 1)
  const yOf = (kg: number) => PAD_TOP + ((top - kg) / range) * (H - PAD_TOP - PAD_BOTTOM)

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
    <div className="px-gutter py-3">
      <div className="flex items-baseline gap-2">
        <span className="text-title1 font-semibold tabular-nums text-label">{last.kg}</span>
        <span className="text-subheadline" style={{ color: 'var(--c-label-2)' }}>
          kg
        </span>
        {sorted.length > 1 ? (
          <span
            className={`badge ml-auto ${
              delta > 0
                ? 'bg-orange/12 text-orange'
                : delta < 0
                  ? 'bg-blue/12 text-blue'
                  : 'bg-fill-3'
            }`}
            style={delta === 0 ? { color: 'var(--c-label-2)' } : undefined}
          >
            {delta > 0 ? `＋${delta} kg` : delta < 0 ? `−${-delta} kg` : '无变化'}
          </span>
        ) : null}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-1 h-[150px] w-full text-green"
        role="img"
        aria-label={`体重变化，从 ${first.kg} 公斤到 ${last.kg} 公斤`}
      >
        {areaPath ? <path d={areaPath} fill="currentColor" opacity="0.12" /> : null}
        <path
          d={linePath}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p) => (
          <circle
            key={p.entry.id}
            cx={p.x}
            cy={p.y}
            r="3.5"
            fill="rgb(var(--c-bg-card))"
            stroke="currentColor"
            strokeWidth="2"
          />
        ))}
        <text
          x={points[0].x}
          y={H - 6}
          fontSize="10"
          fill="var(--c-label-2)"
          textAnchor="start"
        >
          {axisDate(first.date)}
        </text>
        {points.length > 1 ? (
          <text
            x={points[points.length - 1].x}
            y={H - 6}
            fontSize="10"
            fill="var(--c-label-2)"
            textAnchor="end"
          >
            {axisDate(last.date)}
          </text>
        ) : null}
      </svg>
    </div>
  )
}
