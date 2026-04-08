import React from 'react'
import { CalendarEvent } from './types'
import { Bell, Video, ClipboardList, ArrowRight } from 'lucide-react'

interface UpcomingListProps {
  events: CalendarEvent[]
}

export const UpcomingList: React.FC<UpcomingListProps> = ({ events }) => {
  const getEventIconParams = (ev: CalendarEvent) => {
    switch (ev.type) {
      case 'deadline':
        return {
          icon: <Bell className="w-5 h-5 flex-shrink-0" />,
          color: 'text-[#f0a01b]',
          bg: 'border-l-[#f0a01b]',
          labelClass: 'text-[#f0a01b]',
          container: 'bg-white dark:bg-[#1a1a1a] shadow-sm border-l-4 border-y border-r border-[#c1c9bf]/20 dark:border-white/10'
        }
      case 'lesson':
      case 'session':
        return {
          icon: <Video className="w-5 h-5 flex-shrink-0" />,
          color: 'text-[#00361a] opacity-50 group-hover:opacity-100 dark:text-[#9ed3aa]',
          bg: '',
          labelClass: 'hidden',
          container: 'bg-white dark:bg-[#1a1a1a] hover:bg-[#f3f4ef] dark:hover:bg-[#222222] border border-[#c1c9bf]/20 dark:border-white/10'
        }
      default:
        return {
          icon: <ClipboardList className="w-5 h-5 flex-shrink-0" />,
          color: 'text-[#00361a] opacity-50 group-hover:opacity-100 dark:text-[#9ed3aa]',
          bg: '',
          labelClass: 'hidden',
          container: 'bg-white dark:bg-[#1a1a1a] hover:bg-[#f3f4ef] dark:hover:bg-[#222222] border border-[#c1c9bf]/20 dark:border-white/10'
        }
    }
  }

  // Helper to format friendly date string
  const getFriendlyDate = (dateStr: string) => {
    const d = new Date(dateStr)
    const today = new Date()
    // rudimentary check
    if (d.toDateString() === today.toDateString()) return 'Hôm nay'
    
    // Check tomorrow
    const tmr = new Date()
    tmr.setDate(tmr.getDate() + 1)
    if (d.toDateString() === tmr.toDateString()) return 'Ngày mai'
    
    // Otherwise show weekday
    const weekdays = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
    return weekdays[d.getDay()]
  }

  return (
    <div className="bg-[#f3f4ef] dark:bg-[#1C1B1B] p-6 rounded-[2rem] border border-[var(--border)]">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xl font-extrabold tracking-tight text-[#191c19] dark:text-white">Sắp tới</h4>
        <span className="bg-[#1b4d2e] dark:bg-[#9ed3aa] text-white dark:text-[#01391c] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
          {events.length} Task
        </span>
      </div>

      <div className="space-y-4">
        {events.length === 0 ? (
          <p className="text-sm text-[#717971] text-center py-4">Không có sự kiện sắp tới.</p>
        ) : (
          events.map(ev => {
            const style = getEventIconParams(ev)
            const dateLabel = getFriendlyDate(ev.dateStr)

            return (
              <div key={ev.id} className={`p-4 rounded-2xl transition-colors group ${style.container}`}>
                <div className="flex items-start gap-3">
                  <div className={style.color}>{style.icon}</div>
                  <div>
                    <p className="font-bold text-sm text-[#191c19] dark:text-white leading-tight mb-1">{ev.title}</p>
                    <p className="text-xs text-[#414942] dark:text-[#9ca3af] mb-1">
                      {dateLabel}, {ev.timeStr}
                    </p>
                    {ev.isImportant && (
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${style.labelClass}`}>
                        Quan trọng
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <button className="w-full mt-8 py-3 text-[#00361a] dark:text-[#9ed3aa] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#e7e9e4] dark:hover:bg-[#2a2a2a] transition-colors rounded-xl border border-transparent">
        Xem tất cả lịch
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}
