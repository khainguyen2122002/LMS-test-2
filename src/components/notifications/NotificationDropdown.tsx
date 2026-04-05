"use client"

import React, { useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, CheckCheck, BellOff, Trash2, Loader2 } from 'lucide-react'
import { useNotifications } from '@/components/notifications/NotificationProvider'
import { timeAgo, NOTIFICATION_THEME } from '@/lib/notifications'
import type { Notification, NotificationType } from '@/lib/notifications'

interface Props {
  open: boolean
  onClose: () => void
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────

const FILTER_TABS: { key: 'all' | NotificationType; label: string }[] = [
  { key: 'all',        label: 'Tất cả' },
  { key: 'course',     label: '📚 Khóa học' },
  { key: 'document',   label: '📄 Tài liệu' },
  { key: 'system',     label: '⚙️ Hệ thống' },
  { key: 'schedule',   label: '📅 Lịch trình' },
  { key: 'assignment', label: '📝 Bài tập' },
]

export const NotificationDropdown: React.FC<Props> = ({ open, onClose }) => {
  const { notifications, unreadCount, loading, markRead, markAllRead } = useNotifications()
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<'all' | NotificationType>('all')

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, onClose])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Reset filter when opening
  useEffect(() => {
    if (open) setFilter('all')
  }, [open])

  if (!open) return null

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter((n) => n.type === filter)

  const handleClick = async (n: Notification) => {
    if (!n.isRead) await markRead(n.id)
    if (n.link) {
      router.push(n.link)
      onClose()
    }
  }

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-2 w-[400px] max-h-[560px] rounded-2xl shadow-2xl shadow-black/50 border border-white/[0.06] overflow-hidden z-50 flex flex-col dark:bg-[#1a1a1a] light:bg-white"
      role="dialog"
      aria-label="Thông báo"
    >
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="px-5 pt-4 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold dark:text-white light:text-neutral-900">Thông báo</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold bg-[#F9A825] text-[#2a1800] px-2 py-0.5 rounded-full">
                {unreadCount} mới
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <CheckCheck size={14} /> Đọc hết
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/5 text-neutral-500 hover:dark:text-white light:text-neutral-900 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Filter tabs ──────────────────────────────────────────── */}
        <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                filter === tab.key
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-neutral-500 hover:dark:text-neutral-300 light:text-neutral-600 hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Notification List ─────────────────────────────────────── */}
      <div className="overflow-y-auto flex-1 overscroll-contain">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="text-neutral-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 px-6">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <BellOff size={22} className="text-neutral-600" />
            </div>
            <p className="text-sm text-neutral-500 font-medium">
              {filter === 'all' ? 'Không có thông báo' : 'Không có thông báo loại này'}
            </p>
            <p className="text-xs text-neutral-600 mt-1">Bạn sẽ nhận thông báo khi có cập nhật mới.</p>
          </div>
        ) : (
          filtered.map((n) => {
            const theme = NOTIFICATION_THEME[n.type]
            return (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={`w-full text-left px-5 py-3.5 flex gap-3 transition-all border-b border-white/[0.03] group ${
                  n.isRead
                    ? 'opacity-70 hover:opacity-100 hover:bg-white/[0.03]'
                    : 'bg-emerald-500/[0.04] hover:bg-emerald-500/[0.08]'
                }`}
              >
                {/* Type icon */}
                <div className={`w-9 h-9 rounded-xl ${theme.bg} flex items-center justify-center text-sm flex-shrink-0 mt-0.5`}>
                  {theme.emoji}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <p className={`text-[13px] font-semibold leading-snug ${n.isRead ? 'dark:text-neutral-400 light:text-neutral-500' : 'dark:text-white light:text-neutral-900'}`}>
                      {n.title}
                    </p>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#F9A825] flex-shrink-0 mt-1.5 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed mb-1">
                    {n.message}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neutral-600 font-medium">{timeAgo(n.createdAt)}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${theme.bg} ${theme.color} font-medium`}>
                      {theme.label}
                    </span>
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>

      {/* ── Footer ────────────────────────────────────────────────── */}
      {filtered.length > 0 && (
        <div className="border-t border-[var(--border)] px-5 py-3">
          <button className="w-full text-center text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider">
            Xem tất cả thông báo
          </button>
        </div>
      )}
    </div>
  )
}
