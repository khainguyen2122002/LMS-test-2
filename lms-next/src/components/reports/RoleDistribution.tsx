"use client"

import React, { useMemo } from 'react'
import { useAnalytics } from '@/components/reports/AnalyticsProvider'

export const RoleDistribution: React.FC = () => {
  const { roleDistribution, totalUsers } = useAnalytics()

  const segments = useMemo(() => {
    let currentOffset = 0
    return roleDistribution.map((role) => {
      // Calculate real percentage based on current counts dynamically
      const pct = Math.max(1, Math.round((role.count / totalUsers) * 100))
      const seg = {
        label: `${role.name} (${pct}%)`,
        count: role.count.toLocaleString('en-US'),
        color: role.color,
        dash: `${pct} 100`,
        offset: -currentOffset,
        rawValue: pct
      }
      currentOffset += pct
      return seg
    })
  }, [roleDistribution, totalUsers])

  const studentCountFormatted = roleDistribution[0]?.count > 1000 
    ? (roleDistribution[0]?.count / 1000).toFixed(1) + 'k'
    : roleDistribution[0]?.count.toString()

  return (
    <div className="dark:bg-[#201f1f] light:bg-white border border-[var(--border)] rounded-xl p-6 min-w-0">
      <h4 className="font-bold dark:text-white light:text-neutral-900 mb-6 flex items-center gap-2">
        <span className="w-1 h-4 bg-amber-400 rounded-full" />
        Cơ cấu vị trí
      </h4>

      <div className="flex flex-col items-center">
        {/* Donut SVG */}
        <div className="relative w-44 h-44 mb-6">
          <svg className="w-full h-full -rotate-90 transition-all duration-700" viewBox="0 0 36 36">
            {/* Track */}
            <circle cx="18" cy="18" r="15.9" fill="transparent" className="stroke-neutral-200 dark:stroke-[#2a2a2a]" strokeWidth="4" />
            {/* Segments */}
            {segments.map((s, i) => (
              <circle
                key={i}
                cx="18" cy="18" r="15.9"
                fill="transparent"
                stroke={s.color}
                strokeWidth="4"
                strokeDasharray={s.dash}
                strokeDashoffset={s.offset}
                className="transition-all duration-1000 ease-out"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold dark:text-white light:text-neutral-900">{studentCountFormatted}</span>
            <span className="text-[10px] text-neutral-500 uppercase font-bold">Học viên</span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full space-y-3">
          {segments.map((s, i) => (
            <div key={i} className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="dark:text-neutral-400 light:text-neutral-500">{s.label}</span>
              </div>
              <span className="font-semibold dark:text-white light:text-neutral-900">{s.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
