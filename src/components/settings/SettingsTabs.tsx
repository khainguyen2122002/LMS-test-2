"use client"

import React, { useState } from 'react'
import { Info, ShieldCheck, Mail, Plug, Lock, Layout } from 'lucide-react'

const TABS = [
  { icon: Info, label: 'Thông tin nền tảng' },
  { icon: Layout, label: 'Giao diện Dashboard' },
  { icon: ShieldCheck, label: 'Quản lý vai trò & quyền' },
  { icon: Mail, label: 'Email template' },
  { icon: Plug, label: 'Tích hợp bên thứ ba' },
  { icon: Lock, label: 'Bảo mật' },
]

interface Props {
  active: number
  onChange: (i: number) => void
}

export const SettingsTabs: React.FC<Props> = ({ active, onChange }) => (
  <div className="flex flex-col gap-2">
    {TABS.map((tab, i) => (
      <button
        key={i}
        onClick={() => onChange(i)}
        className={`flex items-center gap-3 p-4 rounded-xl text-left transition-all ${
          active === i
            ? 'dark:bg-[#2a2a2a] light:bg-neutral-100 text-emerald-400 border-l-4 border-emerald-500'
            : 'dark:bg-[#1c1b1b] light:bg-white dark:text-neutral-400 light:text-neutral-500 hover:dark:bg-[#201f1f] light:bg-white hover:dark:text-white light:text-neutral-900 border-l-4 border-transparent'
        }`}
      >
        <tab.icon size={18} className="flex-shrink-0" />
        <span className="text-sm font-medium">{tab.label}</span>
      </button>
    ))}
  </div>
)
