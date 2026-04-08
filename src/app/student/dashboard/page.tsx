"use client"

import React, { useState, useEffect } from 'react'
import { Sparkles, ArrowRight, TrendingUp, CheckCircle, Award, MessageSquare, Support, HeadphonesIcon } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

import { StatsCard } from '@/components/student/StatsCard'
import { ActivityItem, ActivityItemProps } from '@/components/student/ActivityItem'
import { ContinuingCourseCard, SuggestedCourseCard } from '@/components/student/CourseCards'

export default function StudentDashboard() {
  const { profile } = useAuth()
  const userName = profile?.fullName || "KHÁI NGUYỄN HOÀNG"

  // ==========================================
  // DYNAMIC STATE (Will be replaced by Supabase via Context/Hooks later)
  // ==========================================
  
  // 1. Stats
  const [stats, setStats] = useState({
    totalHours: 48,
    totalHoursTrend: "+12%",
    activeCourses: 3,
    completionRate: 92,
    streakDays: 12
  })

  // 2. Continuing Course
  const [continuingCourse, setContinuingCourse] = useState({
    id: "course-1",
    title: "Quản trị nhân sự 4.0: Chuyển đổi số trong quản lý",
    subtitle: "Khóa học chuyên sâu",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDO0lsrbIHn4efNlL3TG40KHVFxKPJ7Vm6gMe-6WUhwZHRfiq9igUvi9WxMTkW7WSwwFB0qJ2beTpPckzsVofIeZTNjrbjXQ5zmKmbyyyi8r3sazQZOB9YWYX-k5jyI1_fz6aOPkDWZn_9QsiGLp9jpbcOK3WM-6iybcSKQomBExkIy-ouNlld0yVZZQDDc9mDXgZVxKs3GDThPdhjbK9LXDVoH2VgLHUVwDOhKza4IFtkOc8YQzvGvPjRU6M50h5sNj5lKRn479LU",
    lessonsCompleted: 12,
    lessonsTotal: 16,
    timeLeftStr: "45p",
    nextLessonTitle: "Chiến lược tuyển dụng đa kênh trong kỷ nguyên AI."
  })

  // Calculate strict progress percentage
  const continuingProgress = Math.round((continuingCourse.lessonsCompleted / continuingCourse.lessonsTotal) * 100)

  // 3. Suggested Courses
  const [suggestedCourses, setSuggestedCourses] = useState([
    {
      id: "course-2",
      title: "Xây dựng văn hóa doanh nghiệp vững mạnh",
      category: "PHÁT TRIỂN",
      instructor: "Gv. Nguyễn Văn A",
      rating: 4.9,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCM7cdJM5w0N5D-1aHQqhcYFJQ5QlFv_vrgJWdAjAbu-dOu1-m64YaK7-d08FxYAHqSMwdnuWmiSr7FVl2Sywoiq8RpUNUHW_PUV0pSgOt39L94uMpx7wIMCVztBCfY7NhhRYkCEsYMNNEo3Ee_nahW0wGWvLTo6_qdaK4T7H9qip1Nud8wBZOJqL2ygAdb8dDo2X13CSXd_nTmymo8pDETKhE-ADfSsyUWS8_J8Dnrg3GJaCu4IiaqD8Xg2UIoYYWMKE8nRnlZjJ0"
    },
    {
      id: "course-3",
      title: "Thiết lập hệ thống KPI & OKR hiệu quả",
      category: "QUẢN TRỊ",
      instructor: "Gv. Trần Thị B",
      rating: 4.8,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYi3kN7BRQtwLXIZVVI4WjyCgm4vvaAh69IFn0iTCco-bdTEybctODvTLoehG6B7zsA_tx5xSFTYedYtTcn63jQxibH88ggaFIFY2a8Q-VpvrKZU2zRU0Iyrb0sXJh8pWl9LD5Jeyb9INk7spHE3g9Dv7SnTYjzv7K0EAIKxt7JjBi7edeib4b16amULqjO_a_403RUdBhxxmTw4mbPsfwzlig-raR3TI3hzrcxZ0BrDT5AUC_Yl8Ew-cCG5wd6Mbz-cFzEFwOx8c"
    }
  ])

  // 4. Recent Activity
  const [activities, setActivities] = useState<ActivityItemProps[]>([
    {
      icon: CheckCircle,
      title: "Hoàn thành bài học",
      subtitle: "Quy trình onboarding nhân viên mới",
      timeStr: "2 giờ trước",
      iconColorClass: "text-[#00361a] dark:text-[#9ed3aa]",
      iconBgClass: "bg-[#1b4d2e]/10 dark:bg-[#9ed3aa]/10"
    },
    {
      icon: Award,
      title: "Nhận huy hiệu mới",
      subtitle: "Người học tích cực tuần 2",
      timeStr: "Hôm qua",
      iconColorClass: "text-[#f0a01b]",
      iconBgClass: "bg-[#f0a01b]/10"
    },
    {
      icon: MessageSquare,
      title: "Bình luận mới",
      subtitle: "Phản hồi thắc mắc về KPI",
      timeStr: "3 ngày trước",
      iconColorClass: "text-[#4f6353] dark:text-[#b6ccb8]",
      iconBgClass: "bg-[#cfe5d1]/20 dark:bg-[#b6ccb8]/10"
    }
  ])

  // simulated fetch effect
  useEffect(() => {
    // TODO: Supabase fetch queries will go here
    // const fetchDashboardData = async () => { ... }
    // fetchDashboardData()
  }, [])

  return (
    <div className="space-y-12 pb-12">
      
      {/* Hero Banner Section */}
      <section className="relative rounded-3xl overflow-hidden min-h-[320px] flex items-center bg-gradient-to-br from-[#00361a] to-[#1b4d2e] dark:from-[#012613] dark:to-[#0a1e12] p-8 md:p-12 text-white">
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <Sparkles className="text-[#f0a01b] w-4 h-4" />
            <span className="text-[10px] font-bold tracking-[0.1em] uppercase">
              Hành trình nâng tầm nhân sự
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Chào mừng trở lại,<br className="hidden md:block"/> {userName}!
          </h2>
          <p className="text-lg opacity-80 font-light leading-relaxed max-w-lg">
            Hãy tiếp tục hành trình nâng tầm nhân sự của bạn. Sự kiên trì hôm nay là thành công của ngày mai.
          </p>
          <Link href={`/courses/${continuingCourse.id}`}>
            <button className="bg-gradient-to-r from-[#f0a01b] to-[#ffb957] text-[#00361a] px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-black/20 mt-2">
              Học tiếp ngay
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
        {/* Decorative Element */}
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 md:opacity-20 pointer-events-none">
          <Award strokeWidth={0.5} className="w-[300px] h-[300px] absolute -right-10 -top-10" />
        </div>
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Tổng giờ học" 
          value={`${stats.totalHours}h`} 
          subtitle={stats.totalHoursTrend} 
          icon={TrendingUp} 
        />
        <StatsCard 
          title="Khóa đang học" 
          value={stats.activeCourses.toString().padStart(2, '0')} 
          subtitle="Khóa học" 
          subtitleColor="text-[#717971] dark:text-[#9ca3af]" 
        />
        <StatsCard 
          title="Tỷ lệ hoàn thành" 
          value={`${stats.completionRate}%`} 
          subtitle="Vượt mục tiêu" 
        />
        <StatsCard 
          title="Chuỗi ngày học" 
          value={stats.streakDays} 
          subtitle="Ngày liên tiếp"
          valueColor="text-[#f0a01b]"
          subtitleColor="text-[#717971] dark:text-[#9ca3af]" 
        />
      </section>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Courses */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Continuing Learning */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-[#f0a01b] font-bold tracking-widest uppercase text-[10px] mb-1 block">
                  CURRENT FOCUS
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-[#191c19] dark:text-white">
                  Tiếp tục học
                </h3>
              </div>
              <Link href="/student/courses" className="text-sm font-semibold text-[#1b4d2e] dark:text-[#9ed3aa] flex items-center gap-1 hover:underline">
                Xem tất cả <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <ContinuingCourseCard 
              {...continuingCourse} 
              progress={continuingProgress} 
            />
          </section>

          {/* Suggestions Grid */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-[#f0a01b] font-bold tracking-widest uppercase text-[10px] mb-1 block">
                  CURATED FOR YOU
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-[#191c19] dark:text-white">
                  Gợi ý cho bạn
                </h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {suggestedCourses.map(course => (
                <SuggestedCourseCard key={course.id} {...course} />
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Activity & Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* Recent Activity */}
          <section className="bg-[#f3f4ef] dark:bg-[#1C1B1B] p-8 rounded-[2rem] border border-[var(--border)]">
            <h3 className="text-xl font-bold tracking-tight text-[#191c19] dark:text-white mb-8">
              Hoạt động gần đây
            </h3>
            <div className="space-y-6">
              {activities.map((activity, index) => (
                <ActivityItem 
                  key={index} 
                  {...activity} 
                  isLast={index === activities.length - 1} 
                />
              ))}
            </div>
            <button className="w-full mt-8 py-3 text-xs font-bold text-[#717971] dark:text-[#9ca3af] hover:text-[#00361a] dark:hover:text-white transition-colors uppercase tracking-[0.15em]">
              Xem lịch sử đầy đủ
            </button>
          </section>

          {/* Learning Goal Card */}
          <section className="bg-gradient-to-br from-[#f0a01b] to-[#422800] dark:from-[#9c6301] dark:to-[#2b1700] p-8 rounded-[2rem] text-white overflow-hidden relative">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2 block relative z-10">
              Weekly Goal
            </span>
            <h4 className="text-2xl font-extrabold mb-6 relative z-10">6/8 giờ học tập</h4>
            
            <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden mb-6 relative z-10">
              <div className="h-full bg-white w-3/4 rounded-full transition-all duration-1000 ease-out"></div>
            </div>
            
            <p className="text-sm opacity-90 leading-relaxed italic relative z-10 font-medium">
              "Kiến thức không bao giờ là đủ, sự học là vô tận."
            </p>
            
            <Award className="absolute -right-6 -bottom-6 w-32 h-32 text-white opacity-10 pointer-events-none" />
          </section>

          {/* Support Card */}
          <Link href="/student/support" className="block">
            <section className="bg-[#e1e3de] dark:bg-[#2A2A2A] p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-[#1b4d2e] hover:text-white dark:hover:bg-[#1b4d2e] dark:hover:text-white transition-all duration-300 border border-[var(--border)]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/50 dark:bg-black/20 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                  <HeadphonesIcon className="w-5 h-5 text-neutral-700 dark:text-neutral-300 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-white">
                    Cần hỗ trợ?
                  </p>
                  <p className="text-[10px] text-neutral-600 dark:text-neutral-400 group-hover:text-white/80 mt-0.5">
                    Trò chuyện với cố vấn học tập
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
            </section>
          </Link>
        </aside>
      </div>
      
      {/* Footer */}
      <footer className="text-center text-[#717971] dark:text-[#9ca3af] text-[10px] uppercase tracking-widest mt-8">
        © 2026 INSPIRING HR LMS. Nâng tầm nhân sự, khẳng định giá trị.
      </footer>
    </div>
  )
}
