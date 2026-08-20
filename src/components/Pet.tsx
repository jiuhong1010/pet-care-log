import { useState } from 'react'
import { SPECIES_LABEL, type Pet, type Species } from '../types'
import { describeAge } from '../lib/date'
import { Field, Sheet } from './ui'

const AVATARS = ['🐱', '🐈', '🐈‍⬛', '🐶', '🐕', '🐩', '🐰', '🐹', '🦜', '🐢']

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
    <div className="flex flex-wrap items-center gap-2">
      {pets.map((p) => {
        const active = p.id === activeId
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p.id)}
            aria-pressed={active}
            className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-bold transition
              ${
                active
                  ? 'border-peach-400 bg-peach-300/30 text-cocoa-800 shadow-soft'
                  : 'border-cream-300 bg-milk text-cocoa-600 hover:border-peach-300'
              }`}
          >
            <span aria-hidden="true" className="text-lg">
              {p.avatar}
            </span>
            {p.name}
          </button>
        )
      })}
      <button
        type="button"
        onClick={onAdd}
        className="rounded-full border-2 border-dashed border-cocoa-400/40 px-4 py-2 text-sm
          font-bold text-cocoa-400 transition hover:border-peach-400 hover:text-peach-500"
      >
        ＋ 加一只
      </button>
    </div>
  )
}

export function PetHeader({ pet }: { pet: Pet }) {
  const age = describeAge(pet.birthday)
  return (
    <div className="flex items-center gap-4">
      <div
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full
          border-2 border-cream-300 bg-cream-200 text-3xl"
        aria-hidden="true"
      >
        {pet.avatar}
      </div>
      <div className="min-w-0">
        <h1 className="truncate font-hand text-2xl font-bold text-cocoa-800">{pet.name}</h1>
        <p className="text-sm text-cocoa-400">
          {SPECIES_LABEL[pet.species]}
          {age ? ` · ${age}` : ''}
        </p>
      </div>
    </div>
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
    <Sheet open={open} title="添加一只毛孩子" onClose={onClose}>
      <div className="space-y-4">
        <Field label="它叫什么">
          <input
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="比如：糯米"
            autoFocus
          />
        </Field>

        <Field label="选个头像">
          <div className="flex flex-wrap gap-2">
            {AVATARS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAvatar(a)}
                aria-pressed={avatar === a}
                aria-label={`头像 ${a}`}
                className={`h-11 w-11 rounded-2xl border-2 text-xl transition
                  ${
                    avatar === a
                      ? 'border-peach-400 bg-peach-300/30 scale-105'
                      : 'border-cream-300 bg-cream-50 hover:border-peach-300'
                  }`}
              >
                <span aria-hidden="true">{a}</span>
              </button>
            ))}
          </div>
        </Field>

        <Field label="种类">
          <div className="flex gap-2">
            {(Object.keys(SPECIES_LABEL) as Species[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpecies(s)}
                aria-pressed={species === s}
                className={`flex-1 rounded-2xl border-2 py-2 text-sm font-bold transition
                  ${
                    species === s
                      ? 'border-peach-400 bg-peach-300/30 text-cocoa-800'
                      : 'border-cream-300 bg-cream-50 text-cocoa-600 hover:border-peach-300'
                  }`}
              >
                {SPECIES_LABEL[s]}
              </button>
            ))}
          </div>
        </Field>

        <Field label="生日" hint="不知道也没关系，可以留空">
          <input
            type="date"
            className="field"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
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
            存好了
          </button>
        </div>
      </div>
    </Sheet>
  )
}
