"use client"

import React, { useState, useEffect } from 'react'
import { Loader2, BookOpen, TrendingUp } from 'lucide-react'
import { getMyEnrollments, Enrollment } from '@/lib/enrollment-service'

// Static achievements (dynamic requires separate table)
const ACHIEVEMENTS = [
  { name: 'Chuyên gia tuyển dụng', icon: '👥', unlocked: true, date: '12/12/2023' },
  { name: 'Kỷ luật thép', icon: '⏰', unlocked: true, date: '05/12/2023' },
  { name: 'Bậc thầy tâm lý', icon: '🧠', unlocked: false, date: '' },
  { name: 'Lãnh đạo xuất chúng', icon: '🏆', unlocked: false, date: '' },
]

// Monthly mock hours (will connect to lesson completion events later)
const MONTHLY_HOURS = [
  { month: 'T.8', hours: 4 },
  { month: 'T.9', hours: 7 },
  { month: 'T.10', hours: 5 },
  { month: 'T.11', hours: 9 },
  { month: 'T.12', hours: 14 },
  { month: 'T.1', hours: 0 },
]
const maxHours = Math.max(...MONTHLY_HOURS.map(m => m.hours), 1)

export default function ProgressPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      const data = await getMyEnrollments()
      setEnrollments(data)
      setLoading(false)
    }
    fetch()
  }, [])

  // Computed
  const totalLessons = enrollments.reduce((a, e) => a + ((e.course as any)?.lessons?.length || 0), 0)
  const completedLessons = enrollments.reduce((a, e) => a + (e.completed_lessons || 0), 0)
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  // SVG circle
  const r = 88
  const circumference = 2 * Math.PI * r
  const dashOffset = circumference - (circumference * overallProgress) / 100

  return (
    <div className="pb-16 space-y-12">
      {/* Header */}
      <section>
        <p className="text-[#f0a01b] font-bold tracking-[0.2em] uppercase text-xs mb-2">DASHBOARD PHÂN TÍCH</p>
        <h2 className="text-4xl font-extrabold tracking-tight dark:text-white text-[#191c19]">Tiến độ học tập</h2>
        <p className="text-[#717971] dark:text-[#9ca3af] mt-3 max-w-2xl">
          Theo dõi lộ trình phát triển kỹ năng của bạn. Dữ liệu cập nhật theo thời gian thực từ hệ thống học tập.
        </p>
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-10 h-10 animate-spin text-[#1b4d2e]" />
        </div>
      ) : (
        <>
          {/* Bento Grid Top */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Circle Progress */}
            <div className="lg:col-span-4 bg-white dark:bg-[#1C1B1B] rounded-3xl p-8 flex flex-col items-center justify-center text-center border border-[var(--border)]">
              <div className="relative w-44 h-44 mb-5">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r={r} fill="transparent" stroke="currentColor" strokeWidth="12" className="text-[#e7e9e4] dark:text-[#2a2a2a]" />
                  <circle
                    cx="100" cy="100" r={r} fill="transparent"
                    stroke="#ffb957" strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold text-[#1b4d2e] dark:text-[#9ed3aa]">{overallProgress}%</span>
                  <span className="text-xs uppercase tracking-tight opacity-60 mt-0.5">Hoàn thành</span>
                </div>
              </div>
              <h3 className="text-lg font-bold dark:text-white text-[#191c19]">Tổng quan tiến độ</h3>
              <p className="text-sm text-[#717971] mt-2">
                {enrollments.length > 0
                  ? `Bạn đã hoàn thành ${completedLessons}/${totalLessons} bài học trong ${enrollments.length} khóa học.`
                  : 'Bạn chưa có khóa học nào. Liên hệ Admin!'}
              </p>
            </div>

            {/* Monthly Chart */}
            <div className="lg:col-span-8 bg-[#f3f4ef] dark:bg-[#1C1B1B] rounded-3xl p-8 border border-[var(--border)]">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-lg font-bold dark:text-white text-[#191c19]">Hoạt động hàng tháng</h3>
                  <p className="text-xs text-[#717971] mt-1">Thời gian học tập tích lũy (Giờ ước tính)</p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#f0a01b]" />
                  <span className="text-xs font-bold text-[#f0a01b]">2024–2025</span>
                </div>
              </div>
              <div className="flex items-end justify-between gap-2 h-40">
                {MONTHLY_HOURS.map((m, i) => {
                  const barHeight = maxHours > 0 ? Math.round((m.hours / maxHours) * 100) : 0
                  const isLast = i === MONTHLY_HOURS.length - 1 || m.month === 'T.12'
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full rounded-full relative overflow-hidden" style={{ height: '140px', background: 'rgba(0,0,0,0.06)' }}>
                        <div
                          className={`absolute bottom-0 w-full rounded-full transition-all duration-1000 ${isLast ? 'bg-gradient-to-t from-[#00361a] to-[#1b4d2e]' : 'bg-[#1b4d2e]/40 dark:bg-[#9ed3aa]/30'}`}
                          style={{ height: `${barHeight}%` }}
                        />
                      </div>
                      <span className={`text-[10px] uppercase font-bold ${isLast ? 'text-[#1b4d2e] dark:text-[#9ed3aa]' : 'text-[#717971] opacity-60'}`}>
                        {m.month}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Course-by-course */}
          {enrollments.length > 0 && (
            <section className="space-y-6">
              <h3 className="text-2xl font-bold tracking-tight dark:text-white text-[#191c19]">Chi tiết từng khóa học</h3>
              <div className="space-y-4">
                {enrollments.map(e => {
                  const course = e.course as any
                  const total = course?.lessons?.length || 0
                  const prog = e.progress_percentage
                  return (
                    <div key={e.id} className="bg-white dark:bg-[#1C1B1B] rounded-2xl p-5 flex flex-col md:flex-row items-center gap-6 border border-[var(--border)] hover:border-[#1b4d2e]/30 transition-colors">
                      <div className="w-full md:w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={course?.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-[#f0a01b] uppercase tracking-wider">{course?.category}</span>
                        <h4 className="text-base font-bold dark:text-white text-[#191c19] mt-0.5 line-clamp-1">{course?.title}</h4>
                        <div className="flex items-center gap-3 mt-2 text-xs text-[#717971]">
                          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {e.completed_lessons}/{total} bài</span>
                          <span>Từ: {new Date(e.enrolled_at).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                      <div className="w-full md:w-52 flex-shrink-0">
                        <div className="flex justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-[#717971] uppercase">TIẾN ĐỘ</span>
                          <span className="text-[10px] font-extrabold text-[#1b4d2e] dark:text-[#9ed3aa]">{prog}%</span>
                        </div>
                        <div className="h-2 w-full bg-[#cfe5d1] dark:bg-[#2a2a2a] rounded-full overflow-hidden">
                          <div className="h-full bg-[#ffb957] rounded-full transition-all duration-700" style={{ width: `${prog}%` }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Achievements */}
          <section className="bg-[#f3f4ef] dark:bg-[#1C1B1B] rounded-[2rem] p-8 border border-[var(--border)]">
            <div className="mb-8">
              <h3 className="text-xl font-bold tracking-tight dark:text-white text-[#191c19]">Thành tựu & Huy hiệu</h3>
              <p className="text-sm text-[#717971] mt-1">Ghi nhận những nỗ lực và kỹ năng bạn đã đạt được.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {ACHIEVEMENTS.map((badge, i) => (
                <div key={i} className={`flex flex-col items-center text-center group ${!badge.unlocked ? 'opacity-40 grayscale' : ''}`}>
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 text-3xl transition-transform group-hover:scale-110 duration-300 ${
                    badge.unlocked
                      ? 'bg-gradient-to-br from-[#00361a] to-[#1b4d2e] shadow-[0_0_20px_rgba(249,168,37,0.2)]'
                      : 'border-4 border-dashed border-[#c1c9bf]'
                  }`}>
                    {badge.icon}
                  </div>
                  <span className="font-bold text-sm dark:text-white text-[#191c19]">{badge.name}</span>
                  <span className="text-[10px] text-[#717971] mt-0.5 uppercase tracking-wider">
                    {badge.unlocked ? `Đạt: ${badge.date}` : 'Chưa mở khóa'}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Footer CTA */}
          <footer className="bg-gradient-to-br from-[#00361a] to-[#1b4d2e] rounded-[2rem] p-10 text-white relative overflow-hidden">
            <div className="relative z-10 max-w-xl">
              <h3 className="text-2xl font-extrabold tracking-tight mb-3">
                {overallProgress >= 50 ? 'Bạn đang làm rất tốt! 🎉' : 'Bắt đầu hành trình học tập! 🚀'}
              </h3>
              <p className="opacity-80 mb-6 text-sm leading-relaxed">
                {overallProgress >= 50
                  ? `Tiến độ ${overallProgress}% — Hãy duy trì nhịp độ và hoàn thành các khóa học còn lại!`
                  : 'Hãy bắt đầu từ những bài học đầu tiên. Mỗi ngày một ít, tích tiểu thành đại!'}
              </p>
              <a href="/student/courses">
                <button className="bg-[#ffb957] text-[#422800] font-bold px-7 py-3 rounded-full hover:opacity-90 transition-colors flex items-center gap-2">
                  Vào khóa học <TrendingUp className="w-4 h-4" />
                </button>
              </a>
            </div>
            <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-[#422800] opacity-20 rounded-full blur-[100px]" />
          </footer>
        </>
      )}
    </div>
  )
}
