import { useState } from 'react'
import type { MedEntry, MedicationLog, VisitEntry, WeightEntry } from '../types'
import { shortDate, shortDateTime, todayISO } from '../lib/date'
import { EmptyState, FormRow, Group, Row, Sheet } from './ui'
import { UiIcon } from './UiIcon'

function DeleteButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="icon-action shrink-0 transition active:opacity-50"
      style={{ color: 'var(--c-label-3)' }}
    >
      <UiIcon name="trash" size={19} />
    </button>
  )
}

export function WeightFormSheet({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (input: Omit<WeightEntry, 'id' | 'petId'>) => void
}) {
  const [date, setDate] = useState(todayISO())
  const [kg, setKg] = useState('')

  const submit = () => {
    const num = Number(kg)
    if (!date || !Number.isFinite(num) || num <= 0) return
    onSubmit({ date, kg: Number(num.toFixed(2)) })
    setKg('')
    setDate(todayISO())
    onClose()
  }

  return (
    <Sheet
      open={open}
      title="记录体重"
      onClose={onClose}
      onSubmit={submit}
      submitLabel="保存"
      submitDisabled={!kg || Number(kg) <= 0}
    >
      <Group>
        <div className="row-divider">
          <FormRow label="日期">
            <input
              type="date"
              className="field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormRow>
          <FormRow label="体重">
            <span className="flex items-center gap-1.5">
              <input
                type="number"
                step="0.01"
                min="0"
                className="field w-24"
                value={kg}
                onChange={(e) => setKg(e.target.value)}
                placeholder="4.2"
                autoFocus
              />
              <span className="text-body" style={{ color: 'var(--c-label-2)' }}>
                kg
              </span>
            </span>
          </FormRow>
        </div>
      </Group>
    </Sheet>
  )
}

export function WeightList({
  entries,
  onDelete,
}: {
  entries: WeightEntry[]
  onDelete: (id: string) => void
}) {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8)
  if (sorted.length === 0) return null
  return (
    <div className="row-divider">
      {sorted.map((w) => (
        <Row
          key={w.id}
          title={shortDate(w.date)}
          detail={<span className="tabular-nums">{w.kg} kg</span>}
          trailing={
            <DeleteButton
              onClick={() => onDelete(w.id)}
              label={`删除 ${shortDate(w.date)} 的记录`}
            />
          }
        />
      ))}
    </div>
  )
}

export function MedFormSheet({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (input: Omit<MedEntry, 'id' | 'petId'>) => void
}) {
  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [startDate, setStartDate] = useState(todayISO())
  const [endDate, setEndDate] = useState('')
  const [note, setNote] = useState('')

  const submit = () => {
    const trimmed = name.trim()
    if (!trimmed || !startDate) return
    onSubmit({
      name: trimmed,
      dosage: dosage.trim(),
      startDate,
      endDate,
      note: note.trim(),
    })
    setName('')
    setDosage('')
    setStartDate(todayISO())
    setEndDate('')
    setNote('')
    onClose()
  }

  return (
    <Sheet
      open={open}
      title="记录用药"
      onClose={onClose}
      onSubmit={submit}
      submitLabel="保存"
      submitDisabled={!name.trim()}
    >
      <div className="space-y-4">
        <Group>
          <div className="row-divider">
            <FormRow label="药名">
              <input
                className="field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="必填"
                autoFocus
              />
            </FormRow>
            <FormRow label="用法">
              <input
                className="field"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="每天半片，早上"
              />
            </FormRow>
          </div>
        </Group>

        <Group footer="还在吃就把结束日期留空">
          <div className="row-divider">
            <FormRow label="开始">
              <input
                type="date"
                className="field"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </FormRow>
            <FormRow label="结束">
              <input
                type="date"
                className="field"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </FormRow>
          </div>
        </Group>

        <Group>
          <FormRow label="备注" stacked>
            <input
              className="field-boxed"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="有什么反应、医生怎么说"
            />
          </FormRow>
        </Group>
      </div>
    </Sheet>
  )
}

export function MedList({
  entries,
  logs = [],
  caregiver = '我',
  onCheckIn,
  onDelete,
}: {
  entries: MedEntry[]
  logs?: MedicationLog[]
  caregiver?: string
  onCheckIn?: (med: MedEntry) => void
  onDelete: (id: string) => void
}) {
  const sorted = [...entries].sort((a, b) => b.startDate.localeCompare(a.startDate))
  if (sorted.length === 0) {
    return (
      <EmptyState
        icon={<UiIcon name="pill" size={34} />}
        title="还没有用药记录"
        hint="吃过什么药、吃了多久，下次看病医生会问"
      />
    )
  }
  return (
    <div className="row-divider">
      {sorted.map((m) => {
        const ongoing = !m.endDate
        const last = logs
          .filter((log) => log.medId === m.id && log.status === 'completed')
          .sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0]
        return (
          <Row
            key={m.id}
            icon={<UiIcon name="pill" />}
            title={
              <>
                {m.name}
                {ongoing ? (
                  <span className="badge ml-2 bg-green/12 text-green">在用</span>
                ) : null}
              </>
            }
            subtitle={
              <>
                {m.dosage ? `${m.dosage} · ` : ''}
                {shortDate(m.startDate)}
                {m.endDate ? ` 到 ${shortDate(m.endDate)}` : ' 起'}
                {m.note ? ` · ${m.note}` : ''}
                {ongoing && last ? ` · 上次 ${shortDateTime(last.completedAt)}（${last.caregiver || caregiver}）` : ''}
              </>
            }
            trailing={
              <span className="flex shrink-0 items-center gap-1">
                {ongoing && onCheckIn ? (
                  <button
                    type="button"
                    className="med-checkin"
                    onClick={() => onCheckIn(m)}
                    aria-label={`记录 ${m.name} 已用药`}
                  >
                    <UiIcon name="check" size={15} />
                    <span>已用</span>
                  </button>
                ) : null}
                <DeleteButton onClick={() => onDelete(m.id)} label={`删除 ${m.name}`} />
              </span>
            }
          />
        )
      })}
    </div>
  )
}

export function VisitFormSheet({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (input: Omit<VisitEntry, 'id' | 'petId'>) => void
}) {
  const [date, setDate] = useState(todayISO())
  const [hospital, setHospital] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [note, setNote] = useState('')

  const submit = () => {
    if (!date || !diagnosis.trim()) return
    onSubmit({
      date,
      hospital: hospital.trim(),
      diagnosis: diagnosis.trim(),
      note: note.trim(),
    })
    setDate(todayISO())
    setHospital('')
    setDiagnosis('')
    setNote('')
    onClose()
  }

  return (
    <Sheet
      open={open}
      title="记录就诊"
      onClose={onClose}
      onSubmit={submit}
      submitLabel="保存"
      submitDisabled={!diagnosis.trim()}
    >
      <div className="space-y-4">
        <Group>
          <div className="row-divider">
            <FormRow label="日期">
              <input
                type="date"
                className="field"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </FormRow>
            <FormRow label="医院">
              <input
                className="field"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                placeholder="医院名字"
              />
            </FormRow>
          </div>
        </Group>

        <Group header="医生说了什么" footer="换医院时，这段最有用">
          <FormRow label="诊断" stacked>
            <textarea
              className="field-boxed min-h-[96px] resize-y"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="诊断结果、注意事项、要不要复查"
            />
          </FormRow>
        </Group>

        <Group>
          <FormRow label="其他" stacked>
            <input
              className="field-boxed"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="花了多少钱、做了什么检查"
            />
          </FormRow>
        </Group>
      </div>
    </Sheet>
  )
}

export function VisitList({
  entries,
  onDelete,
}: {
  entries: VisitEntry[]
  onDelete: (id: string) => void
}) {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))
  if (sorted.length === 0) {
    return (
      <EmptyState
        icon={<UiIcon name="medicalKit" size={34} />}
        title="还没有就诊记录"
        hint="把医生说的话记下来，换医院时不用凭记忆复述"
      />
    )
  }
  return (
    <div className="row-divider">
      {sorted.map((v) => (
        <div key={v.id} className="px-gutter py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-body text-label">
                <span className="text-blue">
                  <UiIcon name="medicalKit" size={19} />
                </span>
                {shortDate(v.date)}
                {v.hospital ? (
                  <span style={{ color: 'var(--c-label-2)' }}>{v.hospital}</span>
                ) : null}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-subheadline text-label">
                {v.diagnosis}
              </p>
              {v.note ? (
                <p className="mt-1 text-footnote" style={{ color: 'var(--c-label-2)' }}>
                  {v.note}
                </p>
              ) : null}
            </div>
            <DeleteButton
              onClick={() => onDelete(v.id)}
              label={`删除 ${shortDate(v.date)} 的就诊记录`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
