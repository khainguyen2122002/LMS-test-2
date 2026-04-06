"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { SystemConfig, defaultSystemConfig } from '@/lib/settings-service'
import { toast } from 'sonner'

interface SettingsContextValue {
  config: SystemConfig
  draftConfig: SystemConfig
  isHydrated: boolean
  
  updateDraft: <K extends keyof SystemConfig>(key: K, value: SystemConfig[K]) => void
  commitDraft: () => void
  discardDraft: () => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export const useSettings = () => {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SystemConfig>(defaultSystemConfig)
  const [draftConfig, setDraftConfig] = useState<SystemConfig>(defaultSystemConfig)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount safely
  useEffect(() => {
    try {
      const stored = localStorage.getItem('lms_system_config')
      if (stored) {
        const parsed = JSON.parse(stored) as SystemConfig
        // Fallback merge to avoid undefined array crashes on old caches
        const safeMerged = { ...defaultSystemConfig, ...parsed }
        
        // Specifically guard arrays and new fields against being completely omitted in old cache
        if (!parsed.roles) safeMerged.roles = defaultSystemConfig.roles
        if (!parsed.emailTemplates) safeMerged.emailTemplates = defaultSystemConfig.emailTemplates
        if (!parsed.integrations) safeMerged.integrations = defaultSystemConfig.integrations
        
        // Ensure hero fields exist
        if (!parsed.heroTag) safeMerged.heroTag = defaultSystemConfig.heroTag
        if (!parsed.heroHeadline) safeMerged.heroHeadline = defaultSystemConfig.heroHeadline
        if (!parsed.heroSubtitle) safeMerged.heroSubtitle = defaultSystemConfig.heroSubtitle
        if (!parsed.heroBgColor) safeMerged.heroBgColor = defaultSystemConfig.heroBgColor

        setConfig(safeMerged)
        setDraftConfig(safeMerged)
      }
    } catch (err) {
      console.error('Failed to parse settings from localStorage', err)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  const updateDraft = useCallback(<K extends keyof SystemConfig>(key: K, value: SystemConfig[K]) => {
    setDraftConfig(prev => ({ ...prev, [key]: value }))
  }, [])

  const commitDraft = useCallback(() => {
    setConfig(draftConfig)
    try {
      localStorage.setItem('lms_system_config', JSON.stringify(draftConfig))
      toast.success('Đã lưu cấu hình hệ thống!')
    } catch (err) {
      toast.error('Lỗi khi lưu vào bộ nhớ cục bộ.')
    }
  }, [draftConfig])

  const discardDraft = useCallback(() => {
    setDraftConfig(config)
    toast.info('Đã hủy bỏ thay đổi.')
  }, [config])

  return (
    <SettingsContext.Provider
      value={{
        config,
        draftConfig,
        isHydrated,
        updateDraft,
        commitDraft,
        discardDraft,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
