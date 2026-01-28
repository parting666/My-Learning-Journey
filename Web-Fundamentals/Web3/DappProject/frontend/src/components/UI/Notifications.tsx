import React, { createContext, useContext, useCallback, useMemo, useRef, useState } from 'react'

type NoticeType = 'info' | 'success' | 'error' | 'warning'

type Notice = {
  id: string
  type: NoticeType
  message: string
}

type NotifyFn = (message: string, type?: NoticeType) => void

const NotificationsContext = createContext<{ notify: NotifyFn } | undefined>(undefined)

export function useNotify() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error('useNotify must be used within NotificationsProvider')
  return ctx.notify
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notices, setNotices] = useState<Notice[]>([])
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const remove = useCallback((id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id))
    const t = timers.current[id]
    if (t) {
      clearTimeout(t)
      delete timers.current[id]
    }
  }, [])

  const notify: NotifyFn = useCallback((message: string, type: NoticeType = 'info') => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`
    setNotices((prev) => [{ id, type, message }, ...prev].slice(0, 5))
    timers.current[id] = setTimeout(() => remove(id), 5000)
  }, [remove])

  const value = useMemo(() => ({ notify }), [notify])

  return (
    <NotificationsContext.Provider value={value}>
      {children}
      <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 space-y-2 w-[92%] max-w-xl">
        {notices.map((n) => (
          <div
            key={n.id}
            className={
              `rounded-md px-4 py-2 shadow border text-sm ` +
              (n.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : n.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-700'
                : n.type === 'warning'
                ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                : 'bg-blue-50 border-blue-200 text-blue-700')
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div className="break-words">{n.message}</div>
              <button onClick={() => remove(n.id)} className="text-xs opacity-70 hover:opacity-100">关闭</button>
            </div>
          </div>
        ))}
      </div>
    </NotificationsContext.Provider>
  )
}