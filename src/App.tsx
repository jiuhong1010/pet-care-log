import { useMemo, useState } from 'react'
import { useAppData } from './hooks/useAppData'
import { newId, exportData } from './lib/storage'
import { upcomingDues } from './lib/due'
import type {
  MedEntry,
  Pet,
  Shot,
  Species,
  VisitEntry,
  WeightEntry,
} from './types'
import { Card, EmptyHint, SectionTitle, Sheet } from './components/ui'
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

type SheetName = 'pet' | 'shot' | 'weight' | 'med' | 'visit' | 'settings' | null

export default function App() {
  const { data, update, saveFailed } = useAppData()
  const [activePetId, setActivePetId] = useState<string | null>(null)
  const [sheet, setSheet] = useState<SheetName>(null)
  const [surveySkipped, setSurveySkipped] = useState(false)

  // 当前选中的宠物：优先用户选择，否则第一只
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

  // 所有宠物合起来需要注意的事项数量，用于顶部小徽标
  const totalDue = useMemo(() => {
    const byPet = data.pets.map((p) => upcomingDues(data.shots.filter((s) => s.petId === p.id)))
    return byPet.reduce((sum, list) => sum + list.length, 0)
  }, [data.pets, data.shots])

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

  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl px-4 pb-16 pt-6 sm:px-6">
      {/* 顶栏 */}
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">
            🐾
          </span>
          <span className="font-hand text-2xl font-bold text-cocoa-800">毛毛档案</span>
          {totalDue > 0 ? (
            <span className="chip bg-peach-300/40 text-peach-500">{totalDue} 件事要做</span>
          ) : null}
        </div>
        <button type="button" className="btn-ghost" onClick={() => setSheet('settings')}>
          ⚙️ 设置
        </button>
      </header>

      {saveFailed ? (
        <div className="mb-4 rounded-2xl border-2 border-berry-300 bg-berry-300/20 px-4 py-3 text-sm text-cocoa-800">
          <strong>没能存到本地。</strong>
          如果你在用无痕模式，关掉页面记录就会丢失，建议换普通窗口打开。
        </div>
      ) : null}

      {showSurvey ? (
        <div className="mb-5">
          <SurveyCard
            onAnswer={(a) => update((prev) => ({ ...prev, survey: a }))}
            onSkip={() => setSurveySkipped(true)}
          />
        </div>
      ) : null}

      {/* 宠物切换 */}
      <div className="mb-5">
        <PetSwitcher
          pets={data.pets}
          activeId={activePet?.id ?? null}
          onSelect={setActivePetId}
          onAdd={() => setSheet('pet')}
        />
      </div>

      {!activePet ? (
        <Card>
          <EmptyHint
            emoji="🐣"
            title="先加一只毛孩子吧"
            hint="记录只会存在你自己的浏览器里，不用注册、不用登录"
          />
          <div className="flex justify-center">
            <button type="button" className="btn-primary" onClick={() => setSheet('pet')}>
              ＋ 添加第一只
            </button>
          </div>
        </Card>
      ) : (
        <div className="space-y-5">
          <Card>
            <PetHeader pet={activePet} />
          </Card>

          {/* 到期提醒放最上面：这是用户回访的唯一理由 */}
          <Card>
            <SectionTitle
              emoji="⏰"
              title="接下来要做的"
              action={
                <button type="button" className="btn-primary" onClick={() => setSheet('shot')}>
                  ＋ 记一次
                </button>
              }
            />
            <DueList shots={shots} />
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card>
              <SectionTitle
                emoji="⚖️"
                title="体重"
                action={
                  <button type="button" className="btn-ghost" onClick={() => setSheet('weight')}>
                    ＋ 称一次
                  </button>
                }
              />
              <WeightChart entries={weights} />
              <WeightList
                entries={weights}
                onDelete={(id) =>
                  update((prev) => ({
                    ...prev,
                    weights: prev.weights.filter((w) => w.id !== id),
                  }))
                }
              />
            </Card>

            <Card>
              <SectionTitle
                emoji="💊"
                title="用药"
                action={
                  <button type="button" className="btn-ghost" onClick={() => setSheet('med')}>
                    ＋ 加一条
                  </button>
                }
              />
              <MedList
                entries={meds}
                onDelete={(id) =>
                  update((prev) => ({ ...prev, meds: prev.meds.filter((m) => m.id !== id) }))
                }
              />
            </Card>
          </div>

          <Card>
            <SectionTitle
              emoji="🏥"
              title="看病记录"
              action={
                <button type="button" className="btn-ghost" onClick={() => setSheet('visit')}>
                  ＋ 加一次
                </button>
              }
            />
            <VisitList
              entries={visits}
              onDelete={(id) =>
                update((prev) => ({ ...prev, visits: prev.visits.filter((v) => v.id !== id) }))
              }
            />
          </Card>

          {shots.length > 0 ? (
            <Card>
              <SectionTitle emoji="📜" title="疫苗驱虫全部记录" />
              <ShotHistory
                shots={shots}
                onDelete={(id) =>
                  update((prev) => ({ ...prev, shots: prev.shots.filter((s) => s.id !== id) }))
                }
              />
            </Card>
          ) : null}

          <Card>
            <SectionTitle emoji="💬" title="想说点什么" />
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
          </Card>
        </div>
      )}

      <footer className="mt-10 text-center text-xs text-cocoa-400">
        <p>数据只存在这台设备的浏览器里，清缓存会丢，记得偶尔去设置里导出备份 🌿</p>
      </footer>

      {/* 各类表单 */}
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
      <VisitFormSheet
        open={sheet === 'visit'}
        onClose={() => setSheet(null)}
        onSubmit={addVisit}
      />

      <Sheet open={sheet === 'settings'} title="设置" onClose={() => setSheet(null)}>
        <div className="space-y-4">
          <ValidationSummary survey={data.survey} feedbacks={data.feedbacks} />

          <div className="rounded-2xl bg-cream-50 px-4 py-3 text-sm text-cocoa-600">
            <p className="font-bold text-cocoa-800">数据存在哪</p>
            <p className="mt-1 text-cocoa-400">
              全部在你这台设备的浏览器本地，没有服务器、没有账号，我看不到你的记录。
              换设备或清缓存会丢，所以建议导出备份。
            </p>
          </div>

          <button type="button" className="btn-primary w-full" onClick={() => exportData(data)}>
            ⬇️ 导出备份（含反馈）
          </button>

          <div className="pt-1">
            <p className="mb-2 text-sm text-cocoa-400">
              当前共 {data.pets.length} 只宠物、
              {data.shots.length} 条疫苗驱虫、{data.weights.length} 条体重、
              {data.meds.length} 条用药、{data.visits.length} 条就诊。
            </p>
            <button
              type="button"
              className="btn-ghost w-full border-berry-300 text-berry-500 hover:border-berry-500"
              onClick={() => {
                if (window.confirm('清空所有记录？这个操作没法撤销，建议先导出备份。')) {
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
              清空所有记录
            </button>
          </div>
        </div>
      </Sheet>
    </div>
  )
}
