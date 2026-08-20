import { useMemo, useState } from 'react'
import { useAppData } from './hooks/useAppData'
import { newId, exportData } from './lib/storage'
import { upcomingDues } from './lib/due'
import type { MedEntry, Pet, Shot, Species, VisitEntry, WeightEntry } from './types'
import { EmptyState, Group, LargeTitle, Row, Sheet } from './components/ui'
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
  IconBubble,
  IconDownload,
  IconGear,
  IconPaw,
  IconPlus,
  IconTrash,
} from './components/icons'

type SheetName = 'pet' | 'shot' | 'weight' | 'med' | 'visit' | 'settings' | null

/** 分组标题右侧的「新增」按钮 */
function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex items-center gap-0.5 px-1 py-1 text-subheadline font-medium text-blue
        transition active:opacity-60"
    >
      <IconPlus size={17} />
      新增
    </button>
  )
}

/** 带右上角按钮的分组标题 */
function GroupHeaderRow({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between px-gutter pb-1.5 pt-5">
      <h2 className="text-footnote" style={{ color: 'var(--c-label-2)' }}>
        {title}
      </h2>
      {action}
    </div>
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

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl pb-16">
      <LargeTitle
        title="毛毛档案"
        action={
          <button
            type="button"
            onClick={() => setSheet('settings')}
            aria-label="设置"
            className="p-1.5 text-blue transition active:opacity-60"
          >
            <IconGear size={23} />
          </button>
        }
      />

      {totalDue > 0 ? (
        <p className="px-gutter pb-2 text-subheadline" style={{ color: 'var(--c-label-2)' }}>
          有 <span className="font-semibold text-orange">{totalDue}</span> 件事要做
        </p>
      ) : null}

      {saveFailed ? (
        <div className="px-gutter pb-3">
          <div className="rounded-card bg-red/12 px-4 py-3 text-subheadline text-label">
            <strong className="font-semibold">没能存到本地。</strong>
            如果在用无痕模式，关掉页面记录会丢失，建议换普通窗口。
          </div>
        </div>
      ) : null}

      {showSurvey ? (
        <div className="px-2">
          <SurveyCard
            onAnswer={(a) => update((prev) => ({ ...prev, survey: a }))}
            onSkip={() => setSurveySkipped(true)}
          />
        </div>
      ) : null}

      <div className="pt-2">
        <PetSwitcher
          pets={data.pets}
          activeId={activePet?.id ?? null}
          onSelect={setActivePetId}
          onAdd={() => setSheet('pet')}
        />
      </div>

      {!activePet ? (
        <div className="px-2 pt-4">
          <Group>
            <EmptyState
              icon={<IconPaw size={38} />}
              title="先添加一只宠物"
              hint="记录只存在你自己的浏览器里，不用注册"
            />
            <div className="flex justify-center px-gutter pb-4">
              <button type="button" className="btn-filled" onClick={() => setSheet('pet')}>
                添加宠物
              </button>
            </div>
          </Group>
        </div>
      ) : (
        <div className="px-2">
          <div className="pt-3">
            <PetHeader pet={activePet} />
          </div>

          <GroupHeaderRow
            title="接下来要做的"
            action={<AddButton onClick={() => setSheet('shot')} label="新增疫苗或驱虫记录" />}
          />
          <div className="group-card">
            <DueList shots={shots} />
          </div>

          <GroupHeaderRow
            title="体重"
            action={<AddButton onClick={() => setSheet('weight')} label="新增体重记录" />}
          />
          <div className="group-card">
            <WeightChart entries={weights} />
            {weights.length > 0 ? (
              <div style={{ borderTop: '0.5px solid var(--c-separator)' }}>
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

          <GroupHeaderRow
            title="就诊记录"
            action={<AddButton onClick={() => setSheet('visit')} label="新增就诊记录" />}
          />
          <div className="group-card">
            <VisitList
              entries={visits}
              onDelete={(id) =>
                update((prev) => ({ ...prev, visits: prev.visits.filter((v) => v.id !== id) }))
              }
            />
          </div>

          {shots.length > 0 ? (
            <>
              <GroupHeaderRow title="疫苗驱虫全部记录" />
              <div className="group-card">
                <ShotHistory
                  shots={shots}
                  onDelete={(id) =>
                    update((prev) => ({ ...prev, shots: prev.shots.filter((s) => s.id !== id) }))
                  }
                />
              </div>
            </>
          ) : null}

          <GroupHeaderRow title="想说点什么" />
          <div className="group-card">
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
          </div>
        </div>
      )}

      <footer
        className="mt-8 px-gutter text-center text-footnote"
        style={{ color: 'var(--c-label-3)' }}
      >
        数据只存在这台设备的浏览器里，清缓存会丢，记得偶尔导出备份
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

          <Group header="数据" footer="全部在你这台设备的浏览器本地，没有服务器、没有账号。换设备或清缓存会丢，建议导出备份。">
            <div className="row-divider">
              <Row
                icon={<IconDownload size={20} />}
                title="导出备份"
                subtitle="含所有记录与反馈"
                onClick={() => exportData(data)}
              />
              <Row
                icon={<IconBubble size={20} />}
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
              <IconTrash size={20} />
              <span className="text-body">清空所有记录</span>
            </button>
          </Group>
        </div>
      </Sheet>
    </div>
  )
}
