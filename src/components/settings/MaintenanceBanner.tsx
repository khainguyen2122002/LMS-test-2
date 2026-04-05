"use client"

import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { useSettings } from '@/components/settings/SettingsProvider'

export const MaintenanceBanner: React.FC = () => {
  const { config, isHydrated } = useSettings()

  if (!isHydrated || !config.maintenanceMode) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-black py-2 px-6 rounded-full shadow-2xl flex items-center justify-center gap-3 animate-in slide-in-from-top-4 duration-300 z-[9999]">
      <AlertTriangle size={18} className="animate-pulse" />
      <p className="text-sm font-bold tracking-tight">Hệ thống đang bảo trì. Chức năng học viên hiện bị giới hạn.</p>
    </div>
  )
}
