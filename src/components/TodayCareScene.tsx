import medicationArt from '../assets/generated/story-thumbnails/medication.png'
import observationArt from '../assets/generated/story-thumbnails/observation.png'
import vaccineArt from '../assets/generated/story-thumbnails/vaccine.png'
import visitPackArt from '../assets/generated/story-thumbnails/visit-pack.png'
import type { DueInfo } from '../lib/due'
import { humanizeDueDays, shortDate } from '../lib/date'
import type { HealthObservation, MedEntry, MedicationLog, Pet } from '../types'
import { PetAvatar } from './PetAvatar'
import { UiIcon } from './UiIcon'

const storyIllustrations = {
  medication: medicationArt,
  observation: observationArt,
  vaccine: vaccineArt,
  visitPack: visitPackArt,
} as const

type StoryIllustrationName = keyof typeof storyIllustrations

type StoryNode = {
  id: string
  time: string
  title: string
  detail: string
  illustration: StoryIllustrationName
  tone: 'mint' | 'sky' | 'sun'
  onClick: () => void
}

function clockTime(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '刚刚'
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function activeMedication(meds: MedEntry[]) {
  return meds.find((med) => !med.endDate) ?? null
}

export function TodayCareScene({
  pet,
  observations,
  meds,
  medicationLogs,
  dues,
  onRecord,
  onMedication,
  onShot,
  onPack,
}: {
  pet: Pet
  observations: HealthObservation[]
  meds: MedEntry[]
  medicationLogs: MedicationLog[]
  dues: DueInfo[]
  onRecord: () => void
  onMedication: () => void
  onShot: () => void
  onPack: () => void
}) {
  const latestObservation = [...observations].sort((a, b) =>
    b.occurredAt.localeCompare(a.occurredAt),
  )[0]
  const medication = activeMedication(meds)
  const medicationLog = medication
    ? [...medicationLogs]
        .filter((log) => log.medId === medication.id)
        .sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0]
    : null
  const due = dues[0]

  const nodes: StoryNode[] = [
    latestObservation
      ? {
          id: 'observation',
          time: clockTime(latestObservation.occurredAt),
          title: latestObservation.label,
          detail: latestObservation.note || '这条变化已经接入连续观察',
          illustration: 'observation',
          tone: 'mint',
          onClick: onRecord,
        }
      : {
          id: 'observation',
          time: '刚刚',
          title: '留下一点变化',
          detail: '食欲、精神、排便或任何不同',
          illustration: 'observation',
          tone: 'mint',
          onClick: onRecord,
        },
    medication
      ? {
          id: 'medication',
          time: medicationLog ? clockTime(medicationLog.completedAt) : '今天',
          title: medication.name,
          detail: medicationLog ? `最近由 ${medicationLog.caregiver} 完成` : medication.dosage,
          illustration: 'medication',
          tone: 'sun',
          onClick: onMedication,
        }
      : {
          id: 'medication',
          time: '用药',
          title: '还没有用药安排',
          detail: '需要时把药名与用法接进来',
          illustration: 'medication',
          tone: 'sun',
          onClick: onMedication,
        },
    due
      ? {
          id: 'due',
          time: due.nextDate ? shortDate(due.nextDate) : '待安排',
          title: due.shot.name,
          detail: humanizeDueDays(due.daysLeft),
          illustration: 'vaccine',
          tone: 'sky',
          onClick: onShot,
        }
      : {
          id: 'due',
          time: '接下来',
          title: '近期没有到期事项',
          detail: '补充疫苗或驱虫后会自动提醒',
          illustration: 'vaccine',
          tone: 'sky',
          onClick: onShot,
        },
  ]

  return (
    <section className="today-story" aria-labelledby="today-story-heading">
      <div className="today-story-heading">
        <div>
          <p className="page-context">今天</p>
          <h2 id="today-story-heading">{pet.name} 的照护轨迹</h2>
        </div>
        <PetAvatar avatar={pet.avatar} className="today-story-avatar" decorative />
      </div>

      <div className="today-story-canvas">
        <span className="story-blob story-blob-one" aria-hidden="true" />
        <span className="story-blob story-blob-two" aria-hidden="true" />
        <PetAvatar
          key={`${pet.id}-${pet.avatar}`}
          avatar={pet.avatar}
          className="story-cat story-cat-pet"
          decorative
        />

        <div className="story-trail">
          <svg
            className="story-route"
            viewBox="0 0 320 480"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M36 18 C 94 38, 12 82, 70 120 S 186 146, 124 205 S 48 272, 116 318 S 250 370, 292 452" />
          </svg>

          {nodes.map((node, index) => (
            <button
              type="button"
              key={node.id}
              className={`story-node story-node-${index + 1} is-${node.tone}`}
              onClick={node.onClick}
            >
              <span className="story-node-time">{node.time}</span>
              <span className="story-node-visual" aria-hidden="true">
                <img src={storyIllustrations[node.illustration]} alt="" loading="eager" decoding="async" />
              </span>
              <span className="story-node-copy">
                <strong>{node.title}</strong>
                <small>{node.detail}</small>
              </span>
            </button>
          ))}
        </div>
      </div>

      <button type="button" className="story-pack" onClick={onPack}>
        <span className="story-pack-art" aria-hidden="true">
          <img src={storyIllustrations.visitPack} alt="" loading="lazy" decoding="async" />
        </span>
        <span>
          <strong>看诊包</strong>
          <small>
            {observations.length
              ? `已串起 ${observations.length} 条观察，随时可以带去看诊`
              : '观察会自动整理到这里，看诊时不遗漏'}
          </small>
        </span>
        <UiIcon name="chevronRight" size={18} />
      </button>

      <button type="button" className="story-primary-action" onClick={onRecord}>
        <UiIcon name="edit" size={21} />
        记下刚刚的变化
      </button>
    </section>
  )
}
