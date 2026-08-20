import { useState } from 'react'
import type { MedEntry, VisitEntry, WeightEntry } from '../types'
import { shortDate, todayISO } from '../lib/date'
import { EmptyHint, Field, Sheet } from './ui'

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
    <Sheet open={open} title="称一次体重" onClose={onClose}>
      <div className="space-y-4">
        <Field label="哪天称的">
          <input
            type="date"
            className="field"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>
        <Field label="多少公斤">
          <input
            type="number"
            step="0.01"
            min="0"
            className="field"
            value={kg}
            onChange={(e) => setKg(e.target.value)}
            placeholder="比如：4.2"
            autoFocus
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
            disabled={!kg || Number(kg) <= 0}
          >
            记下来
          </button>
        </div>
      </div>
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
    <ul className="mt-3 space-y-1.5">
      {sorted.map((w) => (
        <li
          key={w.id}
          className="group flex items-center justify-between gap-3 rounded-xl bg-cream-50 px-3 py-2 text-sm"
        >
          <span className="text-cocoa-400">{shortDate(w.date)}</span>
          <span className="font-bold text-cocoa-800">{w.kg} kg</span>
          <button
            type="button"
            onClick={() => onDelete(w.id)}
            aria-label={`删除 ${shortDate(w.date)} 的记录`}
            className="rounded-full px-1.5 text-cocoa-400 opacity-60 transition
              hover:text-berry-500 focus:opacity-100 group-hover:opacity-100"
          >
            🗑
          </button>
        </li>
      ))}
    </ul>
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
    <Sheet open={open} title="记一次用药" onClose={onClose}>
      <div className="space-y-4">
        <Field label="药名">
          <input
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="比如：拜有利"
            autoFocus
          />
        </Field>
        <Field label="怎么吃">
          <input
            className="field"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="比如：每天半片，早上"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="从哪天开始">
            <input
              type="date"
              className="field"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Field>
          <Field label="到哪天停" hint="还在吃就留空">
            <input
              type="date"
              className="field"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Field>
        </div>
        <Field label="备注">
          <input
            className="field"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="有什么反应、医生怎么说"
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
            disabled={!name.trim()}
          >
            记下来
          </button>
        </div>
      </div>
    </Sheet>
  )
}

export function MedList({
  entries,
  onDelete,
}: {
  entries: MedEntry[]
  onDelete: (id: string) => void
}) {
  const sorted = [...entries].sort((a, b) => b.startDate.localeCompare(a.startDate))
  if (sorted.length === 0) {
    return <EmptyHint emoji="💊" title="还没有用药记录" hint="吃过什么药、吃了多久，下次看病医生会问" />
  }
  return (
    <ul className="space-y-2">
      {sorted.map((m) => {
        const ongoing = !m.endDate
        return (
          <li
            key={m.id}
            className="group flex items-start justify-between gap-3 rounded-2xl border-2 border-cream-200 bg-cream-50 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 font-bold text-cocoa-800">
                <span>
                  <span className="mr-1.5" aria-hidden="true">
                    💊
                  </span>
                  {m.name}
                </span>
                {ongoing ? (
                  <span className="chip bg-mint-300/40 text-mint-700">还在吃</span>
                ) : null}
              </p>
              {m.dosage ? <p className="text-sm text-cocoa-600">{m.dosage}</p> : null}
              <p className="text-xs text-cocoa-400">
                {shortDate(m.startDate)}
                {m.endDate ? ` 到 ${shortDate(m.endDate)}` : ' 起'}
              </p>
              {m.note ? <p className="mt-1 text-sm text-cocoa-600">{m.note}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => onDelete(m.id)}
              aria-label={`删除 ${m.name}`}
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
    <Sheet open={open} title="记一次看病" onClose={onClose}>
      <div className="space-y-4">
        <Field label="哪天去的">
          <input
            type="date"
            className="field"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>
        <Field label="哪家医院">
          <input
            className="field"
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
            placeholder="医院名字"
          />
        </Field>
        <Field label="医生说了什么" hint="下次换医院时，这段最有用">
          <textarea
            className="field min-h-[92px] resize-y"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="诊断结果、注意事项、要复查吗"
          />
        </Field>
        <Field label="其他">
          <input
            className="field"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="花了多少钱、做了什么检查"
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
            disabled={!diagnosis.trim()}
          >
            记下来
          </button>
        </div>
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
      <EmptyHint
        emoji="🏥"
        title="还没有就诊记录"
        hint="把医生说的话记下来，换医院时不用凭记忆复述"
      />
    )
  }
  return (
    <ul className="space-y-2">
      {sorted.map((v) => (
        <li
          key={v.id}
          className="group rounded-2xl border-2 border-cream-200 bg-cream-50 px-4 py-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-bold text-cocoa-800">
                <span className="mr-1.5" aria-hidden="true">
                  🏥
                </span>
                {shortDate(v.date)}
                {v.hospital ? ` · ${v.hospital}` : ''}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-cocoa-600">{v.diagnosis}</p>
              {v.note ? <p className="mt-1 text-xs text-cocoa-400">{v.note}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => onDelete(v.id)}
              aria-label={`删除 ${shortDate(v.date)} 的就诊记录`}
              className="shrink-0 rounded-full px-2 py-1 text-cocoa-400 opacity-60 transition
                hover:bg-berry-300/30 hover:text-berry-500 focus:opacity-100 group-hover:opacity-100"
            >
              🗑
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
