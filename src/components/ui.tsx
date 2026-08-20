import type { ReactNode } from 'react'

export function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`card ${className}`}>{children}</div>
}

export function SectionTitle({
  emoji,
  title,
  action,
}: {
  emoji: string
  title: string
  action?: ReactNode
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 font-hand text-xl font-bold text-cocoa-800">
        <span aria-hidden="true">{emoji}</span>
        {title}
      </h2>
      {action}
    </div>
  )
}

export function EmptyHint({
  emoji,
  title,
  hint,
}: {
  emoji: string
  title: string
  hint?: string
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
      <span className="animate-float-slow text-4xl" aria-hidden="true">
        {emoji}
      </span>
      <p className="font-hand text-lg text-cocoa-600">{title}</p>
      {hint ? <p className="max-w-xs text-sm text-cocoa-400">{hint}</p> : null}
    </div>
  )
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: ReactNode
  hint?: string
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-cocoa-400">{hint}</span> : null}
    </label>
  )
}

/** 轻量弹层。移动端从底部升起，桌面端居中 */
export function Sheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="关闭"
        onClick={onClose}
        className="absolute inset-0 bg-cocoa-800/25 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative max-h-[88vh] w-full max-w-lg animate-pop-in overflow-y-auto rounded-t-blob
          border-2 border-cream-300 bg-milk p-5 shadow-lift sm:rounded-blob"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-hand text-xl font-bold text-cocoa-800">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-cocoa-400 transition hover:bg-cream-200 hover:text-cocoa-800"
            aria-label="关闭"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
