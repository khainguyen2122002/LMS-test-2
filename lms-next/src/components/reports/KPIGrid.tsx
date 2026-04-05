"use client"

import React from 'react'
import { TrendingUp, TrendingDown, BadgeCheck, PieChart, Clock } from 'lucide-react'
import { useAnalytics } from '@/components/reports/AnalyticsProvider'

interface KPI {
  label: string
  value: string | number
  icon: React.ReactNode
  iconBg: string
  trend: React.ReactNode
  extra?: React.ReactNode
  glowColor: string
}

export const KPIGrid: React.FC = () => {
  const { totalCompletedUsers, completionRate, averageStudyTime } = useAnalytics()

  const kpis: KPI[] = [
    {
      label: 'Tổng học viên hoàn thành',
      value: new Intl.NumberFormat('en-US').format(totalCompletedUsers),
      icon: <BadgeCheck size={20} />, 
      iconBg: 'bg-emerald-900/20 text-emerald-400',
      trend: (
        <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
          <TrendingUp size={14} /> Tăng trưởng theo thời gian thực
        </span>
      ),
      glowColor: 'bg-emerald-500/5',
    },
    {
      label: 'Tỷ lệ hoàn thành trung bình',
      value: `${completionRate}%`,
      icon: <PieChart size={20} />,
      iconBg: 'bg-amber-900/20 text-amber-400',
      trend: null,
      extra: (
        <div className="mt-4 space-y-1.5">
          <div className="w-full dark:bg-[#353534] light:bg-neutral-200 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${completionRate >= 80 ? 'bg-emerald-400' : 'bg-amber-400'}`} style={{ width: `${completionRate}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-neutral-500">
            <span>Mục tiêu: 80%</span>
            <span className={completionRate >= 80 ? 'text-emerald-400' : 'text-amber-400'}>
              {completionRate >= 80 ? `+${(completionRate - 80).toFixed(1)}% vượt` : `${(80 - completionRate).toFixed(1)}% thiếu`}
            </span>
          </div>
        </div>
      ),
      glowColor: 'bg-amber-500/5',
    },
    {
      label: 'Thời gian học trung bình',
      value: `${averageStudyTime}h/tuần`,
      icon: <Clock size={20} />,
      iconBg: 'bg-yellow-900/20 text-yellow-300',
      trend: (
        <span className="flex items-center gap-1 text-red-400 text-xs font-medium">
          <TrendingDown size={14} /> -0.1h so với tháng trước
        </span>
      ),
      glowColor: 'bg-yellow-500/5',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {kpis.map((kpi, i) => (
        <div key={i} className="dark:bg-[#201f1f] light:bg-white border border-[var(--border)] p-6 rounded-xl relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-neutral-500 text-xs font-semibold uppercase tracking-widest mb-1">{kpi.label}</p>
              <h3 className="text-3xl font-bold dark:text-white light:text-neutral-900">{kpi.value}</h3>
            </div>
            <div className={`${kpi.iconBg} p-2 rounded-lg`}>{kpi.icon}</div>
          </div>
          {kpi.trend && <div className="mt-4">{kpi.trend}</div>}
          {kpi.extra && kpi.extra}
          <div className={`absolute -bottom-6 -right-6 w-24 h-24 ${kpi.glowColor} rounded-full blur-2xl group-hover:opacity-150 transition-opacity`} />
        </div>
      ))}
    </div>
  )
}
