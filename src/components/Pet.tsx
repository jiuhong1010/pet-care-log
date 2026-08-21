import { useState } from 'react'
import { SPECIES_LABEL, type Pet, type Species } from '../types'
import { describeAge } from '../lib/date'
import { FormRow, Group, Segmented, Sheet } from './ui'
import { UiIcon } from './UiIcon'
import { PET_AVATAR_OPTIONS, PetAvatar } from './PetAvatar'

/** 宠物切换：横向滚动的胶囊，选中态用 tint 填充 */
export function PetSwitcher({
  pets,
  activeId,
  onSelect,
  onAdd,
}: {
  pets: Pet[]
  activeId: string | null
  onSelect: (id: string) => void
  onAdd: () => void
}) {
  return (
    <div className="pet-switcher">
      {pets.map((p) => {
        const active = p.id === activeId
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p.id)}
            aria-pressed={active}
            className={`pet-switch min-h-tap
              ${active ? 'bg-blue text-white' : 'text-label'}`}
            style={active ? undefined : { background: 'var(--c-fill-3)' }}
          >
            <PetAvatar avatar={p.avatar} className="pet-switch-avatar" decorative />
            <span className="pet-switch-name">{p.name}</span>
          </button>
        )
      })}
      <button
        type="button"
        onClick={onAdd}
        aria-label="添加宠物"
        className="pet-switch min-h-tap text-blue"
        style={{ background: 'var(--c-fill-3)' }}
      >
        <UiIcon name="plus" size={16} />
      </button>
    </div>
  )
}

/** 当前宠物与近期照护状态 */
export function PetHeader({ pet, dueCount }: { pet: Pet; dueCount: number }) {
  const age = describeAge(pet.birthday)
  return (
    <section className="pet-hero" aria-labelledby={`pet-${pet.id}`}>
      <div className="pet-identity">
        <PetAvatar avatar={pet.avatar} className="pet-avatar" decorative />
        <div className="min-w-0">
          <p className="pet-context">正在照顾</p>
          <h1 id={`pet-${pet.id}`} className="pet-name">
            {pet.name}
          </h1>
          <p className="pet-meta">
            {SPECIES_LABEL[pet.species]}
            {age ? ` · ${age}` : ''}
          </p>
        </div>
      </div>

      <div className={`care-status ${dueCount > 0 ? 'needs-attention' : 'all-clear'}`}>
        <span className="care-status-icon" aria-hidden="true">
          {dueCount > 0 ? (
            <UiIcon name="clock" size={19} />
          ) : (
            <UiIcon name="check" size={19} />
          )}
        </span>
        <span>
          <strong>{dueCount > 0 ? `${dueCount} 件事需要留意` : '最近都安排妥了'}</strong>
          <small>{dueCount > 0 ? '看看日期，别错过下一次' : '未来 30 天没有到期项目'}</small>
        </span>
      </div>
    </section>
  )
}

export function PetFormSheet({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (input: { name: string; species: Species; birthday: string; avatar: string }) => void
}) {
  const [name, setName] = useState('')
  const [species, setSpecies] = useState<Species>('cat')
  const [birthday, setBirthday] = useState('')
  const [avatar, setAvatar] = useState('🐱')

  const reset = () => {
    setName('')
    setSpecies('cat')
    setBirthday('')
    setAvatar('🐱')
  }

  const submit = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    onSubmit({ name: trimmed, species, birthday, avatar })
    reset()
    onClose()
  }

  return (
    <Sheet
      open={open}
      title="新增宠物"
      onClose={onClose}
      onSubmit={submit}
      submitLabel="添加"
      submitDisabled={!name.trim()}
    >
      <div className="space-y-4">
        <Group>
          <div className="row-divider">
            <FormRow label="名字">
              <input
                className="field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="必填"
                autoFocus
              />
            </FormRow>
            <FormRow label="生日">
              <input
                type="date"
                className="field"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </FormRow>
          </div>
        </Group>

        <Group header="种类">
          <div className="px-gutter py-2.5">
            <Segmented
              value={species}
              onChange={setSpecies}
              options={(Object.keys(SPECIES_LABEL) as Species[]).map((s) => ({
                value: s,
                label: SPECIES_LABEL[s],
              }))}
            />
          </div>
        </Group>

        <Group header="头像">
          <div className="avatar-picker-grid px-gutter py-3">
            {PET_AVATAR_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setAvatar(option.value)}
                aria-pressed={avatar === option.value}
                aria-label={`选择${option.label}头像`}
                className="avatar-choice"
              >
                <PetAvatar avatar={option.value} decorative />
              </button>
            ))}
          </div>
        </Group>
      </div>
    </Sheet>
  )
}
