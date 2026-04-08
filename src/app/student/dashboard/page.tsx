"use client"

import React, { useState, useEffect } from 'react'
import { Sparkles, ArrowRight, TrendingUp, CheckCircle, Award, MessageSquare, HeadphonesIcon, Loader2, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { getMyEnrollments, Enrollment } from '@/lib/enrollment-service'

export default function StudentDashboard() {
  const { profile } = useAuth()
  const userName = profile?.fullName || 'Học viên'

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

  // Computed stats from real data
  const activeCourses = enrollments.filter(e => e.progress_percentage < 100).length
  const completedCourses = enrollments.filter(e => e.progress_percentage >= 100).length
  const avgProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((a, e) => a + e.progress_percentage, 0) / enrollments.length)
    : 0

  // The most recently enrolled in-progress course
  const continuingEnrollment = enrollments.find(e => e.progress_percentage < 100 && e.progress_percentage > 0)
    || enrollments.find(e => e.progress_percentage === 0)

  const continuingCourse = continuingEnrollment?.course as any
  const continuingProgress = continuingEnrollment?.progress_percentage || 0

  const statsItems = [
    { title: 'Khóa đang học', value: String(activeCourses).padStart(2, '0'), subtitle: 'Đang tiến hành' },
    { title: 'Hoàn thành', value: String(completedCourses).padStart(2, '0'), subtitle: 'Đã học xong', color: 'text-[#9ed3aa]' },
    { title: 'Trung bình', value: `${avgProgress}%`, subtitle: 'Tiến độ tổng', color: 'text-[#ffb957]' },
    { title: 'Khóa học', value: String(enrollments.length).padStart(2, '0'), subtitle: 'Đã đăng ký' },
  ]

  return (
    <div className="space-y-12 pb-12">

      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden min-h-[280px] flex items-center bg-gradient-to-br from-[#00361a] to-[#1b4d2e] dark:from-[#012613] dark:to-[#0a1e12] p-8 md:p-12 text-white">
        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <Sparkles className="text-[#f0a01b] w-4 h-4" />
            <span className="text-[10px] font-bold tracking-[0.1em] uppercase">Hành trình nâng tầm nhân sự</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            Chào mừng trở lại,<br /> {userName}!
          </h2>
          <p className="text-base opacity-80 font-light leading-relaxed max-w-lg">
            {enrollments.length > 0
              ? `Bạn đang theo dõi ${activeCourses} khóa học. Tiến độ trung bình ${avgProgress}%. Hãy tiếp tục!`
              : 'Bạn chưa được cấp quyền khóa học nào. Liên hệ Admin để bắt đầu hành trình!'}
          </p>
          {continuingCourse && (
            <Link href={`/learn/${continuingCourse.id}`}>
              <button className="bg-gradient-to-r from-[#f0a01b] to-[#ffb957] text-[#00361a] px-7 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 shadow-lg shadow-black/20 transition-transform mt-2">
                Học tiếp ngay <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          )}
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none">
          <Award strokeWidth={0.5} className="w-[280px] h-[280px] absolute -right-8 -top-8" />
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statsItems.map((stat, i) => (
          <div key={i} className="bg-[#f3f4ef] dark:bg-[#1C1B1B] p-5 rounded-2xl border border-[var(--border)]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#717971] dark:text-[#9ca3af] mb-1">{stat.title}</p>
            <p className={`text-3xl font-black tracking-tight ${stat.color || 'dark:text-white text-[#191c19]'}`}>
              {loading ? '--' : stat.value}
            </p>
            <p className="text-xs text-[#717971] dark:text-[#9ca3af] mt-1">{stat.subtitle}</p>
          </div>
        ))}
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left: Courses */}
        <div className="lg:col-span-8 space-y-10">

          {/* Continuing course */}
          <section>
            <div className="flex justify-between items-end mb-5">
              <div>
                <span className="text-[#f0a01b] font-bold tracking-widest uppercase text-[10px] mb-1 block">CURRENT FOCUS</span>
                <h3 className="text-xl font-bold tracking-tight dark:text-white text-[#191c19]">Tiếp tục học</h3>
              </div>
              <Link href="/student/courses" className="text-sm font-semibold text-[#1b4d2e] dark:text-[#9ed3aa] flex items-center gap-1 hover:underline">
                Xem tất cả <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16 bg-[#f3f4ef] dark:bg-[#1C1B1B] rounded-3xl">
                <Loader2 className="w-8 h-8 animate-spin text-[#1b4d2e]" />
              </div>
            ) : !continuingCourse ? (
              <div className="flex flex-col items-center justify-center py-16 bg-[#f3f4ef] dark:bg-[#1C1B1B] rounded-3xl text-center">
                <BookOpen className="w-12 h-12 text-[#c1c9bf] mb-3" />
                <p className="font-bold text-[#191c19] dark:text-white mb-1">Chưa có khóa học nào</p>
                <p className="text-sm text-[#717971]">Liên hệ Admin để được cấp quyền học</p>
              </div>
            ) : (
              <div className="bg-[#f3f4ef] dark:bg-[#1C1B1B] rounded-3xl overflow-hidden border border-[var(--border)]">
                <div className="relative aspect-video md:aspect-auto md:h-52 overflow-hidden">
                  <img
                    src={continuingCourse.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDO0lsrbIHn4efNlL3TG40KHVFxKPJ7Vm6gMe-6WUhwZHRfiq9igUvi9WxMTkW7WSwwFB0qJ2beTpPckzsVofIeZTNjrbjXQ5zmKmbyyyi8r3sazQZOB9YWYX-k5jyI1_fz6aOPkDWZn_9QsiGLp9jpbcOK3WM-6iybcSKQomBExkIy-ouNlld0yVZZQDDc9mDXgZVxKs3GDThPdhjbK9LXDVoH2VgLHUVwDOhKza4IFtkOc8YQzvGvPjRU6M50h5sNj5lKRn479LU'}
                    className="w-full h-full object-cover"
                    alt={continuingCourse.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <span className="bg-[#ffb957] text-[#2a1800] text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                      {continuingCourse.category || 'KHÓA HỌC'}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold dark:text-white text-[#191c19] mb-1">{continuingCourse.title}</h4>
                  <p className="text-xs text-[#717971] mb-4">
                    👨‍🏫 {continuingCourse.profiles?.full_name || 'Giảng viên'}
                  </p>
                  <div className="w-full h-2 bg-[#cfe5d1] dark:bg-[#2a2a2a] rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-[#f0a01b] rounded-full transition-all" style={{ width: `${continuingProgress}%` }} />
                  </div>
                  <div className="flex justify-between items-center mb-5">
                    <span className="text-xs text-[#717971]">{continuingProgress}% hoàn thành</span>
                    <span className="text-xs font-bold text-[#f0a01b]">{continuingEnrollment?.completed_lessons || 0}/{continuingCourse.lessons?.length || 0} bài</span>
                  </div>
                  <Link href={`/learn/${continuingCourse.id}`}>
                    <button className="w-full py-3.5 bg-[#f0a01b] hover:bg-[#e09015] text-[#191c19] font-bold rounded-2xl flex items-center justify-center gap-2 transition-all">
                      Tiếp tục học <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right: Activity */}
        <aside className="lg:col-span-4 space-y-6">
          <section className="bg-[#f3f4ef] dark:bg-[#1C1B1B] p-6 rounded-3xl border border-[var(--border)]">
            <h3 className="text-base font-bold tracking-tight dark:text-white text-[#191c19] mb-6">Hoạt động gần đây</h3>
            <div className="space-y-5">
              {[
                { icon: CheckCircle, title: 'Tiến độ cập nhật', sub: activeCourses > 0 ? `${activeCourses} khóa đang học` : 'Chưa có khóa học', color: 'text-[#00361a] dark:text-[#9ed3aa]', bg: 'bg-[#1b4d2e]/10' },
                { icon: Award, title: 'Điểm tích lũy', sub: `${avgProgress * 10} XP`, color: 'text-[#f0a01b]', bg: 'bg-[#f0a01b]/10' },
                { icon: MessageSquare, title: 'Hệ thống', sub: 'Chào mừng đến với LMS!', color: 'text-[#4f6353] dark:text-[#b6ccb8]', bg: 'bg-[#cfe5d1]/20' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.bg}`}>
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold dark:text-white text-[#191c19]">{item.title}</p>
                    <p className="text-xs text-[#717971] mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Goal card */}
          <section className="bg-gradient-to-br from-[#f0a01b] to-[#422800] p-6 rounded-3xl text-white overflow-hidden relative">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2 block">Mục tiêu tuần</span>
            <h4 className="text-xl font-extrabold mb-4">{avgProgress}% hoàn thành trung bình</h4>
            <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${Math.min(avgProgress, 100)}%` }} />
            </div>
            <p className="text-xs opacity-90 italic">"Kiến thức không bao giờ là đủ, sự học là vô tận."</p>
            <Award className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-10" />
          </section>

          {/* Support */}
          <Link href="/student/support" className="block">
            <div className="bg-[#e1e3de] dark:bg-[#2A2A2A] p-5 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-[#1b4d2e] hover:text-white transition-all border border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/50 dark:bg-black/20 flex items-center justify-center">
                  <HeadphonesIcon className="w-4 h-4 text-neutral-700 dark:text-neutral-300 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-white">Cần hỗ trợ?</p>
                  <p className="text-[10px] text-neutral-500 group-hover:text-white/80 mt-0.5">Trò chuyện với cố vấn</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-white" />
            </div>
          </Link>
        </aside>
      </div>

      <footer className="text-center text-[#717971] dark:text-[#9ca3af] text-[10px] uppercase tracking-widest">
        © 2026 INSPIRING HR LMS. Nâng tầm nhân sự, khẳng định giá trị.
      </footer>
    </div>
  )
}
