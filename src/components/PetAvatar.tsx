import blackCat from '../assets/generated/pet-avatars-v4/black-cat.png'
import goldenRetriever from '../assets/generated/pet-avatars-v4/golden-retriever.png'
import greenParrot from '../assets/generated/pet-avatars-v4/green-parrot.png'
import hamster from '../assets/generated/pet-avatars-v4/hamster.png'
import lopRabbit from '../assets/generated/pet-avatars-v4/lop-rabbit.png'
import orangeCat from '../assets/generated/pet-avatars-v4/orange-cat.png'
import shibaInu from '../assets/generated/pet-avatars-v4/shiba-inu.png'
import silverCat from '../assets/generated/pet-avatars-v4/silver-cat.png'
import turtle from '../assets/generated/pet-avatars-v4/turtle.png'
import whitePoodle from '../assets/generated/pet-avatars-v4/white-poodle.png'

export const PET_AVATAR_OPTIONS = [
  { value: '🐱', label: '橘猫', image: orangeCat },
  { value: '🐈', label: '银灰猫', image: silverCat },
  { value: '🐈‍⬛', label: '黑猫', image: blackCat },
  { value: '🐶', label: '金毛犬', image: goldenRetriever },
  { value: '🐕', label: '柴犬', image: shibaInu },
  { value: '🐩', label: '白色贵宾犬', image: whitePoodle },
  { value: '🐰', label: '垂耳兔', image: lopRabbit },
  { value: '🐹', label: '金丝熊', image: hamster },
  { value: '🦜', label: '绿色鹦鹉', image: greenParrot },
  { value: '🐢', label: '小乌龟', image: turtle },
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

/** 独立透明肖像使用统一画布；旧数据中的 emoji 值继续兼容。 */
export function PetAvatar({ avatar, className = '', decorative = false }: PetAvatarProps) {
  const details = avatarDetails(avatar)

  return (
    <span
      className={`pet-portrait ${className}`}
      aria-hidden={decorative ? 'true' : undefined}
      aria-label={decorative ? undefined : `${details.label}头像`}
      role={decorative ? undefined : 'img'}
    >
      <img
        className="pet-portrait-art"
        src={details.image}
        alt=""
        draggable="false"
      />
    </span>
  )
}
