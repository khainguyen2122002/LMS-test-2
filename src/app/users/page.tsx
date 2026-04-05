"use client"
export const dynamic = 'force-dynamic'

import React, { useState } from 'react'
import { Upload, UserPlus } from 'lucide-react'
import { UserStatsGrid } from '@/components/users/UserStatsGrid'
import { UserTable } from '@/components/users/UserTable'
import { UserProvider } from '@/components/users/UserProvider'
import { UserFormModal } from '@/components/users/modals/UserFormModal'
import { ExcelImportModal } from '@/components/users/modals/ExcelImportModal'

export default function UsersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false)

  return (
    <UserProvider>
      <div className="py-8 space-y-8 animate-in fade-in duration-500">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold tracking-tight dark:text-white light:text-neutral-900">
              Quản lý người dùng
            </h2>
            <p className="dark:text-neutral-400 light:text-neutral-500">
              Quản lý toàn bộ học viên, giảng viên và admin của nền tảng
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button 
              onClick={() => setIsExcelModalOpen(true)}
              className="px-5 py-2.5 rounded-lg border border-[var(--border)] dark:text-white light:text-neutral-900 text-sm font-medium hover:dark:bg-[#2a2a2a] light:hover:bg-neutral-100 transition-all flex items-center gap-2"
            >
              <Upload size={18} />
              Nhập từ Excel
            </button>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-br from-amber-400 to-[#F9A825] text-black text-sm font-bold shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
            >
              <UserPlus size={18} />
              Thêm người dùng mới
            </button>
          </div>
        </div>

        {/* Stats Bento Grid */}
        <UserStatsGrid />

        {/* Filter & Table */}
        <UserTable />
        
        {/* Top-level Modals via Context actions */}
        <UserFormModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        <ExcelImportModal isOpen={isExcelModalOpen} onClose={() => setIsExcelModalOpen(false)} />
      </div>
    </UserProvider>
  )
}
