"use client"

import React, { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { CalendarEvent } from '@/components/student/schedule/types'
import { CalendarGrid } from '@/components/student/schedule/CalendarGrid'
import { UpcomingList } from '@/components/student/schedule/UpcomingList'
import { EventModal } from '@/components/student/schedule/EventModal'

export default function StudentSchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date()) // Controls month being viewed
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()) // Selected day for filtering
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Seed with some initial data matching the design constraints
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const today = new Date()
    const offsetDate = (days: number) => {
      const d = new Date(today)
      d.setDate(d.getDate() + days)
      return d.toISOString().split('T')[0]
    }

    return [
      {
        id: '1',
        title: 'Báo cáo tuần 2',
        dateStr: offsetDate(0), // Today
        type: 'deadline',
        timeStr: '23:59 PM',
        isImportant: true
      },
      {
        id: '2',
        title: 'Văn hóa Doanh nghiệp',
        dateStr: offsetDate(0), // Today
        type: 'lesson',
        timeStr: '20:00 PM'
      },
      {
        id: '3',
        title: 'HR Strategy 101',
        dateStr: offsetDate(-6), // Last week
        type: 'session',
        timeStr: '19:00 PM'
      },
      {
        id: '4',
        title: 'Live: HR Tech Trends',
        dateStr: offsetDate(3), // In 3 days
        type: 'session',
        timeStr: '14:00 PM'
      },
      {
        id: '5',
        title: 'Q&A Mentor',
        dateStr: offsetDate(4), // In 4 days
        type: 'session',
        timeStr: '15:00 PM'
      },
      {
        id: '6',
        title: 'Bài trắc nghiệm cuối khóa',
        dateStr: offsetDate(5), // In 5 days
        type: 'other',
        timeStr: '09:00 AM'
      }
    ]
  })

  // Handlers
  const handleAddEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const event: CalendarEvent = {
      ...newEvent,
      id: Math.random().toString(36).substr(2, 9)
    }
    setEvents(prev => [...prev, event])
  }

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  // Filter events for "Sắp tới" (Upcoming) list:
  // If selectedDate is strictly evaluating 'this day', we could just show events for selected date.
  // The design implies it shows upcoming events generally, or filtered by selected day.
  // Let's show upcoming from selected date onwards.
  const upcomingEvents = useMemo(() => {
    const fromDateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    return events
      .filter(ev => ev.dateStr >= fromDateStr)
      .sort((a, b) => {
        if (a.dateStr === b.dateStr) {
          return a.timeStr.localeCompare(b.timeStr)
        }
        return a.dateStr.localeCompare(b.dateStr)
      })
      .slice(0, 5) // Show top 5 upcoming
  }, [events, selectedDate])


  return (
    <div className="w-full pb-12 relative min-h-[90vh]">
      {/* Header Section */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <span className="font-['Inter'] text-[10px] text-[#f0a01b] font-bold tracking-widest uppercase mb-2 block">
            Lộ trình học tập
          </span>
          <h2 className="font-['Inter'] text-4xl font-extrabold tracking-tight text-[#191c19] dark:text-white">
            Lịch học
          </h2>
        </div>
        
        <div className="flex bg-[#f3f4ef] dark:bg-[#1f1f1f] p-1 rounded-full border border-[var(--border)]">
          <button className="px-6 py-2 rounded-full bg-white dark:bg-[#2a2a2a] text-[#191c19] dark:text-white text-sm font-semibold shadow-sm">
            Tháng
          </button>
          <button className="px-6 py-2 rounded-full text-[#414942] dark:text-[#9ca3af] text-sm font-medium opacity-60 hover:opacity-100 transition-opacity">
            Tuần
          </button>
          <button className="px-6 py-2 rounded-full text-[#414942] dark:text-[#9ca3af] text-sm font-medium opacity-60 hover:opacity-100 transition-opacity">
            Ngày
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Calendar View */}
        <div className="flex-1 min-w-0">
          <CalendarGrid 
            currentDate={currentDate}
            selectedDate={selectedDate}
            events={events}
            onSelectDate={setSelectedDate}
            onAddEventClick={() => setIsModalOpen(true)}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
        </div>

        {/* Right Side Panel */}
        <aside className="w-full lg:w-80 space-y-6 flex-shrink-0">
          <UpcomingList events={upcomingEvents} />

          {/* Personal Progress Card */}
          <div className="relative overflow-hidden rounded-[2rem] p-6 bg-[#00361a] dark:bg-[#012613] text-white">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <span className="font-['Inter'] text-[10px] font-bold text-[#9ed3aa] tracking-widest uppercase opacity-80 block mb-2">
              Tiến độ tháng này
            </span>
            <h5 className="text-3xl font-extrabold mb-4">84%</h5>
            <div className="w-full h-2 bg-[#1b4d2e] dark:bg-[#0a1e12] rounded-full overflow-hidden mb-4">
              <div className="h-full bg-[#f0a01b] w-[84%] transition-all duration-1000"></div>
            </div>
            <p className="text-xs opacity-80 leading-relaxed text-[#d2e8d4]">
              Bạn đã hoàn thành tuyệt vời các mục tiêu tuần. Chỉ còn 2 bài giảng nữa để đạt 100%!
            </p>
          </div>
        </aside>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#422800] dark:bg-[#ffb957] text-white dark:text-[#422800] rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform active:scale-95 group z-40"
      >
        <Plus className="w-6 h-6" strokeWidth={3} />
        <span className="absolute right-full mr-4 bg-[#191c19] dark:bg-white text-white dark:text-[#191c19] px-4 py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Tạo sự kiện mới
        </span>
      </button>

      <EventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddEvent}
      />
    </div>
  )
}
