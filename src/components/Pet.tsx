import { useState } from 'react'
import { SPECIES_LABEL, type Pet, type Species } from '../types'
import { describeAge } from '../lib/date'
import { FormRow, Group, Segmented, Sheet } from './ui'
import { IconPlus } from './icons'

const AVATARS = ['🐱', '🐈', '🐈‍⬛', '🐶', '🐕', '🐩', '🐰', '🐹', '🦜', '🐢']

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
    <div className="flex gap-2 overflow-x-auto px-gutter pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {pets.map((p) => {
        const active = p.id === activeId
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p.id)}
            aria-pressed={active}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-subheadline
              font-medium transition duration-150 ease-ios active:opacity-60
              ${active ? 'bg-blue text-white' : 'text-label'}`}
            style={active ? undefined : { background: 'var(--c-fill-3)' }}
          >
            <span aria-hidden="true">{p.avatar}</span>
            {p.name}
          </button>
        )
      })}
      <button
        type="button"
        onClick={onAdd}
        aria-label="添加宠物"
        className="flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-subheadline
          font-medium text-blue transition active:opacity-60"
        style={{ background: 'var(--c-fill-3)' }}
      >
        <IconPlus size={16} />
      </button>
    </div>
  )
}

/** 宠物信息卡：头像 + 名字 + 年龄 */
export function PetHeader({ pet }: { pet: Pet }) {
  const age = describeAge(pet.birthday)
  return (
    <Group>
      <div className="flex items-center gap-3.5 px-gutter py-3.5">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-3xl"
          style={{ background: 'var(--c-fill-3)' }}
          aria-hidden="true"
        >
          {pet.avatar}
        </div>
        <div className="min-w-0">
          <p className="truncate text-title3 font-semibold text-label">{pet.name}</p>
          <p className="text-subheadline" style={{ color: 'var(--c-label-2)' }}>
            {SPECIES_LABEL[pet.species]}
            {age ? ` · ${age}` : ''}
          </p>
        </div>
      </div>
    </Group>
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
          <div className="flex flex-wrap gap-2 px-gutter py-3">
            {AVATARS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAvatar(a)}
                aria-pressed={avatar === a}
                aria-label={`头像 ${a}`}
                className={`h-11 w-11 rounded-full text-xl transition duration-150 ease-ios
                  ${avatar === a ? 'ring-2 ring-blue' : ''}`}
                style={{ background: 'var(--c-fill-3)' }}
              >
                <span aria-hidden="true">{a}</span>
              </button>
            ))}
          </div>
        </Group>
      </div>
    </Sheet>
  )
}
