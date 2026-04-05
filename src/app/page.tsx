"use client"

import { useEffect, useState } from 'react'
import { TrendingUp, Users2 } from 'lucide-react'
import { dashboardContent } from "@/lib/content";
import { HeroBanner } from "@/components/dashboard/HeroBanner";
import { StatCard } from "@/components/dashboard/StatCard";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { getDashboardStats } from '@/lib/analytic-service'

export default function Home() {
  const { hero, stats, currentCourse, quickActions } = dashboardContent;
  const [realStats, setRealStats] = useState({
    totalUsers: 0,
    courseViews: 0,
  })

  useEffect(() => {
    async function loadStats() {
      const data = await getDashboardStats()
      setRealStats({
        totalUsers: data.totalUsers || 0,
        courseViews: data.courseViews || 0,
      })
    }
    loadStats()
  }, [])

  return (
    <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-700 overflow-hidden">
      {/* LEFT COLUMN: Hero + Course (col-span-8) */}
      <div className="lg:col-span-8 space-y-12 min-w-0">
        <HeroBanner content={hero} />
        <CourseCard content={currentCourse} />
      </div>

      {/* RIGHT COLUMN: Stats + Tools (col-span-4) */}
      <div className="lg:col-span-4 space-y-8 min-w-0 max-w-full overflow-visible">
        <div className="flex flex-col gap-6">
          <StatCard 
            label="TỔNG KHÓA HỌC"
            value={realStats.courseViews.toString()}
            trend="Dữ liệu thực tế"
            progress={100}
            icon={TrendingUp}
          />
          <StatCard 
            label="NGƯỜI DÙNG"
            value={realStats.totalUsers.toString()}
            trend="Thành viên hệ thống"
            trendValue="+100%"
            icon={Users2}
            variant="amber"
          />
        </div>
        
        <QuickActionCard content={quickActions} />
      </div>
    </div>
  );
}
