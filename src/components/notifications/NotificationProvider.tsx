"use client"

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import type { Notification } from '@/lib/notifications'

// ─── Context value ────────────────────────────────────────────────────────────

interface NotificationContextValue {
  /** All loaded notifications (sorted newest first) */
  notifications: Notification[]
  /** Number of unread notifications */
  unreadCount: number
  /** Loading state for initial fetch */
  loading: boolean
  /** Mark a single notification as read (calls API) */
  markRead: (id: string) => Promise<void>
  /** Mark all notifications as read (calls API) */
  markAllRead: () => Promise<void>
  /** Create a new notification (calls API) */
  push: (input: {
    title: string
    message: string
    type: Notification['type']
    link?: string
    metadata?: Record<string, unknown>
  }) => Promise<void>
  /** Re-fetch from API */
  refresh: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within <NotificationProvider>')
  return ctx
}

// ─── API helpers ──────────────────────────────────────────────────────────────

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(path, init)
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json()
}

function deserialize(raw: Notification & { createdAt: string }): Notification {
  return { ...raw, createdAt: new Date(raw.createdAt) }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 15_000 // poll every 15 seconds for new notifications

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Fetch all ────────────────────────────────────────────────────────────

  const refresh = useCallback(async () => {
    try {
      const data = await apiFetch('/api/notifications')
      setNotifications(data.notifications.map(deserialize))
      setUnreadCount(data.unreadCount)
    } catch (err) {
      console.error('[Notifications] fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Poll for unread count (lightweight) ──────────────────────────────────

  const pollCount = useCallback(async () => {
    try {
      const data = await apiFetch('/api/notifications?countOnly=true')
      const serverCount = data.unreadCount as number
      // If new notifications appeared, do a full refresh
      if (serverCount !== unreadCount) {
        await refresh()
      }
    } catch {
      // silent — polling failure is not critical
    }
  }, [unreadCount, refresh])

  // ── Lifecycle ────────────────────────────────────────────────────────────

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    pollRef.current = setInterval(pollCount, POLL_INTERVAL_MS)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [pollCount])

  // ── Actions ──────────────────────────────────────────────────────────────

  const markRead = useCallback(async (id: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
    setUnreadCount((c) => Math.max(0, c - 1))

    try {
      await apiFetch(`/api/notifications/${id}`, { method: 'PATCH' })
    } catch {
      // Revert on error
      await refresh()
    }
  }, [refresh])

  const markAllRead = useCallback(async () => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    setUnreadCount(0)

    try {
      await apiFetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllRead' }),
      })
    } catch {
      await refresh()
    }
  }, [refresh])

  const push = useCallback(async (input: {
    title: string
    message: string
    type: Notification['type']
    link?: string
    metadata?: Record<string, unknown>
  }) => {
    try {
      const raw = await apiFetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const created = deserialize(raw)
      setNotifications((prev) => [created, ...prev])
      setUnreadCount((c) => c + 1)
    } catch (err) {
      console.error('[Notifications] create failed:', err)
    }
  }, [])

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, loading, markRead, markAllRead, push, refresh }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
