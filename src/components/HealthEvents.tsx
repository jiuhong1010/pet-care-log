import { useMemo, useState } from 'react'
import type {
  HealthEvent,
  HealthObservation,
  HealthObservationKind,
  HealthObservationSeverity,
  Pet,
  WeightEntry,
  MedEntry,
  MedicationLog,
} from '../types'
import { isoFromLocalDateTime, localDateTimeInputValue, shortDateTime } from '../lib/date'
import { EmptyState, FormRow, Group, Row, Segmented, Sheet } from './ui'
import { UiIcon } from './UiIcon'
import { FeatureIllustration, type FeatureIllustrationName } from './FeatureIllustration'

export const OBSERVATION_LABELS: Record<HealthObservationKind, string> = {
  appetite: '食欲',
  energy: '精神',
  vomiting: '呕吐',
  stool: '排便',
  urination: '排尿',
  breathing: '呼吸',
  pain: '疼痛',
  custom: '其他变化',
}

const SEVERITY_LABELS: Record<HealthObservationSeverity, string> = {
  mild: '有一点',
  moderate: '比较明显',
  severe: '需要尽快处理',
}

const SEVERITY_COLORS: Record<HealthObservationSeverity, string> = {
  mild: 'is-mild',
  moderate: 'is-moderate',
  severe: 'is-severe',
}

function formatDuration(startedAt: string, endedAt = '') {
  const start = new Date(startedAt).getTime()
  const end = endedAt ? new Date(endedAt).getTime() : Date.now()
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return '刚刚开始'
  const hours = Math.floor((end - start) / 3_600_000)
  if (hours < 1) return '不到 1 小时'
  if (hours < 24) return `${hours} 小时`
  const days = Math.floor(hours / 24)
  return `${days} 天${hours % 24 ? ` ${hours % 24} 小时` : ''}`
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export type ObservationDraft = {
  eventMode: 'continue' | 'new'
  title: string
  kind: HealthObservationKind
  label: string
  severity: HealthObservationSeverity
  occurredAt: string
  note: string
  question: string
  files: File[]
}

export function HealthEventComposerSheet({
  open,
  pet,
  activeEvent,
  onClose,
  onSubmit,
}: {
  open: boolean
  pet: Pet
  activeEvent: HealthEvent | null
  onClose: () => void
  onSubmit: (draft: ObservationDraft) => void
}) {
  const [eventMode, setEventMode] = useState<'continue' | 'new'>(activeEvent ? 'continue' : 'new')
  const [title, setTitle] = useState('这次不舒服')
  const [kind, setKind] = useState<HealthObservationKind>('appetite')
  const [severity, setSeverity] = useState<HealthObservationSeverity>('mild')
  const [occurredAt, setOccurredAt] = useState(localDateTimeInputValue())
  const [note, setNote] = useState('')
  const [question, setQuestion] = useState('')
  const [files, setFiles] = useState<File[]>([])

  const reset = () => {
    setEventMode(activeEvent ? 'continue' : 'new')
    setTitle('这次不舒服')
    setKind('appetite')
    setSeverity('mild')
    setOccurredAt(localDateTimeInputValue())
    setNote('')
    setQuestion('')
    setFiles([])
  }

  const submit = () => {
    if (eventMode === 'new' && !title.trim()) return
    onSubmit({
      eventMode,
      title: title.trim() || activeEvent?.title || '这次不舒服',
      kind,
      label: kind === 'custom' ? '其他变化' : OBSERVATION_LABELS[kind],
      severity,
      occurredAt: isoFromLocalDateTime(occurredAt),
      note: note.trim(),
      question: question.trim(),
      files,
    })
    reset()
    onClose()
  }

  return (
    <Sheet
      open={open}
      title="记下刚刚的变化"
      onClose={onClose}
      onSubmit={submit}
      submitLabel="收好这条"
      submitDisabled={(eventMode === 'new' && !title.trim()) || !occurredAt}
    >
      <div className="composer-stack">
        {activeEvent ? (
          <Group header="放进哪一段照护轨迹？" footer="短时间内的变化会自动收进同一件事，减少重复分类。">
            <div className="px-gutter py-3">
              <p className="active-event-reference">当前：{activeEvent.title}</p>
              <Segmented
                value={eventMode}
                onChange={setEventMode}
                options={[
                  { value: 'continue' as const, label: '继续这次观察' },
                  { value: 'new' as const, label: '开始新的一段' },
                ]}
              />
            </div>
          </Group>
        ) : null}

        {eventMode === 'new' ? (
          <Group>
            <FormRow label="这次叫什么" stacked>
              <input
                className="field-boxed"
                value={title}
                maxLength={40}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={`比如：${pet.name}这两天胃口变小`}
                autoFocus
              />
            </FormRow>
          </Group>
        ) : null}

        <Group header="发生了什么？" footer="先记事实，不需要现在判断是什么病。">
          <div className="observation-kind-grid">
            {(Object.keys(OBSERVATION_LABELS) as HealthObservationKind[]).map((option) => {
              const active = option === kind
              return (
                <button
                  key={option}
                  type="button"
                  className={`observation-kind ${active ? 'is-selected' : ''}`}
                  aria-pressed={active}
                  onClick={() => setKind(option)}
                >
                  <span className="observation-kind-mark" aria-hidden="true" />
                  <span>{OBSERVATION_LABELS[option]}</span>
                </button>
              )
            })}
          </div>
        </Group>

        <Group header="程度和时间">
          <div className="row-divider">
            <FormRow label="程度">
              <Segmented
                value={severity}
                onChange={setSeverity}
                options={(Object.keys(SEVERITY_LABELS) as HealthObservationSeverity[]).map((value) => ({
                  value,
                  label: value === 'severe' ? '尽快处理' : SEVERITY_LABELS[value],
                }))}
              />
            </FormRow>
            <FormRow label="发生时间">
              <input
                type="datetime-local"
                className="field"
                value={occurredAt}
                onChange={(event) => setOccurredAt(event.target.value)}
              />
            </FormRow>
          </div>
        </Group>

        <Group>
          <FormRow label="补充一句" stacked>
            <textarea
              className="field-boxed min-h-[92px] resize-y"
              value={note}
              maxLength={500}
              onChange={(event) => setNote(event.target.value)}
              placeholder="比如：晚饭只吃了一半，喝水正常"
            />
          </FormRow>
        </Group>

        <Group header="想问医生什么？" footer="可选。记下当时想到的问题，看诊时不用临时回忆。">
          <FormRow label="问题" stacked>
            <input
              className="field-boxed"
              value={question}
              maxLength={160}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="比如：需要带便便样本吗？"
            />
          </FormRow>
        </Group>

        <Group header="附一张现场照片" footer="照片只放在这台设备的浏览器里，不会上传。">
          <div className="attachment-picker">
            <label className="attachment-button">
              <UiIcon name="plus" size={18} />
              <span>{files.length ? `已选 ${files.length} 张` : '从相册或相机选择'}</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={(event) => {
                  const next = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith('image/'))
                  setFiles(next.slice(0, 4))
                }}
              />
            </label>
            {files.length ? (
              <ul className="attachment-list" aria-label="已选照片">
                {files.map((file) => (
                  <li key={`${file.name}-${file.lastModified}`}>
                    <span className="truncate">{file.name}</span>
                    <span>{formatFileSize(file.size)}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </Group>
      </div>
    </Sheet>
  )
}

export function CareTimeline({
  events,
  observations,
  onRecord,
  onResolve,
}: {
  events: HealthEvent[]
  observations: HealthObservation[]
  onRecord: () => void
  onResolve: (eventId: string) => void
}) {
  const event = events[0]
  const eventObservations = useMemo(
    () =>
      event
        ? observations
            .filter((observation) => observation.eventId === event.id)
            .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
        : [],
    [event, observations],
  )

  if (!event) {
    return (
      <section className="timeline-empty" aria-labelledby="timeline-heading">
        <div className="section-heading section-heading-inset">
          <div>
            <p className="eyebrow">照护轨迹</p>
            <h2 id="timeline-heading">从第一条真实观察开始</h2>
          </div>
          <span className="timeline-spark" aria-hidden="true" />
        </div>
        <div className="timeline-empty-body">
          <span className="timeline-empty-node"><FeatureIllustration name="observation" /></span>
          <div>
            <p>不用每天打卡。</p>
            <p className="muted-copy">等到你发现一点不同，再把当时的事实收进来。</p>
          </div>
          <button type="button" className="btn-tinted" onClick={onRecord}>
            记下第一次变化
          </button>
        </div>
      </section>
    )
  }

  const latest = eventObservations[0]
  return (
    <section className="timeline-card" aria-labelledby="timeline-heading">
      <div className="section-heading section-heading-inset">
        <div>
          <p className="eyebrow">照护轨迹</p>
          <h2 id="timeline-heading">{event.title}</h2>
        </div>
        <span className={`event-status ${event.status === 'active' ? 'is-active' : 'is-resolved'}`}>
          {event.status === 'active' ? '进行中' : '已整理'}
        </span>
      </div>

      <div className="timeline-summary">
        <span className="timeline-date">从 {shortDateTime(event.startedAt)} 开始</span>
        <span className="timeline-duration">持续 {formatDuration(event.startedAt, event.endedAt)}</span>
      </div>

      <div className="timeline-track">
        <svg className="timeline-curve" viewBox="0 0 48 360" aria-hidden="true" preserveAspectRatio="none">
          <path d="M24 2 C6 68 42 112 23 173 C5 231 42 285 24 358" />
        </svg>
        {eventObservations.slice(0, 8).map((observation, index) => (
          <article className="timeline-node" key={observation.id} style={{ '--node-index': index } as React.CSSProperties}>
            <span className={`timeline-node-dot ${SEVERITY_COLORS[observation.severity]}`} aria-hidden="true" />
            <div className="timeline-node-copy">
              <div className="timeline-node-head">
                <strong>{observation.label}</strong>
                <time dateTime={observation.occurredAt}>{shortDateTime(observation.occurredAt)}</time>
              </div>
              <p>
                {SEVERITY_LABELS[observation.severity]}
                {observation.note ? ` · ${observation.note}` : ''}
              </p>
              {observation.attachmentIds.length ? (
                <span className="timeline-attachment">
                  <UiIcon name="paperclip" size={14} /> 已附 {observation.attachmentIds.length} 张现场照片
                </span>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <div className="timeline-actions">
        <button type="button" className="btn-tinted" onClick={onRecord}>
          <UiIcon name="plus" size={17} />
          继续记下变化
        </button>
        {event.status === 'active' ? (
          <button type="button" className="btn-plain" onClick={() => onResolve(event.id)}>
            这次已经缓解
          </button>
        ) : (
          <span className="timeline-last">最近：{latest ? latest.label : '还没有观察'}</span>
        )}
      </div>
    </section>
  )
}

export function VisitPackSummary({
  pet,
  event,
  observations,
  weights,
  meds,
  medicationLogs,
  onRecord,
  onPrint,
}: {
  pet: Pet
  event: HealthEvent | null
  observations: HealthObservation[]
  weights: WeightEntry[]
  meds: MedEntry[]
  medicationLogs: MedicationLog[]
  onRecord: () => void
  onPrint: () => void
}) {
  const eventObservations = event
    ? observations
        .filter((observation) => observation.eventId === event.id)
        .sort((a, b) => a.occurredAt.localeCompare(b.occurredAt))
    : []
  const currentMeds = meds.filter((med) => !med.endDate)
  const latestWeight = [...weights].sort((a, b) => b.date.localeCompare(a.date))[0]
  const missing = [
    latestWeight ? null : '补一条最近体重',
    currentMeds.length ? null : '确认当前是否在用药',
    event?.questions.length ? null : '记下想问医生的问题',
  ].filter(Boolean) as string[]

  if (!event) {
    return (
      <section className="visit-pack-card is-quiet" aria-labelledby="visit-pack-heading">
        <div className="visit-pack-header">
          <div className="visit-pack-icon"><FeatureIllustration name="visitPack" /></div>
          <div className="min-w-0">
            <p className="eyebrow">看诊包</p>
            <h2 id="visit-pack-heading">观察随时记，看诊时不遗漏</h2>
          </div>
        </div>
        <p className="muted-copy">开始一段健康事件后，这里会自动整理观察、体重、用药和问题。</p>
        <button type="button" className="btn-plain pack-quiet-action" onClick={onRecord}>
          从一次变化开始 <UiIcon name="arrowRight" size={17} />
        </button>
      </section>
    )
  }

  return (
    <section className="visit-pack-card" aria-labelledby="visit-pack-heading">
      <div className="visit-pack-header">
        <div className="visit-pack-icon"><FeatureIllustration name="visitPack" /></div>
        <div className="min-w-0 flex-1">
          <p className="eyebrow">看诊包</p>
          <h2 id="visit-pack-heading">{event.title}</h2>
          <p className="pack-subtitle">已收好 {eventObservations.length} 条观察 · 还差 {missing.length} 项</p>
        </div>
        <span className="pack-count" aria-label={`已收集 ${eventObservations.length} 条观察`}>
          {eventObservations.length}
        </span>
      </div>

      <div className="pack-progress" aria-label={`看诊包已收集 ${4 - missing.length} 项，共 4 项`}>
        {['发生了什么', '现在怎样', '正在使用什么', '想问什么'].map((label, index) => {
          const complete = index === 0 ? eventObservations.length > 0 : index === 1 ? Boolean(latestWeight) : index === 2 ? currentMeds.length > 0 : event.questions.length > 0
          return <span key={label} className={complete ? 'is-complete' : ''} title={label} />
        })}
      </div>

      <details className="pack-details">
        <summary>
          <span>查看资料清单</span>
          <UiIcon name="chevronDown" size={18} />
        </summary>
        <div className="pack-checklist">
          <PackCheck done={eventObservations.length > 0} label={`异常观察 ${eventObservations.length} 条`} />
          <PackCheck done={Boolean(latestWeight)} label={latestWeight ? `最近体重 ${latestWeight.kg} kg` : '补一条最近体重'} />
          <PackCheck done={currentMeds.length > 0} label={currentMeds.length ? `当前用药 ${currentMeds.length} 项` : '确认当前是否在用药'} />
          <PackCheck done={event.questions.length > 0} label={event.questions.length ? `想问医生 ${event.questions.length} 个问题` : '记下想问医生的问题'} />
          {medicationLogs.length ? (
            <p className="pack-footnote">最近一次用药已记录，带上照护人和时间。</p>
          ) : null}
        </div>
      </details>

      <div className="pack-actions">
        <button type="button" className="btn-tinted" onClick={onRecord}>
          <UiIcon name="plus" size={17} /> 补充资料
        </button>
        <button type="button" className="btn-plain" onClick={onPrint}>
          <UiIcon name="printer" size={17} /> 打印看诊卡
        </button>
      </div>
      <p className="pack-privacy"><UiIcon name="lock" size={14} /> 资料只留在这台设备，分享前由你决定。</p>
      <div className="printable-visit-pack" aria-hidden="true">
        <h1>{pet.name} · 看诊卡</h1>
        <p>整理时间：{shortDateTime(new Date().toISOString())}</p>
        <h2>这次发生了什么</h2>
        <p>事件：{event.title}</p>
        <p>开始：{shortDateTime(event.startedAt)} · 持续：{formatDuration(event.startedAt, event.endedAt)}</p>
        <ul>
          {eventObservations.map((observation) => (
            <li key={observation.id}>{shortDateTime(observation.occurredAt)} · {observation.label} · {SEVERITY_LABELS[observation.severity]}{observation.note ? ` · ${observation.note}` : ''}</li>
          ))}
        </ul>
        <h2>现在怎样</h2>
        <p>{latestWeight ? `最近体重：${latestWeight.kg} kg（${latestWeight.date}）` : '未记录最近体重'}</p>
        <h2>正在使用什么</h2>
        <ul>{currentMeds.length ? currentMeds.map((med) => <li key={med.id}>{med.name} · {med.dosage || '用法未记'} </li>) : <li>目前没有标记为在用的药物</li>}</ul>
        <h2>想问医生什么</h2>
        <ul>{event.questions.length ? event.questions.map((question, index) => <li key={`${question}-${index}`}>{question}</li>) : <li>还没有问题</li>}</ul>
      </div>
    </section>
  )
}

function PackCheck({ done, label }: { done: boolean; label: string }) {
  return (
    <div className={`pack-check ${done ? 'is-done' : ''}`}>
      <span className="pack-check-icon"><UiIcon name={done ? 'check' : 'circle'} size={17} /></span>
      <span>{label}</span>
    </div>
  )
}

export function RecordMenuSheet({
  open,
  onClose,
  onChoose,
}: {
  open: boolean
  onClose: () => void
  onChoose: (action: 'shot' | 'weight' | 'med' | 'visit') => void
}) {
  const options: {
    value: 'shot' | 'weight' | 'med' | 'visit'
    illustration: FeatureIllustrationName
    title: string
    subtitle: string
  }[] = [
    { value: 'shot', illustration: 'vaccine', title: '疫苗和驱虫', subtitle: '记下日期，自动算下一次' },
    { value: 'weight', illustration: 'weight', title: '体重', subtitle: '留下一次新的变化参照' },
    { value: 'med', illustration: 'medication', title: '用药', subtitle: '药名、用法和照护接力' },
    { value: 'visit', illustration: 'visit', title: '就诊记录', subtitle: '把医生说的话留下来' },
  ]
  return (
    <Sheet open={open} title="记录其他照护" onClose={onClose}>
      <Group footer="健康事件适合记录“刚刚发生的变化”；这些入口适合补齐长期档案。">
        <div className="row-divider">
          {options.map((option) => (
            <Row
              key={option.value}
              icon={<span className="record-menu-illustration"><FeatureIllustration name={option.illustration} /></span>}
              title={option.title}
              subtitle={option.subtitle}
              trailing={<UiIcon name="chevronRight" size={18} />}
              onClick={() => {
                onChoose(option.value)
              }}
            />
          ))}
        </div>
      </Group>
    </Sheet>
  )
}

export function MedicationRelay({
  meds,
  logs,
  caregiver,
  onCheckIn,
  onDelete,
}: {
  meds: MedEntry[]
  logs: MedicationLog[]
  caregiver: string
  onCheckIn: (med: MedEntry) => void
  onDelete: (id: string) => void
}) {
  const current = meds.filter((med) => !med.endDate)
  if (!current.length) {
    return <EmptyState icon={<span className="empty-illustration"><FeatureIllustration name="medication" /></span>} title="还没有正在使用的药" hint="把药名和用法留下，下次照护就不用再猜。" />
  }
  return (
    <div className="med-relay-list">
      {current.map((med) => {
        const last = logs.filter((log) => log.medId === med.id && log.status === 'completed').sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0]
        return (
          <div className="med-relay-row" key={med.id}>
            <div className="med-relay-icon"><FeatureIllustration name="medication" /></div>
            <div className="min-w-0 flex-1">
              <div className="med-relay-title"><strong>{med.name}</strong><span className="badge badge-mint">在用</span></div>
              <p>{med.dosage || '用法还没记'} · {last ? `上次 ${shortDateTime(last.completedAt)} · ${last.caregiver}` : '还没有今天的完成记录'}</p>
            </div>
            <div className="med-relay-actions">
              <button type="button" className="med-checkin" onClick={() => onCheckIn(med)} aria-label={`记录 ${med.name} 已用药`}>
                <UiIcon name="check" size={16} /> <span>已用</span>
              </button>
              <button type="button" className="icon-action" onClick={() => onDelete(med.id)} aria-label={`删除 ${med.name}`}>
                <UiIcon name="trash" size={17} />
              </button>
            </div>
          </div>
        )
      })}
      <p className="med-relay-note">今天由 {caregiver || '我'} 记录 · 点“已用”留下时间和照护人</p>
    </div>
  )
}
