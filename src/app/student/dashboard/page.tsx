"use client"

import React, { useMemo } from 'react'
import { Sparkles, ArrowRight, CheckCircle, Award, MessageSquare, HeadphonesIcon, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { getMyEnrollments } from '@/lib/enrollment-service'
import { useQuery } from '@tanstack/react-query'
import { useProfile } from '@/hooks/use-profile'

export default function StudentDashboard() {
  const { data: profile } = useProfile()
  const userName = profile?.fullName || 'Học viên'

  // Enrollment Query
  const { 
    data: enrollments = [], 
    isLoading: loading 
  } = useQuery({
    queryKey: ['enrollments', 'me'],
    queryFn: getMyEnrollments,
    staleTime: 1000 * 60 * 5, // 5 mins
  })

  // Computed stats from real data
  const activeCourses = useMemo(() => enrollments.filter(e => e.progress_percentage < 100).length, [enrollments])
  const completedCourses = useMemo(() => enrollments.filter(e => e.progress_percentage >= 100).length, [enrollments])
  const avgProgress = useMemo(() => enrollments.length > 0
    ? Math.round(enrollments.reduce((a, e) => a + e.progress_percentage, 0) / enrollments.length)
    : 0, [enrollments])

  // The most recently enrolled in-progress course
  const continuingEnrollment = useMemo(() => 
    enrollments.find(e => e.progress_percentage < 100 && e.progress_percentage > 0)
    || enrollments.find(e => e.progress_percentage === 0), 
  [enrollments])

  const continuingCourse = continuingEnrollment?.course as any
  const continuingProgress = continuingEnrollment?.progress_percentage || 0

  const statsItems = [
    { title: 'Khóa đang học', value: String(activeCourses).padStart(2, '0'), subtitle: 'Đang tiến hành' },
    { title: 'Hoàn thành', value: String(completedCourses).padStart(2, '0'), subtitle: 'Đã học xong', color: 'text-[#9ed3aa]' },
    { title: 'Trung bình', value: `${avgProgress}%`, subtitle: 'Tiến độ tổng', color: 'text-[#ffb957]' },
    { title: 'Khóa học', value: String(enrollments.length).padStart(2, '0'), subtitle: 'Đã đăng ký' },
  ]

  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-700">

      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden min-h-[280px] flex items-center bg-gradient-to-br from-[#00361a] to-[#1b4d2e] dark:from-[#012613] dark:to-[#0a1e12] p-8 md:p-12 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <Sparkles className="text-[#f0a01b] w-4 h-4" />
            <span className="text-[10px] font-bold tracking-[0.1em] uppercase">Hành trình nâng tầm nhân sự</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            Chào mừng trở lại,<br /> {userName}!
          </h2>
          <p className="text-base opacity-80 font-light leading-relaxed max-w-lg">
            {!loading ? (
              enrollments.length > 0
                ? `Bạn đang theo dõi ${activeCourses} khóa học. Tiến độ trung bình ${avgProgress}%. Hãy tiếp tục!`
                : 'Bạn chưa được cấp quyền khóa học nào. Liên hệ Admin để bắt đầu hành trình!'
            ) : 'Đang tải thông tin học tập của bạn...'}
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
          <Award strokeWidth={0.5} className="w-[280px] h-[280px] absolute -right-8 -top-8 text-white" />
        </div>
      </section>

      {/* Stats with Skeletons */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statsItems.map((stat, i) => (
          <div key={i} className={`bg-[#f3f4ef] dark:bg-[#1C1B1B] p-5 rounded-2xl border border-[var(--border)] transition-all hover:border-[#1b4d2e]/30 ${loading ? 'animate-pulse' : ''}`}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#717971] dark:text-[#9ca3af] mb-1">{stat.title}</p>
            {loading ? (
              <div className="h-9 w-12 bg-neutral-200 dark:bg-neutral-800 rounded mt-1" />
            ) : (
              <p className={`text-3xl font-black tracking-tight ${stat.color || 'dark:text-white text-[#191c19]'}`}>
                {stat.value}
              </p>
            )}
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
              <div className="w-full aspect-video md:h-80 bg-neutral-200 dark:bg-neutral-800 rounded-3xl animate-pulse" />
            ) : !continuingCourse ? (
              <div className="flex flex-col items-center justify-center py-16 bg-[#f3f4ef] dark:bg-[#1C1B1B] rounded-3xl text-center border border-dashed border-[var(--border)]">
                <BookOpen className="w-12 h-12 text-[#c1c9bf] mb-3" />
                <p className="font-bold text-[#191c19] dark:text-white mb-1">Chưa có khóa học nào</p>
                <p className="text-sm text-[#717971]">Liên hệ Admin để được cấp quyền học</p>
              </div>
            ) : (
              <div className="bg-[#f3f4ef] dark:bg-[#1C1B1B] rounded-3xl overflow-hidden border border-[var(--border)] group hover:shadow-xl transition-all">
                <div className="relative aspect-video md:aspect-auto md:h-64 overflow-hidden">
                  <img
                    src={continuingCourse.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt={continuingCourse.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-8">
                    <span className="bg-[#ffb957] text-[#2a1800] text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase shadow-lg">
                      {continuingCourse.category || 'KHÓA HỌC'}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h4 className="text-2xl font-bold dark:text-white text-[#191c19] mb-1 transition-colors group-hover:text-[#1b4d2e] dark:group-hover:text-[#9ed3aa]">{continuingCourse.title}</h4>
                  <p className="text-sm text-[#717971] mb-6 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1b4d2e]/10 flex items-center justify-center text-[10px]">👨‍🏫</span>
                    {continuingCourse.profiles?.full_name || 'Hệ thống'}
                  </p>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between items-center text-xs font-bold text-[#717971]">
                      <span>Tiến độ hoàn thành</span>
                      <span className="text-[#f0a01b]">{continuingProgress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#cfe5d1] dark:bg-[#2a2a2a] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#f0a01b] to-[#ffb957] rounded-full transition-all duration-1000" style={{ width: `${continuingProgress}%` }} />
                    </div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider text-right">
                      {continuingEnrollment?.completed_lessons || 0}/{continuingCourse.lessons?.length || 0} bài học đã học
                    </p>
                  </div>

                  <Link href={`/learn/${continuingCourse.id}`}>
                    <button className="w-full py-4 bg-[#1b4d2e] hover:bg-[#205e38] dark:bg-[#1b4d2e] text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]">
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
            <h3 className="text-base font-bold tracking-tight dark:text-white text-[#191c19] mb-6">Trạng thái hiện tại</h3>
            <div className="space-y-5">
              {[
                { icon: CheckCircle, title: 'Khóa học active', sub: loading ? '...' : (activeCourses > 0 ? `${activeCourses} khóa đang học` : 'Chưa có khóa học'), color: 'text-[#00361a] dark:text-[#9ed3aa]', bg: 'bg-[#1b4d2e]/10' },
                { icon: Award, title: 'Điểm tích lũy', sub: loading ? '...' : `${avgProgress * 10} XP`, color: 'text-[#f0a01b]', bg: 'bg-[#f0a01b]/10' },
                { icon: MessageSquare, title: 'Hệ thống', sub: 'Mọi thứ ổn định', color: 'text-[#4f6353] dark:text-[#b6ccb8]', bg: 'bg-[#cfe5d1]/20' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 group/item">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover/item:scale-110 ${item.bg}`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
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
          <section className="bg-gradient-to-br from-[#1b4d2e] to-[#00361a] p-6 rounded-3xl text-white overflow-hidden relative shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2 block">Cường độ học tập</span>
            <h4 className="text-xl font-extrabold mb-4">{loading ? '...' : `${avgProgress}%`} tiến độ trung bình</h4>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-[#f0a01b] rounded-full transition-all duration-1000" style={{ width: `${Math.min(avgProgress, 100)}%` }} />
            </div>
            <p className="text-xs opacity-70 italic font-light leading-relaxed">"Hãy tập trung hoàn thành các mục tiêu nhỏ mỗi ngày để đạt được kết quả lớn."</p>
            <Award className="absolute -right-4 -bottom-4 w-24 h-24 text-[#f0a01b] opacity-10" />
          </section>

          {/* Support */}
          <Link href="/student/support" className="block">
            <div className="bg-[#e1e3de] dark:bg-[#2A2A2A] p-5 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-[#1b4d2e] dark:hover:bg-[#1b4d2e] hover:text-white transition-all border border-[var(--border)] shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/50 dark:bg-black/20 flex items-center justify-center transition-colors group-hover:bg-white/20">
                  <HeadphonesIcon className="w-5 h-5 text-neutral-700 dark:text-neutral-300 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-white">Hỗ trợ học tập</p>
                  <p className="text-[10px] text-neutral-500 group-hover:text-white/80 mt-0.5">Liên hệ với đội ngũ giảng dạy</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </aside>
      </div>

      <footer className="pt-8 text-center text-[#717971] dark:text-[#9ca3af] text-[10px] uppercase tracking-[0.2em] opacity-60">
        © 2026 INSPIRING HR LMS. Nâng tầm nhân sự, khẳng định giá trị.
      </footer>
    </div>
  )
}
