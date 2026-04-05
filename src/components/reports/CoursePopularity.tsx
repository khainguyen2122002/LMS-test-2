"use client"

import React from 'react'
import { Flame, Star, Users } from 'lucide-react'
import { useAnalytics } from '@/components/reports/AnalyticsProvider'

export const CoursePopularity: React.FC = () => {
  const { popularCourses } = useAnalytics()

  return (
    <div className="dark:bg-[#201f1f] light:bg-white border border-[var(--border)] rounded-xl p-6 overflow-hidden relative">
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h4 className="font-bold dark:text-white light:text-neutral-900 flex items-center gap-2">
          <span className="w-1 h-4 bg-orange-500 rounded-full" />
          Khóa học nổi bật
        </h4>
        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
          <Flame size={16} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {popularCourses.map((course, idx) => (
          <div key={course.id} className="dark:bg-[#2a2a2a] light:bg-neutral-50 p-5 rounded-xl border border-[var(--border)] hover:border-orange-500/30 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4 mb-3">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-neutral-800 text-neutral-400 text-xs font-bold font-mono">
                  #{idx + 1}
                </span>
                <span className="text-[10px] uppercase font-bold text-orange-500 tracking-wider">
                  {course.category}
                </span>
              </div>
              <h5 className="font-bold dark:text-white light:text-neutral-900 text-sm mb-4 leading-relaxed group-hover:text-orange-400 transition-colors">
                {course.title}
              </h5>
              <div className="flex items-center justify-between text-xs text-neutral-500 pt-4 border-t border-[var(--border)]">
                <span className="flex items-center gap-1.5 font-medium dark:text-neutral-300 light:text-neutral-600">
                  <Users size={14} className="text-emerald-500" />
                  {course.students.toLocaleString('en-US')}
                </span>
                <span className="flex items-center gap-1 font-bold text-amber-400">
                  <Star size={14} className="fill-amber-400" />
                  {course.rating}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
