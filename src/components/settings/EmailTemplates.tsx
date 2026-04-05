"use client"

import React, { useState } from 'react'
import { Mail, Edit2, X, Check, Search, ArrowRight } from 'lucide-react'
import { useSettings } from '@/components/settings/SettingsProvider'

export const EmailTemplates: React.FC = () => {
  const { draftConfig, updateDraft } = useSettings()
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Temporary state for the modal
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [previewMode, setPreviewMode] = useState(false)

  const handleEdit = (id: string, sub: string, content: string) => {
    setSubject(sub)
    setBody(content)
    setPreviewMode(false)
    setEditingId(id)
  }

  const handleSave = () => {
    const updated = (draftConfig.emailTemplates || []).map(t => 
       t.id === editingId ? { ...t, subject, body } : t
    )
    updateDraft('emailTemplates', updated)
    setEditingId(null)
  }

  const activeTemplate = (draftConfig.emailTemplates || []).find(t => t.id === editingId)

  // Dumb mock generator to replace vars with dummy data
  const generatePreview = (text: string) => {
    return text
      .replace(/{{name}}/g, 'Nguyễn Hiếu')
      .replace(/{{email}}/g, 'hieu.nguyen@example.com')
      .replace(/{{course_name}}/g, 'Mastering HR 2024')
      .replace(/{{date}}/g, '15/10/2026')
      .replace(/{{reset_url}}/g, 'https://lms.com/reset-xyz')
      .replace(/{{course_url}}/g, 'https://lms.com/course/abc')
  }

  return (
    <div className="space-y-6">
       <div className="dark:bg-[#1A1A1A] light:bg-white rounded-xl p-8 border border-[var(--border)] overflow-hidden">
          <div className="flex items-start gap-4 mb-8">
            <div className="p-3 rounded-lg bg-blue-900/20 text-blue-400">
              <Mail size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold dark:text-white light:text-neutral-900 mb-2">Quản lý Email Template</h3>
              <p className="text-sm dark:text-neutral-400 light:text-neutral-500">
                Cấu hình nội dung các email tự động gửi đi từ hệ thống. Hỗ trợ biến số nội suy.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(draftConfig.emailTemplates || []).map(t => (
              <div key={t.id} className="dark:bg-[#0e0e0e] light:bg-neutral-50 p-6 rounded-xl border border-[var(--border)] group transition-all hover:border-blue-500/30">
                <div className="flex justify-between items-start mb-4">
                   <h4 className="font-bold text-blue-400">{t.name}</h4>
                   <button 
                     onClick={() => handleEdit(t.id, t.subject, t.body)}
                     className="p-2 rounded-lg bg-[var(--card)] text-neutral-500 hover:text-white hover:bg-blue-500/20 transition-all opacity-0 group-hover:opacity-100"
                   >
                     <Edit2 size={14} />
                   </button>
                </div>
                <div className="text-xs mb-4">
                  <span className="text-neutral-500 block mb-1">Subject:</span>
                  <span className="font-semibold text-neutral-300 truncate block">{t.subject}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(t.variables || []).map(v => (
                    <span key={v} className="px-2 py-1 rounded bg-black/40 text-[10px] text-neutral-400 font-mono border border-neutral-800">
                      {'{{'}{v}{'}}'}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
       </div>

       {/* Modal Overlay */}
       {editingId && activeTemplate && (
         <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="dark:bg-[#1A1A1A] light:bg-white border border-[var(--border)] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
               <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-[var(--card)]">
                 <h3 className="font-bold text-lg dark:text-white light:text-neutral-900 flex items-center gap-2">
                   <Edit2 size={16} className="text-blue-400" /> Sửa {activeTemplate.name}
                 </h3>
                 <button onClick={() => setEditingId(null)} className="text-neutral-500 hover:text-white transition-colors">
                   <X size={20} />
                 </button>
               </div>

               <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto max-h-[70vh]">
                 
                 {/* Tabs preview/edit */}
                 <div className="flex bg-[var(--input-bg)] p-1 rounded-lg w-max">
                   <button onClick={() => setPreviewMode(false)} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${!previewMode ? 'bg-[var(--card)] text-white shadow' : 'text-neutral-500'}`}>Soạn thảo</button>
                   <button onClick={() => setPreviewMode(true)} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${previewMode ? 'bg-[var(--card)] text-white shadow' : 'text-neutral-500'}`}>Xem trước (Preview)</button>
                 </div>

                 {!previewMode ? (
                   <>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">Tiêu đề (Subject)</label>
                      <input 
                        type="text" 
                        value={subject} 
                        onChange={e => setSubject(e.target.value)}
                        className="w-full bg-[var(--input-bg)] border-none rounded-xl py-3 px-4 dark:text-white light:text-neutral-900 focus:ring-1 focus:ring-blue-500/40 outline-none"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-2">
                         <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest">Nội dung HTML/Text</label>
                         <span className="text-[10px] text-blue-400 font-mono">Biến hỗ trợ: {(activeTemplate.variables || []).join(', ')}</span>
                      </div>
                      <textarea 
                        value={body} 
                        onChange={e => setBody(e.target.value)}
                        rows={8}
                        className="w-full bg-[var(--input-bg)] border-none rounded-xl py-3 px-4 dark:text-white light:text-neutral-900 focus:ring-1 focus:ring-blue-500/40 outline-none font-mono text-sm leading-relaxed"
                      />
                    </div>
                   </>
                 ) : (
                   <div className="bg-white text-black p-8 rounded-xl border border-neutral-200 shadow-inner font-sans">
                      <div className="mb-4 pb-4 border-b border-neutral-200">
                        <p className="text-xs text-neutral-500"><strong>Subject:</strong> {generatePreview(subject)}</p>
                      </div>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-800">
                        {generatePreview(body)}
                      </div>
                   </div>
                 )}
               </div>

               <div className="p-6 border-t border-[var(--border)] bg-[var(--card)] flex justify-end gap-3">
                 <button onClick={() => setEditingId(null)} className="px-5 py-2.5 rounded-xl bg-transparent text-neutral-400 hover:text-white font-bold text-sm transition-colors">
                   Hủy
                 </button>
                 <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-colors">
                   <Check size={16} /> Lưu Thay Đổi
                 </button>
               </div>
            </div>
         </div>
       )}
    </div>
  )
}
