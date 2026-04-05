"use client"

import React from 'react'
import { Search } from 'lucide-react'

export const HeroSearch: React.FC = () => (
  <div className="relative overflow-hidden rounded-3xl dark:bg-[#1c1b1b] light:bg-white p-12 mb-10">
    {/* Glow gradient */}
    <div className="absolute top-0 right-0 w-1/3 h-full opacity-20 pointer-events-none bg-gradient-to-l from-emerald-500/20 to-transparent" />

    <div className="relative z-10 max-w-2xl">
      <span className="text-amber-400 font-semibold tracking-widest text-xs uppercase mb-4 block">
        Trung tâm hỗ trợ
      </span>
      <h2 className="text-4xl font-extrabold dark:text-white light:text-neutral-900 mb-6 tracking-tight">
        Hỗ trợ &amp; Trợ giúp
      </h2>
      <p className="dark:text-neutral-400 light:text-neutral-500 mb-8 text-lg leading-relaxed">
        Chào mừng bạn đến với trung tâm hỗ trợ của Inspiring HR. Chúng tôi ở đây để giúp bạn tối ưu hóa trải nghiệm học tập và quản lý.
      </p>
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400" size={22} />
        <input
          type="text"
          placeholder="Tìm câu trả lời cho vấn đề của bạn..."
          className="w-full dark:bg-[#0e0e0e] light:bg-neutral-100 border-none rounded-2xl py-5 pl-14 pr-36 dark:text-white light:text-neutral-900 shadow-2xl focus:ring-2 focus:ring-emerald-500/30 text-base outline-none"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-br from-emerald-400 to-[#1B4D2E] dark:text-white light:text-neutral-900 px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
          Tìm kiếm
        </button>
      </div>
    </div>
  </div>
)
