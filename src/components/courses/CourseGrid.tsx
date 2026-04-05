"use client"

import React from 'react'
import { ArrowRight, Timer, BadgeCheck, BookOpen, Users, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCourses } from '@/components/courses/CourseProvider'
import type { Course } from '@/lib/course-service'

// ─── Shared Card Actions & Utilities ───────────────────────────────────────
const calculateProgress = (completed: number | undefined, total: number | undefined) => {
  if (!total || total === 0) return 0
  return Math.round(((completed || 0) / total) * 100)
}

// ─── Featured Card (spans 2 cols) ───────────────────────────────────────────
const FeaturedCard: React.FC<{ course: Course }> = ({ course }) => {
  const router = useRouter()
  const progress = calculateProgress(course.completed_lessons, course.total_lessons)

  return (
    <article 
      onClick={() => router.push(`/courses/${course.id}`)}
      className="dark:bg-[#201f1f] light:bg-white rounded-xl overflow-hidden group border border-[var(--border)] hover:border-emerald-500/20 transition-all lg:col-span-2 flex flex-col md:flex-row min-w-0 cursor-pointer shadow-sm hover:shadow-xl"
    >
      <div className="w-full md:w-2/5 relative h-64 md:h-auto overflow-hidden flex-shrink-0">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-amber-400 text-black px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest shadow-md">
          Phổ biến nhất
        </div>
      </div>
      <div className="p-8 flex-1 flex flex-col justify-between min-w-0">
        <div>
          {course.level && (
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
              <span className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">{course.level}</span>
            </div>
          )}
          <h3 className="text-2xl font-bold dark:text-white light:text-neutral-900 mb-3 leading-tight group-hover:text-emerald-500 transition-colors">
            {course.title}
          </h3>
          <p className="dark:text-neutral-400 light:text-neutral-500 text-sm line-clamp-2 mb-6">{course.description}</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-500 flex-wrap gap-2">
            {course.instructor && (
              <span className="flex items-center gap-1.5">
                <Users size={14} /> {course.instructor}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <BookOpen size={14} /> {course.total_lessons || 0} bài giảng
            </span>
          </div>
          
          {(course.completed_lessons || 0) > 0 && typeof progress === 'number' && (
            <>
              <div className="w-full dark:bg-[#353534] light:bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-xs font-medium ${progress === 100 ? 'text-emerald-500' : 'text-amber-400'}`}>
                  {progress === 100 ? 'Đã hoàn thành' : `Đang hoàn thành ${progress}%`}
                </span>
                <button className="text-emerald-500 text-sm font-bold flex items-center gap-1 hover:underline">
                  {progress === 100 ? 'Xem lại' : 'Học tiếp'} <ArrowRight size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  )
}

// ─── Standard Card ────────────────────────────────────────────────────────────
const StandardCard: React.FC<{ course: Course }> = ({ course }) => {
  const router = useRouter()
  const progress = calculateProgress(course.completed_lessons, course.total_lessons)
  
  return (
    <article 
      onClick={() => router.push(`/courses/${course.id}`)}
      className="dark:bg-[#201f1f] light:bg-white rounded-xl overflow-hidden group border border-[var(--border)] hover:border-emerald-500/20 transition-all flex flex-col min-w-0 cursor-pointer shadow-sm hover:shadow-xl"
    >
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
           {(course.completed_lessons || 0) > 0 ? (
             <span className="text-white text-xs font-bold flex items-center gap-1">
               {progress === 100 ? 'Xem lại bài học' : 'Học tiếp'} <ArrowRight size={14} />
             </span>
           ) : (
             <span className="text-white text-xs font-bold flex items-center gap-1">Khám phá <ArrowRight size={14} /></span>
           )}
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col min-w-0">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-base font-bold dark:text-white light:text-neutral-900 group-hover:text-emerald-500 transition-colors leading-snug">
            {course.title}
          </h3>
        </div>
        <p className="text-neutral-500 text-xs mb-4 flex-1 line-clamp-2">{course.description}</p>
        
        {(course.completed_lessons || 0) > 0 && typeof progress === 'number' && (
           <div className="mb-4">
             <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-neutral-500">{course.completed_lessons} / {course.total_lessons} bài giảng</span>
                <span className={`text-[10px] font-bold ${progress === 100 ? 'text-emerald-500' : 'text-amber-400'}`}>{progress}%</span>
             </div>
             <div className="w-full dark:bg-[#353534] light:bg-neutral-200 h-1 rounded-full overflow-hidden">
               <div
                  className={`h-full rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-amber-400'}`}
                  style={{ width: `${progress}%` }}
                />
             </div>
           </div>
        )}

        <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between gap-2 flex-wrap min-h-[36px]">
          {/* Left meta */}
          <div className="flex items-center gap-2">
            {course.instructorAvatar ? (
              <img src={course.instructorAvatar} alt="avatar" className="w-6 h-6 rounded-full object-cover border border-[var(--border)]" />
            ) : (
               <div className="w-6 h-6 rounded-full dark:bg-[#0e0e0e] light:bg-neutral-200 flex items-center justify-center font-bold text-[10px] text-neutral-500">
                  {course.instructor ? course.instructor.charAt(0) : 'G'}
               </div>
            )}
            <span className="text-[11px] font-medium text-neutral-500 line-clamp-1 max-w-[100px]">{course.instructor}</span>
            {course.hours && (
              <span className="flex items-center gap-1 text-[11px] text-neutral-500 ml-1">
                <Timer size={12} /> {course.hours}h
              </span>
            )}
            {course.certified && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-500 ml-1" title={course.certLabel}>
                <BadgeCheck size={12} />
              </span>
            )}
          </div>

          {/* Right action */}
          {!(course.completed_lessons || 0) && course.is_free && (
            <span className="text-[10px] font-bold dark:text-white light:text-neutral-900 bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded">Miễn phí</span>
          )}
          {!(course.completed_lessons || 0) && !course.is_free && (
             <span className="text-[10px] font-bold dark:text-white light:text-neutral-900">Trả phí</span>
          )}
        </div>
      </div>
    </article>
  )
}

// ─── Grid ─────────────────────────────────────────────────────────────────────
export const CourseGrid: React.FC = () => {
  const { loading, filteredCourses, activeCategory, searchQuery } = useCourses()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-neutral-500">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
        <p className="text-lg font-medium">Đang tải danh sách khóa học...</p>
      </div>
    )
  }

  if (filteredCourses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-neutral-500 border border-[var(--border)] border-dashed rounded-2xl bg-[var(--card)]">
        <BookOpen size={48} className="mb-4 opacity-20" />
        <p className="text-xl font-medium dark:text-white light:text-neutral-900">Không tìm thấy khóa học</p>
        <p className="text-sm mt-2 max-w-md">Hãy thử tìm với từ khóa khác hoặc xóa bỏ bộ lọc hiện tại.</p>
      </div>
    )
  }

  // Identify whether we show the featured card or just a uniform grid of standard cards.
  const isDefaultView = activeCategory === 'Tất cả' && searchQuery.trim() === ''

  if (isDefaultView && filteredCourses.length > 0) {
    const [featured, ...rest] = filteredCourses
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeaturedCard course={featured} />
        {rest.map((c) => (
          <StandardCard key={c.id} course={c} />
        ))}
      </div>
    )
  }

  // Flat Uniform Grid for filtered results
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredCourses.map((c) => (
         <StandardCard key={c.id} course={c} />
      ))}
    </div>
  )
}
