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

const PORTRAIT_FRAMES = [
  { vertical: '0%', scale: 1.18, x: '0%', y: '0%', clipLeft: '0%' },
  { vertical: '0%', scale: 1.15, x: '0%', y: '0%', clipLeft: '0%' },
  { vertical: '0%', scale: 1.15, x: '0%', y: '0%', clipLeft: '0%' },
  { vertical: '0%', scale: 1.15, x: '0%', y: '-1%', clipLeft: '0%' },
  { vertical: '0%', scale: 1.15, x: '0%', y: '0%', clipLeft: '8%' },
  { vertical: '100%', scale: 1.1, x: '0%', y: '0%', clipLeft: '0%' },
  { vertical: '100%', scale: 1.1, x: '0%', y: '0%', clipLeft: '8%' },
  { vertical: '100%', scale: 1.12, x: '0%', y: '0%', clipLeft: '0%' },
  { vertical: '100%', scale: 1.12, x: '-1%', y: '-1%', clipLeft: '0%' },
  { vertical: '100%', scale: 1.25, x: '0%', y: '-2%', clipLeft: '5%' },
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
  const frame = PORTRAIT_FRAMES[index]

  return (
    <span
      className={`pet-portrait ${className}`}
      aria-hidden={decorative ? 'true' : undefined}
      aria-label={decorative ? undefined : `${details.label}头像`}
      role={decorative ? undefined : 'img'}
    >
      <span
        className="pet-portrait-art"
        style={{
          backgroundImage: `url(${avatarSprite})`,
          backgroundPosition: `${horizontalPosition}% ${frame.vertical}`,
          clipPath: `inset(0 0 0 ${frame.clipLeft})`,
          transform: `translateX(-50%) translate(${frame.x}, ${frame.y}) scale(${frame.scale})`,
        }}
        aria-hidden="true"
      />
    </span>
  )
}
