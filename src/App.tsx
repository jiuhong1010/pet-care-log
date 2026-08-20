import { useMemo, useState } from 'react'
import { useAppData } from './hooks/useAppData'
import { newId, exportData } from './lib/storage'
import { upcomingDues } from './lib/due'
import type {
  MedEntry,
  Pet,
  Shot,
  Species,
  SurveyAnswer,
  VisitEntry,
  WeightEntry,
} from './types'
import { Group, Row, Sheet } from './components/ui'
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
import { FeedbackBox, SurveyCard, ValidationSummary } from './components/Validation'
import {
  UiIcon,
} from './components/UiIcon'

type SheetName = 'pet' | 'shot' | 'weight' | 'med' | 'visit' | 'settings' | null

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="section-add">
      <UiIcon name="plus" size={17} />
      新增
    </button>
  )
}

function GroupHeaderRow({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {action}
    </div>
  )
}

function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button type="button" className="quick-action" onClick={onClick}>
      <span className="quick-action-icon">{icon}</span>
      <span>{label}</span>
    </button>
  )
}

export default function App() {
  const { data, update, saveFailed } = useAppData()
  const [activePetId, setActivePetId] = useState<string | null>(null)
  const [sheet, setSheet] = useState<SheetName>(null)
  const [surveySkipped, setSurveySkipped] = useState(false)

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
  const activeDue = useMemo(() => upcomingDues(shots), [shots])

  const totalDue = useMemo(
    () =>
      data.pets
        .map((p) => upcomingDues(data.shots.filter((s) => s.petId === p.id)))
        .reduce((sum, list) => sum + list.length, 0),
    [data.pets, data.shots],
  )

  const addPet = (input: {
    name: string
    species: Species
    birthday: string
    avatar: string
  }) => {
    const pet: Pet = { id: newId(), createdAt: new Date().toISOString(), ...input }
    update((prev) => ({ ...prev, pets: [...prev.pets, pet] }))
    setActivePetId(pet.id)
  }

  const addShot = (input: Omit<Shot, 'id' | 'petId'>) => {
    if (!petId) return
    update((prev) => ({ ...prev, shots: [...prev.shots, { id: newId(), petId, ...input }] }))
  }

  const addWeight = (input: Omit<WeightEntry, 'id' | 'petId'>) => {
    if (!petId) return
    update((prev) => ({ ...prev, weights: [...prev.weights, { id: newId(), petId, ...input }] }))
  }

  const addMed = (input: Omit<MedEntry, 'id' | 'petId'>) => {
    if (!petId) return
    update((prev) => ({ ...prev, meds: [...prev.meds, { id: newId(), petId, ...input }] }))
  }

  const addVisit = (input: Omit<VisitEntry, 'id' | 'petId'>) => {
    if (!petId) return
    update((prev) => ({ ...prev, visits: [...prev.visits, { id: newId(), petId, ...input }] }))
  }

  const showSurvey = !data.survey && !surveySkipped
  const answerSurvey = (answer: SurveyAnswer) =>
    update((prev) => ({ ...prev, survey: answer }))

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            <UiIcon name="paw" size={21} />
          </span>
          <span>
            <span className="brand-name">毛毛档案</span>
            <span className="brand-promise">把重要的照顾，记得清清楚楚</span>
          </span>
        </div>
        <div className="topbar-actions">
          {totalDue > 0 ? <span className="attention-summary">{totalDue} 件待留意</span> : null}
          <button
            type="button"
            onClick={() => setSheet('settings')}
            aria-label="设置"
            className="icon-action"
          >
            <UiIcon name="settings" size={22} />
          </button>
        </div>
      </header>

      {saveFailed ? (
        <div className="page-gutter pb-3">
          <div className="save-warning" role="alert">
            <strong>没能存到本地。</strong>
            如果在用无痕模式，关掉页面记录会丢失，建议换普通窗口。
          </div>
        </div>
      ) : null}

      {!activePet ? (
        <main className="page-gutter first-run">
          <section className="welcome-panel">
            <div className="welcome-symbol" aria-hidden="true">
              <UiIcon name="paw" size={42} />
            </div>
            <div className="welcome-copy">
              <h1>每一次照顾，都有迹可循</h1>
              <p>疫苗、驱虫、体重、用药和就诊记录，放在一个随时找得到的地方。</p>
            </div>
            <button type="button" className="welcome-cta" onClick={() => setSheet('pet')}>
              <UiIcon name="plus" size={19} />
              添加第一只宠物
            </button>
            <p className="privacy-note">无需注册 · 数据只保存在你的浏览器</p>
          </section>

          {showSurvey ? (
            <SurveyCard onAnswer={answerSurvey} onSkip={() => setSurveySkipped(true)} />
          ) : null}
        </main>
      ) : (
        <main className="page-gutter dashboard">
          <div className="pet-nav">
            <PetSwitcher
              pets={data.pets}
              activeId={activePet.id}
              onSelect={setActivePetId}
              onAdd={() => setSheet('pet')}
            />
          </div>

          <PetHeader pet={activePet} dueCount={activeDue.length} />

          <nav className="quick-actions" aria-label="快速记录">
            <QuickAction
              icon={<UiIcon name="syringe" size={20} />}
              label="疫苗驱虫"
              onClick={() => setSheet('shot')}
            />
            <QuickAction
              icon={<UiIcon name="chart" size={20} />}
              label="体重"
              onClick={() => setSheet('weight')}
            />
            <QuickAction
              icon={<UiIcon name="pill" size={20} />}
              label="用药"
              onClick={() => setSheet('med')}
            />
            <QuickAction
              icon={<UiIcon name="medicalKit" size={20} />}
              label="就诊"
              onClick={() => setSheet('visit')}
            />
          </nav>

          {showSurvey ? (
            <SurveyCard onAnswer={answerSurvey} onSkip={() => setSurveySkipped(true)} />
          ) : null}

          <div className="dashboard-grid">
            <div className="dashboard-column">
              <section className="record-block priority-block">
                <GroupHeaderRow
                  title="接下来要做的"
                  action={
                    <AddButton onClick={() => setSheet('shot')} label="新增疫苗或驱虫记录" />
                  }
                />
                <div className="group-card">
                  <DueList shots={shots} />
                </div>
              </section>

              <section className="record-block">
                <GroupHeaderRow
                  title="体重趋势"
                  action={<AddButton onClick={() => setSheet('weight')} label="新增体重记录" />}
                />
                <div className="group-card">
                  <WeightChart entries={weights} />
                  {weights.length > 0 ? (
                    <div className="subsection-divider">
                      <WeightList
                        entries={weights}
                        onDelete={(id) =>
                          update((prev) => ({
                            ...prev,
                            weights: prev.weights.filter((w) => w.id !== id),
                          }))
                        }
                      />
                    </div>
                  ) : null}
                </div>
              </section>
            </div>

            <div className="dashboard-column">
              <section className="record-block">
                <GroupHeaderRow
                  title="用药"
                  action={<AddButton onClick={() => setSheet('med')} label="新增用药记录" />}
                />
                <div className="group-card">
                  <MedList
                    entries={meds}
                    onDelete={(id) =>
                      update((prev) => ({ ...prev, meds: prev.meds.filter((m) => m.id !== id) }))
                    }
                  />
                </div>
              </section>

              <section className="record-block">
                <GroupHeaderRow
                  title="就诊记录"
                  action={<AddButton onClick={() => setSheet('visit')} label="新增就诊记录" />}
                />
                <div className="group-card">
                  <VisitList
                    entries={visits}
                    onDelete={(id) =>
                      update((prev) => ({
                        ...prev,
                        visits: prev.visits.filter((v) => v.id !== id),
                      }))
                    }
                  />
                </div>
              </section>
            </div>
          </div>

          {shots.length > 0 ? (
            <section className="record-block wide-block">
              <GroupHeaderRow title="疫苗与驱虫历史" />
              <div className="group-card">
                <ShotHistory
                  shots={shots}
                  onDelete={(id) =>
                    update((prev) => ({ ...prev, shots: prev.shots.filter((s) => s.id !== id) }))
                  }
                />
              </div>
            </section>
          ) : null}

          <section className="feedback-strip">
            <div className="feedback-intro">
              <h2>用起来哪里还不顺手？</h2>
              <p>你的想法只保存在本地，导出备份时会一起带上。</p>
            </div>
            <FeedbackBox
              onSubmit={(text) =>
                update((prev) => ({
                  ...prev,
                  feedbacks: [
                    ...prev.feedbacks,
                    { id: newId(), text, createdAt: new Date().toISOString() },
                  ],
                }))
              }
            />
          </section>
        </main>
      )}

      <footer className="site-footer">
        <UiIcon name="download" size={16} />
        数据只存在这台设备的浏览器里，记得偶尔导出备份
      </footer>

      <PetFormSheet open={sheet === 'pet'} onClose={() => setSheet(null)} onSubmit={addPet} />
      <ShotFormSheet
        open={sheet === 'shot'}
        species={activePet?.species ?? 'cat'}
        onClose={() => setSheet(null)}
        onSubmit={addShot}
      />
      <WeightFormSheet
        open={sheet === 'weight'}
        onClose={() => setSheet(null)}
        onSubmit={addWeight}
      />
      <MedFormSheet open={sheet === 'med'} onClose={() => setSheet(null)} onSubmit={addMed} />
      <VisitFormSheet open={sheet === 'visit'} onClose={() => setSheet(null)} onSubmit={addVisit} />

      <Sheet open={sheet === 'settings'} title="设置" onClose={() => setSheet(null)}>
        <div className="space-y-4">
          {data.survey || data.feedbacks.length > 0 ? (
            <Group header="你的反馈">
              <ValidationSummary survey={data.survey} feedbacks={data.feedbacks} />
            </Group>
          ) : null}

          <Group
            header="数据"
            footer="全部在你这台设备的浏览器本地，没有服务器、没有账号。换设备或清缓存会丢，建议导出备份。"
          >
            <div className="row-divider">
              <Row
                icon={<UiIcon name="download" size={20} />}
                title="导出备份"
                subtitle="含所有记录与反馈"
                onClick={() => exportData(data)}
              />
              <Row
                icon={<UiIcon name="feedback" size={20} />}
                title="当前数据量"
                detail={`${data.pets.length} 只 · ${
                  data.shots.length + data.weights.length + data.meds.length + data.visits.length
                } 条`}
              />
            </div>
          </Group>

          <Group>
            <button
              type="button"
              className="row w-full text-red transition active:opacity-50"
              onClick={() => {
                if (window.confirm('清空所有记录？无法撤销，建议先导出备份。')) {
                  update(() => ({
                    version: 1,
                    pets: [],
                    shots: [],
                    weights: [],
                    meds: [],
                    visits: [],
                    survey: data.survey,
                    feedbacks: data.feedbacks,
                  }))
                  setActivePetId(null)
                  setSheet(null)
                }
              }}
            >
              <UiIcon name="trash" size={20} />
              <span className="text-body">清空所有记录</span>
            </button>
          </Group>
        </div>
      </Sheet>
    </div>
  )
}
