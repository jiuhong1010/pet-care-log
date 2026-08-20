import { useState } from 'react'
import { SHOT_PRESETS, type Shot, type ShotKind, type Species } from '../types'
import { computeDue, DUE_STYLE, latestPerName } from '../lib/due'
import { humanizeDueDays, shortDate, todayISO } from '../lib/date'
import { EmptyHint, Field, Sheet } from './ui'

const KIND_LABEL: Record<ShotKind, string> = { vaccine: '疫苗', deworm: '驱虫' }

/** 到期提醒卡：整个产品最该被看见的东西，所以放在最上面且用颜色区分紧急度 */
export function DueList({ shots }: { shots: Shot[] }) {
  const all = latestPerName(shots).map(computeDue)
  const needAttention = all
    .filter((d) => d.status === 'overdue' || d.status === 'soon')
    .sort((a, b) => a.daysLeft - b.daysLeft)

  if (shots.length === 0) {
    return (
      <EmptyHint
        emoji="💉"
        title="还没记过疫苗和驱虫"
        hint="记一次上次打疫苗的日期，之后就不用再自己算了"
      />
    )
  }

  if (needAttention.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-mint-300/25 px-4 py-4">
        <span className="text-2xl" aria-hidden="true">
          ✅
        </span>
        <div>
          <p className="font-hand text-lg text-mint-700">最近都不用操心</p>
          <p className="text-sm text-cocoa-400">30 天内没有要做的事，安心撸猫</p>
        </div>
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {needAttention.map((d) => {
        const style = DUE_STYLE[d.status]
        return (
          <li
            key={d.shot.id}
            className="flex items-center justify-between gap-3 rounded-2xl border-2 border-cream-200 bg-cream-50 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate font-bold text-cocoa-800">
                <span className="mr-1.5" aria-hidden="true">
                  {d.shot.kind === 'vaccine' ? '💉' : '🪱'}
                </span>
                {d.shot.name}
              </p>
              <p className="text-xs text-cocoa-400">
                上次 {shortDate(d.shot.date)}
                {d.nextDate ? ` · 下次 ${shortDate(d.nextDate)}` : ''}
              </p>
            </div>
            <span className={`chip shrink-0 ${style.chip}`}>{humanizeDueDays(d.daysLeft)}</span>
          </li>
        )
      })}
    </ul>
  )
}

export function ShotHistory({
  shots,
  onDelete,
}: {
  shots: Shot[]
  onDelete: (id: string) => void
}) {
  const sorted = [...shots].sort((a, b) => b.date.localeCompare(a.date))
  if (sorted.length === 0) return null

  return (
    <ul className="space-y-2">
      {sorted.map((s) => {
        const due = computeDue(s)
        return (
          <li
            key={s.id}
            className="group flex items-start justify-between gap-3 rounded-2xl border-2 border-cream-200 bg-cream-50 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate font-bold text-cocoa-800">
                <span className="mr-1.5" aria-hidden="true">
                  {s.kind === 'vaccine' ? '💉' : '🪱'}
                </span>
                {s.name}
                <span className="ml-2 text-xs font-normal text-cocoa-400">
                  {KIND_LABEL[s.kind]}
                </span>
              </p>
              <p className="text-xs text-cocoa-400">
                {shortDate(s.date)}
                {due.nextDate ? ` · 下次约 ${shortDate(due.nextDate)}` : ' · 不重复'}
              </p>
              {s.note ? <p className="mt-1 text-sm text-cocoa-600">{s.note}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => onDelete(s.id)}
              aria-label={`删除 ${s.name}`}
              className="shrink-0 rounded-full px-2 py-1 text-cocoa-400 opacity-60 transition
                hover:bg-berry-300/30 hover:text-berry-500 focus:opacity-100 group-hover:opacity-100"
            >
              🗑
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export function ShotFormSheet({
  open,
  species,
  onClose,
  onSubmit,
}: {
  open: boolean
  species: Species
  onClose: () => void
  onSubmit: (input: Omit<Shot, 'id' | 'petId'>) => void
}) {
  const [kind, setKind] = useState<ShotKind>('vaccine')
  const [name, setName] = useState('')
  const [date, setDate] = useState(todayISO())
  const [intervalDays, setIntervalDays] = useState(365)
  const [note, setNote] = useState('')

  const presets = SHOT_PRESETS.filter(
    (p) => p.kind === kind && p.species.includes(species),
  )

  const reset = () => {
    setKind('vaccine')
    setName('')
    setDate(todayISO())
    setIntervalDays(365)
    setNote('')
  }

  const submit = () => {
    const trimmed = name.trim()
    if (!trimmed || !date) return
    onSubmit({ kind, name: trimmed, date, intervalDays, note: note.trim() })
    reset()
    onClose()
  }

  return (
    <Sheet open={open} title="记一次疫苗 / 驱虫" onClose={onClose}>
      <div className="space-y-4">
        <Field label="类型">
          <div className="flex gap-2">
            {(['vaccine', 'deworm'] as ShotKind[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setKind(k)
                  setIntervalDays(k === 'vaccine' ? 365 : 90)
                }}
                aria-pressed={kind === k}
                className={`flex-1 rounded-2xl border-2 py-2 text-sm font-bold transition
                  ${
                    kind === k
                      ? 'border-peach-400 bg-peach-300/30 text-cocoa-800'
                      : 'border-cream-300 bg-cream-50 text-cocoa-600 hover:border-peach-300'
                  }`}
              >
                {k === 'vaccine' ? '💉 疫苗' : '🪱 驱虫'}
              </button>
            ))}
          </div>
        </Field>

        {presets.length > 0 ? (
          <Field label="常见项目" hint="点一下自动填名称和间隔，也可以自己写">
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setName(p.name)
                    setIntervalDays(p.intervalDays)
                  }}
                  className={`chip border-2 transition
                    ${
                      name === p.name
                        ? 'border-peach-400 bg-peach-300/30 text-cocoa-800'
                        : 'border-cream-300 bg-cream-50 text-cocoa-600 hover:border-peach-300'
                    }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </Field>
        ) : null}

        <Field label="名称">
          <input
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="比如：猫三联"
          />
        </Field>

        <Field label="这次是哪天做的">
          <input
            type="date"
            className="field"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>

        <Field label="多久做一次（天）" hint="填 0 表示不用重复，比如幼猫的最后一针">
          <input
            type="number"
            min={0}
            className="field"
            value={intervalDays}
            onChange={(e) => setIntervalDays(Math.max(0, Number(e.target.value) || 0))}
          />
        </Field>

        <Field label="备注">
          <input
            className="field"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="哪家医院、什么牌子"
          />
        </Field>

        <div className="flex gap-2 pt-1">
          <button type="button" className="btn-ghost flex-1" onClick={onClose}>
            取消
          </button>
          <button
            type="button"
            className="btn-primary flex-1"
            onClick={submit}
            disabled={!name.trim() || !date}
          >
            记下来
          </button>
        </div>
      </div>
    </Sheet>
  )
}
