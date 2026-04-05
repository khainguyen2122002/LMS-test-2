import React from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Clock, Users, PlayCircle, Lock, CheckCircle } from 'lucide-react'
import { getCourseDetails } from '@/lib/course-service'

export default async function CourseDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const courseId = params.id
  
  const course = await getCourseDetails(courseId)

  if (!course) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold">Không tìm thấy khóa học</h2>
        <Link href="/courses" className="text-emerald-500 hover:underline mt-4 inline-block">Quay lại danh sách</Link>
      </div>
    )
  }

  return (
    <div className="py-8 space-y-8 animate-in fade-in duration-500 pt-16 lg:pt-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 w-full">
        
        {/* Back navigation */}
        <Link 
          href="/courses" 
          className="inline-flex items-center gap-2 text-neutral-500 hover:dark:text-white light:hover:text-neutral-900 transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft size={16} /> Quay lại danh sách khóa học
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop'} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                  {course.category || 'Khóa học'}
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                  {course.title}
                </h1>
              </div>
            </div>

            <div className="dark:bg-[#1A1A1A] light:bg-white p-8 rounded-3xl border border-[var(--border)] space-y-6">
              <h2 className="text-2xl font-bold dark:text-white light:text-neutral-900">Mô tả khóa học</h2>
              <p className="text-neutral-400 leading-relaxed text-lg">
                {course.description}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold dark:text-white light:text-neutral-900 px-2">Nội dung bài học</h2>
              <div className="space-y-3">
                {course.lessons.length > 0 ? course.lessons.map((lesson: any, index: number) => (
                  <div 
                    key={lesson.id}
                    className="flex items-center justify-between p-5 dark:bg-[#1A1A1A] light:bg-white border border-[var(--border)] rounded-2xl hover:border-emerald-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl dark:bg-[#0e0e0e] light:bg-neutral-100 flex items-center justify-center font-bold text-neutral-500 group-hover:text-emerald-500 transition-colors">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold dark:text-white light:text-neutral-900 group-hover:text-emerald-500 transition-colors">
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-neutral-500">{lesson.is_free ? 'Xem miễn phí' : 'Yêu cầu đăng ký'}</p>
                      </div>
                    </div>
                    {lesson.is_free ? (
                      <PlayCircle size={20} className="text-emerald-500" />
                    ) : (
                      <Lock size={18} className="text-neutral-600" />
                    )}
                  </div>
                )) : (
                  <div className="p-10 text-center border border-dashed border-[var(--border)] rounded-2xl text-neutral-500">
                    Chưa có bài học nào được tải lên.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="dark:bg-[#1A1A1A] light:bg-white p-6 rounded-3xl border border-[var(--border)] shadow-xl sticky top-24">
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">Giảng viên</p>
                  <div className="flex items-center gap-3">
                    {course.instructorAvatar ? (
                      <img src={course.instructorAvatar} alt={course.instructor} className="w-12 h-12 rounded-2xl object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center font-bold text-neutral-500">
                        {course.instructor?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-bold dark:text-white light:text-neutral-900">{course.instructor}</p>
                      <p className="text-xs text-neutral-500">Chuyên gia nhân sự</p>
                    </div>
                  </div>
                </div>

                <hr className="border-[var(--border)]" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Clock size={16} /> Thời lượng
                    </div>
                    <span className="font-bold dark:text-white light:text-neutral-900">{course.hours || 0} giờ</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <BookOpen size={16} /> Số bài học
                    </div>
                    <span className="font-bold dark:text-white light:text-neutral-900">{course.lessons.length} bài</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Users size={16} /> Học viên
                    </div>
                    <span className="font-bold dark:text-white light:text-neutral-900">{course.students || 0} học viên</span>
                  </div>
                </div>

                <button 
                  className="w-full py-4 rounded-2xl font-bold text-black shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all text-sm mt-4"
                  style={{ background: 'linear-gradient(135deg, #9ed3aa 0%, #1b4d2e 100%)' }}
                >
                  Đăng ký tham gia ngay
                </button>
                
                {course.certified && (
                  <div className="flex items-center gap-2 justify-center text-emerald-500 text-xs font-bold pt-2">
                    <CheckCircle size={14} /> Có chứng chỉ hoàn thành
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
