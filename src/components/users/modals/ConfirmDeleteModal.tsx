"use client"

import React from 'react'
import { AlertTriangle, X } from 'lucide-react'
import type { User } from '@/lib/user-service'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  user: User | null
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, user }) => {
  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="dark:bg-[#1c1b1b] light:bg-white border border-[var(--border)] rounded-2xl w-full max-w-md shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10 mb-4">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        
        <h2 className="text-xl font-bold dark:text-white light:text-neutral-900 mb-2">Xác nhận xóa</h2>
        <p className="text-sm dark:text-neutral-400 light:text-neutral-500 mb-6">
          Bạn có chắc chắn muốn xóa người dùng <strong className="dark:text-white light:text-neutral-900">{user.fullName}</strong> này không? Dữ liệu này có thể được hoàn tác trong thời gian ngắn sau khi xóa.
        </p>

        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-xl font-semibold dark:bg-[#2a2a2a] light:bg-neutral-200 dark:text-white light:text-neutral-900 hover:opacity-80 transition-opacity"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            className="w-full px-4 py-2.5 rounded-xl font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20 transition-all"
          >
            Đồng ý Xóa
          </button>
        </div>
      </div>
    </div>
  )
}
