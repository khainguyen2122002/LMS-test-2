"use client"

import React, { useState, useEffect } from 'react'
import { CourseProgressItem } from '@/components/student/progress/CourseProgressItem'
import { AchievementBadge, AchievementBadgeProps } from '@/components/student/progress/AchievementBadge'
import { MonthlyChart } from '@/components/student/progress/MonthlyChart'
import { ArrowRight, PlayCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function StudentProgressPage() {
  const { profile } = useAuth()
  const userName = profile?.fullName?.split(' ')[0] || "Khái"

  // ==========================================
  // DYNAMIC STATE (Will be replaced by Supabase)
  // ==========================================
  
  const [overallProgress, setOverallProgress] = useState(75)

  const [monthlyActivity, setMonthlyActivity] = useState([
    { month: 'T.10', hours: 45, isCurrent: false },
    { month: 'T.11', hours: 60, isCurrent: false },
    { month: 'T.12', hours: 85, isCurrent: true },
    { month: 'T.01', hours: 0, isCurrent: false },
    { month: 'T.02', hours: 0, isCurrent: false }
  ])

  const [courseProgress, setCourseProgress] = useState([
    {
      id: "course-1",
      title: "Kỹ năng Tuyển dụng & Giữ chân Nhân tài 2024",
      category: "QUẢN TRỊ CHIẾN LƯỢC",
      progress: 85,
      hoursLearned: "12h 45m",
      avgScore: 8.5,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUy1iBHRlPnGLdFbDrFIhwnPS2B2bhNjB0yH9YuFV-Lof6MFZZDgJn5P3x5oxhDjDnqWDfpJC_ohBlb0ShqG-n3_0SEsn3R80hUW7jj2DtWb9iC7E3CV7X-NwsI4eku9Nc3cUAzagauUIOB-FgWUZ-QOHjRtWUT1P9jiXb1g5V4TUDbwYU1dATvkEnh47QtCtdGOFAGdQ1zYtR6oA8tQlXFH6ILVrku4XvKJmKCBlHPddj6diVqh2zbbqQJ4CPFZg1W6DS8D9oE7U"
    },
    {
      id: "course-2",
      title: "Luật Lao động & Tuân thủ Doanh nghiệp",
      category: "PHÁP LUẬT LAO ĐỘNG",
      progress: 30,
      hoursLearned: "4h 20m",
      avgScore: 9.2,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSAPYxBeUwq7zSMfOPSRo5BxFN4jWJVp_OD5JASzq09Oi9CTxGGDvDmqSJ93M4L48nsr90T9GGAzitxXXohdfTRJEb7Il8094hXIsAU-jl4R9UAhy6lDpJfWIpTcdCX1tlsvFF7q37naNNKLGMVT6vdH5mzRNbprL1HrjzBSPAPz7hEW5pa0Q_SIEAilqId8NLnC4mvwQqKWR_MtSuRQtxbhLHHhsEUTSK7-EsZnfKlN5z4auU-1Ay4mcU_SYeaQCTcSpZoC1Gz4k"
    }
  ])

  const [achievements, setAchievements] = useState<Omit<AchievementBadgeProps, 'id'>[]>([
    { name: "Chuyên gia tuyển dụng", iconStr: "groups", unlocked: true, date: "12/12/2023" },
    { name: "Kỷ luật thép", iconStr: "schedule", unlocked: true, date: "05/12/2023" },
    { name: "Bậc thầy tâm lý", iconStr: "psychology", unlocked: false },
    { name: "Lãnh đạo xuất chúng", iconStr: "leaderboard", unlocked: false }
  ])

  // SVG Circle calculation for Overall Progress
  const radius = 88
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (overallProgress / 100) * circumference

  return (
    <div className="w-full pb-12 space-y-12">
      {/* Header Section */}
      <section className="relative">
        <div className="max-w-4xl">
          <p className="font-['Inter'] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-[#f0a01b] mb-2">
            DASHBOARD PHÂN TÍCH
          </p>
          <h2 className="font-['Inter'] font-extrabold text-4xl md:text-5xl tracking-tight text-[#191c19] dark:text-white leading-tight">
            Tiến độ học tập
          </h2>
          <p className="text-[#414942] dark:text-[#d1d5db] mt-4 max-w-2xl leading-relaxed text-sm md:text-base">
            Theo dõi lộ trình phát triển kỹ năng của bạn. Các chỉ số được cập nhật theo thời gian thực dựa trên kết quả bài học và tương tác hệ thống.
          </p>
        </div>
      </section>

      {/* Bento Grid Overviews */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Circular Progress */}
        <div className="lg:col-span-4 bg-white dark:bg-[#1a1a1a] rounded-[2rem] p-8 flex flex-col items-center justify-center text-center border border-[var(--border)] shadow-sm">
          <div className="relative w-48 h-48 mb-6">
            <svg className="w-full h-full transform -rotate-90 origin-center">
              <circle 
                className="text-[#e7e9e4] dark:text-[#2a2a2a] stroke-current" 
                cx="96" cy="96" r="88" 
                fill="transparent" strokeWidth="12"
              ></circle>
              <circle 
                className="text-[#ffb957] stroke-current drop-shadow-[0_0_8px_rgba(255,185,87,0.4)] transition-all duration-1000 ease-out" 
                cx="96" cy="96" r="88" 
                fill="transparent" 
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-[#00361a] dark:text-[#9ed3aa]">{overallProgress}%</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter text-[#717971] dark:text-[#9ca3af] mt-1">
                Hoàn thành
              </span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-[#191c19] dark:text-white">Tổng quan tiến độ</h3>
          <p className="text-sm text-[#414942] dark:text-[#9ca3af] mt-2">
            Bạn đã hoàn thành 12/16 khóa học trong lộ trình Quản lý Nhân sự Cao cấp.
          </p>
        </div>

        {/* Monthly Activity Chart */}
        <div className="lg:col-span-8 bg-[#f3f4ef] dark:bg-[#1C1B1B] rounded-[2rem] p-8 flex flex-col border border-[var(--border)]">
          <div className="flex justify-between items-start md:items-center mb-6 max-md:flex-col gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#191c19] dark:text-white">Hoạt động hàng tháng</h3>
              <p className="text-xs text-[#717971] dark:text-[#9ca3af] mt-1">Thời gian học tập tích lũy (Giờ)</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white dark:bg-[#2a2a2a] text-[#191c19] dark:text-white text-xs font-bold rounded-lg border border-[var(--border)] shadow-sm">
                2024
              </span>
              <span className="px-3 py-1 bg-[#e7e9e4] dark:bg-[#111111] text-[#717971] dark:text-[#555] text-xs font-medium rounded-lg border border-transparent">
                2023
              </span>
            </div>
          </div>
          
          <MonthlyChart data={monthlyActivity} maxHours={100} />
        </div>
      </section>

      {/* Course-by-course Progress */}
      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <h3 className="text-2xl font-bold tracking-tight text-[#191c19] dark:text-white">
            Chi tiết từng khóa học
          </h3>
          <button className="text-[#00361a] dark:text-[#9ed3aa] font-bold flex items-center gap-1 hover:underline transition-all">
            <span className="text-sm">Xem tất cả báo cáo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-6">
          {courseProgress.map(course => (
            <CourseProgressItem key={course.id} {...course} />
          ))}
        </div>
      </section>

      {/* Achievements & Badges */}
      <section className="bg-[#f3f4ef] dark:bg-[#1C1B1B] rounded-[2.5rem] p-8 md:p-12 border border-[var(--border)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-[#191c19] dark:text-white mb-2">
              Thành tựu & Huy hiệu
            </h3>
            <p className="text-sm text-[#414942] dark:text-[#9ca3af]">
              Ghi nhận những nỗ lực và kỹ năng bạn đã đạt được.
            </p>
          </div>
          <div className="flex -space-x-4">
            <div className="w-12 h-12 rounded-full border-4 border-[#f3f4ef] dark:border-[#1C1B1B] bg-[#ffddb5] dark:bg-[#603c00] flex items-center justify-center relative z-20">
              <span className="text-[#422800] dark:text-[#ffddb5] font-bold">🏆</span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-[#f3f4ef] dark:border-[#1C1B1B] bg-[#1b4d2e] dark:bg-[#0a1e12] flex items-center justify-center relative z-10">
              <span className="text-white dark:text-[#9ed3aa] font-bold">⚡</span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-[#f3f4ef] dark:border-[#1C1B1B] bg-[#e1e3de] dark:bg-[#2a2a2a] flex items-center justify-center text-xs font-bold text-[#191c19] dark:text-white z-0">
              +12
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {achievements.map((ach, idx) => (
            <AchievementBadge key={idx} id={idx.toString()} {...ach} />
          ))}
        </div>
      </section>

      {/* Encouragement Footer */}
      <footer className="bg-gradient-to-br from-[#00361a] to-[#1b4d2e] dark:from-[#012613] dark:to-[#0a1e12] rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="relative z-10 flex-1">
          <h3 className="text-3xl font-extrabold tracking-tight mb-4">
            Bạn đang làm rất tốt, {userName}!
          </h3>
          <p className="text-base opacity-80 mb-8 max-w-xl leading-relaxed">
            Dựa trên tốc độ hiện tại, bạn sẽ hoàn thành toàn bộ lộ trình chuyên gia sớm hơn 15 ngày so với dự kiến ban đầu. Hãy duy trì nhịp độ này!
          </p>
          <button className="bg-[#ffb957] text-[#422800] font-bold px-8 py-3.5 rounded-full hover:opacity-90 hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-[#ffb957]/20 w-max">
            Tiếp tục bài học tiếp theo
            <PlayCircle className="w-5 h-5" />
          </button>
        </div>
        
        {/* Abstract Deco Background */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#422800] opacity-30 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute right-20 top-0 w-40 h-40 bg-[#89bd95] opacity-20 rounded-full blur-[60px] pointer-events-none"></div>
      </footer>
    </div>
  )
}
