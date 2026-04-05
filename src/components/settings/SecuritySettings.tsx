"use client"

import React, { useState } from 'react'
import { ShieldCheck, CloudUpload, Loader2 } from 'lucide-react'
import { useSettings } from '@/components/settings/SettingsProvider'
import { toast } from 'sonner'

interface SmallToggleProps {
  checked: boolean
  onChange: (v: boolean) => void
}

const SmallToggle: React.FC<SmallToggleProps> = ({ checked, onChange }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
      checked ? 'bg-[#F9A825]' : 'bg-neutral-600'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
        checked ? 'translate-x-[18px]' : 'translate-x-[2px]'
      }`}
    />
  </button>
)

export const SecuritySettings: React.FC = () => {
  const { draftConfig, updateDraft } = useSettings()
  const [isBackingUp, setIsBackingUp] = useState(false)

  const handleBackup = async () => {
    setIsBackingUp(true)
    toast.info('Đang nén dữ liệu và chuẩn bị upload...')
    
    // Simulate backup delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsBackingUp(false)
    toast.success('Đã sao lưu dữ liệu thành công!', {
      description: 'Lưu trữ đám mây tại bucket: lms-archive-primary'
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Security Policy */}
      <div className="lg:col-span-2 dark:bg-[#1A1A1A] light:bg-white rounded-xl p-6 border border-[var(--border)]">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck size={20} className="text-amber-400" />
          <h3 className="font-bold dark:text-white light:text-neutral-900">Chính sách bảo mật tài khoản</h3>
        </div>

        <div className="space-y-3">
          {/* 2FA */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--input-bg)]">
            <span className="text-sm font-medium dark:text-neutral-200 light:text-neutral-700">Bắt buộc xác thực 2 lớp (2FA)</span>
            <SmallToggle 
               checked={draftConfig.require2FA} 
               onChange={(v) => updateDraft('require2FA', v)} 
            />
          </div>

          {/* Max Sessions */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--input-bg)]">
            <span className="text-sm font-medium dark:text-neutral-200 light:text-neutral-700">Giới hạn số phiên đăng nhập đồng thời</span>
            <input
              type="number"
              min={1}
              max={10}
              value={draftConfig.maxConcurrentSessions}
              onChange={(e) => updateDraft('maxConcurrentSessions', Number(e.target.value) || 1)}
              className="w-16 dark:bg-[#1e1e1e] light:bg-neutral-200 border-none rounded-lg text-center py-1 text-sm outline-none focus:ring-1 focus:ring-emerald-500/40 dark:text-white light:text-neutral-900"
            />
          </div>

          {/* Auto Logout */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--input-bg)]">
            <span className="text-sm font-medium dark:text-neutral-200 light:text-neutral-700">Thời gian tự động đăng xuất (phút)</span>
            <input
              type="number"
              min={5}
              max={1440}
              value={draftConfig.timeoutMinutes}
              onChange={(e) => updateDraft('timeoutMinutes', Number(e.target.value) || 30)}
              className="w-16 dark:bg-[#1e1e1e] light:bg-neutral-200 border-none rounded-lg text-center py-1 text-sm outline-none focus:ring-1 focus:ring-emerald-500/40 dark:text-white light:text-neutral-900"
            />
          </div>
        </div>
      </div>

      {/* Backup Card */}
      <div
        className="rounded-xl p-6 border border-emerald-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(27,77,46,0.3) 0%, #201f1f 100%)' }}
      >
        <div className="w-16 h-16 rounded-full bg-emerald-900/20 flex items-center justify-center mb-4 relative z-10">
          <CloudUpload size={28} className="text-emerald-400" />
        </div>
        <h4 className="font-bold dark:text-white light:text-white mb-2 relative z-10">Sao lưu dữ liệu</h4>
        <p className="text-xs dark:text-neutral-400 light:text-neutral-300 mb-6 px-2 leading-relaxed relative z-10">
          Sao lưu toàn bộ cơ sở dữ liệu và tài liệu đào tạo sang hệ thống lưu trữ đám mây.
        </p>
        <button 
          onClick={handleBackup}
          disabled={isBackingUp}
          className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm transition-colors relative z-10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isBackingUp ? (
            <><Loader2 size={16} className="animate-spin" /> Đang sao lưu...</>
          ) : (
            'Thực hiện ngay'
          )}
        </button>
      </div>
    </div>
  )
}
