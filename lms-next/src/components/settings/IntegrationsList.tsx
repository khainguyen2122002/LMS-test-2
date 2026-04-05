"use client"

import React, { useState } from 'react'
import { Plug, Settings2, X, Check, Link2, KeyRound } from 'lucide-react'
import { useSettings } from '@/components/settings/SettingsProvider'

export const IntegrationsList: React.FC = () => {
  const { draftConfig, updateDraft } = useSettings()
  const [configuringId, setConfiguringId] = useState<string | null>(null)
  
  // Temporary state for the config modal dynamically populated based on active integration keys
  const [localConfig, setLocalConfig] = useState<Record<string, string>>({})

  const handleOpenConfig = (id: string, config: Record<string, string>) => {
    setConfiguringId(id)
    setLocalConfig({ ...config })
  }

  const handleSaveConfig = () => {
    if (!configuringId) return
    const updated = (draftConfig.integrations || []).map(i => 
       i.id === configuringId ? { ...i, config: localConfig } : i
    )
    updateDraft('integrations', updated)
    setConfiguringId(null)
  }

  const handleToggleEnable = (id: string, currentVal: boolean) => {
    const updated = (draftConfig.integrations || []).map(i => 
      i.id === id ? { ...i, isEnabled: !currentVal } : i
   )
   updateDraft('integrations', updated)
  }

  const activeIntegration = (draftConfig.integrations || []).find(i => i.id === configuringId)

  return (
    <div className="space-y-6">
       <div className="dark:bg-[#1A1A1A] light:bg-white rounded-xl p-8 border border-[var(--border)] overflow-hidden">
          <div className="flex items-start gap-4 mb-8">
            <div className="p-3 rounded-lg bg-purple-900/20 text-purple-400">
              <Plug size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold dark:text-white light:text-neutral-900 mb-2">Tích hợp cung cấp (Vendors)</h3>
              <p className="text-sm dark:text-neutral-400 light:text-neutral-500">
                Các API Keys kết nối đến đối tác thứ 3. Keys sẽ tự động mã hóa dạng * khi lưu vào hệ thống để bảo vệ cấp độ 1.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(draftConfig.integrations || []).map(t => (
              <div key={t.id} className="dark:bg-[#0e0e0e] light:bg-neutral-50 p-6 rounded-xl border border-[var(--border)] relative overflow-hidden group hover:border-purple-500/30 transition-all flex flex-col justify-between">
                
                {/* Glow if enabled */}
                {t.isEnabled && <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none" />}

                <div>
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <Link2 size={16} className={t.isEnabled ? "text-purple-400" : "text-neutral-500"} />
                        <h4 className="font-bold dark:text-white light:text-neutral-900">{t.name}</h4>
                      </div>
                      <button
                        role="switch"
                        aria-checked={t.isEnabled}
                        onClick={() => handleToggleEnable(t.id, t.isEnabled)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                          t.isEnabled ? 'bg-purple-500' : 'bg-neutral-600'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${ t.isEnabled ? 'translate-x-[18px]' : 'translate-x-[2px]' }`} />
                      </button>
                   </div>
                   <p className="text-xs text-neutral-500 font-mono mb-6">{t.provider}</p>
                </div>

                <button 
                  onClick={() => handleOpenConfig(t.id, t.config)}
                  className="w-full py-2.5 rounded-lg border border-[var(--border)] dark:bg-[var(--card)] light:bg-white text-xs font-bold hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <Settings2 size={14} /> Tùy chỉnh Cấu Hình
                </button>
              </div>
            ))}
          </div>
       </div>

       {/* Config Modal Overlay */}
       {configuringId && activeIntegration && (
         <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="dark:bg-[#1A1A1A] light:bg-white border border-[var(--border)] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
               <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-[var(--card)]">
                 <h3 className="font-bold text-lg dark:text-white light:text-neutral-900 flex items-center gap-2">
                   <KeyRound size={16} className="text-purple-400" /> Webhook & API Keys
                 </h3>
                 <button onClick={() => setConfiguringId(null)} className="text-neutral-500 hover:text-white transition-colors">
                   <X size={20} />
                 </button>
               </div>

               <div className="p-6 flex-1 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">
                 <div className="bg-purple-900/20 text-purple-400 text-xs p-3 rounded-lg flex items-start gap-2 mb-2">
                   <Plug size={14} className="flex-shrink-0 mt-0.5" />
                   Cầu nối tới máy chủ <strong>{activeIntegration.provider}</strong>. Không chia sẻ mã Hash với bất kỳ cá nhân nào ngoài thẩm quyền quản trị cấp 1.
                 </div>

                 {(Object.keys(activeIntegration.config || {})).map(fieldKey => (
                   <div key={fieldKey}>
                      <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                         {fieldKey}
                      </label>
                      <input 
                        type="password" 
                        value={localConfig[fieldKey] || ''} 
                        onChange={e => setLocalConfig({ ...localConfig, [fieldKey]: e.target.value })}
                        className="w-full bg-[var(--input-bg)] border-none rounded-xl py-3 px-4 dark:text-white light:text-neutral-900 focus:ring-1 focus:ring-purple-500/40 outline-none font-mono text-sm tracking-wider"
                      />
                   </div>
                 ))}
               </div>

               <div className="p-6 border-t border-[var(--border)] bg-[var(--card)] flex justify-end gap-3">
                 <button onClick={() => setConfiguringId(null)} className="px-5 py-2.5 rounded-xl bg-transparent text-neutral-400 hover:text-white font-bold text-sm transition-colors">
                   Hủy
                 </button>
                 <button onClick={handleSaveConfig} className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-colors">
                   <Check size={16} /> Lưu Thông Số
                 </button>
               </div>
            </div>
         </div>
       )}
    </div>
  )
}
