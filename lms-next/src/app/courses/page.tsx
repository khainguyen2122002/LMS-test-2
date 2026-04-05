"use client"

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { CourseFilters } from '@/components/courses/CourseFilters'
import { CourseGrid } from '@/components/courses/CourseGrid'
import { CourseProvider } from '@/components/courses/CourseProvider'
import { CreateCourseModal } from '@/components/courses/modals/CreateCourseModal'

export default function CoursesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <CourseProvider>
      <div className="py-8 space-y-8 min-h-screen animate-in fade-in duration-500">
        {/* Page Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight dark:text-white light:text-neutral-900 mb-2">Khóa học</h2>
            <p className="dark:text-neutral-400 light:text-neutral-500 text-sm max-w-lg">
              Nâng cao kỹ năng quản trị và phát triển nguồn nhân lực bền vững cùng Inspiring HR.
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm text-black shadow-lg shadow-emerald-900/20 hover:scale-[1.02] active:scale-95 transition-all"
            style={{ background: 'linear-gradient(135deg, #9ed3aa 0%, #1b4d2e 100%)' }}
          >
            <Plus size={18} />
            Tạo khóa học mới
          </button>
        </section>

        {/* Filters & Search */}
        <CourseFilters />

        {/* Dynamic Grid */}
        <CourseGrid />

        {/* Overlays */}
        <CreateCourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </CourseProvider>
  )
}
