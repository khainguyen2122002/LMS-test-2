"use client"

import React, { useState } from 'react'
import { X, Image as ImageIcon } from 'lucide-react'
import { useCourses, CourseCategory } from '@/components/courses/CourseProvider'

interface CreateCourseModalProps {
  isOpen: boolean
  onClose: () => void
}

const CATEGORIES: CourseCategory[] = ['Quản trị nhân sự', 'Tuyển dụng', 'Đào tạo & Phát triển', 'Văn hóa doanh nghiệp', 'Kỹ năng mềm']

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({ isOpen, onClose }) => {
  const { addCourse } = useCourses()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [instructor, setInstructor] = useState('')
  const [category, setCategory] = useState<CourseCategory>('Quản trị nhân sự')
  const [thumbnail, setThumbnail] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [isFree, setIsFree] = useState(false)

  if (!isOpen) return null

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setInstructor('')
    setCategory('Quản trị nhân sự')
    setThumbnail('')
    setIsPublished(true)
    setIsFree(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description || !instructor) return
    
    // Provide a default image mockup if left blank
    const finalImage = thumbnail || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPgLo0ItmU5U27BSf-eDoZUmH8JNLN_JiaZcEK2MsJYd68PGk7uSmUwB0_-ZCkUiSCPlF7kATcOjuUhXdBFXea4FP19B-oul4QVPqic4QxRq4JTS7dEGgMMjFlMbSEpy1tB1Ez6xobsdWu_PduMPXppwM_c89KfphS4-l4pXKHOEYuMqQGyc00pFYYpVOioCGb4WpAztEHdI1aQQ3y5WzCrHnJaIhC6VAhxXO8BSdGZQAH6_A4bd5LphIWjVohTeRqcmewcBsQWy0'

    addCourse({
      title,
      description,
      instructor,
      category,
      thumbnail: finalImage,
      is_published: isPublished,
      is_free: isFree,
    })

    resetForm()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="dark:bg-[#1c1b1b] light:bg-white border border-[var(--border)] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        <div className="px-6 py-4 flex justify-between items-center border-b border-[var(--border)] flex-shrink-0">
          <h2 className="text-xl font-bold dark:text-white light:text-neutral-900">Tạo khóa học mới</h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-lg text-neutral-400 hover:dark:bg-[#2a2a2a] light:hover:bg-neutral-100 hover:text-neutral-800 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lệnh Left Column */}
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold dark:text-neutral-300 light:text-neutral-700">Tên khóa học <span className="text-red-500">*</span></label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tên khóa học..."
                  className="w-full bg-[var(--input-bg)] border-none rounded-xl py-2.5 px-4 dark:text-white light:text-neutral-900 focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold dark:text-neutral-300 light:text-neutral-700">Giảng viên <span className="text-red-500">*</span></label>
                <input
                  required
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  placeholder="VD: TS. Nguyễn Văn A"
                  className="w-full bg-[var(--input-bg)] border-none rounded-xl py-2.5 px-4 dark:text-white light:text-neutral-900 focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold dark:text-neutral-300 light:text-neutral-700">Thể loại</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CourseCategory)}
                  className="w-full bg-[var(--input-bg)] border-none rounded-xl py-2.5 px-4 dark:text-white light:text-neutral-900 focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none appearance-none"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold dark:text-neutral-300 light:text-neutral-700">Mô tả ngắn <span className="text-red-500">*</span></label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả nội dung trọng tâm của khóa học..."
                  rows={4}
                  className="w-full bg-[var(--input-bg)] border-none rounded-xl py-2.5 px-4 dark:text-white light:text-neutral-900 focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none resize-none"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold dark:text-neutral-300 light:text-neutral-700">Ảnh Thumbnail (URL)</label>
                <div className="flex relative">
                  <input
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="https://example.com/image.png"
                    className="w-full bg-[var(--input-bg)] border-none rounded-xl py-2.5 pl-10 pr-4 dark:text-white light:text-neutral-900 focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none text-sm"
                  />
                  <ImageIcon size={16} className="absolute left-3.5 top-3 text-neutral-500" />
                </div>
                {/* Image Preview Box */}
                <div className="mt-3 w-full h-36 rounded-xl border border-dashed border-[var(--border)] overflow-hidden bg-[var(--input-bg)] flex items-center justify-center">
                  {thumbnail ? (
                    <img src={thumbnail} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  ) : (
                    <div className="text-center text-neutral-500 text-xs">Chưa có ảnh bìa</div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--input-bg)] space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500 bg-neutral-800 border-neutral-700"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold dark:text-white light:text-neutral-900">Xuất bản ngay</span>
                    <span className="text-[11px] text-neutral-500">Hiển thị khóa học công khai trên hệ thống</span>
                  </div>
                </label>
                <div className="w-full h-px dark:bg-white/5 light:bg-black/5" />
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500 bg-neutral-800 border-neutral-700"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold dark:text-white light:text-neutral-900">Khóa học miễn phí</span>
                    <span className="text-[11px] text-neutral-500">Không yêu cầu học viên phải thanh toán</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)] mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-semibold dark:bg-[#2a2a2a] light:bg-neutral-200 dark:text-white light:text-neutral-900 hover:opacity-80 transition-opacity"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 transition-all"
            >
              Lưu khóa học
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
