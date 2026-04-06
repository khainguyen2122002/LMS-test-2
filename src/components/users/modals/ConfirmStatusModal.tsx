import React from 'react'
import { X, AlertCircle } from 'lucide-react'
import type { User } from '@/lib/user-service'

interface ConfirmStatusModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  user: User | null
}

export const ConfirmStatusModal: React.FC<ConfirmStatusModalProps> = ({ isOpen, onClose, onConfirm, user }) => {
  if (!isOpen || !user) return null

  const isActivating = user.status === 'Ngừng hoạt động'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="dark:bg-[#1c1b1b] light:bg-white border border-[var(--border)] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 text-center space-y-4">
          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${isActivating ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
            <AlertCircle size={24} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-bold dark:text-white light:text-neutral-900">
              Xác nhận thay đổi
            </h3>
            <p className="text-sm dark:text-neutral-400 light:text-neutral-500">
              Bạn có chắc chắn muốn {isActivating ? 'kích hoạt' : 'ngừng hoạt động'} tài khoản của <span className="font-bold text-[var(--foreground)]">{user.fullName}</span> không?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-semibold dark:bg-[#2a2a2a] light:bg-neutral-100 dark:text-white light:text-neutral-900 hover:opacity-80 transition-opacity text-sm"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all text-sm ${isActivating ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20' : 'bg-red-600 hover:bg-red-500 shadow-red-900/20'}`}
            >
              Xác nhận
            </button>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-neutral-500 hover:dark:bg-[#2a2a2a] light:hover:bg-neutral-100 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
