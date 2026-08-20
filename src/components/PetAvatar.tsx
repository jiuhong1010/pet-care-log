import avatarSprite from '../assets/generated/pet-avatar-sprite-v2.png'

export const PET_AVATAR_OPTIONS = [
  { value: '🐱', label: '橘猫' },
  { value: '🐈', label: '银灰猫' },
  { value: '🐈‍⬛', label: '黑猫' },
  { value: '🐶', label: '金毛犬' },
  { value: '🐕', label: '柴犬' },
  { value: '🐩', label: '白色贵宾犬' },
  { value: '🐰', label: '垂耳兔' },
  { value: '🐹', label: '金丝熊' },
  { value: '🦜', label: '绿色鹦鹉' },
  { value: '🐢', label: '小乌龟' },
] as const

const PORTRAIT_VERTICAL_POSITIONS = [
  '8.5%',
  '8.5%',
  '8.5%',
  '8.5%',
  '8.5%',
  '81.5%',
  '81.5%',
  '81.5%',
  '84.5%',
  '93%',
] as const

type PetAvatarProps = {
  avatar: string
  className?: string
  decorative?: boolean
}

function avatarDetails(avatar: string) {
  const index = PET_AVATAR_OPTIONS.findIndex((option) => option.value === avatar)
  return PET_AVATAR_OPTIONS[index >= 0 ? index : 0]
}

/** 从 5×2 插画图集中裁出单只宠物；旧数据中的 emoji 值继续兼容。 */
export function PetAvatar({ avatar, className = '', decorative = false }: PetAvatarProps) {
  const details = avatarDetails(avatar)
  const index = PET_AVATAR_OPTIONS.indexOf(details)
  const column = index % 5
  const horizontalPosition = column * 25

  return (
    <span
      className={`pet-portrait ${className}`}
      style={{
        backgroundImage: `url(${avatarSprite})`,
        backgroundPosition: `${horizontalPosition}% ${PORTRAIT_VERTICAL_POSITIONS[index]}`,
      }}
      aria-hidden={decorative ? 'true' : undefined}
      aria-label={decorative ? undefined : `${details.label}头像`}
      role={decorative ? undefined : 'img'}
    />
  )
}
