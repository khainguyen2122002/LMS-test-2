"use client"

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useUsers } from '@/components/users/UserProvider'
import type { User, UserRole, UserStatus } from '@/lib/user-service'

interface UserFormModalProps {
  isOpen: boolean
  onClose: () => void
  userToEdit?: User | null
}

export const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, userToEdit }) => {
  const { addUser, updateUser } = useUsers()
  
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>('learner')
  const [status, setStatus] = useState<UserStatus>('Hoạt động')

  useEffect(() => {
    if (userToEdit) {
      setFullName(userToEdit.fullName)
      setEmail(userToEdit.email)
      setRole(userToEdit.role)
      setStatus(userToEdit.status)
    } else {
      setFullName('')
      setEmail('')
      setRole('learner')
      setStatus('Hoạt động')
    }
  }, [userToEdit, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !email) return

    if (userToEdit) {
      updateUser(userToEdit.id, { fullName, email, role, status })
    } else {
      addUser({ fullName, email, role, status })
    }
    
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="dark:bg-[#1c1b1b] light:bg-white border border-[var(--border)] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 flex justify-between items-center border-b border-[var(--border)]">
          <h2 className="text-lg font-bold dark:text-white light:text-neutral-900">
            {userToEdit ? 'Chỉnh sửa thông tin' : 'Thêm người dùng mới'}
          </h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-lg text-neutral-400 hover:dark:bg-[#2a2a2a] light:hover:bg-neutral-100 hover:text-neutral-800 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold dark:text-neutral-300 light:text-neutral-700">Họ và tên <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[var(--input-bg)] border-none rounded-xl py-2.5 px-4 dark:text-white light:text-neutral-900 focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none"
              placeholder="VD: Nguyễn Văn A"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold dark:text-neutral-300 light:text-neutral-700">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--input-bg)] border-none rounded-xl py-2.5 px-4 dark:text-white light:text-neutral-900 focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none"
              placeholder="VD: email@company.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold dark:text-neutral-300 light:text-neutral-700">Vai trò</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-[var(--input-bg)] border-none rounded-xl py-2.5 px-4 dark:text-white light:text-neutral-900 focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none appearance-none"
              >
                <option value="learner">Học viên</option>
                <option value="instructor">Giảng viên</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold dark:text-neutral-300 light:text-neutral-700">Trạng thái</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as UserStatus)}
                className="w-full bg-[var(--input-bg)] border-none rounded-xl py-2.5 px-4 dark:text-white light:text-neutral-900 focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none appearance-none"
              >
                <option value="Hoạt động">Hoạt động</option>
                <option value="Ngừng hoạt động">Ngừng hoạt động</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
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
              {userToEdit ? 'Lưu thay đổi' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
