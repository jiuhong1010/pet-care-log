/**
 * SF Symbols 风格的线性图标。
 *
 * 手写而非引图标库的原因：iOS 观感的关键在于图标与文字的视觉重量一致，
 * 通用图标库（Feather、Lucide 等）的描边比例与 SF Symbols 不同，混在一起会"不像"。
 *
 * 遵循的 SF Symbols 约定：
 * - 圆头线帽 + 圆角连接（Apple 自己的自定义符号教程明确要求 round cap / round join）
 * - 描边宽度随字号缩放，而非线性放大 —— 这里用 strokeWidth 相对 24 视口固定为 1.8，
 *   对应 Regular 字重的视觉密度
 * - 光学垂直居中而非几何居中，故用 -translate-y-px 微调基线
 */

type IconProps = {
  className?: string
  /** 像素尺寸，默认 22（对应 body 17px 旁的图标） */
  size?: number
}

function Svg({
  children,
  className = '',
  size = 22,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

/** 注射器：疫苗 */
export function IconSyringe(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M17.5 6.5 21 3" />
      <path d="m14 5 5 5" />
      <path d="M18 9 9.5 17.5a2 2 0 0 1-1.2.6l-2.6.3.3-2.6a2 2 0 0 1 .6-1.2L15 6z" />
      <path d="m6 15-3 3 3 3" />
      <path d="M11.5 9.5l1.5 1.5" />
    </Svg>
  )
}

/** 药丸：驱虫 / 用药 */
export function IconPill(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-45 12 12)" />
      <path d="M9.2 6.8 17.2 14.8" />
    </Svg>
  )
}

/** 时钟：到期提醒 */
export function IconClock(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </Svg>
  )
}

/** 折线图：体重 */
export function IconChart(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M3.5 19.5h17" />
      <path d="M6 15.5l4-4.5 3 2.5 5-6" />
    </Svg>
  )
}

/** 十字医疗箱：看病记录 */
export function IconCross(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3" y="6.5" width="18" height="13" rx="3" />
      <path d="M9 6.5V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v1.5" />
      <path d="M12 10.5v5M9.5 13h5" />
    </Svg>
  )
}

/** 加号 */
export function IconPlus(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  )
}

/** 对勾：无待办 */
export function IconCheck(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4.5 12.5l5 5 10-11" />
    </Svg>
  )
}

/** 感叹号圆圈：逾期 */
export function IconExclamation(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5" />
      <circle cx="12" cy="16.4" r="0.6" fill="currentColor" stroke="none" />
    </Svg>
  )
}

/** 齿轮：设置 */
export function IconGear(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8v2.4M12 18.8v2.4M4.5 4.5l1.7 1.7M17.8 17.8l1.7 1.7M2.8 12h2.4M18.8 12h2.4M4.5 19.5l1.7-1.7M17.8 6.2l1.7-1.7" />
    </Svg>
  )
}

/** 垃圾桶：删除 */
export function IconTrash(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 7h16" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
      <path d="M6 7l.8 12A2 2 0 0 0 8.8 21h6.4a2 2 0 0 0 2-1.9L18 7" />
      <path d="M10.5 11v6M13.5 11v6" />
    </Svg>
  )
}

/** 右尖括号：列表可进入指示 */
export function IconChevron(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M9.5 5.5l6.5 6.5-6.5 6.5" />
    </Svg>
  )
}

/** 关闭 */
export function IconXmark(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  )
}

/** 下载箭头：导出 */
export function IconDownload(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 3.5v11" />
      <path d="M7.5 10.5 12 15l4.5-4.5" />
      <path d="M4 17.5v1A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5v-1" />
    </Svg>
  )
}

/** 对话气泡：反馈 */
export function IconBubble(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M20.5 11.5c0 4.1-3.8 7.5-8.5 7.5-1 0-2-.15-2.9-.43L4.5 20.5l1.2-3.4A7 7 0 0 1 3.5 11.5C3.5 7.4 7.3 4 12 4s8.5 3.4 8.5 7.5z" />
    </Svg>
  )
}

/** 爪印：品牌标识 */
export function IconPaw(p: IconProps) {
  return (
    <Svg {...p}>
      <ellipse cx="12" cy="15.2" rx="4.2" ry="3.4" />
      <ellipse cx="6.3" cy="10.4" rx="1.9" ry="2.4" />
      <ellipse cx="17.7" cy="10.4" rx="1.9" ry="2.4" />
      <ellipse cx="9.6" cy="6.4" rx="1.8" ry="2.3" />
      <ellipse cx="14.4" cy="6.4" rx="1.8" ry="2.3" />
    </Svg>
  )
}
