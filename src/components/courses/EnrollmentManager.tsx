"use client"

import React, { useState, useMemo } from 'react'
import { Search, UserPlus, Trash2, Loader2, Users, CheckCircle2, X } from 'lucide-react'
import { 
  getCourseEnrollees, 
  searchLearners, 
  enrollStudent, 
  unenrollStudent, 
  Enrollment 
} from '@/lib/enrollment-service'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface EnrollmentManagerProps {
  courseId: string
  courseTitle: string
  onClose: () => void
}

export const EnrollmentManager: React.FC<EnrollmentManagerProps> = ({ courseId, courseTitle, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()

  // 1. Fetch Enrolled Students
  const { 
    data: enrollees = [], 
    isLoading: loadingEnrollees 
  } = useQuery({
    queryKey: ['enrollees', courseId],
    queryFn: () => getCourseEnrollees(courseId),
    staleTime: 1000 * 30, // 30 seconds
  })

  // 2. Search Students (Real-time with Query)
  const { 
    data: searchResults = [], 
    isFetching: searching,
    isError: searchError
  } = useQuery({
    queryKey: ['searchLearners', searchQuery],
    queryFn: () => searchLearners(searchQuery),
    enabled: searchQuery.trim().length > 1,
    staleTime: 1000 * 60, // 1 minute cache for search results
  })

  // 3. Enroll Mutation
  const enrollMutation = useMutation({
    mutationFn: ({ userId }: { userId: string; userName: string }) => 
      enrollStudent(userId, courseId),
    onSuccess: (_, variables) => {
      toast.success(`Đã cấp quyền cho ${variables.userName}`)
      queryClient.invalidateQueries({ queryKey: ['enrollees', courseId] })
      setSearchQuery('')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Lỗi khi cấp quyền')
    }
  })

  // 4. Unenroll Mutation
  const unenrollMutation = useMutation({
    mutationFn: ({ enrollmentId }: { enrollmentId: string; userName: string | undefined }) => 
      unenrollStudent(enrollmentId),
    onSuccess: (_, variables) => {
      toast.success(`Đã thu hồi quyền của ${variables.userName || 'học viên'}`)
      queryClient.invalidateQueries({ queryKey: ['enrollees', courseId] })
    },
    onError: () => {
      toast.error('Lỗi khi thu hồi quyền')
    }
  })

  const enrolledIds = useMemo(() => new Set(enrollees.map(e => e.user_id)), [enrollees])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="dark:bg-[#1c1b1b] bg-white border border-[var(--border)] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-start border-b border-[var(--border)] flex-shrink-0 bg-white dark:bg-[#1c1b1b]">
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

        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          {/* Search & Grant Access */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">Cấp quyền truy cập</h3>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-neutral-500" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm học viên theo tên hoặc email..."
                className="w-full pl-9 pr-4 py-2.5 bg-[var(--input-bg)] border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D2E]/50 dark:text-white transition-all"
              />
              {searching && <Loader2 size={16} className="absolute right-3 top-3 text-neutral-500 animate-spin" />}
            </div>

            {/* Search Results with Skeleton */}
            {searchQuery.trim().length > 1 && (
              <div className="bg-[var(--input-bg)] border border-[var(--border)] rounded-xl overflow-hidden divide-y divide-[var(--border)]">
                {searching ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                        <div className="space-y-1">
                          <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-800 rounded" />
                          <div className="h-2 w-32 bg-neutral-200 dark:bg-neutral-800 rounded" />
                        </div>
                      </div>
                      <div className="h-8 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
                    </div>
                  ))
                ) : searchResults.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-neutral-500">
                    Không tìm thấy học viên nào với "{searchQuery}"
                  </div>
                ) : (
                  searchResults.map(user => {
                    const isEnrolled = enrolledIds.has(user.id)
                    const isEnrolling = enrollMutation.isPending && enrollMutation.variables?.userId === user.id
                    
                    return (
                      <div key={user.id} className="flex items-center justify-between px-4 py-3 hover:bg-[#1B4D2E]/5 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#1B4D2E] flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/10">
                            {user.full_name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold dark:text-white group-hover:text-[#1B4D2E] dark:group-hover:text-[#9ed3aa] transition-colors">{user.full_name}</p>
                            <p className="text-xs text-neutral-500">{user.email}</p>
                          </div>
                        </div>
                        {isEnrolled ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded-full">
                            <CheckCircle2 size={14} /> Đã cấp
                          </span>
                        ) : (
                          <button
                            onClick={() => enrollMutation.mutate({ userId: user.id, userName: user.full_name })}
                            disabled={isEnrolling}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B4D2E] hover:bg-[#205e38] text-white text-xs font-bold rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                          >
                            {isEnrolling ? <Loader2 size={12} className="animate-spin" /> : <UserPlus size={12} />}
                            Cấp quyền
                          </button>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </section>

          {/* Enrolled Students List */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                Học viên đã được cấp quyền
              </h3>
              <span className="text-[10px] font-bold bg-[#1B4D2E]/20 text-[#1B4D2E] dark:text-[#9ed3aa] px-2.5 py-1 rounded-full border border-[#1B4D2E]/20">
                {enrollees.length} học viên
              </span>
            </div>

            {loadingEnrollees ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 w-full bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : enrollees.length === 0 ? (
              <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900/40 rounded-2xl border border-dashed border-[var(--border)]">
                <Users size={40} className="mx-auto mb-3 text-neutral-300 dark:text-neutral-700" />
                <p className="text-sm font-medium text-neutral-500">Chưa có học viên nào</p>
                <p className="text-xs text-neutral-400 mt-1">Tìm kiếm học viên để bắt đầu đào tạo</p>
              </div>
            ) : (
              <div className="space-y-2">
                {enrollees.map(enrollment => {
                  const user = enrollment.user as any
                  const isRemoving = unenrollMutation.isPending && unenrollMutation.variables?.enrollmentId === enrollment.id

                  return (
                    <div key={enrollment.id} className="flex items-center justify-between p-3 bg-white dark:bg-[#1C1B1B] rounded-xl border border-[var(--border)] group hover:border-[#1B4D2E]/30 transition-all shadow-sm">
                      <div className="flex items-center gap-3">
                        {user?.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-white/5" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B4D2E] to-[#205e38] flex items-center justify-center text-white text-sm font-bold shadow-inner">
                            {user?.full_name?.charAt(0) || '?'}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold dark:text-white">{user?.full_name}</p>
                          <p className="text-[11px] text-neutral-500">{user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs font-bold text-[#1B4D2E] dark:text-[#9ed3aa]">{enrollment.progress_percentage}%</p>
                          <p className="text-[10px] text-neutral-500 font-medium">
                            {new Date(enrollment.enrolled_at).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <button
                          onClick={() => unenrollMutation.mutate({ enrollmentId: enrollment.id, userName: user?.full_name })}
                          disabled={isRemoving}
                          className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                          title="Thu hồi quyền truy cập"
                        >
                          {isRemoving ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
