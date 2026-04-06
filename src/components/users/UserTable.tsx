"use client"

import React, { useState } from 'react'
import { MoreVertical, ChevronLeft, ChevronRight, Search, Pencil, Key, Trash2, Loader2 } from 'lucide-react'
import { useUsers, FilterType } from '@/components/users/UserProvider'
import type { User } from '@/lib/user-service'
import { UserFormModal } from './modals/UserFormModal'
import { ConfirmDeleteModal } from './modals/ConfirmDeleteModal'
import { ConfirmStatusModal } from './modals/ConfirmStatusModal'

// Predefined tabs
const FILTERS: FilterType[] = ['Tất cả', 'Học viên', 'Giảng viên', 'Admin', 'Hoạt động', 'Ngừng hoạt động']

const roleBadge: Record<string, string> = {
  'learner': 'bg-emerald-900/30 text-emerald-400',
  'instructor': 'bg-amber-900/20 text-amber-400',
  'admin': 'bg-neutral-700 text-neutral-200',
}

const roleLabel: Record<string, string> = {
  'learner': 'Học viên',
  'instructor': 'Giảng viên',
  'admin': 'Admin',
}

export const UserTable: React.FC = () => {
  const {
    loading,
    searchQuery, setSearchQuery,
    activeFilter, setActiveFilter,
    activePage, setActivePage,
    paginatedUsers,
    filteredUsers,
    totalPages,
    updateUser,
  } = useUsers()

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  
  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState<User | null>(null)
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [userForStatus, setUserForStatus] = useState<User | null>(null)

  const handleEdit = (user: User) => {
    setUserToEdit(user)
    setIsEditModalOpen(true)
    setOpenDropdownId(null)
  }

  const handleDeleteParams = (user: User) => {
    setUserToDelete(user)
    setIsDeleteModalOpen(true)
    setOpenDropdownId(null)
  }

  const executeDelete = () => {
    // Logic delete sẽ được cập nhật sau trong UserProvider
    setIsDeleteModalOpen(false)
    setUserToDelete(null)
  }

  const handleStatusChange = (user: User) => {
    setUserForStatus(user)
    setIsStatusModalOpen(true)
  }

  const confirmStatusChange = async () => {
    if (userForStatus) {
      const nextStatus = userForStatus.status === 'Hoạt động' ? 'Ngừng hoạt động' : 'Hoạt động'
      await updateUser(userForStatus.id, { status: nextStatus })
      setIsStatusModalOpen(false)
      setUserForStatus(null)
    }
  }

  return (
    <div className="dark:bg-[#1c1b1b] light:bg-white rounded-xl overflow-hidden shadow-2xl">
      {/* Filter Bar */}
      <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-1 dark:bg-[#0e0e0e] light:bg-neutral-100 p-1 rounded-lg flex-wrap">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 text-sm rounded-md transition-all duration-150 ${
                activeFilter === filter
                  ? 'bg-[#1B4D2E] dark:text-white light:text-neutral-900 font-semibold shadow-sm'
                  : 'dark:text-neutral-400 light:text-neutral-500 hover:dark:text-white light:hover:text-neutral-900 font-medium'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        
        {/* Search Input */}
        <div className="relative flex-shrink-0 w-full lg:w-72">
          <input
            type="text"
            placeholder="Tìm theo tên, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--input-bg)] border-none rounded-xl py-2 pl-10 pr-4 text-sm dark:text-white light:text-neutral-900 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[300px] relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5 z-10">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : paginatedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-neutral-500">
            <Search size={40} className="mb-3 opacity-20" />
            <p className="text-lg font-medium">Không tìm thấy người dùng nào</p>
            <p className="text-sm mt-1">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="dark:bg-[#2a2a2a] light:bg-neutral-100/30">
                {['Họ và tên', 'Email', 'Vai trò', 'Khóa học', 'Ngày tham gia', 'Trạng thái', ''].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:dark:bg-[#2a2a2a] light:hover:bg-neutral-100/40 transition-colors group relative"
                >
                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.fullName}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full dark:bg-[#0e0e0e] light:bg-[--border] flex items-center justify-center font-bold text-neutral-500">
                          {user.fullName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold dark:text-white light:text-neutral-900">{user.fullName}</p>
                        <p className="text-xs text-neutral-500">ID: {user.id.substring(0, 8)}...</p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-sm dark:text-neutral-400 light:text-neutral-500">{user.email}</td>

                  {/* Role Badge */}
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${roleBadge[user.role]}`}>
                      {roleLabel[user.role] || user.role}
                    </span>
                  </td>

                  {/* Courses */}
                  <td className="px-6 py-4 text-sm dark:text-white light:text-neutral-900">
                    {user.coursesCount > 0 ? `${user.coursesCount} khóa học` : '-'}
                  </td>

                  {/* Join Date */}
                  <td className="px-6 py-4 text-sm dark:text-neutral-400 light:text-neutral-500">{user.joinDate}</td>

                  {/* Status Toggle */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleStatusChange(user)}
                      className="group/status relative flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800/50 transition-all cursor-pointer"
                    >
                      {user.status === 'Hoạt động' ? (
                        <>
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] group-hover/status:scale-110 transition-transform" />
                          <span className="text-xs font-medium text-emerald-400">Hoạt động</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 rounded-full bg-neutral-600 group-hover/status:scale-110 transition-transform" />
                          <span className="text-xs font-medium text-neutral-500">Ngừng hoạt động</span>
                        </>
                      )}
                      {/* Hover Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-800 text-[9px] text-white rounded opacity-0 group-hover/status:opacity-100 whitespace-nowrap pointer-events-none transition-opacity font-bold uppercase tracking-widest border border-white/5">
                        Click để đổi trạng thái
                      </div>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="relative">
                      <button 
                        onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
                        className={`p-2 text-neutral-500 transition-colors ${openDropdownId === user.id ? 'dark:text-white light:text-neutral-900 bg-[var(--input-bg)] rounded-lg' : 'opacity-0 group-hover:opacity-100 hover:dark:text-white light:hover:text-neutral-900'} `}
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openDropdownId === user.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenDropdownId(null)} />
                          <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
                            <button onClick={() => handleEdit(user)} className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 dark:text-neutral-200 light:text-neutral-700 hover:bg-[var(--input-bg)] transition-colors">
                              <Pencil size={15} /> Chỉnh sửa
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 dark:text-neutral-200 light:text-neutral-700 hover:bg-[var(--input-bg)] transition-colors">
                              <Key size={15} /> Reset mật khẩu
                            </button>
                            <button onClick={() => handleDeleteParams(user)} className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-red-500 hover:bg-red-500/10 transition-colors mt-1 border-t border-[var(--border)]">
                              <Trash2 size={15} /> Xóa người dùng
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="p-6 flex items-center justify-between border-t border-[var(--border)]">
        <p className="text-xs text-neutral-500">
          Hiển thị {(activePage - 1) * 8 + (paginatedUsers.length > 0 ? 1 : 0)} - {Math.min(activePage * 8, filteredUsers.length)} trên {filteredUsers.length} người dùng
        </p>
        <div className="flex items-center gap-1">
          <button 
            disabled={activePage === 1}
            onClick={() => setActivePage(activePage - 1)}
            className="p-2 rounded-lg text-neutral-600 disabled:opacity-30 enabled:hover:bg-[var(--input-bg)] transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="flex items-center gap-1 px-2">
            <span className="text-xs font-bold dark:text-white light:text-neutral-900">{activePage}</span>
            <span className="text-xs text-neutral-500">/ {totalPages}</span>
          </div>

          <button 
            disabled={activePage >= totalPages}
            onClick={() => setActivePage(activePage + 1)}
            className="p-2 rounded-lg text-neutral-600 disabled:opacity-30 enabled:hover:bg-[var(--input-bg)] transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <UserFormModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        userToEdit={userToEdit} 
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        user={userToDelete}
      />

      <ConfirmStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={confirmStatusChange}
        user={userForStatus}
      />
    </div>
  )
}
