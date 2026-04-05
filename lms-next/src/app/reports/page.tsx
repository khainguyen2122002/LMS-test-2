import type { Metadata } from 'next'
import { CalendarDays, Download } from 'lucide-react'
import { KPIGrid } from '@/components/reports/KPIGrid'
import { GrowthChart } from '@/components/reports/GrowthChart'
import { RoleDistribution } from '@/components/reports/RoleDistribution'
import { CoursePopularity } from '@/components/reports/CoursePopularity'
import { RecentActivity } from '@/components/reports/RecentActivity'
import { AnalyticsProvider } from '@/components/reports/AnalyticsProvider'
import { SimulationPanel } from '@/components/reports/SimulationPanel'

export const metadata: Metadata = {
  title: 'Báo cáo & Phân tích | Inspiring HR',
  description: 'Theo dõi hiệu suất đào tạo và tương tác của học viên theo thời gian thực.',
}

export default function ReportsPage() {
  return (
    <AnalyticsProvider>
      <div className="py-8 space-y-8 animate-in fade-in duration-500">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight dark:text-white light:text-neutral-900">
              Báo cáo &amp; Phân tích
            </h2>
            <p className="dark:text-neutral-400 light:text-neutral-500 mt-2">
              Theo dõi hiệu suất đào tạo và tương tác của học viên theo thời gian thực.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button className="dark:bg-[#2a2a2a] light:bg-neutral-100 dark:text-white light:text-neutral-900 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:dark:bg-[#353534] light:bg-neutral-200 transition-colors">
              <CalendarDays size={16} />
              30 ngày qua
            </button>
            <button className="bg-gradient-to-br from-emerald-400 to-[#1B4D2E] dark:text-white light:text-neutral-900 px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/20 hover:scale-[1.02] active:scale-95 transition-all">
              <Download size={16} />
              Xuất báo cáo
            </button>
          </div>
        </div>

        {/* Global Simulation Panel */}
        <SimulationPanel />

        {/* KPI Cards */}
        <KPIGrid />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 min-w-0">
            <GrowthChart />
          </div>
          <div className="lg:col-span-4 min-w-0">
            <RoleDistribution />
          </div>
        </div>

        {/* Course Popularity */}
        <CoursePopularity />

        {/* Recent Activity */}
        <RecentActivity />

        {/* Decorative background blobs */}
        <div className="fixed top-0 right-0 -z-10 w-[600px] h-[500px] bg-emerald-900/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-0 left-[260px] -z-10 w-[500px] h-[400px] bg-amber-900/5 rounded-full blur-[100px] pointer-events-none" />
      </div>
    </AnalyticsProvider>
  )
}
