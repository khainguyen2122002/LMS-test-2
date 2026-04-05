"use client"

import React from 'react'
import { TrendingUp, Users2, School, ShieldCheck } from 'lucide-react'
import { useUsers } from '@/components/users/UserProvider'

interface StatItem {
  label: string
  value: number | string
  icon: React.ReactNode
  trend: string
  trendColor: string
  glowColor: string
}

export const UserStatsGrid: React.FC = () => {
  const { totalUsersCount, studentCount, teacherCount, adminCount } = useUsers()

  const stats: StatItem[] = [
    {
      label: 'Tổng người dùng',
      value: totalUsersCount,
      icon: <TrendingUp size={16} className="mr-1" />,
      trend: '+12% so với tháng trước',
      trendColor: 'text-emerald-400',
      glowColor: 'bg-emerald-500/5',
    },
    {
      label: 'Học viên (Hoạt động)',
      value: studentCount,
      icon: <School size={16} className="mr-1" />,
      trend: 'Đang theo học',
      trendColor: 'text-amber-400',
      glowColor: 'bg-amber-500/5',
    },
    {
      label: 'Giảng viên',
      value: teacherCount,
      icon: <Users2 size={16} className="mr-1" />,
      trend: 'Biên chế trên hệ thống',
      trendColor: 'text-amber-300',
      glowColor: 'bg-yellow-500/5',
    },
    {
      label: 'Admin',
      value: adminCount,
      icon: <ShieldCheck size={16} className="mr-1" />,
      trend: 'Toàn quyền điều hành',
      trendColor: 'text-neutral-500',
      glowColor: 'bg-red-500/5',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="dark:bg-[#201f1f] light:bg-white p-6 rounded-xl relative overflow-hidden group dark:hover:bg-[#252524] light:hover:bg-neutral-100 transition-colors"
        >
          <div
            className={`absolute top-0 right-0 w-24 h-24 ${stat.glowColor} rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500`}
          />
          <div className="relative z-10">
            <p className="dark:text-neutral-400 light:text-neutral-500 text-sm font-medium mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold dark:text-white light:text-neutral-900">{stat.value}</h3>
            <div className={`mt-4 flex items-center text-xs ${stat.trendColor} font-medium`}>
              {stat.icon}
              {stat.trend}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
