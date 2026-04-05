import { NextRequest, NextResponse } from 'next/server'
import {
  getNotifications,
  createNotification,
  markAllAsRead,
  getUnreadCount,
} from '@/lib/notification-service'
import type { NotificationType } from '@/lib/notifications'

// Current user ID — replace with auth session later
const CURRENT_USER = 'admin'

/**
 * GET /api/notifications
 *
 * Query params:
 *   unreadOnly  — "true" to filter unread only
 *   type        — notification type filter
 *   limit       — max results (default 50)
 *   offset      — pagination offset
 *   countOnly   — "true" to return only unread count
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams

  // Lightweight endpoint: just the unread count
  if (params.get('countOnly') === 'true') {
    const count = await getUnreadCount(CURRENT_USER)
    return NextResponse.json({ unreadCount: count })
  }

  const result = await getNotifications({
    userId: CURRENT_USER,
    unreadOnly: params.get('unreadOnly') === 'true',
    type: (params.get('type') as NotificationType) || undefined,
    limit: Number(params.get('limit')) || 50,
    offset: Number(params.get('offset')) || 0,
  })

  // Serialize dates for JSON
  return NextResponse.json({
    ...result,
    notifications: result.notifications.map((n) => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
    })),
  })
}

/**
 * POST /api/notifications
 *
 * Body: { title, message, type, link?, metadata? }
 * Creates a new notification for the current user.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, message, type, link, metadata } = body

    if (!title || !message || !type) {
      return NextResponse.json(
        { error: 'title, message, and type are required' },
        { status: 400 }
      )
    }

    const notification = await createNotification({
      userId: CURRENT_USER,
      title,
      message,
      type,
      link,
      metadata,
    })

    return NextResponse.json(
      { ...notification, createdAt: notification.createdAt.toISOString() },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

/**
 * PATCH /api/notifications
 *
 * Body: { action: "markAllRead" }
 * Marks all notifications as read for the current user.
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.action === 'markAllRead') {
      const count = await markAllAsRead(CURRENT_USER)
      return NextResponse.json({ success: true, markedCount: count })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
