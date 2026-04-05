// ─── Core Notification Types ──────────────────────────────────────────────────

export type NotificationType =
  | 'course'
  | 'schedule'
  | 'document'
  | 'system'
  | 'user'
  | 'assignment'

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  createdAt: Date
  link?: string
  metadata?: Record<string, unknown>
}

// ─── API request/response shapes ──────────────────────────────────────────────

export interface CreateNotificationInput {
  userId: string
  title: string
  message: string
  type: NotificationType
  link?: string
  metadata?: Record<string, unknown>
}

export interface NotificationFilters {
  userId: string
  unreadOnly?: boolean
  type?: NotificationType
  limit?: number
  offset?: number
}

export interface NotificationListResponse {
  notifications: Notification[]
  total: number
  unreadCount: number
}

// ─── Type → Visual mapping (UI helper) ───────────────────────────────────────

export const NOTIFICATION_THEME: Record<NotificationType, {
  emoji: string
  label: string
  color: string
  bg: string
  border: string
}> = {
  course:     { emoji: '📚', label: 'Khóa học',      color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  schedule:   { emoji: '📅', label: 'Lịch trình',    color: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20' },
  document:   { emoji: '📄', label: 'Tài liệu',      color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
  system:     { emoji: '⚙️', label: 'Hệ thống',      color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20' },
  user:       { emoji: '👤', label: 'Người dùng',    color: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20' },
  assignment: { emoji: '📝', label: 'Bài kiểm tra',  color: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/20' },
}

// ─── Time Formatting (Vietnamese) ────────────────────────────────────────────

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'Vừa xong'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} phút trước`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} giờ trước`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} ngày trước`
  return date.toLocaleDateString('vi-VN')
}

// ─── Generate unique ID ──────────────────────────────────────────────────────

export function generateId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}
