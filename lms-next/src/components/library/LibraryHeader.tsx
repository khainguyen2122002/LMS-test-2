"use client"

import React, { useState } from 'react'
import { Search, Upload } from 'lucide-react'

type DocFilter = 'Tất cả' | 'Công văn' | 'Nghị định' | 'Thông báo' | 'Quy định nội bộ'
type YearFilter = 'Năm 2025' | 'Năm 2024'

const DOC_FILTERS: DocFilter[] = ['Tất cả', 'Công văn', 'Nghị định', 'Thông báo', 'Quy định nội bộ']
const YEAR_FILTERS: YearFilter[] = ['Năm 2025', 'Năm 2024']

export const LibrarySearchBar: React.FC = () => {
  const [docFilter, setDocFilter] = useState<DocFilter>('Tất cả')
  const [yearFilter, setYearFilter] = useState<YearFilter | null>(null)

  return (
    <div className="flex flex-col gap-5 mb-12">
      {/* Large search */}
      <div className="relative w-full max-w-3xl">
        <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400" />
        <input
          type="text"
          placeholder="Tìm công văn, nghị định, thông báo..."
          className="w-full dark:bg-[#201f1f] light:bg-white border-none h-16 pl-16 pr-8 rounded-2xl text-base dark:text-white light:text-neutral-900 focus:ring-1 focus:ring-emerald-500/40 outline-none placeholder:text-neutral-600 transition-all"
        />
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 items-center">
        {DOC_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setDocFilter(f)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              docFilter === f
                ? 'bg-emerald-400 text-[#01391c] font-semibold shadow shadow-emerald-500/20'
                : 'dark:bg-[#201f1f] light:bg-white dark:text-neutral-400 light:text-neutral-500 hover:dark:text-white light:text-neutral-900'
            }`}
          >
            {f}
          </button>
        ))}
        <div className="h-6 w-px bg-white/10 mx-1" />
        {YEAR_FILTERS.map((y) => (
          <button
            key={y}
            onClick={() => setYearFilter(yearFilter === y ? null : y)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              yearFilter === y
                ? 'bg-amber-900/30 text-amber-400 border border-amber-600/30'
                : 'dark:bg-[#201f1f] light:bg-white dark:text-neutral-400 light:text-neutral-500 hover:dark:text-white light:text-neutral-900'
            }`}
          >
            {y}
          </button>
        ))}
      </div>
    </div>
  )
}
