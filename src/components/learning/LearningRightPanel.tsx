import React, { useState } from 'react'
import { Note } from './types'
import { Trash2, Send, Clock, Download } from 'lucide-react'

interface LearningRightPanelProps {
  notes: Note[]
  onAddNote: (content: string) => void
  onDeleteNote: (id: string) => void
  onCompleteCourse: () => void
  totalLessons: number
  completedLessons: number
  totalHoursStr: string
}

type TabKey = 'notes' | 'discussion' | 'documents'

export const LearningRightPanel: React.FC<LearningRightPanelProps> = ({
  notes, onAddNote, onDeleteNote, onCompleteCourse, totalLessons, completedLessons, totalHoursStr
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('notes')
  const [newNote, setNewNote] = useState('')

  const handleSend = () => {
    if (!newNote.trim()) return
    onAddNote(newNote)
    setNewNote('')
  }

  return (
    <aside className="w-96 h-full bg-[#1A1A1A] flex flex-col border-l border-[#c1c9bf]/10 flex-shrink-0 text-[#f9faf5]">
      {/* Tab Navigation */}
      <div className="flex border-b border-[#c1c9bf]/10">
        <button 
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-4 text-[10px] font-bold tracking-widest uppercase transition-all ${
            activeTab === 'notes' ? 'text-[#ffb957] border-b-2 border-[#ffb957]' : 'text-[#f9faf5] opacity-40 hover:opacity-100'
          }`}
        >
          Ghi chú
        </button>
        <button 
          onClick={() => setActiveTab('discussion')}
          className={`flex-1 py-4 text-[10px] font-bold tracking-widest uppercase transition-all ${
            activeTab === 'discussion' ? 'text-[#ffb957] border-b-2 border-[#ffb957]' : 'text-[#f9faf5] opacity-40 hover:opacity-100'
          }`}
        >
          Thảo luận
        </button>
        <button 
          onClick={() => setActiveTab('documents')}
          className={`flex-1 py-4 text-[10px] font-bold tracking-widest uppercase transition-all ${
            activeTab === 'documents' ? 'text-[#ffb957] border-b-2 border-[#ffb957]' : 'text-[#f9faf5] opacity-40 hover:opacity-100'
          }`}
        >
          Tài liệu
        </button>
      </div>

      {activeTab === 'notes' && (
        <>
          {/* Tab Content: Notes */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {notes.length === 0 ? (
              <p className="text-sm text-center opacity-40 py-10">Chưa có ghi chú nào.</p>
            ) : (
              notes.map(note => (
                <div key={note.id} className="bg-[#111111] p-4 rounded-2xl border border-[#c1c9bf]/5 hover:border-[#1b4d2e]/50 transition-colors group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-[#ffb957]">{note.timeLabel}</span>
                    <button onClick={() => onDeleteNote(note.id)}>
                      <Trash2 className="w-4 h-4 opacity-30 hover:opacity-100 hover:text-red-400 transition-all cursor-pointer" />
                    </button>
                  </div>
                  <p className="text-sm leading-relaxed text-white/80">{note.content}</p>
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-[#111111] border-t border-[#c1c9bf]/5">
            <div className="relative">
              <textarea 
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="w-full bg-[#1A1A1A] border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#ffb957] placeholder:opacity-30 text-white resize-none" 
                placeholder="Viết ghi chú của bạn tại đây..." 
                rows={3}
              ></textarea>
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button 
                  onClick={handleSend}
                  disabled={!newNote.trim()}
                  className="p-2 bg-[#1B4D2E] rounded-xl text-white flex items-center justify-center hover:bg-[#23683e] transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] opacity-40">
                <Clock className="w-3.5 h-3.5" />
                <span>Lưu tại 04:22</span>
              </div>
              <button className="flex items-center gap-1 text-[10px] font-bold text-[#ffb957] uppercase tracking-widest hover:opacity-80 transition-opacity">
                <Download className="w-3.5 h-3.5" /> Tải xuống PDF
              </button>
            </div>
          </div>
        </>
      )}

      {activeTab === 'discussion' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col items-center justify-center opacity-50">
          <p className="text-sm">Tính năng thảo luận đang được cập nhật...</p>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col items-center justify-center opacity-50">
          <p className="text-sm">Không có tài liệu đính kèm cho bài học này.</p>
        </div>
      )}

      {/* Course Summary Card at Bottom */}
      <div className="p-6 border-t border-[#c1c9bf]/10 bg-[#1A1A1A]">
        <h4 className="text-[10px] font-bold tracking-widest uppercase mb-4 opacity-50">TIẾN ĐỘ TỔNG THỂ</h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span>Bài học đã học</span>
            <span className="font-bold">{completedLessons}/{totalLessons}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span>Thời gian học</span>
            <span className="font-bold">{totalHoursStr}</span>
          </div>
          <button 
            onClick={onCompleteCourse}
            className="w-full py-3 bg-gradient-to-br from-[#00361a] to-[#1b4d2e] text-white text-[10px] font-bold tracking-widest uppercase rounded-xl hover:shadow-lg hover:shadow-[#1B4D2E]/20 transition-all active:scale-95"
          >
            Làm bài kiểm tra phần 2
          </button>
        </div>
      </div>
    </aside>
  )
}
