import { useMemo, useState, type ReactNode } from 'react'
import { useAppData } from './hooks/useAppData'
import { newId, exportData } from './lib/storage'
import { saveAttachment } from './lib/media'
import { upcomingDues } from './lib/due'
import type {
  AttachmentMeta,
  HealthEvent,
  HealthObservation,
  MedEntry,
  MedicationLog,
  Pet,
  Shot,
  Species,
  VisitEntry,
  WeightEntry,
} from './types'
import { FormRow, Group, Row, Sheet } from './components/ui'
import { PetFormSheet, PetHeader, PetSwitcher } from './components/Pet'
import { DueList, ShotFormSheet, ShotHistory } from './components/Shots'
import { WeightChart } from './components/WeightChart'
import {
  MedFormSheet,
  MedList,
  VisitFormSheet,
  VisitList,
  WeightFormSheet,
  WeightList,
} from './components/Records'
import { UiIcon } from './components/UiIcon'
import careMascot from './assets/generated/care-mascot.png'
import { AppNavigation, type WorkspaceView } from './components/AppNavigation'
import { TodayCareScene } from './components/TodayCareScene'
import {
  FeatureIllustration,
  type FeatureIllustrationName,
} from './components/FeatureIllustration'
import {
  CareTimeline,
  HealthEventComposerSheet,
  MedicationRelay,
  VisitPackSummary,
  type ObservationDraft,
} from './components/HealthEvents'

type SheetName = 'pet' | 'shot' | 'weight' | 'med' | 'visit' | 'settings' | 'event' | null

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="section-add">
      <UiIcon name="plus" size={17} />
      新增
    </button>
  )
}

function GroupHeaderRow({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {action}
    </div>
  )
}

function IllustratedRecordAction({
  illustration,
  title,
  description,
  className = '',
  onClick,
}: {
  illustration: FeatureIllustrationName
  title: string
  description: string
  className?: string
  onClick: () => void
}) {
  return (
    <button type="button" className={`illustrated-record-action ${className}`} onClick={onClick}>
      <span className="illustrated-record-art" aria-hidden="true">
        <FeatureIllustration name={illustration} />
      </span>
      <span className="illustrated-record-copy">
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <UiIcon name="chevronRight" size={18} />
    </button>
  )
}

function formatCount(data: {
  shots: Shot[]
  weights: WeightEntry[]
  meds: MedEntry[]
  visits: VisitEntry[]
  observations: HealthObservation[]
  medicationLogs: MedicationLog[]
}) {
  return (
    data.shots.length +
    data.weights.length +
    data.meds.length +
    data.visits.length +
    data.observations.length +
    data.medicationLogs.length
  )
}

export default function App() {
  const { data, update, saveFailed } = useAppData()
  const [activePetId, setActivePetId] = useState<string | null>(null)
  const [sheet, setSheet] = useState<SheetName>(null)
  const [view, setView] = useState<WorkspaceView>('today')
  const [toast, setToast] = useState<string | null>(null)

  const activePet: Pet | null = useMemo(() => {
    if (data.pets.length === 0) return null
    return data.pets.find((p) => p.id === activePetId) ?? data.pets[0]
  }, [data.pets, activePetId])

  const petId = activePet?.id ?? ''
  const shots = useMemo(() => data.shots.filter((s) => s.petId === petId), [data.shots, petId])
  const weights = useMemo(
    () => data.weights.filter((w) => w.petId === petId),
    [data.weights, petId],
  )
  const meds = useMemo(() => data.meds.filter((m) => m.petId === petId), [data.meds, petId])
  const visits = useMemo(() => data.visits.filter((v) => v.petId === petId), [data.visits, petId])
  const healthEvents = useMemo(
    () =>
      data.healthEvents
        .filter((event) => event.petId === petId)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [data.healthEvents, petId],
  )
  const observations = useMemo(
    () => data.observations.filter((observation) => observation.petId === petId),
    [data.observations, petId],
  )
  const medicationLogs = useMemo(
    () => data.medicationLogs.filter((log) => log.petId === petId),
    [data.medicationLogs, petId],
  )
  const activeHealthEvent = healthEvents.find((event) => event.status === 'active') ?? null
  const latestHealthEvent = healthEvents[0] ?? null
  const activeDue = useMemo(() => upcomingDues(shots), [shots])

  const totalDue = useMemo(
    () =>
      data.pets
        .map((p) => upcomingDues(data.shots.filter((s) => s.petId === p.id)))
        .reduce((sum, list) => sum + list.length, 0),
    [data.pets, data.shots],
  )

  const flash = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast((current) => (current === message ? null : current)), 2800)
  }

  const addPet = (input: { name: string; species: Species; birthday: string; avatar: string }) => {
    const pet: Pet = { id: newId(), createdAt: new Date().toISOString(), ...input }
    update((prev) => ({ ...prev, pets: [...prev.pets, pet] }))
    setActivePetId(pet.id)
  }

  const addShot = (input: Omit<Shot, 'id' | 'petId'>) => {
    if (!petId) return
    update((prev) => ({ ...prev, shots: [...prev.shots, { id: newId(), petId, ...input }] }))
    flash('已收好这条照护记录')
  }

  const addWeight = (input: Omit<WeightEntry, 'id' | 'petId'>) => {
    if (!petId) return
    update((prev) => ({ ...prev, weights: [...prev.weights, { id: newId(), petId, ...input }] }))
    flash('体重已记下，看诊包也会同步更新')
  }

  const addMed = (input: Omit<MedEntry, 'id' | 'petId'>) => {
    if (!petId) return
    update((prev) => ({ ...prev, meds: [...prev.meds, { id: newId(), petId, ...input }] }))
    flash('用药信息已收好')
  }

  const addVisit = (input: Omit<VisitEntry, 'id' | 'petId'>) => {
    if (!petId) return
    update((prev) => ({ ...prev, visits: [...prev.visits, { id: newId(), petId, ...input }] }))
    flash('医生说的话已留下')
  }

  const addHealthObservation = (draft: ObservationDraft) => {
    if (!petId) return
    const now = new Date().toISOString()
    const existing = draft.eventMode === 'continue' ? activeHealthEvent : null
    const eventId = existing?.id ?? newId()
    const observationId = newId()
    const attachmentIds = draft.files.map(() => newId())
    const attachmentMeta: AttachmentMeta[] = draft.files.map((file, index) => ({
      id: attachmentIds[index],
      petId,
      observationId,
      name: file.name,
      mimeType: file.type,
      size: file.size,
      createdAt: now,
    }))
    const event: HealthEvent = existing
      ? {
          ...existing,
          updatedAt: now,
          questions:
            draft.question && !existing.questions.includes(draft.question)
              ? [...existing.questions, draft.question]
              : existing.questions,
        }
      : {
          id: eventId,
          petId,
          title: draft.title || '这次不舒服',
          startedAt: draft.occurredAt,
          endedAt: '',
          status: 'active',
          questions: draft.question ? [draft.question] : [],
          createdAt: now,
          updatedAt: now,
        }
    const observation: HealthObservation = {
      id: observationId,
      petId,
      eventId,
      kind: draft.kind,
      label: draft.label,
      severity: draft.severity,
      occurredAt: draft.occurredAt,
      note: draft.note,
      attachmentIds,
      createdAt: now,
    }

    update((prev) => ({
      ...prev,
      healthEvents: prev.healthEvents.some((item) => item.id === event.id)
        ? prev.healthEvents.map((item) => (item.id === event.id ? event : item))
        : [...prev.healthEvents, event],
      observations: [...prev.observations, observation],
      attachments: [...prev.attachments, ...attachmentMeta],
    }))
    if (draft.files.length) {
      void Promise.all(draft.files.map((file, index) => saveAttachment(attachmentIds[index], file))).then((results) => {
        if (results.some((ok) => !ok)) {
          update((prev) => ({
            ...prev,
            observations: prev.observations.map((item) =>
              item.id === observationId
                ? { ...item, attachmentIds: item.attachmentIds.filter((_, index) => results[index]) }
                : item,
            ),
            attachments: prev.attachments.filter((item) => item.observationId !== observationId || results[attachmentIds.indexOf(item.id)]),
          }))
          flash('观察已保存，但有照片没能放进本地附件库')
        }
      })
    }
    flash(existing ? '这条变化已接到照护轨迹' : '已开始整理这次变化')
  }

  const resolveHealthEvent = (eventId: string) => {
    const now = new Date().toISOString()
    update((prev) => ({
      ...prev,
      healthEvents: prev.healthEvents.map((event) =>
        event.id === eventId ? { ...event, status: 'resolved', endedAt: now, updatedAt: now } : event,
      ),
    }))
    flash('这次变化已经收好，之后仍能在时间线里找到')
  }

  const checkInMedication = (med: MedEntry) => {
    if (!petId) return
    const log: MedicationLog = {
      id: newId(),
      petId,
      medId: med.id,
      completedAt: new Date().toISOString(),
      caregiver: data.caregiverName.trim() || '我',
      status: 'completed',
      note: '',
    }
    update((prev) => ({ ...prev, medicationLogs: [...prev.medicationLogs, log] }))
    flash(`${med.name} 已记为完成 · ${log.caregiver}`)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <span>
            <span className="brand-name">毛毛档案</span>
            <span className="brand-promise">把每一次变化，整理成说得清的时间线</span>
          </span>
        </div>
        <div className="topbar-actions">
          {totalDue > 0 ? <span className="attention-summary">{totalDue} 件待留意</span> : null}
          <button type="button" onClick={() => setSheet('settings')} aria-label="设置" className="icon-action"><UiIcon name="settings" size={21} /></button>
        </div>
      </header>

      {saveFailed ? (
        <div className="page-gutter pb-3"><div className="save-warning" role="alert"><strong>这次没能存到本地。</strong> 先保留页面别关；如果正在用无痕模式，换普通窗口后再试一次。</div></div>
      ) : null}

      {!activePet ? (
        <main className="page-gutter first-run">
          <section className="welcome-panel">
            <div className="welcome-copy">
              <p className="eyebrow eyebrow-light">毛毛档案 · 本地优先</p>
              <h1>把每一次变化，整理成看诊时说得清的时间线。</h1>
              <p>不用先判断属于哪一类。记下刚刚发现的事实，观察、体重、用药和问题会慢慢收进同一个看诊包。</p>
              <button type="button" className="welcome-cta" onClick={() => setSheet('pet')}><UiIcon name="plus" size={19} />建立第一份档案</button>
              <p className="privacy-note"><UiIcon name="lock" size={14} /> 无需注册 · 资料只保存在你的浏览器</p>
            </div>
            <div className="welcome-scene" aria-hidden="true"><img src={careMascot} alt="" className="welcome-mascot" /><div className="welcome-route"><span /><span /><span /></div></div>
            <div className="welcome-proof" aria-label="三步照护轨迹">
              <div><span>01</span><strong>发现一点不同</strong><small>时间和事实先留下</small></div>
              <div><span>02</span><strong>看诊前收一收</strong><small>资料自动组成看诊包</small></div>
              <div><span>03</span><strong>回来继续照顾</strong><small>医嘱和用药接上</small></div>
            </div>
          </section>
        </main>
      ) : (
        <main className={`page-gutter dashboard dashboard-view-${view}`}>
          <div className="pet-nav"><PetSwitcher pets={data.pets} activeId={activePet.id} onSelect={setActivePetId} onAdd={() => setSheet('pet')} /></div>
          <PetHeader pet={activePet} dueCount={activeDue.length} />
          <AppNavigation value={view} onChange={setView} />

          <div className="workspace-content">
            {view === 'today' ? (
              <div className="today-view">
                <TodayCareScene
                  pet={activePet}
                  observations={observations}
                  meds={meds}
                  medicationLogs={medicationLogs}
                  dues={activeDue}
                  onRecord={() => setSheet('event')}
                  onMedication={() => setSheet('med')}
                  onShot={() => setSheet('shot')}
                  onPack={() => setView('pack')}
                />

                <div className="today-detail-grid">
                  <section className="record-block priority-block">
                    <GroupHeaderRow title="接下来要做的" action={<AddButton onClick={() => setSheet('shot')} label="新增疫苗或驱虫记录" />} />
                    <div className="group-card"><DueList shots={shots} /></div>
                  </section>
                  <section className="record-block">
                    <GroupHeaderRow title="今天的用药接力" action={<AddButton onClick={() => setSheet('med')} label="新增用药记录" />} />
                    <div className="group-card"><MedicationRelay meds={meds} logs={medicationLogs} caregiver={data.caregiverName} onCheckIn={checkInMedication} onDelete={(id) => update((prev) => ({ ...prev, meds: prev.meds.filter((m) => m.id !== id) }))} /></div>
                  </section>
                </div>
              </div>
            ) : null}

            {view === 'timeline' ? (
              <div className="timeline-view">
                <section className="view-intro timeline-intro" aria-labelledby="timeline-view-heading">
                  <div className="view-intro-copy">
                    <p className="page-context">差异化功能 · 连续观察</p>
                    <h2 id="timeline-view-heading">变化不是散落的记录，而是一段有起点和进展的故事</h2>
                    <p>同一次不舒服会自动收进一条时间线，看诊时能快速说明何时开始、如何变化、现在怎样。</p>
                    <button type="button" className="btn-tinted" onClick={() => setSheet('event')}><UiIcon name="plus" size={17} />继续记录</button>
                  </div>
                  <FeatureIllustration name="observation" className="view-intro-art" />
                </section>
                <CareTimeline events={healthEvents} observations={observations} onRecord={() => setSheet('event')} onResolve={resolveHealthEvent} />
                {healthEvents.length > 1 ? (
                  <section className="event-archive" aria-labelledby="event-archive-heading">
                    <div className="section-heading"><h2 id="event-archive-heading">过去的照护事件</h2></div>
                    <div className="event-archive-list">
                      {healthEvents.slice(1).map((event) => (
                        <div key={event.id}><strong>{event.title}</strong><span>{event.status === 'resolved' ? '已整理' : '进行中'}</span></div>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>
            ) : null}

            {view === 'pack' ? (
              <div className="pack-view">
                <section className="view-intro pack-intro" aria-labelledby="pack-view-heading">
                  <div className="view-intro-copy">
                    <p className="page-context">差异化功能 · 看诊前整理</p>
                    <h2 id="pack-view-heading">不用在候诊室里临时回忆</h2>
                    <p>观察、最近体重、当前用药和想问的问题会自动汇成一张看诊卡，打印与分享都由你决定。</p>
                  </div>
                  <FeatureIllustration name="visitPack" className="view-intro-art" />
                </section>
                <VisitPackSummary pet={activePet} event={latestHealthEvent} observations={observations} weights={weights} meds={meds} medicationLogs={medicationLogs} onRecord={() => setSheet('event')} onPrint={() => window.print()} />
              </div>
            ) : null}

            {view === 'records' ? (
              <div className="records-view">
                <section className="records-heading" aria-labelledby="records-view-heading">
                  <div><p className="page-context">长期档案</p><h2 id="records-view-heading">需要回看时，资料都在这里</h2><p>长期记录服务于下一次照护，不要求你为了“完整”而打卡。</p></div>
                </section>

                <div className="record-entry-board" aria-label="新增长期照护记录">
                  <IllustratedRecordAction illustration="vaccine" title="疫苗与驱虫" description="记下日期，自动计算下一次" className="is-vaccine" onClick={() => setSheet('shot')} />
                  <IllustratedRecordAction illustration="weight" title="体重" description="给变化留下参照" className="is-weight" onClick={() => setSheet('weight')} />
                  <IllustratedRecordAction illustration="medication" title="用药" description="药名、用法与照护接力" className="is-medication" onClick={() => setSheet('med')} />
                  <IllustratedRecordAction illustration="visit" title="就诊记录" description="把医生说的话留下" className="is-visit" onClick={() => setSheet('visit')} />
                </div>

                <div className="records-library">
                  <section className="record-block priority-block"><GroupHeaderRow title="到期安排" action={<AddButton onClick={() => setSheet('shot')} label="新增疫苗或驱虫记录" />} /><div className="group-card"><DueList shots={shots} /></div></section>
                  <section className="record-block"><GroupHeaderRow title="体重趋势" action={<AddButton onClick={() => setSheet('weight')} label="新增体重记录" />} /><div className="group-card"><WeightChart entries={weights} />{weights.length > 0 ? <div className="subsection-divider"><WeightList entries={weights} onDelete={(id) => update((prev) => ({ ...prev, weights: prev.weights.filter((w) => w.id !== id) }))} /></div> : null}</div></section>
                  <section className="record-block"><GroupHeaderRow title="用药记录" action={<AddButton onClick={() => setSheet('med')} label="新增用药记录" />} /><div className="group-card"><MedicationRelay meds={meds} logs={medicationLogs} caregiver={data.caregiverName} onCheckIn={checkInMedication} onDelete={(id) => update((prev) => ({ ...prev, meds: prev.meds.filter((m) => m.id !== id) }))} />{meds.some((med) => Boolean(med.endDate)) ? <details className="history-details"><summary>查看已结束的用药</summary><MedList entries={meds.filter((med) => Boolean(med.endDate))} logs={medicationLogs} caregiver={data.caregiverName} onCheckIn={checkInMedication} onDelete={(id) => update((prev) => ({ ...prev, meds: prev.meds.filter((m) => m.id !== id) }))} /></details> : null}</div></section>
                  <section className="record-block"><GroupHeaderRow title="就诊记录" action={<AddButton onClick={() => setSheet('visit')} label="新增就诊记录" />} /><div className="group-card"><VisitList entries={visits} onDelete={(id) => update((prev) => ({ ...prev, visits: prev.visits.filter((v) => v.id !== id) }))} /></div></section>
                  {shots.length > 0 ? <section className="record-block records-shot-history"><GroupHeaderRow title="疫苗与驱虫历史" /><div className="group-card"><ShotHistory shots={shots} onDelete={(id) => update((prev) => ({ ...prev, shots: prev.shots.filter((s) => s.id !== id) }))} /></div></section> : null}
                </div>

              </div>
            ) : null}
          </div>
          {view === 'today' ? (
            <button type="button" className="mobile-record-action" onClick={() => setSheet('event')}>
              <UiIcon name="edit" size={21} />
              记下刚刚的变化
            </button>
          ) : null}
        </main>
      )}

      <footer className="site-footer"><UiIcon name="lock" size={15} /> 数据只存在这台设备的浏览器里 · 记得偶尔导出备份</footer>
      {toast ? <div className="toast" role="status" aria-live="polite"><UiIcon name="check" size={17} /> {toast}</div> : null}

      <PetFormSheet open={sheet === 'pet'} onClose={() => setSheet(null)} onSubmit={addPet} />
      <ShotFormSheet open={sheet === 'shot'} species={activePet?.species ?? 'cat'} onClose={() => setSheet(null)} onSubmit={addShot} />
      <WeightFormSheet open={sheet === 'weight'} onClose={() => setSheet(null)} onSubmit={addWeight} />
      <MedFormSheet open={sheet === 'med'} onClose={() => setSheet(null)} onSubmit={addMed} />
      <VisitFormSheet open={sheet === 'visit'} onClose={() => setSheet(null)} onSubmit={addVisit} />
      {activePet ? <HealthEventComposerSheet open={sheet === 'event'} pet={activePet} activeEvent={activeHealthEvent} onClose={() => setSheet(null)} onSubmit={addHealthObservation} /> : null}

      <Sheet open={sheet === 'settings'} title="设置" onClose={() => setSheet(null)}>
        <div className="settings-stack">
          <Group header="照护人" footer="只用于记录“谁在什么时候完成了用药”，不会同步给别人。"><FormRow label="名字" stacked><input className="field-boxed" value={data.caregiverName} maxLength={24} onChange={(event) => update((prev) => ({ ...prev, caregiverName: event.target.value }))} placeholder="比如：小满妈妈" /></FormRow></Group>
          <Group header="数据" footer="全部在你这台设备的浏览器本地，没有服务器、没有账号。换设备或清缓存会丢，建议导出备份。"><div className="row-divider"><Row icon={<UiIcon name="download" size={20} />} title="导出备份" subtitle="包含全部结构化照护记录" onClick={() => exportData(data)} /><Row icon={<UiIcon name="chart" size={20} />} title="当前数据量" detail={`${data.pets.length} 只 · ${formatCount(data)} 条`} /></div></Group>
          <Group><button type="button" className="row w-full text-red transition active:opacity-50" onClick={() => { if (!window.confirm('清空所有记录？无法撤销，建议先导出备份。')) return; update((prev) => ({ ...prev, version: 2, pets: [], shots: [], weights: [], meds: [], visits: [], healthEvents: [], observations: [], attachments: [], medicationLogs: [], survey: null, feedbacks: [] })); setActivePetId(null); setSheet(null) }}><UiIcon name="trash" size={20} /><span className="text-body">清空所有记录</span></button></Group>
        </div>
      </Sheet>
    </div>
  )
}
