"use client"

import React, { useState, useRef, useEffect } from 'react'
import { X, Image as ImageIcon, Play, Upload, File, FileText, Trash2, Loader2, Link as LinkIcon, Paperclip, PlusCircle, Video } from 'lucide-react'
import { useCourses, CourseCategory } from '@/components/courses/CourseProvider'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

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

  // New Fields
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [youtubeThumbnail, setYoutubeThumbnail] = useState('')
  const [attachments, setAttachments] = useState<Array<{ name: string, url: string, type: string, size: number }>>([])
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, number>>({}) // file id -> progress (%)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // YouTube Thumbnail Logic
  useEffect(() => {
    const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)
    if (videoIdMatch && videoIdMatch[1]) {
      setYoutubeThumbnail(`https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`)
    } else {
      setYoutubeThumbnail('')
    }
  }, [youtubeUrl])

  if (!isOpen) return null

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setInstructor('')
    setCategory('Quản trị nhân sự')
    setThumbnail('')
    setIsPublished(true)
    setIsFree(false)
    setYoutubeUrl('')
    setAttachments([])
    setUploadingFiles({})
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let files: FileList | null = null
    if ('files' in e) {
      files = (e as React.ChangeEvent<HTMLInputElement>).target.files
    } else {
      e.preventDefault()
      files = (e as React.DragEvent).dataTransfer.files
    }

    if (!files || files.length === 0) return

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileId = Math.random().toString(36).substring(7)
        
        try {
            setUploadingFiles(prev => ({ ...prev, [fileId]: 10 }))
            
            // Upload to Supabase Storage
            const fileName = `${Date.now()}_${file.name}`
            const filePath = `course-attachments/${fileName}`

            setUploadingFiles(prev => ({ ...prev, [fileId]: 30 }))

            const { data, error } = await supabase.storage
                .from('course-attachments')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (error) throw error

            setUploadingFiles(prev => ({ ...prev, [fileId]: 90 }))

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('course-attachments')
                .getPublicUrl(filePath)

            setAttachments(prev => [...prev, {
                name: file.name,
                url: publicUrl,
                type: file.type,
                size: file.size
            }])

            setUploadingFiles(prev => {
                const copy = { ...prev }
                delete copy[fileId]
                return copy
            })
        } catch (error: any) {
            console.error('Upload error:', error)
            toast.error(`Lỗi khi tải tệp ${file.name}: ` + error.message)
            setUploadingFiles(prev => {
                const copy = { ...prev }
                delete copy[fileId]
                return copy
            })
        }
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="text-red-400" />
    if (type.includes('image')) return <ImageIcon className="text-blue-400" />
    if (type.includes('video')) return <Play className="text-emerald-400" />
    if (type.includes('zip') || type.includes('compressed')) return <Paperclip className="text-amber-400" />
    return <File className="text-neutral-400" />
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description || !instructor) return
    setIsSubmitting(true)
    
    try {
        const finalImage = thumbnail || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPgLo0ItmU5U27BSf-eDoZUmH8JNLN_JiaZcEK2MsJYd68PGk7uSmUwB0_-ZCkUiSCPlF7kATcOjuUhXdBFXea4FP19B-oul4QVPqic4QxRq4JTS7dEGgMMjFlMbSEpy1tB1Ez6xobsdWu_PduMPXppwM_c89KfphS4-l4pXKHOEYuMqQGyc00pFYYpVOioCGb4WpAztEHdI1aQQ3y5WzCrHnJaIhC6VAhxXO8BSdGZQAH6_A4bd5LphIWjVohTeRqcmewcBsQWy0'

        await addCourse({
          title,
          description,
          instructor,
          category,
          thumbnail: finalImage,
          is_published: isPublished,
          is_free: isFree,
          youtube_url: youtubeUrl,
          attachments: attachments,
        })

        resetForm()
        onClose()
    } catch (err) {
        console.error(err)
    } finally {
        setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="dark:bg-[#1c1b1b] light:bg-white border border-[var(--border)] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        <div className="px-6 py-4 flex justify-between items-center border-b border-[var(--border)] flex-shrink-0">
          <h2 className="text-xl font-bold dark:text-white light:text-neutral-900 flex items-center gap-2">
            <PlusCircle size={20} className="text-emerald-500" />
            Tạo khóa học mới
          </h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-lg text-neutral-400 hover:dark:bg-[#2a2a2a] light:hover:bg-neutral-100 hover:text-neutral-800 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Basic Info */}
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
                <div className="relative">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as CourseCategory)}
                        className="w-full bg-[var(--input-bg)] border-none rounded-xl py-2.5 px-4 dark:text-white light:text-neutral-900 focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none appearance-none"
                    >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
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

            {/* Right Column: Visuals & Settings */}
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
                <div className="mt-3 w-full h-40 rounded-xl border border-dashed border-[var(--border)] overflow-hidden bg-[var(--input-bg)] flex items-center justify-center group relative">
                  {thumbnail ? (
                    <img src={thumbnail} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  ) : (
                    <div className="text-center text-neutral-500 text-xs flex flex-col items-center gap-2">
                        <Play size={24} className="opacity-30" />
                        <span>Chưa có ảnh bìa</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--input-bg)] space-y-4 border border-[var(--border)]">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500 bg-neutral-800 border-neutral-700"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold dark:text-white light:text-neutral-900 group-hover:text-emerald-400 transition-colors">Xuất bản ngay</span>
                    <span className="text-[11px] text-neutral-500">Hiển thị khóa học công khai</span>
                  </div>
                </label>
                <div className="w-full h-px dark:bg-white/5 light:bg-black/5" />
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500 bg-neutral-800 border-neutral-700"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold dark:text-white light:text-neutral-900 group-hover:text-emerald-400 transition-colors">Khóa học miễn phí</span>
                    <span className="text-[11px] text-neutral-500">Không yêu cầu học viên thanh toán</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* YouTube & Attachments Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[var(--border)] pt-8">
                {/* YouTube */}
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold dark:text-neutral-300 light:text-neutral-700 flex items-center gap-2">
                            <Video size={16} className="text-red-500" />
                            Link YouTube giới thiệu
                        </label>
                        <div className="flex relative">
                            <input
                                value={youtubeUrl}
                                onChange={(e) => setYoutubeUrl(e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="w-full bg-[var(--input-bg)] border-none rounded-xl py-2.5 pl-10 pr-4 dark:text-white light:text-neutral-900 focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none text-sm"
                            />
                            <LinkIcon size={16} className="absolute left-3.5 top-3 text-neutral-500" />
                        </div>
                    </div>
                    <div className="w-full h-44 rounded-xl border border-dashed border-[var(--border)] overflow-hidden bg-[var(--input-bg)] flex items-center justify-center relative group shadow-inner">
                        {youtubeThumbnail ? (
                            <>
                                <img src={youtubeThumbnail} alt="Youtube Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/40">
                                        <Play size={24} className="text-white fill-current" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-neutral-500 text-xs flex flex-col items-center gap-2 opacity-50">
                                <Video size={32} />
                                <span className="uppercase tracking-widest font-bold">Preview Video</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Attachments */}
                <div className="space-y-4 text-emerald-500">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold dark:text-neutral-300 light:text-neutral-700 flex items-center gap-2">
                             <Paperclip size={16} className="text-emerald-500" />
                             Tài liệu đính kèm
                        </label>
                        <div 
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleFileUpload}
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-44 rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--input-bg)] hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col items-center justify-center group shadow-inner relative"
                        >
                            <input 
                                type="file" 
                                multiple 
                                className="hidden" 
                                ref={fileInputRef} 
                                onChange={handleFileUpload}
                            />
                            <div className="flex flex-col items-center gap-3 transition-transform group-hover:scale-110">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                                    <Upload size={24} className="text-neutral-400 group-hover:text-emerald-500" />
                                </div>
                                <div className="text-center">
                                    <p className="text-[11px] font-bold text-neutral-500 group-hover:text-emerald-500 uppercase tracking-widest leading-none">Kéo thả tệp vào đây</p>
                                    <p className="text-[10px] text-neutral-600 mt-2">PDF, DOCX, ZIP, MP4...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
          </div>

          {/* Attachment list & progress */}
          {(attachments.length > 0 || Object.keys(uploadingFiles).length > 0) && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Tài liệu đã chọn ({attachments.length})</h3>
                    {Object.keys(uploadingFiles).length > 0 && <span className="text-[10px] font-bold text-emerald-500 animate-pulse">ĐANG TẢI LÊN...</span>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {attachments.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-[var(--input-bg)] border border-[var(--border)] group hover:border-emerald-500/30 transition-all relative overflow-hidden">
                              <div className="p-2.5 rounded-lg bg-neutral-900 border border-[var(--border)] flex-shrink-0 group-hover:scale-110 transition-transform">
                                  {getFileIcon(file.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold dark:text-white light:text-neutral-900 truncate pr-6" title={file.name}>{file.name}</p>
                                  <p className="text-[10px] text-neutral-500 font-medium mt-0.5">{formatSize(file.size)}</p>
                              </div>
                              <button 
                                  type="button"
                                  onClick={() => removeAttachment(idx)}
                                  className="absolute right-3 p-1.5 rounded-lg text-neutral-500 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                              >
                                  <Trash2 size={14} />
                              </button>
                          </div>
                      ))}
                      {/* Uploading placeholders */}
                      {Object.entries(uploadingFiles).map(([id, progress]) => (
                          <div key={id} className="flex items-center gap-3 p-4 rounded-xl bg-[var(--input-bg)] border border-emerald-500/20 relative overflow-hidden">
                              <div className="p-2.5 rounded-lg bg-neutral-900 flex-shrink-0">
                                  <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                              </div>
                              <div className="flex-1">
                                  <div className="flex justify-between items-center mb-2">
                                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Uploading...</p>
                                      <span className="text-[10px] font-bold text-emerald-500">{progress}%</span>
                                  </div>
                                  <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                                      <div className="h-full bg-emerald-500 transition-all duration-300 shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: `${progress}%` }} />
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border)] sticky bottom-0 bg-[var(--input-bg/80)] backdrop-blur-md z-10 -mx-6 px-6 -mb-6 pb-6">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-semibold dark:bg-[#2a2a2a] light:bg-neutral-200 dark:text-white light:text-neutral-900 hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || Object.keys(uploadingFiles).length > 0}
              className="px-8 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
            >
              {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Đang lưu khóa học...
                  </>
                ) : 'Tạo khóa học'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
