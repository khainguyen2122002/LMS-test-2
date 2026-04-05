"use client"

import React from 'react'
import { Search } from 'lucide-react'
import { useCourses, CourseCategory } from '@/components/courses/CourseProvider'

const FILTERS: CourseCategory[] = [
  'Tất cả',
  'Quản trị nhân sự',
  'Tuyển dụng',
  'Đào tạo & Phát triển',
  'Văn hóa doanh nghiệp',
  'Kỹ năng mềm',
]

export const CourseFilters: React.FC = () => {
  const { activeCategory, setActiveCategory, searchQuery, setSearchQuery } = useCourses()

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between pb-1">
      {/* Category Chips */}
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide w-full md:w-auto">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveCategory(f)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
              activeCategory === f
                ? 'bg-amber-400 text-black font-semibold shadow-lg shadow-amber-500/20'
                : 'dark:bg-[#2a2a2a] light:bg-neutral-100 dark:text-neutral-400 light:text-neutral-500 hover:dark:text-white light:text-neutral-900 border border-transparent hover:border-[var(--border)]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Real-time Search */}
      <div className="relative w-full md:w-72 flex-shrink-0">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm nhanh khóa học..."
          className="w-full bg-[var(--card)] border border-[var(--border)] rounded-full py-2.5 pl-11 pr-4 text-sm dark:text-white light:text-neutral-900 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all shadow-sm"
        />
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
      </div>
    </div>
  )
}
