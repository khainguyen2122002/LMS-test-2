"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Award, CheckCircle, User, BookOpen, Loader2, Lock } from 'lucide-react'
import { getMyEnrollments, Enrollment } from '@/lib/enrollment-service'

type TabValue = 'all' | 'learning' | 'finished'

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabValue>('all')

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      const data = await getMyEnrollments()
      setEnrollments(data)
      setLoading(false)
    }
    fetch()
  }, [])

  const filtered = enrollments.filter(e => {
    if (activeTab === 'learning') return e.progress_percentage < 100
    if (activeTab === 'finished') return e.progress_percentage >= 100
    return true
  })

  const tabs = [
    { id: 'all' as TabValue, label: 'Tất cả', count: enrollments.length },
    { id: 'learning' as TabValue, label: 'Đang học', count: enrollments.filter(e => e.progress_percentage < 100).length },
    { id: 'finished' as TabValue, label: 'Hoàn thành', count: enrollments.filter(e => e.progress_percentage >= 100).length },
  ]

  return (
    <div className="w-full pb-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[#f0a01b] font-medium tracking-widest text-xs uppercase mb-2 block">QUẢN LÝ HỌC TẬP</span>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#191c19] dark:text-white leading-tight">Khóa học của tôi</h1>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#f3f4ef] dark:bg-[#1C1B1B] rounded-full overflow-x-auto border border-[var(--border)]">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 text-sm whitespace-nowrap rounded-full transition-colors flex-shrink-0 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-[#1b4d2e] text-white shadow-sm font-semibold'
                    : 'font-medium text-[#414942] dark:text-[#9ca3af] hover:bg-[#e7e9e4] dark:hover:bg-[#2a2a2a]'
                }`}
              >
                {tab.label}
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-[#e7e9e4] dark:bg-[#2a2a2a]'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-10 h-10 animate-spin text-[#1b4d2e] mb-4" />
          <p className="text-sm text-[#717971]">Đang tải khóa học của bạn...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-[#1b4d2e]/10 flex items-center justify-center mb-4">
            <Lock className="w-10 h-10 text-[#1b4d2e] dark:text-[#9ed3aa]" />
          </div>
          <h3 className="text-xl font-bold text-[#191c19] dark:text-white mb-2">
            {activeTab === 'all' ? 'Bạn chưa được cấp quyền khóa học nào' : 'Không có khóa học trong mục này'}
          </h3>
          <p className="text-sm text-[#717971] max-w-sm mb-6">
            {activeTab === 'all'
              ? 'Hãy liên hệ quản trị viên để được cấp quyền truy cập vào các khóa học phù hợp.'
              : 'Hãy học thêm hoặc chuyển sang tab khác để xem danh sách.'}
          </p>
          <Link href="/courses">
            <button className="px-6 py-3 bg-[#1b4d2e] text-white font-bold rounded-full flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Khám phá khóa học
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
            const imageUrl = course?.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUy1iBHRlPnGLdFbDrFIhwnPS2B2bhNjB0yH9YuFV-Lof6MFZZDgJn5P3x5oxhDjDnqWDfpJC_ohBlb0ShqG-n3_0SEsn3R80hUW7jj2DtWb9iC7E3CV7X-NwsI4eku9Nc3cUAzagauUIOB-FgWUZ-QOHjRtWUT1P9jiXb1g5V4TUDbwYU1dATvkEnh47QtCtdGOFAGdQ1zYtR6oA8tQlXFH6ILVrku4XvKJmKCBlHPddj6diVqh2zbbqQJ4CPFZg1W6DS8D9oE7U'
            const instructor = course?.profiles?.full_name || 'Giảng viên'

            return (
              <div key={enrollment.id} className={`dark:bg-[#1a1a1a] bg-white rounded-3xl overflow-hidden flex flex-col border border-[var(--border)] transition-all duration-300 ${isFinished ? 'opacity-90 grayscale-[0.2]' : 'hover:shadow-2xl hover:shadow-[#191c19]/5 hover:-translate-y-1'}`}>
                <div className="relative aspect-video overflow-hidden">
                  <img alt={course?.title} className="w-full h-full object-cover" src={imageUrl} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {isFinished && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-[#00361a] text-white font-bold px-5 py-2 rounded-full text-sm flex items-center gap-2 shadow-xl">
                        <CheckCircle className="w-4 h-4" /> Đã hoàn thành
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-4">
                    <span className="bg-[#ffb957] text-[#2a1800] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                      {course?.category || 'KHÓA HỌC'}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-[#191c19] dark:text-white mb-1 leading-tight line-clamp-2">{course?.title}</h3>
                  <p className="text-xs text-[#717971] mb-4 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> {instructor}
                  </p>

                  <div className="mt-auto">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-[#414942] dark:text-[#d1d5db] uppercase">
                        TIẾN ĐỘ: {progress}%
                      </span>
                      <span className="text-xs text-[#717971]">
                        {enrollment.completed_lessons}/{totalLessons} bài
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#cfe5d1] dark:bg-[#2a2a2a] rounded-full overflow-hidden mb-5">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${isFinished ? 'bg-[#00361a]' : 'bg-[#f0a01b]'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {isFinished ? (
                      <button className="w-full py-3 border-2 border-[#1b4d2e] text-[#1b4d2e] dark:text-[#9ed3aa] dark:border-[#9ed3aa] font-bold rounded-full flex items-center justify-center gap-2 hover:bg-[#1b4d2e] hover:text-white transition-all">
                        <Award className="w-4 h-4" /> Xem chứng chỉ
                      </button>
                    ) : (
                      <Link href={`/learn/${course?.id}`}>
                        <button className="w-full py-3.5 bg-[#f0a01b] hover:bg-[#e09015] text-[#191c19] font-bold rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#f0a01b]/20">
                          Tiếp tục học <ArrowRight className="w-4 h-4" />
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

      {/* Footer Summary */}
      {enrollments.length > 0 && (
        <div className="mt-12 bg-gradient-to-r from-[#1b4d2e] to-[#01391c] rounded-3xl p-8 md:p-12 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/10 to-transparent hidden md:block" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight mb-1">Thống kê học tập của bạn</h2>
              <p className="text-[#9ed3aa] opacity-90 text-sm">Dữ liệu cập nhật từ hệ thống.</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/20 text-center min-w-[110px]">
                <span className="block text-white font-black text-3xl">{String(enrollments.length).padStart(2, '0')}</span>
                <span className="block text-[#9ed3aa] text-[10px] uppercase font-bold tracking-widest mt-1">Khóa học</span>
              </div>
              <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/20 text-center min-w-[110px]">
                <span className="block text-white font-black text-3xl">
                  {enrollments.length > 0 ? Math.round(enrollments.reduce((a, e) => a + e.progress_percentage, 0) / enrollments.length) : 0}%
                </span>
                <span className="block text-[#9ed3aa] text-[10px] uppercase font-bold tracking-widest mt-1">TB tiến độ</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
