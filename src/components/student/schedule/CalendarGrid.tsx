import React, { useMemo } from 'react'
import { CalendarEvent, EventType } from './types'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'

interface CalendarGridProps {
  currentDate: Date
  selectedDate: Date | null
  events: CalendarEvent[]
  onSelectDate: (date: Date) => void
  onAddEventClick: () => void
  onPrevMonth: () => void
  onNextMonth: () => void
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  selectedDate,
  events,
  onSelectDate,
  onAddEventClick,
  onPrevMonth,
  onNextMonth
}) => {
  const { year, month } = {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth()
  }

  const daysInGrid = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1)
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    
    const startDayOfWeek = firstDayOfMonth.getDay() // 0 = Sunday, 1 = Monday
    const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1 // Make Monday = 0
    
    const grid: { date: Date; isCurrentMonth: boolean; dateStr: string }[] = []
    
    // Previous month padding
    for (let i = offset - 1; i >= 0; i--) {
      const d = new Date(year, month, -i)
      grid.push({ date: d, isCurrentMonth: false, dateStr: d.toISOString().split('T')[0] })
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i)
      grid.push({ date: d, isCurrentMonth: true, dateStr: d.toISOString().split('T')[0] })
    }
    
    // Next month padding (make it multiple of 7)
    const remainingCount = (7 - (grid.length % 7)) % 7
    for (let i = 1; i <= remainingCount; i++) {
      const d = new Date(year, month + 1, i)
      grid.push({ date: d, isCurrentMonth: false, dateStr: d.toISOString().split('T')[0] })
    }

    return grid
  }, [year, month])

  const monthName = currentDate.toLocaleString('vi-VN', { month: 'long', year: 'numeric' })
  const todayStr = new Date().toISOString().split('T')[0]

  const getEventStyles = (type: EventType) => {
    switch (type) {
      case 'deadline':
        return 'bg-[#ffddb5] dark:bg-[#603c00] text-[#2a1800] dark:text-[#ffddb5] border-l-[#f0a01b] border-l-2'
      case 'lesson':
        return 'bg-[#00361a] dark:bg-[#9ed3aa] text-white dark:text-[#01391c]'
      case 'session':
        return 'bg-[#cfe5d1] dark:bg-[#384b3c] text-[#0d1f13] dark:text-[#cfe5d1]'
      default:
        return 'bg-[#e7e9e4] dark:bg-[#2a2a2a] text-[#191c19] dark:text-white'
    }
  }

  return (
    <div className="bg-white dark:bg-[#1a1a1a] border border-[var(--border)] rounded-3xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 md:px-8 md:py-6 bg-[#00361a] dark:bg-[#9ed3aa] text-white dark:text-[#01391c]">
        <div className="flex items-center gap-4">
          <h3 className="text-xl md:text-2xl font-bold capitalize">{monthName}</h3>
          <div className="flex gap-1 bg-white/10 dark:bg-black/10 rounded-full p-1">
            <button onClick={onPrevMonth} className="p-1 hover:bg-white/20 dark:hover:bg-black/20 rounded-full transition-colors flex items-center justify-center">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={onNextMonth} className="p-1 hover:bg-white/20 dark:hover:bg-black/20 rounded-full transition-colors flex items-center justify-center">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <button 
          onClick={onAddEventClick}
          className="flex items-center gap-2 px-3 tracking-wide py-2 md:px-4 bg-[#422800] text-white dark:bg-[#ffb957] dark:text-[#422800] rounded-full text-[10px] md:text-xs font-bold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden md:inline">Thêm sự kiện</span>
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 border-b border-[#c1c9bf]/20 dark:border-white/10">
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
          <div key={day} className="py-3 md:py-4 text-center text-[10px] md:text-xs font-bold tracking-widest uppercase text-[#717971] dark:text-[#9ca3af]">
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 bg-[#c1c9bf]/10 gap-px border-[#c1c9bf]/20 dark:border-white/10 dark:bg-white/5">
        {daysInGrid.map((dayObj, i) => {
          const isToday = dayObj.dateStr === todayStr
          const isSelected = selectedDate?.toISOString().split('T')[0] === dayObj.dateStr
          const dayEvents = events.filter(e => e.dateStr === dayObj.dateStr)

          return (
            <div 
              key={i} 
              onClick={() => onSelectDate(dayObj.date)}
              className={`min-h-[100px] md:min-h-[140px] p-2 flex flex-col bg-white dark:bg-[#1a1a1a] cursor-pointer transition-colors ${
                !dayObj.isCurrentMonth ? 'opacity-40' : ''
              } ${isSelected ? 'bg-[#f3f4ef] dark:bg-[#222222]' : 'hover:bg-[#f9faf5] dark:hover:bg-[#1f1f1f]'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs md:text-sm font-bold ${
                  isToday 
                    ? 'bg-[#00361a] dark:bg-[#9ed3aa] text-white dark:text-[#01391c]' 
                    : 'text-[#191c19] dark:text-white'
                }`}>
                  {dayObj.date.getDate()}
                </span>
                
              </div>
              
              {/* Events */}
              <div className="flex-1 overflow-y-auto space-y-1 md:space-y-1.5 no-scrollbar flex flex-col pt-1">
                {dayEvents.slice(0, 3).map(ev => (
                  <div key={ev.id} className={`p-1.5 rounded text-[9px] md:text-[10px] leading-tight ${getEventStyles(ev.type)} truncate`}>
                    <span className="font-bold hidden md:inline">{ev.title}</span> {/* Show title on larger screens */}
                    <span className="font-medium inline md:hidden">{ev.title.substring(0,6)}..</span>
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[10px] text-center font-bold text-[#717971] dark:text-[#9ca3af] mt-1">
                    +{dayEvents.length - 3} nữa
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
