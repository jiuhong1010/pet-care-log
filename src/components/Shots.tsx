import { useState } from 'react'
import { SHOT_PRESETS, type Shot, type ShotKind, type Species } from '../types'
import { computeDue, DUE_STYLE, latestPerName } from '../lib/due'
import { humanizeDueDays, shortDate, todayISO } from '../lib/date'
import { EmptyState, FormRow, Group, Row, Segmented, Sheet } from './ui'
import {
  IconCheck,
  IconClock,
  IconExclamation,
  IconPill,
  IconSyringe,
  IconTrash,
} from './icons'

const KIND_LABEL: Record<ShotKind, string> = { vaccine: '疫苗', deworm: '驱虫' }

function KindIcon({ kind, size = 20 }: { kind: ShotKind; size?: number }) {
  return kind === 'vaccine' ? <IconSyringe size={size} /> : <IconPill size={size} />
}

/** 到期提醒：整个产品唯一的回访理由，所以放最上面 */
export function DueList({ shots }: { shots: Shot[] }) {
  const needAttention = latestPerName(shots)
    .map(computeDue)
    .filter((d) => d.status === 'overdue' || d.status === 'soon')
    .sort((a, b) => a.daysLeft - b.daysLeft)

  if (shots.length === 0) {
    return (
      <EmptyState
        icon={<IconSyringe size={34} />}
        title="还没有疫苗和驱虫记录"
        hint="记一次上次的日期，之后不用再自己算"
      />
    )
  }

  if (needAttention.length === 0) {
    return (
      <div className="row gap-3">
        <span className="text-green">
          <IconCheck size={22} />
        </span>
        <div>
          <p className="text-body text-label">最近没有要做的事</p>
          <p className="text-footnote" style={{ color: 'var(--c-label-2)' }}>
            30 天内都不用操心
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="row-divider">
      {needAttention.map((d) => {
        const style = DUE_STYLE[d.status]
        return (
          <Row
            key={d.shot.id}
            icon={
              d.status === 'overdue' ? (
                <span className="text-red">
                  <IconExclamation size={20} />
                </span>
              ) : (
                <span className="text-orange">
                  <IconClock size={20} />
                </span>
              )
            }
            title={d.shot.name}
            subtitle={`上次 ${shortDate(d.shot.date)}${
              d.nextDate ? ` · 下次 ${shortDate(d.nextDate)}` : ''
            }`}
            trailing={
              <span className={`badge shrink-0 ${style.badge}`}>
                {humanizeDueDays(d.daysLeft)}
              </span>
            }
          />
        )
      })}
    </div>
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
    <div className="row-divider">
      {sorted.map((s) => {
        const due = computeDue(s)
        return (
          <Row
            key={s.id}
            icon={<KindIcon kind={s.kind} />}
            title={
              <>
                {s.name}
                <span className="ml-2 text-footnote" style={{ color: 'var(--c-label-3)' }}>
                  {KIND_LABEL[s.kind]}
                </span>
              </>
            }
            subtitle={
              <>
                {shortDate(s.date)}
                {due.nextDate ? ` · 下次约 ${shortDate(due.nextDate)}` : ' · 不重复'}
                {s.note ? ` · ${s.note}` : ''}
              </>
            }
            trailing={
              <button
                type="button"
                onClick={() => onDelete(s.id)}
                aria-label={`删除 ${s.name}`}
                className="shrink-0 p-1 transition active:opacity-50"
                style={{ color: 'var(--c-label-3)' }}
              >
                <IconTrash size={19} />
              </button>
            }
          />
        )
      })}
    </div>
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

  const presets = SHOT_PRESETS.filter((p) => p.kind === kind && p.species.includes(species))

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
    <Sheet
      open={open}
      title="新增记录"
      onClose={onClose}
      onSubmit={submit}
      submitLabel="保存"
      submitDisabled={!name.trim() || !date}
    >
      <div className="space-y-4">
        <Group>
          <div className="px-gutter py-2.5">
            <Segmented
              value={kind}
              onChange={(k) => {
                setKind(k)
                setIntervalDays(k === 'vaccine' ? 365 : 90)
              }}
              options={[
                { value: 'vaccine' as ShotKind, label: '疫苗' },
                { value: 'deworm' as ShotKind, label: '驱虫' },
              ]}
            />
          </div>
        </Group>

        {presets.length > 0 ? (
          <Group header="常见项目" footer="点一下自动填名称和间隔">
            <div className="flex flex-wrap gap-2 px-gutter py-3">
              {presets.map((p) => {
                const active = name === p.name
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setName(p.name)
                      setIntervalDays(p.intervalDays)
                    }}
                    className={`rounded-full px-3 py-1.5 text-subheadline font-medium
                      transition duration-150 ease-ios active:opacity-60
                      ${active ? 'bg-blue text-white' : 'text-blue'}`}
                    style={active ? undefined : { background: 'var(--c-fill-3)' }}
                  >
                    {p.name}
                  </button>
                )
              })}
            </div>
          </Group>
        ) : null}

        <Group>
          <div className="row-divider">
            <FormRow label="名称">
              <input
                className="field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="比如 猫三联"
              />
            </FormRow>
            <FormRow label="日期">
              <input
                type="date"
                className="field"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </FormRow>
            <FormRow label="间隔">
              <span className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={0}
                  className="field w-20"
                  value={intervalDays}
                  onChange={(e) => setIntervalDays(Math.max(0, Number(e.target.value) || 0))}
                />
                <span className="text-body" style={{ color: 'var(--c-label-2)' }}>
                  天
                </span>
              </span>
            </FormRow>
            <FormRow label="备注">
              <input
                className="field"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="医院、品牌"
              />
            </FormRow>
          </div>
        </Group>

        <p className="px-gutter text-footnote" style={{ color: 'var(--c-label-2)' }}>
          间隔填 0 表示不重复，比如幼猫的最后一针。
        </p>
      </div>
    </Sheet>
  )
}
