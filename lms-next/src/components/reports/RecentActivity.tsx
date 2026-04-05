"use client"

import React from 'react'
import { Activity } from 'lucide-react'
import { useAnalytics } from '@/components/reports/AnalyticsProvider'

export const RecentActivity: React.FC = () => {
  const { recentActivities } = useAnalytics()

  return (
    <div className="dark:bg-[#201f1f] light:bg-white border border-[var(--border)] rounded-xl p-6 min-w-0">
      <h4 className="font-bold dark:text-white light:text-neutral-900 mb-6 flex items-center gap-2">
        <span className="w-1 h-4 bg-blue-500 rounded-full" />
        Hoạt động gần đây
      </h4>

      <div className="space-y-6">
        {recentActivities.map((act, i) => (
          <div key={act.id || i} className="flex gap-4 group">
            {/* Timeline dot */}
            <div className="flex flex-col items-center mt-1">
              <div className="w-8 h-8 rounded-full dark:bg-[#2a2a2a] light:bg-neutral-100 flex items-center justify-center border border-[var(--border)] group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-colors z-10 flex-shrink-0">
                <Activity size={12} className="text-blue-500" />
              </div>
              {i !== recentActivities.length - 1 && (
                <div className="w-px h-full dark:bg-[#2a2a2a] light:bg-neutral-200 my-1 group-hover:bg-blue-500/20 transition-colors" />
              )}
            </div>

            {/* Content */}
            <div className="pb-4 flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-sm font-bold dark:text-white light:text-neutral-900">{act.user}</span>
                <span className="text-sm dark:text-neutral-400 light:text-neutral-500">{act.action}</span>
                {act.course && (
                  <span className="text-sm font-semibold text-blue-400">{act.course}</span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">{act.time}</p>
            </div>
          </div>
        ))}
      </div>
      
      {recentActivities.length === 0 && (
        <div className="text-center py-6 text-sm text-neutral-500">Chưa có hoạt động nào</div>
      )}
    </div>
  )
}
