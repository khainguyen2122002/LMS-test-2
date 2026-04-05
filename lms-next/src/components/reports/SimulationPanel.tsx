"use client"

import React from 'react'
import { GraduationCap, UserPlus, Zap } from 'lucide-react'
import { useAnalytics } from '@/components/reports/AnalyticsProvider'

export const SimulationPanel: React.FC = () => {
  const { simulateCourseCompletion, simulateNewUser, simulateCourseEnroll } = useAnalytics()

  return (
    <div className="dark:bg-[#1A1A1A] light:bg-[#f8fafc] border border-emerald-500/30 rounded-xl p-5 mb-8 shadow-lg shadow-emerald-900/5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold dark:text-white light:text-neutral-900 mb-1 flex items-center gap-2">
            <Zap size={16} className="text-amber-400" fill="currentColor" />
            Giả Lập Dữ Liệu
          </h3>
          <p className="text-xs text-neutral-500">Các nút giả lập phía dưới sẽ kích hoạt event cập nhật State toàn cục. Các biểu đồ và KPI sẽ phản ứng ngay lập tức.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={simulateNewUser}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold dark:bg-[#2a2a2a] light:bg-white border border-[var(--border)] hover:border-emerald-500/50 dark:hover:bg-[#353534] transition-all dark:text-white light:text-neutral-900"
          >
            <UserPlus size={14} className="text-emerald-400" /> + Mới Đăng Ký
          </button>
          
          <button 
            onClick={simulateCourseCompletion}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold dark:bg-[#2a2a2a] light:bg-white border border-[var(--border)] hover:border-amber-500/50 dark:hover:bg-[#353534] transition-all dark:text-white light:text-neutral-900"
          >
            <GraduationCap size={14} className="text-amber-400" /> + Hoàn Thành Couse
          </button>

          <button 
            onClick={simulateCourseEnroll}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold dark:bg-[#2a2a2a] light:bg-white border border-[var(--border)] hover:border-orange-500/50 dark:hover:bg-[#353534] transition-all dark:text-white light:text-neutral-900"
          >
            <FlameIcon /> + Tương Tác Course
          </button>
        </div>
      </div>
    </div>
  )
}

const FlameIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
)
