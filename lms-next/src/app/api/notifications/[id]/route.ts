import { NextRequest, NextResponse } from 'next/server'
import { markAsRead, deleteNotification } from '@/lib/notification-service'

/**
 * PATCH /api/notifications/[id]
 *
 * Marks a single notification as read.
 */
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const success = await markAsRead(id)

  if (!success) {
    return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, id })
}

/**
 * DELETE /api/notifications/[id]
 *
 * Deletes a single notification.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const success = await deleteNotification(id)

  if (!success) {
    return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, id })
}
