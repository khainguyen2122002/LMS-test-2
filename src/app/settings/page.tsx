"use client"

import React, { useState } from 'react'
import { Save, X } from 'lucide-react'
import { SettingsTabs } from '@/components/settings/SettingsTabs'
import { PlatformInfo } from '@/components/settings/PlatformInfo'
import { ToggleCards } from '@/components/settings/ToggleCards'
import { SecuritySettings } from '@/components/settings/SecuritySettings'
import { RoleManagement } from '@/components/settings/RoleManagement'
import { EmailTemplates } from '@/components/settings/EmailTemplates'
import { IntegrationsList } from '@/components/settings/IntegrationsList'
import { useSettings } from '@/components/settings/SettingsProvider'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0)
  const { commitDraft, discardDraft, isHydrated } = useSettings()

  if (!isHydrated) {
    return (
      <div className="py-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="py-8 space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight dark:text-white light:text-neutral-900">Cài đặt hệ thống</h2>
          <p className="dark:text-neutral-400 light:text-neutral-500 mt-2 text-sm max-w-xl">
            Cấu hình tham số vận hành, bảo mật và tích hợp của hệ thống đào tạo LMS chuyên sâu.
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button 
            onClick={discardDraft}
            className="px-6 py-2.5 rounded-xl dark:bg-[#353534] light:bg-neutral-200 dark:text-white light:text-neutral-900 font-medium text-sm hover:dark:bg-[#3a3939] light:hover:bg-neutral-300 transition-colors flex items-center gap-2"
          >
            <X size={16} />
            Hủy thay đổi
          </button>
          <button 
            onClick={commitDraft}
            className="px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-black"
            style={{ background: 'linear-gradient(135deg, #9ed3aa 0%, #1b4d2e 100%)', color: 'white' }}
          >
            <Save size={16} />
            Lưu cấu hình
          </button>
        </div>
      </div>

      {/* Bento Grid: Tabs + Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Vertical Tabs */}
        <div className="col-span-12 lg:col-span-3 min-w-0">
          <SettingsTabs active={activeTab} onChange={setActiveTab} />
        </div>

        {/* Settings Content */}
        <div className="col-span-12 lg:col-span-9 min-w-0 space-y-6">
          {activeTab === 0 && (
            <>
              <PlatformInfo />
              <ToggleCards />
            </>
          )}
          {activeTab === 1 && <RoleManagement />}
          {activeTab === 2 && <EmailTemplates />}
          {activeTab === 3 && <IntegrationsList />}
          {activeTab === 4 && <SecuritySettings />}
        </div>
      </div>
    </div>
  )
}
