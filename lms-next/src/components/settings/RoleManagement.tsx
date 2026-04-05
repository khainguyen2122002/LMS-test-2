"use client"

import React, { useState, useEffect } from 'react'
import { ShieldAlert, Edit2, Check, X, ShieldCheck } from 'lucide-react'
import { useSettings } from '@/components/settings/SettingsProvider'

/**
 * Interface Role as requested by USER
 */
interface Role {
  id: string
  key?: string // original key like 'admin', 'teacher'
  name: string
  description: string
  permissions?: string[]
}

const initialRoles: Role[] = [
  { 
    id: 'r1', 
    key: 'admin', 
    name: 'Admin (Quản trị viên)', 
    description: 'Xem tất cả, tạo/sửa/xóa khóa học, quản lý người dùng, xem báo cáo toàn hệ thống.',
    permissions: ['all']
  },
  { 
    id: 'r2', 
    key: 'teacher', 
    name: 'Giảng viên', 
    description: 'Tạo bài học, upload video, xem dữ liệu báo cáo của học viên trực thuộc.',
    permissions: ['create_course', 'view_students']
  },
  { 
    id: 'r3', 
    key: 'student', 
    name: 'Học viên', 
    description: 'Xem và tương tác khóa học đã đăng ký, nhận thông báo hệ thống, làm bài test.',
    permissions: ['view_courses', 'receive_notifications']
  }
]

export const RoleManagement: React.FC = () => {
  const { draftConfig, updateDraft } = useSettings()
  
  // Local state for roles as requested by USER
  // Initialized with default or from context if exists
  const [roles, setRoles] = useState<Role[]>(draftConfig?.roles || initialRoles)
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editVal, setEditVal] = useState('')

  // Sync back to global draft when local roles change
  useEffect(() => {
    if (roles) {
      updateDraft('roles', roles as any) // Typecast for compatibility with SystemConfig
    }
  }, [roles, updateDraft])

  const handleEditClick = (id: string, currentDesc: string) => {
    setEditingId(id)
    setEditVal(currentDesc)
  }

  const handleSaveEdit = () => {
    if (!editingId) return
    
    // Defensive update using requested pattern
    const updatedRoles = (roles || []).map(r => 
      r.id === editingId ? { ...r, description: editVal } : r
    )
    
    setRoles(updatedRoles)
    setEditingId(null)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditVal('')
  }

  return (
    <div className="dark:bg-[#1A1A1A] light:bg-white rounded-xl p-8 border border-[var(--border)] overflow-hidden shadow-sm">
      <div className="flex items-start gap-4 mb-8">
        <div className="p-3 rounded-lg bg-emerald-900/20 text-emerald-400 border border-emerald-500/20">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold dark:text-white light:text-neutral-900 mb-2">Quản lý vai trò & Quyền hạn</h3>
          <p className="text-sm dark:text-neutral-400 light:text-neutral-500">
            Hệ thống phân quyền dựa trên vai trò (RBAC). Các thay đổi mô tả giúp phân biệt rõ chức năng của từng nhóm người dùng.<br/>
            <span className="text-amber-500 font-medium">Lưu ý: Bạn đang thực hiện chỉnh sửa trên bản nháp (Draft).</span>
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-xs uppercase bg-[var(--input-bg)] dark:text-neutral-400 light:text-neutral-500">
            <tr>
              <th className="px-6 py-4">Mã Role</th>
              <th className="px-6 py-4">Tên hiển thị</th>
              <th className="px-6 py-4">Mô tả / Thẩm quyền</th>
              <th className="px-6 py-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {(roles?.length > 0 ? roles : initialRoles).map(r => (
              <tr key={r.id} className="hover:bg-[var(--input-bg)]/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className="font-mono text-emerald-400 font-bold">{r.key || r.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold dark:text-white light:text-neutral-900">
                  {r.name}
                  {r.permissions && r.permissions.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {r.permissions.slice(0, 2).map(p => (
                        <span key={p} className="text-[9px] px-1.5 py-0.5 rounded-md bg-neutral-800 text-neutral-500 border border-neutral-700 uppercase font-bold">
                          {p}
                        </span>
                      ))}
                      {r.permissions.length > 2 && <span className="text-[9px] text-neutral-600">+{r.permissions.length - 2}</span>}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 min-w-[300px] whitespace-normal leading-relaxed text-neutral-500">
                  {editingId === r.id ? (
                    <div className="relative">
                      <textarea 
                        value={editVal}
                        onChange={(e) => setEditVal(e.target.value)}
                        className="w-full h-24 bg-[var(--card)] border border-emerald-500/50 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 shadow-inner resize-none animate-in fade-in slide-in-from-top-1 px-4 py-3"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <p className="line-clamp-2 lg:line-clamp-none">{r.description}</p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center">
                    {editingId === r.id ? (
                      <div className="flex items-center gap-2">
                         <button 
                           onClick={handleSaveEdit} 
                           className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-all shadow-lg active:scale-95"
                         >
                           <Check size={14} /> Lưu
                         </button>
                         <button 
                           onClick={handleCancel} 
                           className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-neutral-800 text-neutral-400 font-bold text-xs hover:bg-neutral-700 transition-all active:scale-95"
                         >
                           <X size={14} /> Hủy
                         </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleEditClick(r.id, r.description)}
                        className="flex items-center gap-2 py-2 px-4 rounded-lg text-neutral-500 hover:bg-neutral-800 hover:text-white transition-all group-hover:bg-neutral-800/80 active:scale-95"
                        title="Chỉnh sửa mô tả quyền hạn"
                      >
                        <Edit2 size={16} />
                        <span className="text-xs font-bold">Sửa</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
