"use client"

import React from 'react'
import { Wrench, UserPlus } from 'lucide-react'
import { useSettings } from '@/components/settings/SettingsProvider'

interface ToggleProps {
  checked: boolean
  onChange: (val: boolean) => void
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
      checked ? 'bg-[#F9A825]' : 'bg-neutral-600'
    }`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
        checked ? 'translate-x-[22px]' : 'translate-x-[2px]'
      }`}
    />
  </button>
)

export const ToggleCards: React.FC = () => {
  const { draftConfig, updateDraft } = useSettings()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Maintenance Card */}
      <div className="dark:bg-[#1A1A1A] light:bg-white rounded-xl p-6 border border-[var(--border)]">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-900/20 text-amber-400">
              <Wrench size={18} />
            </div>
            <h4 className="font-bold dark:text-white light:text-neutral-900">Chế độ bảo trì</h4>
          </div>
          <Toggle 
             checked={draftConfig.maintenanceMode} 
             onChange={(v) => updateDraft('maintenanceMode', v)} 
          />
        </div>
        <p className="text-xs text-neutral-500 leading-relaxed">
          Tạm dừng truy cập hệ thống để thực hiện cập nhật hoặc bảo trì máy chủ định kỳ.
        </p>
      </div>

      {/* Open Registration Card */}
      <div className="dark:bg-[#1A1A1A] light:bg-white rounded-xl p-6 border border-[var(--border)]">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-900/20 text-emerald-400">
              <UserPlus size={18} />
            </div>
            <h4 className="font-bold dark:text-white light:text-neutral-900">Mở đăng ký tự do</h4>
          </div>
          <Toggle 
            checked={draftConfig.openRegistration} 
            onChange={(v) => updateDraft('openRegistration', v)} 
          />
        </div>
        <p className="text-xs text-neutral-500 leading-relaxed">
          Cho phép học viên mới tự tạo tài khoản mà không cần sự phê duyệt của quản trị viên.
        </p>
      </div>
    </div>
  )
}
