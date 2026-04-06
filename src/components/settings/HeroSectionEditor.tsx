"use client"

import React, { useRef } from 'react'
import { Layout, Palette, Image as ImageIcon, Type, AlignLeft } from 'lucide-react'
import { useSettings } from '@/components/settings/SettingsProvider'

export const HeroSectionEditor: React.FC = () => {
  const { draftConfig, updateDraft } = useSettings()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const tempUrl = URL.createObjectURL(file)
      updateDraft('heroImageUrl', tempUrl)
    }
  }

  return (
    <div className="dark:bg-[#1A1A1A] light:bg-white rounded-xl p-8 border border-[var(--border)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-amber-500/10 transition-colors" />

      <div className="flex items-center gap-3 mb-6">
        <Layout size={20} className="text-amber-400" />
        <h3 className="text-lg font-bold dark:text-white light:text-neutral-900">Giao diện Dashboard Hero</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">
              <Type size={14} /> Tag Text (Badge)
            </label>
            <input
              type="text"
              value={draftConfig.heroTag}
              onChange={(e) => updateDraft('heroTag', e.target.value)}
              placeholder="e.g. INSTITUTIONAL CONTROL"
              className="w-full bg-[var(--input-bg)] border-none rounded-xl py-3 px-4 dark:text-white light:text-neutral-900 focus:ring-1 focus:ring-amber-500/40 transition-all outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">
              <AlignLeft size={14} /> Tiêu đề chính (Headline)
            </label>
            <input
              type="text"
              value={draftConfig.heroHeadline}
              onChange={(e) => updateDraft('heroHeadline', e.target.value)}
              className="w-full bg-[var(--input-bg)] border-none rounded-xl py-3 px-4 dark:text-white light:text-neutral-900 focus:ring-1 focus:ring-amber-500/40 transition-all outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">
              <AlignLeft size={14} /> Nội dung phụ (Subtitle)
            </label>
            <textarea
              value={draftConfig.heroSubtitle}
              onChange={(e) => updateDraft('heroSubtitle', e.target.value)}
              className="w-full bg-[var(--input-bg)] border-none rounded-xl py-3 px-4 dark:text-white light:text-neutral-900 focus:ring-1 focus:ring-amber-500/40 transition-all outline-none resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">
              <Palette size={14} /> Màu nền / Gradient (Background)
            </label>
            <div className="flex gap-3">
                <input
                type="color"
                value={draftConfig.heroBgColor.startsWith('#') ? draftConfig.heroBgColor : '#1B4D2E'}
                onChange={(e) => updateDraft('heroBgColor', e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-none p-0 overflow-hidden"
                />
                <input
                type="text"
                value={draftConfig.heroBgColor}
                onChange={(e) => updateDraft('heroBgColor', e.target.value)}
                placeholder="#1B4D2E or gradient"
                className="flex-1 bg-[var(--input-bg)] border-none rounded-xl py-3 px-4 dark:text-white light:text-neutral-900 focus:ring-1 focus:ring-amber-500/40 transition-all outline-none"
                />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">
              <ImageIcon size={14} /> Ảnh nền (Background Image)
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 rounded-xl border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center bg-[var(--input-bg)] hover:border-amber-500/30 transition-all cursor-pointer group/upload"
            >
              <input 
                 type="file" 
                 accept="image/*" 
                 className="hidden" 
                 ref={fileInputRef} 
                 onChange={handleImageUpload} 
              />
              {draftConfig.heroImageUrl ? (
                 <div className="relative w-full h-full p-2">
                    <img
                      src={draftConfig.heroImageUrl}
                      alt="Hero BG"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-opacity bg-black/40 rounded-lg">
                        <span className="text-white text-xs font-bold">Thay đổi ảnh</span>
                    </div>
                 </div>
              ) : (
                <div className="flex flex-col items-center">
                   <ImageIcon size={24} className="text-neutral-500 mb-2 opacity-50" />
                   <span className="text-[10px] text-neutral-500 group-hover/upload:text-amber-400 transition-colors uppercase tracking-widest font-bold">Tải lên ảnh nền</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
