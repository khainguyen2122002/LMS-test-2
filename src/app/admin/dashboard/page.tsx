"use client"

import { TrendingUp, Users2 } from 'lucide-react'
import { dashboardContent } from "@/lib/content";
import { HeroBanner } from "@/components/dashboard/HeroBanner";
import { StatCard } from "@/components/dashboard/StatCard";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { getDashboardStats } from '@/lib/analytic-service'
import { useQuery } from '@tanstack/react-query'

export default function AdminDashboardPage() {
  const { hero, currentCourse, quickActions } = dashboardContent;

  const { data: realStats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })

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
          <div className={isLoading ? 'animate-pulse' : ''}>
            <StatCard 
              label="TỔNG KHÓA HỌC"
              value={isLoading ? '...' : (realStats?.courseViews?.toString() || '0')}
              trend="Dữ liệu thực tế"
              progress={100}
              icon={TrendingUp}
            />
          </div>
          <div className={isLoading ? 'animate-pulse' : ''}>
            <StatCard 
              label="NGƯỜI DÙNG"
              value={isLoading ? '...' : (realStats?.totalUsers?.toString() || '0')}
              trend="Thành viên hệ thống"
              trendValue="+100%"
              icon={Users2}
              variant="amber"
            />
          </div>
        </div>
        
        <QuickActionCard content={quickActions} />
      </div>
    </div>
  );
}
