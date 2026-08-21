const DB_NAME = 'pet-care-log.media.v1'
const STORE_NAME = 'attachments'

type StoredAttachment = {
  id: string
  blob: Blob
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('当前浏览器不支持本地附件'))
      return
    }
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('无法打开本地附件库'))
  })
}

export async function saveAttachment(id: string, file: File): Promise<boolean> {
  try {
    const db = await openDatabase()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).put({ id, blob: file } satisfies StoredAttachment)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error ?? new Error('无法保存附件'))
    })
    db.close()
    return true
  } catch {
    return false
  }
}

export async function loadAttachment(id: string): Promise<Blob | null> {
  try {
    const db = await openDatabase()
    const result = await new Promise<StoredAttachment | undefined>((resolve, reject) => {
      const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(id)
      request.onsuccess = () => resolve(request.result as StoredAttachment | undefined)
      request.onerror = () => reject(request.error)
    })
    db.close()
    return result?.blob ?? null
  } catch {
    return null
  }
}

export async function removeAttachment(id: string): Promise<void> {
  try {
    const db = await openDatabase()
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).delete(id)
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve()
    })
    db.close()
  } catch {
    // 附件删除失败不应阻塞结构化记录删除；下一次清理再处理即可。
  }
}
