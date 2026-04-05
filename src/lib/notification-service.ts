/**
 * Notification Service — Data access layer.
 *
 * Currently uses an in-memory store for development.
 * To connect to Supabase/Postgres, replace the internal methods
 * with supabase.from('notifications').select/insert/update calls.
 * The public API stays identical — zero UI changes needed.
 */

import {
  Notification,
  CreateNotificationInput,
  NotificationFilters,
  NotificationListResponse,
  generateId,
} from '@/lib/notifications'

// ═══════════════════════════════════════════════════════════════════════════════
// In-memory store  (swap for DB later — only this file changes)
// ═══════════════════════════════════════════════════════════════════════════════

let store: Notification[] = []

function seed() {
  if (store.length > 0) return // already seeded

  const now = Date.now()
  const m = (mins: number) => new Date(now - mins * 60_000)
  const h = (hrs: number) => new Date(now - hrs * 3_600_000)
  const d = (days: number) => new Date(now - days * 86_400_000)

  store = [
    {
      id: generateId(), userId: 'admin',
      title: 'Khóa học mới được giao',
      message: 'Bạn đã được giao khóa "Quản trị nhân sự 4.0". Hạn hoàn thành: 30/04/2025.',
      type: 'course', isRead: false, createdAt: m(8),
      link: '/courses',
      metadata: { courseId: 'c1', priority: 'high' },
    },
    {
      id: generateId(), userId: 'admin',
      title: 'Tài liệu mới trong Thư viện',
      message: 'Nghị định 123/2024/NĐ-CP về tiền lương và trợ cấp vừa được tải lên.',
      type: 'document', isRead: false, createdAt: m(45),
      link: '/library',
      metadata: { documentId: 'd1' },
    },
    {
      id: generateId(), userId: 'admin',
      title: 'Bảo trì hệ thống',
      message: 'Hệ thống sẽ bảo trì từ 02:00 – 04:00 ngày 10/04. Vui lòng lưu công việc trước.',
      type: 'system', isRead: false, createdAt: h(2),
    },
    {
      id: generateId(), userId: 'admin',
      title: 'Thông báo từ Ban Giám Đốc',
      message: 'Lịch nghỉ lễ 30/4 – 1/5 đã được cập nhật. Xem chi tiết tại mục Thông báo.',
      type: 'user', isRead: false, createdAt: h(5),
      link: '/library',
    },
    {
      id: generateId(), userId: 'admin',
      title: 'Bài kiểm tra Leadership Basics',
      message: 'Bạn có bài kiểm tra cuối khóa cần hoàn thành trước 20/04/2025.',
      type: 'assignment', isRead: false, createdAt: d(1),
      link: '/courses',
      metadata: { assignmentId: 'a1', dueDate: '2025-04-20' },
    },
    {
      id: generateId(), userId: 'admin',
      title: 'Lịch họp phòng Nhân sự',
      message: 'Cuộc họp review KPI Q1/2025 vào 14:00 ngày mai tại phòng Hội nghị A.',
      type: 'schedule', isRead: true, createdAt: d(2),
      metadata: { meetingRoom: 'A' },
    },
    {
      id: generateId(), userId: 'admin',
      title: 'Hoàn thành khóa Leadership Basics',
      message: 'Chúc mừng! Bạn đã hoàn thành khóa học với số điểm 95/100.',
      type: 'course', isRead: true, createdAt: d(3),
      link: '/reports',
    },
  ]
}

// Auto-seed on first import
seed()

// ═══════════════════════════════════════════════════════════════════════════════
// Public Service API  (these signatures stay stable when swapping to DB)
// ═══════════════════════════════════════════════════════════════════════════════

/** Fetch notifications with optional filters */
export async function getNotifications(
  filters: NotificationFilters
): Promise<NotificationListResponse> {
  let result = store.filter((n) => n.userId === filters.userId)

  if (filters.unreadOnly) result = result.filter((n) => !n.isRead)
  if (filters.type) result = result.filter((n) => n.type === filters.type)

  // Sort newest first
  result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  const total = result.length
  const unreadCount = store.filter((n) => n.userId === filters.userId && !n.isRead).length

  // Pagination
  const offset = filters.offset ?? 0
  const limit = filters.limit ?? 50
  result = result.slice(offset, offset + limit)

  return { notifications: result, total, unreadCount }
}

/** Create a new notification */
export async function createNotification(
  input: CreateNotificationInput
): Promise<Notification> {
  const notification: Notification = {
    id: generateId(),
    userId: input.userId,
    title: input.title,
    message: input.message,
    type: input.type,
    isRead: false,
    createdAt: new Date(),
    link: input.link,
    metadata: input.metadata,
  }
  store.unshift(notification) // newest first
  return notification
}

/** Mark a single notification as read */
export async function markAsRead(id: string): Promise<boolean> {
  const notif = store.find((n) => n.id === id)
  if (!notif) return false
  notif.isRead = true
  return true
}

/** Mark all notifications as read for a user */
export async function markAllAsRead(userId: string): Promise<number> {
  let count = 0
  store.forEach((n) => {
    if (n.userId === userId && !n.isRead) {
      n.isRead = true
      count++
    }
  })
  return count
}

/** Delete a notification */
export async function deleteNotification(id: string): Promise<boolean> {
  const idx = store.findIndex((n) => n.id === id)
  if (idx === -1) return false
  store.splice(idx, 1)
  return true
}

/** Get unread count only (lightweight) */
export async function getUnreadCount(userId: string): Promise<number> {
  return store.filter((n) => n.userId === userId && !n.isRead).length
}
