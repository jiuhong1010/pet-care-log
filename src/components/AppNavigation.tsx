export type WorkspaceView = 'today' | 'timeline' | 'pack' | 'records'

const items: { value: WorkspaceView; label: string }[] = [
  { value: 'today', label: '今天' },
  { value: 'timeline', label: '时间线' },
  { value: 'pack', label: '看诊包' },
  { value: 'records', label: '长期档案' },
]

export function AppNavigation({
  value,
  onChange,
}: {
  value: WorkspaceView
  onChange: (view: WorkspaceView) => void
}) {
  return (
    <nav className="workspace-nav" aria-label="主要功能">
      <div className="workspace-nav-inner">
        {items.map((item) => {
          const active = item.value === value
          return (
            <button
              key={item.value}
              type="button"
              className={`workspace-nav-item ${active ? 'is-active' : ''}`}
              aria-current={active ? 'page' : undefined}
              onClick={() => onChange(item.value)}
            >
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
