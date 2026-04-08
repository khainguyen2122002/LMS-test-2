"use client"

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight, Award, CheckCircle, User, BookOpen, Loader2, Lock } from 'lucide-react'
import { getMyEnrollments } from '@/lib/enrollment-service'
import { useQuery } from '@tanstack/react-query'

type TabValue = 'all' | 'learning' | 'finished'

export default function MyCoursesPage() {
  const [activeTab, setActiveTab] = useState<TabValue>('all')

  // Enrollment Query
  const { 
    data: enrollments = [], 
    isLoading: loading 
  } = useQuery({
    queryKey: ['enrollments', 'me'],
    queryFn: getMyEnrollments,
    staleTime: 1000 * 60 * 5, // 5 mins
  })

  const filtered = useMemo(() => enrollments.filter(e => {
    if (activeTab === 'learning') return e.progress_percentage < 100
    if (activeTab === 'finished') return e.progress_percentage >= 100
    return true
  }), [enrollments, activeTab])

  const tabs = useMemo(() => [
    { id: 'all' as TabValue, label: 'Tất cả', count: enrollments.length },
    { id: 'learning' as TabValue, label: 'Đang học', count: enrollments.filter(e => e.progress_percentage < 100).length },
    { id: 'finished' as TabValue, label: 'Hoàn thành', count: enrollments.filter(e => e.progress_percentage >= 100).length },
  ], [enrollments])

  return (
    <div className="w-full pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[#f0a01b] font-bold tracking-[0.2em] text-xs uppercase mb-2 block">Lộ trình học tập</span>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#191c19] dark:text-white leading-tight">Khóa học của tôi</h1>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#f3f4ef] dark:bg-[#1C1B1B] rounded-full overflow-x-auto border border-[var(--border)] scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 text-sm whitespace-nowrap rounded-full transition-all flex-shrink-0 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-[#1b4d2e] text-white shadow-md font-bold'
                    : 'font-medium text-[#717971] dark:text-[#9ca3af] hover:bg-[#e7e9e4] dark:hover:bg-[#2a2a2a]'
                }`}
              >
                {tab.label}
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-[#e7e9e4] dark:bg-[#2a2a2a]'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#1C1B1B] rounded-3xl h-[420px] w-full animate-pulse border border-[var(--border)]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-[#f3f4ef] dark:bg-[#1C1B1B]/50 rounded-[2.5rem] border border-dashed border-[var(--border)]">
          <div className="w-24 h-24 rounded-full bg-[#1b4d2e]/10 flex items-center justify-center mb-6">
            <Lock className="w-10 h-10 text-[#1b4d2e] dark:text-[#9ed3aa]" />
          </div>
          <h3 className="text-2xl font-bold text-[#191c19] dark:text-white mb-2">
            {activeTab === 'all' ? 'Hành trình của bạn đang chờ' : 'Không có khóa học nào'}
          </h3>
          <p className="text-sm text-[#717971] max-w-sm mb-8 leading-relaxed">
            {activeTab === 'all'
              ? 'Dường như bạn chưa được cấp quyền khóa học nào. Hãy liên hệ với Quản trị viên để bắt đầu đào tạo.'
              : 'Hãy thử lọc với các tiêu chí khác hoặc xem tất cả danh sách.'}
          </p>
          <Link href="/courses">
            <button className="px-8 py-3.5 bg-[#1b4d2e] hover:bg-[#205e38] text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg transition-all active:scale-95">
              <BookOpen className="w-4 h-4" /> Khám phá thư viện khóa học
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map(enrollment => {
            const course = enrollment.course as any
            const progress = enrollment.progress_percentage
            const isFinished = progress >= 100
            const totalLessons = course?.lessons?.length || 0
            const imageUrl = course?.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'
            const instructor = course?.profiles?.full_name || 'Hệ thống'

            return (
              <div key={enrollment.id} className={`group dark:bg-[#1a1a1a] bg-white rounded-[2rem] overflow-hidden flex flex-col border border-[var(--border)] shadow-sm hover:shadow-xl hover:border-[#1b4d2e]/20 transition-all duration-500 ${isFinished ? 'opacity-95' : 'hover:-translate-y-1.5'}`}>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img 
                    alt={course?.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    src={imageUrl} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {isFinished && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-emerald-500 text-white font-bold p-2 rounded-full shadow-lg">
                        <CheckCircle className="w-5 h-5" />
                      </span>
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 left-6">
                    <span className="bg-[#ffb957] text-[#2a1800] text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg">
                      {course?.category || 'MODULE'}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-[#191c19] dark:text-white mb-2 leading-tight line-clamp-2 transition-colors group-hover:text-[#1b4d2e] dark:group-hover:text-[#9ed3aa] min-h-[3rem]">
                    {course?.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mb-6 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[10px]">👤</span> 
                    {instructor}
                  </p>

                  <div className="mt-auto space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest leading-none">
                          TIẾN ĐỘ: <span className={isFinished ? 'text-emerald-500' : 'text-[#f0a01b]'}>{progress}%</span>
                        </span>
                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-none">
                          {enrollment.completed_lessons}/{totalLessons} BÀI HỌC
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#cfe5d1] dark:bg-[#2a2a2a] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${isFinished ? 'bg-emerald-500' : 'bg-gradient-to-r from-[#f0a01b] to-[#ffb957]'}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {isFinished ? (
                      <button className="w-full py-4 border border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                        <Award className="w-4 h-4" /> Chứng nhận học tập
                      </button>
                    ) : (
                      <Link href={`/learn/${course?.id}`}>
                        <button className="w-full py-4 bg-[#1b4d2e] hover:bg-[#205e38] text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]">
                          Tiếp tục học tập <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer Summary Card */}
      {!loading && enrollments.length > 0 && (
        <div className="mt-16 bg-gradient-to-br from-[#1b4d2e] to-[#00361a] rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-5 pointer-events-none rounded-full blur-[120px] -translate-y-20 translate-x-20" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="max-w-md text-center md:text-left">
              <h2 className="text-3xl font-black tracking-tight mb-3 italic">Hành trình của bạn</h2>
              <p className="text-[#9ed3aa] font-light text-sm leading-relaxed opacity-90">
                Mỗi bài học hoàn thành là một viên gạch xây dựng nên sự nghiệp vững chắc. Hãy duy trì sự tập trung tối đa.
              </p>
            </div>
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="bg-white/10 backdrop-blur-md px-8 py-6 rounded-[2rem] border border-white/20 text-center min-w-[140px] shadow-lg">
                  <span className="block text-white font-black text-4xl mb-1">{String(enrollments.length).padStart(2, '0')}</span>
                  <span className="block text-[#9ed3aa] text-[10px] uppercase font-black tracking-[0.2em]">Tổng khóa</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white/10 backdrop-blur-md px-8 py-6 rounded-[2rem] border border-white/20 text-center min-w-[140px] shadow-lg">
                  <span className="block text-[#ffb957] font-black text-4xl mb-1">
                    {enrollments.length > 0 ? Math.round(enrollments.reduce((a, e) => a + e.progress_percentage, 0) / enrollments.length) : 0}%
                  </span>
                  <span className="block text-[#9ed3aa] text-[10px] uppercase font-black tracking-[0.2em]">Tiến trình</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
