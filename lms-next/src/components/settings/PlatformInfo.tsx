"use client"

import React, { useRef } from 'react'
import { AppWindow } from 'lucide-react'
import { useSettings } from '@/components/settings/SettingsProvider'

export const PlatformInfo: React.FC = () => {
  const { draftConfig, updateDraft } = useSettings()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Mock File Upload -> Create local Object URL
      const tempUrl = URL.createObjectURL(file)
      updateDraft('logoUrl', tempUrl)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const tempUrl = URL.createObjectURL(file)
      updateDraft('logoUrl', tempUrl)
    }
  }

  return (
    <div className="dark:bg-[#1A1A1A] light:bg-white rounded-xl p-8 border border-[var(--border)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-500/10 transition-colors" />

      <div className="flex items-center gap-3 mb-6">
        <AppWindow size={20} className="text-emerald-400" />
        <h3 className="text-lg font-bold dark:text-white light:text-neutral-900">Thông tin nền tảng</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">
              Tên nền tảng
            </label>
            <input
              type="text"
              value={draftConfig.platformName}
              onChange={(e) => updateDraft('platformName', e.target.value)}
              className="w-full bg-[var(--input-bg)] border-none rounded-xl py-3 px-4 dark:text-white light:text-neutral-900 focus:ring-1 focus:ring-emerald-500/40 transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">
              Slogan
            </label>
            <textarea
              value={draftConfig.slogan}
              onChange={(e) => updateDraft('slogan', e.target.value)}
              className="w-full bg-[var(--input-bg)] border-none rounded-xl py-3 px-4 dark:text-white light:text-neutral-900 focus:ring-1 focus:ring-emerald-500/40 transition-all outline-none resize-none"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">
              Ngôn ngữ mặc định
            </label>
            <select 
              value={draftConfig.language}
              onChange={(e) => updateDraft('language', e.target.value as 'vi' | 'en')}
              className="w-full bg-[var(--input-bg)] border-none rounded-xl py-3 px-4 dark:text-white light:text-neutral-900 focus:ring-1 focus:ring-emerald-500/40 transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="vi">Tiếng Việt (Vietnam)</option>
              <option value="en">English (United States)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">
            Logo hệ thống
          </label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="w-full h-44 rounded-xl border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center bg-[var(--input-bg)] hover:border-emerald-500/30 transition-all cursor-pointer group/upload"
          >
            <input 
               type="file" 
               accept="image/*" 
               className="hidden" 
               ref={fileInputRef} 
               onChange={handleImageUpload} 
            />
            {draftConfig.logoUrl ? (
               <img
                 src={draftConfig.logoUrl}
                 alt="Current Logo"
                 className="h-14 mb-3 object-contain"
               />
            ) : (
              <div className="h-14 mb-3 flex items-center justify-center">
                 <AppWindow size={32} className="text-neutral-500 opacity-50" />
              </div>
            )}
            <span className="text-xs text-neutral-500 group-hover/upload:text-emerald-400 transition-colors">Kéo thả hoặc click để tải lên</span>
          </div>
        </div>
      </div>
    </div>
  )
}
