export type EventType = 'deadline' | 'lesson' | 'session' | 'other'

export interface CalendarEvent {
  id: string
  title: string
  dateStr: string // YYYY-MM-DD
  type: EventType
  timeStr: string // e.g., "14:00 PM"
  subtitle?: string 
  isImportant?: boolean
}
