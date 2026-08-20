import { useCallback, useEffect, useState } from 'react'
import { loadData, saveData } from '../lib/storage'
import type { AppData } from '../types'

/**
 * 全站唯一的数据入口。所有修改都走 update()，写入失败时把 saveFailed 置真，
 * 由界面提示用户（例如 Safari 无痕模式下 localStorage 不可写）。
 */
export function useAppData() {
  const [data, setData] = useState<AppData>(() => loadData())
  const [saveFailed, setSaveFailed] = useState(false)

  useEffect(() => {
    const ok = saveData(data)
    setSaveFailed(!ok)
  }, [data])

  const update = useCallback((fn: (prev: AppData) => AppData) => {
    setData((prev) => fn(prev))
  }, [])

  return { data, update, saveFailed }
}
