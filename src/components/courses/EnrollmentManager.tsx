"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Search, UserPlus, Trash2, Loader2, Users, CheckCircle2, X } from 'lucide-react'
import { getCourseEnrollees, searchLearners, enrollStudent, unenrollStudent, Enrollment } from '@/lib/enrollment-service'
import { toast } from 'sonner'

interface EnrollmentManagerProps {
  courseId: string
  courseTitle: string
  onClose: () => void
}

export const EnrollmentManager: React.FC<EnrollmentManagerProps> = ({ courseId, courseTitle, onClose }) => {
  const [enrollees, setEnrollees] = useState<Enrollment[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loadingEnrollees, setLoadingEnrollees] = useState(true)
  const [searching, setSearching] = useState(false)
  const [enrolling, setEnrolling] = useState<string | null>(null)
  const [removing, setRemoving] = useState<string | null>(null)

  const fetchEnrollees = useCallback(async () => {
    setLoadingEnrollees(true)
    const data = await getCourseEnrollees(courseId)
    setEnrollees(data)
    setLoadingEnrollees(false)
  }, [courseId])

  useEffect(() => { fetchEnrollees() }, [fetchEnrollees])

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return }
    const timer = setTimeout(async () => {
      setSearching(true)
      const results = await searchLearners(searchQuery)
      setSearchResults(results)
      setSearching(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleEnroll = async (userId: string, userName: string) => {
    setEnrolling(userId)
    try {
      await enrollStudent(userId, courseId)
      toast.success(`Đã cấp quyền cho ${userName}`)
      setSearchQuery('')
      setSearchResults([])
      await fetchEnrollees()
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi cấp quyền')
    } finally {
      setEnrolling(null)
    }
  }

  const handleUnenroll = async (enrollmentId: string, userName: string) => {
    setRemoving(enrollmentId)
    try {
      await unenrollStudent(enrollmentId)
      toast.success(`Đã thu hồi quyền của ${userName}`)
      await fetchEnrollees()
    } catch {
      toast.error('Lỗi khi thu hồi quyền')
    } finally {
      setRemoving(null)
    }
  }

  const enrolledIds = new Set(enrollees.map(e => e.user_id))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="dark:bg-[#1c1b1b] bg-white border border-[var(--border)] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-start border-b border-[var(--border)] flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users size={18} className="text-[#1B4D2E] dark:text-[#9ed3aa]" />
              <h2 className="text-lg font-bold dark:text-white">Quản lý học viên</h2>
            </div>
            <p className="text-xs text-neutral-500 truncate max-w-sm">"{courseTitle}"</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-neutral-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Search & Grant Access */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">Cấp quyền truy cập</h3>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-neutral-500" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm học viên theo tên hoặc email..."
                className="w-full pl-9 pr-4 py-2.5 bg-[var(--input-bg)] border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D2E]/50 dark:text-white"
              />
              {searching && <Loader2 size={16} className="absolute right-3 top-3 text-neutral-500 animate-spin" />}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 bg-[var(--input-bg)] border border-[var(--border)] rounded-xl overflow-hidden divide-y divide-[var(--border)]">
                {searchResults.map(user => {
                  const isEnrolled = enrolledIds.has(user.id)
                  return (
                    <div key={user.id} className="flex items-center justify-between px-4 py-3 hover:bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1B4D2E] flex items-center justify-center text-white text-xs font-bold">
                          {user.full_name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold dark:text-white">{user.full_name}</p>
                          <p className="text-xs text-neutral-500">{user.email}</p>
                        </div>
                      </div>
                      {isEnrolled ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-500 font-bold">
                          <CheckCircle2 size={14} /> Đã cấp
                        </span>
                      ) : (
                        <button
                          onClick={() => handleEnroll(user.id, user.full_name)}
                          disabled={enrolling === user.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B4D2E] hover:bg-[#205e38] text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                        >
                          {enrolling === user.id ? <Loader2 size={12} className="animate-spin" /> : <UserPlus size={12} />}
                          Cấp quyền
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Enrolled Students List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                Học viên đã được cấp quyền
              </h3>
              <span className="text-xs font-bold bg-[#1B4D2E]/20 text-[#9ed3aa] px-2 py-0.5 rounded-full">
                {enrollees.length} học viên
              </span>
            </div>

            {loadingEnrollees ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#1B4D2E]" />
              </div>
            ) : enrollees.length === 0 ? (
              <div className="text-center py-10 text-neutral-500">
                <Users size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Chưa có học viên nào được cấp quyền</p>
                <p className="text-xs mt-1">Tìm kiếm bên trên để thêm học viên</p>
              </div>
            ) : (
              <div className="space-y-2">
                {enrollees.map(enrollment => {
                  const user = enrollment.user as any
                  return (
                    <div key={enrollment.id} className="flex items-center justify-between p-3 bg-[var(--input-bg)] rounded-xl border border-[var(--border)] group">
                      <div className="flex items-center gap-3">
                        {user?.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#1B4D2E] flex items-center justify-center text-white text-xs font-bold">
                            {user?.full_name?.charAt(0) || '?'}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold dark:text-white">{user?.full_name}</p>
                          <p className="text-xs text-neutral-500">{user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs font-bold text-[#9ed3aa]">{enrollment.progress_percentage}%</p>
                          <p className="text-[10px] text-neutral-500">
                            {new Date(enrollment.enrolled_at).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <button
                          onClick={() => handleUnenroll(enrollment.id, user?.full_name)}
                          disabled={removing === enrollment.id}
                          className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                        >
                          {removing === enrollment.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
