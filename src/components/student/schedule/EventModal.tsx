import React, { useState } from 'react'
import { CalendarEvent, EventType } from './types'
import { X, Calendar as CalendarIcon, Clock, AlignLeft } from 'lucide-react'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: Omit<CalendarEvent, 'id'>) => void
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('')
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0])
  const [timeStr, setTimeStr] = useState('09:00')
  const [type, setType] = useState<EventType>('session')

  if (!isOpen) return null

  const handleSave = () => {
    if (!title.trim()) return
    onSave({
      title,
      dateStr,
      timeStr,
      type,
      isImportant: type === 'deadline'
    })
    
    // reset slightly
    setTitle('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1C1B1B] w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl border border-[var(--border)] animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-[#c1c9bf]/20 dark:border-white/10 bg-[#f9faf5] dark:bg-[#1a1a1a]">
          <h3 className="text-xl font-bold text-[#191c19] dark:text-white">Thêm sự kiện</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#e7e9e4] dark:hover:bg-[#2a2a2a] rounded-full transition-colors">
            <X className="w-5 h-5 text-[#414942] dark:text-[#9ca3af]" />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#414942] dark:text-[#d1d5db]">Tên sự kiện</label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717971]" />
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ví dụ: Phỏng vấn giả lập" 
                className="w-full pl-10 pr-4 py-2.5 bg-[#f3f4ef] dark:bg-[#2a2a2a] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#00361a] dark:focus:ring-[#9ed3aa] transition-all text-[#191c19] dark:text-white placeholder:text-[#717971] dark:placeholder:text-[#9ca3af]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#414942] dark:text-[#d1d5db]">Ngày</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717971]" />
                <input 
                  type="date" 
                  value={dateStr}
                  onChange={e => setDateStr(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f3f4ef] dark:bg-[#2a2a2a] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#00361a] dark:focus:ring-[#9ed3aa] transition-all text-[#191c19] dark:text-white"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#414942] dark:text-[#d1d5db]">Giờ</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717971]" />
                <input 
                  type="time" 
                  value={timeStr}
                  onChange={e => setTimeStr(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f3f4ef] dark:bg-[#2a2a2a] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#00361a] dark:focus:ring-[#9ed3aa] transition-all text-[#191c19] dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#414942] dark:text-[#d1d5db]">Loại</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setType('session')}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${type === 'session' ? 'bg-[#1b4d2e] text-white border-[#1b4d2e]' : 'bg-transparent text-[#414942] dark:text-[#d1d5db] border-[#c1c9bf] dark:border-[#444] hover:bg-[#e7e9e4] dark:hover:bg-[#2a2a2a]'}`}
              >
                Học Live/Q&A
              </button>
              <button 
                onClick={() => setType('deadline')}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${type === 'deadline' ? 'bg-[#f0a01b] text-[#2a1800] border-[#f0a01b]' : 'bg-transparent text-[#414942] dark:text-[#d1d5db] border-[#c1c9bf] dark:border-[#444] hover:bg-[#e7e9e4] dark:hover:bg-[#2a2a2a]'}`}
              >
                Hạn chót/Deadline
              </button>
              <button 
                onClick={() => setType('lesson')}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${type === 'lesson' ? 'bg-[#00361a] text-white border-[#00361a]' : 'bg-transparent text-[#414942] dark:text-[#d1d5db] border-[#c1c9bf] dark:border-[#444] hover:bg-[#e7e9e4] dark:hover:bg-[#2a2a2a]'}`}
              >
                Bài giảng
              </button>
              <button 
                onClick={() => setType('other')}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${type === 'other' ? 'bg-[#e7e9e4] dark:bg-[#333] text-[#191c19] dark:text-white border-transparent' : 'bg-transparent text-[#414942] dark:text-[#d1d5db] border-[#c1c9bf] dark:border-[#444] hover:bg-[#e7e9e4] dark:hover:bg-[#2a2a2a]'}`}
              >
                Sự kiện khác
              </button>
            </div>
          </div>

        </div>
        <div className="p-6 bg-[#f9faf5] dark:bg-[#1a1a1a] border-t border-[#c1c9bf]/20 dark:border-white/10 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-sm font-bold text-[#414942] dark:text-[#d1d5db] hover:bg-[#e7e9e4] dark:hover:bg-[#2a2a2a] transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#1b4d2e] dark:bg-[#9ed3aa] text-white dark:text-[#01391c] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Lưu sự kiện
          </button>
        </div>
      </div>
    </div>
  )
}
