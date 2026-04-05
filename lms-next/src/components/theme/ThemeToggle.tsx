"use client"

import React, { useRef, useEffect, useState } from 'react'
import { Sun, Moon, Monitor, Check } from 'lucide-react'
import { useTheme, type ThemeMode } from '@/components/theme/ThemeProvider'

const OPTIONS: { mode: ThemeMode; label: string; icon: React.ElementType }[] = [
  { mode: 'light',  label: 'Sáng',     icon: Sun },
  { mode: 'dark',   label: 'Tối',      icon: Moon },
  { mode: 'system', label: 'Hệ thống', icon: Monitor },
]

export const ThemeToggle: React.FC = () => {
  const { mode, resolvedTheme, setMode } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Current icon based on mode
  const CurrentIcon = resolvedTheme === 'dark' ? Moon : Sun

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`p-1.5 rounded-lg transition-all ${
          open
            ? 'text-[#F9A825] bg-[#F9A825]/10'
            : 'dark:text-neutral-400 light:text-neutral-500 dark:dark:text-neutral-400 light:text-neutral-500 light:text-neutral-500 hover:text-[#F9A825] opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
        }`}
        aria-label="Chuyển đổi giao diện"
        title="Chuyển đổi giao diện"
      >
        <CurrentIcon size={19} />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-44 rounded-xl shadow-2xl shadow-black/40 border border-white/[0.06] dark:border-white/[0.06] light:border-black/[0.08] overflow-hidden z-50 dark:dark:bg-[#1a1a1a] light:bg-white light:bg-white dark:bg-[#1a1a1a] light:bg-white">
          <div className="p-1.5">
            {OPTIONS.map(({ mode: m, label, icon: Icon }) => {
              const isActive = mode === m
              return (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m)
                    setOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#F9A825]/10 text-[#F9A825]'
                      : 'dark:dark:text-neutral-400 light:text-neutral-500 dark:hover:dark:text-white light:text-neutral-900 dark:hover:bg-white/5 text-neutral-500 hover:text-neutral-800 hover:bg-black/5'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-[#F9A825]' : ''} />
                  <span className="flex-1 text-left">{label}</span>
                  {isActive && <Check size={14} className="text-[#F9A825]" />}
                </button>
              )
            })}
          </div>
          <div className="border-t dark:border-[var(--border)] border-black/5 px-3 py-2">
            <p className="text-[10px] dark:text-neutral-600 dark:text-neutral-400 light:text-neutral-500 font-medium uppercase tracking-wider">
              Đang dùng: {resolvedTheme === 'dark' ? 'Giao diện tối' : 'Giao diện sáng'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
