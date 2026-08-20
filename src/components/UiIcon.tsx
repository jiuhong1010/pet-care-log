import {
  ChartLineUp,
  ChatCircleDots,
  Check,
  Clock,
  DownloadSimple,
  FirstAidKit,
  GearSix,
  PawPrint,
  Pill,
  Plus,
  Syringe,
  Trash,
  WarningCircle,
  X,
  type Icon,
  type IconProps,
} from '@phosphor-icons/react'

const iconRegistry = {
  chart: ChartLineUp,
  check: Check,
  clock: Clock,
  close: X,
  download: DownloadSimple,
  feedback: ChatCircleDots,
  medicalKit: FirstAidKit,
  paw: PawPrint,
  pill: Pill,
  plus: Plus,
  settings: GearSix,
  syringe: Syringe,
  trash: Trash,
  warning: WarningCircle,
} satisfies Record<string, Icon>

export type UiIconName = keyof typeof iconRegistry

type UiIconProps = Omit<IconProps, 'ref'> & {
  name: UiIconName
}

/** 产品唯一的 UI glyph 入口：业务组件只使用语义名称，不直接依赖图标库。 */
export function UiIcon({
  name,
  size = 22,
  weight = 'regular',
  className = '',
  ...props
}: UiIconProps) {
  const IconComponent = iconRegistry[name]

  return (
    <IconComponent
      size={size}
      weight={weight}
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  )
}
