"use client"
export const dynamic = 'force-dynamic'

import React, { useState } from 'react'
import { Plus, Users } from 'lucide-react'
import { CourseFilters } from '@/components/courses/CourseFilters'
import { CourseProvider, useCourses } from '@/components/courses/CourseProvider'
import { CreateCourseModal } from '@/components/courses/modals/CreateCourseModal'
import { EnrollmentManager } from '@/components/courses/EnrollmentManager'
import { ArrowRight, Timer, BadgeCheck, BookOpen, Loader2 } from 'lucide-react'
import type { Course } from '@/lib/course-service'

// Admin Course Grid with Enrollment button integrated
const AdminCourseGrid: React.FC<{ onManageEnrollment: (id: string, title: string) => void }> = ({ onManageEnrollment }) => {
  const { loading, filteredCourses } = useCourses()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
      </div>
    )
  }

  if (filteredCourses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[var(--border)] rounded-2xl text-neutral-500">
        <BookOpen size={48} className="mb-4 opacity-20" />
        <p className="text-xl font-medium dark:text-white">Chưa có khóa học nào</p>
        <p className="text-sm mt-2">Tạo khóa học đầu tiên để bắt đầu</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCourses.map(course => (
        <ArticleCard
          key={course.id}
          course={course}
          onManageEnrollment={onManageEnrollment}
        />
      ))}
    </div>
  )
}

const ArticleCard: React.FC<{
  course: Course
  onManageEnrollment: (id: string, title: string) => void
}> = ({ course, onManageEnrollment }) => {
  return (
    <article className="dark:bg-[#201f1f] bg-white rounded-xl overflow-hidden border border-[var(--border)] flex flex-col shadow-sm hover:shadow-xl transition-all">
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          {course.is_published ? (
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Đã xuất bản</span>
          ) : (
            <span className="bg-neutral-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Nháp</span>
          )}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-2">
          <span className="text-[10px] font-bold text-[#f0a01b] uppercase tracking-wider">{course.category}</span>
        </div>
        <h3 className="text-sm font-bold dark:text-white line-clamp-2 mb-2 leading-snug">{course.title}</h3>
        <p className="text-xs text-neutral-500 line-clamp-2 flex-1">{course.description}</p>

        <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center gap-2">
          <span className="text-xs text-neutral-500 flex items-center gap-1">
            <BookOpen size={12} /> {course.total_lessons || 0} bài
          </span>
          {course.hours && (
            <span className="text-xs text-neutral-500 flex items-center gap-1">
              <Timer size={12} /> {course.hours}h
            </span>
          )}
          <div className="ml-auto">
            <button
              onClick={() => onManageEnrollment(course.id, course.title)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B4D2E]/10 dark:bg-[#9ed3aa]/10 text-[#1B4D2E] dark:text-[#9ed3aa] font-bold text-xs rounded-lg hover:bg-[#1B4D2E] hover:text-white transition-all"
            >
              <Users size={12} /> Học viên
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function AdminCoursesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [enrollmentTarget, setEnrollmentTarget] = useState<{ id: string; title: string } | null>(null)

  return (
    <CourseProvider>
      <div className="py-8 space-y-8 min-h-screen animate-in fade-in duration-500">
        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-[#f0a01b] font-bold tracking-widest uppercase text-xs mb-1">QUẢN TRỊ HỌC TẬP</p>
            <h2 className="text-4xl font-extrabold tracking-tight dark:text-white mb-2">Khóa học</h2>
            <p className="dark:text-neutral-400 text-sm max-w-lg">
              Quản lý toàn bộ khóa học, xuất bản nội dung và cấp quyền truy cập cho học viên.
            </p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm text-black shadow-lg shadow-emerald-900/20 hover:scale-[1.02] active:scale-95 transition-all"
            style={{ background: 'linear-gradient(135deg, #9ed3aa 0%, #1b4d2e 100%)' }}
          >
            <Plus size={18} />
            Tạo khóa học mới
          </button>
        </section>

        <CourseFilters />

        <AdminCourseGrid
          onManageEnrollment={(id, title) => setEnrollmentTarget({ id, title })}
        />

        {/* Modals */}
        <CreateCourseModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

        {enrollmentTarget && (
          <EnrollmentManager
            courseId={enrollmentTarget.id}
            courseTitle={enrollmentTarget.title}
            onClose={() => setEnrollmentTarget(null)}
          />
        )}
      </div>
    </CourseProvider>
  )
}
