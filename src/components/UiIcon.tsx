import {
  ChartLineUp,
  CaretDown,
  CaretRight,
  ChatCircleDots,
  Check,
  Circle,
  Clock,
  DownloadSimple,
  FirstAidKit,
  ArrowRight,
  LockSimple,
  PawPrint,
  Paperclip,
  Pill,
  Plus,
  Printer,
  SlidersHorizontal,
  Syringe,
  Trash,
  WarningCircle,
  X,
  type Icon,
  type IconProps,
} from '@phosphor-icons/react'

const iconRegistry = {
  chart: ChartLineUp,
  arrowRight: ArrowRight,
  chevronDown: CaretDown,
  chevronRight: CaretRight,
  check: Check,
  circle: Circle,
  clock: Clock,
  close: X,
  download: DownloadSimple,
  feedback: ChatCircleDots,
  medicalKit: FirstAidKit,
  lock: LockSimple,
  paperclip: Paperclip,
  paw: PawPrint,
  pill: Pill,
  plus: Plus,
  printer: Printer,
  settings: SlidersHorizontal,
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
