import { useEffect, useRef, type ReactNode } from 'react'
import { IconXmark } from './icons'

/** inset grouped 分组：标题 + 卡片 */
export function Group({
  header,
  footer,
  children,
  className = '',
}: {
  header?: string
  footer?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={className}>
      {header ? <h2 className="group-header">{header}</h2> : null}
      <div className="group-card">{children}</div>
      {footer ? (
        <p className="px-gutter pt-1.5 text-footnote" style={{ color: 'var(--c-label-2)' }}>
          {footer}
        </p>
      ) : null}
    </section>
  )
}

/** 卡片内的一行 */
export function Row({
  icon,
  title,
  subtitle,
  detail,
  trailing,
  onClick,
}: {
  icon?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  detail?: ReactNode
  trailing?: ReactNode
  onClick?: () => void
}) {
  const inner = (
    <>
      {icon ? <span className="text-blue">{icon}</span> : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-body text-label">{title}</span>
        {subtitle ? (
          <span className="block truncate text-footnote" style={{ color: 'var(--c-label-2)' }}>
            {subtitle}
          </span>
        ) : null}
      </span>
      {detail ? (
        <span className="shrink-0 text-body" style={{ color: 'var(--c-label-2)' }}>
          {detail}
        </span>
      ) : null}
      {trailing}
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="row w-full text-left transition duration-100 ease-ios active:bg-fill-3"
      >
        {inner}
      </button>
    )
  }
  return <div className="row">{inner}</div>
}

/** 大标题栏，对应 iOS 的 large title navigation bar */
export function LargeTitle({
  title,
  action,
}: {
  title: string
  action?: ReactNode
}) {
  return (
    <header className="flex items-end justify-between gap-3 px-gutter pb-2 pt-3">
      <h1 className="font-rounded text-large-title font-bold tracking-tight text-label">
        {title}
      </h1>
      {action}
    </header>
  )
}

export function EmptyState({
  icon,
  title,
  hint,
}: {
  icon: ReactNode
  title: string
  hint?: string
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-9 text-center">
      <span style={{ color: 'var(--c-label-3)' }}>{icon}</span>
      <p className="text-callout" style={{ color: 'var(--c-label-2)' }}>
        {title}
      </p>
      {hint ? (
        <p className="max-w-xs text-footnote" style={{ color: 'var(--c-label-3)' }}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}

/** 表单里的一个字段：左标签右输入，iOS 表单的标准形态 */
export function FormRow({
  label,
  children,
  stacked = false,
}: {
  label: string
  children: ReactNode
  stacked?: boolean
}) {
  if (stacked) {
    return (
      <div className="px-gutter py-2.5">
        <span className="mb-1 block text-footnote" style={{ color: 'var(--c-label-2)' }}>
          {label}
        </span>
        {children}
      </div>
    )
  }
  return (
    <label className="row">
      <span className="w-[5.5rem] shrink-0 text-body text-label">{label}</span>
      <span className="min-w-0 flex-1">{children}</span>
    </label>
  )
}

/**
 * 弹层。移动端从底部升起（iOS sheet），桌面端居中。
 * 顶部是 iOS 风格的三栏导航条：取消 / 标题 / 完成。
 */
export function Sheet({
  open,
  title,
  onClose,
  onSubmit,
  submitLabel = '完成',
  submitDisabled = false,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  onSubmit?: () => void
  submitLabel?: string
  submitDisabled?: boolean
  children: ReactNode
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current()
    }
    document.addEventListener('keydown', onKeyDown)

    window.requestAnimationFrame(() => {
      if (document.activeElement === document.body) dialogRef.current?.focus()
    })

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      previousFocus?.focus()
    }
  }, [open])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="关闭"
        onClick={onClose}
        className="sheet-backdrop"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="sheet-panel"
      >
        <div className="sheet-header">
          <button type="button" onClick={onClose} className="btn-plain">
            取消
          </button>
          <span className="text-headline font-semibold text-label">{title}</span>
          {onSubmit ? (
            <button
              type="button"
              onClick={onSubmit}
              disabled={submitDisabled}
              className="btn-plain font-semibold"
            >
              {submitLabel}
            </button>
          ) : (
            <button type="button" onClick={onClose} className="btn-plain" aria-label="关闭">
              <IconXmark size={20} />
            </button>
          )}
        </div>
        <div className="sheet-content">{children}</div>
      </div>
    </div>
  )
}

/** 分段控件，对应 UISegmentedControl */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div
      className="flex gap-1 rounded-control p-1"
      style={{ background: 'var(--c-fill-3)' }}
      role="tablist"
    >
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`min-h-tap flex-1 rounded-[8px] px-3 py-2 text-subheadline font-medium transition duration-150 ease-ios
              ${active ? 'bg-bg-card text-label shadow-sm' : 'text-label'}`}
            style={active ? undefined : { color: 'var(--c-label-2)' }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
