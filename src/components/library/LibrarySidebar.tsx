"use client"

import React, { useState } from 'react'
import { FileText, ArrowRight } from 'lucide-react'

const RECENT = [
  { title: 'Hướng dẫn kê khai thuế thu nhập cá nhân Q1/2025', time: 'Hôm nay, 14:30' },
  { title: 'Nghị quyết hội đồng quản trị về kế hoạch 2025', time: 'Hôm qua' },
  { title: 'Quyết định bổ nhiệm nhân sự cấp cao tháng 01', time: '12/01/2025' },
]

interface YearEntry { year: string; count: string | null; isActive?: boolean }
const YEARS: YearEntry[] = [
  { year: 'Năm 2026', count: 'Sắp tới' },
  { year: 'Năm 2025', count: '12 Tài liệu', isActive: true },
  { year: 'Năm 2024', count: '148 Tài liệu' },
]

const CATEGORIES = ['Quản trị nhân sự', 'Tiền lương', 'Bảo hiểm xã hội', 'Tuyển dụng', 'Khen thưởng', 'Kỷ luật']

export const LibrarySidebar: React.FC = () => {
  const [activeYear, setActiveYear] = useState('Năm 2025')

  return (
    <aside className="space-y-6">
      {/* Tài liệu mới nhất */}
      <section className="dark:bg-[#1c1b1b] light:bg-white rounded-2xl p-6 border border-[var(--border)]">
        <h4 className="text-base font-bold dark:text-white light:text-neutral-900 mb-5">Tài liệu mới nhất</h4>
        <div className="space-y-4">
          {RECENT.map((doc, i) => (
            <a key={i} href="#" className="flex gap-3 group">
              <div className="shrink-0 w-10 h-10 dark:bg-[#2a2a2a] light:bg-neutral-100 rounded-lg flex items-center justify-center text-emerald-400 group-hover:bg-[#1B4D2E] transition-colors">
                <FileText size={18} />
              </div>
              <div>
                <h5 className="text-sm font-medium text-neutral-200 leading-tight mb-1 group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {doc.title}
                </h5>
                <span className="text-[10px] text-neutral-600 uppercase font-bold tracking-wider">{doc.time}</span>
              </div>
            </a>
          ))}
        </div>
        <button className="w-full mt-5 pt-4 border-t border-[var(--border)] text-xs font-bold text-emerald-400 uppercase tracking-widest hover:dark:text-white light:text-neutral-900 transition-colors text-left flex items-center gap-1">
          Xem tất cả cập nhật <ArrowRight size={12} />
        </button>
      </section>

      {/* Lưu trữ theo năm */}
      <section className="dark:bg-[#1c1b1b] light:bg-white rounded-2xl p-6 border border-[var(--border)]">
        <h4 className="text-base font-bold dark:text-white light:text-neutral-900 mb-4">Lưu trữ theo năm</h4>
        <div className="space-y-2">
          {YEARS.map((y) => {
            const isActive = activeYear === y.year
            return (
              <button
                key={y.year}
                onClick={() => setActiveYear(y.year)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left ${
                  isActive
                    ? 'bg-emerald-900/20 border border-emerald-700/30'
                    : 'dark:bg-[#201f1f] light:bg-white hover:bg-emerald-900/10 border border-transparent'
                }`}
              >
                <span className={`text-sm font-medium ${isActive ? 'text-emerald-400 font-bold' : 'dark:text-neutral-400 light:text-neutral-500 hover:dark:text-white light:text-neutral-900'}`}>
                  {y.year}
                </span>
                <span className={`text-xs ${isActive ? 'text-emerald-400 font-bold' : 'text-neutral-600'}`}>
                  {y.count}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Danh mục phổ biến */}
      <section className="dark:bg-[#1c1b1b] light:bg-white rounded-2xl p-6 border border-[var(--border)]">
        <h4 className="text-base font-bold dark:text-white light:text-neutral-900 mb-4">Danh mục phổ biến</h4>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <a
              key={cat}
              href="#"
              className="px-4 py-2 dark:bg-[#2a2a2a] light:bg-neutral-100 hover:bg-[#1B4D2E] hover:text-emerald-300 text-xs font-medium dark:text-neutral-300 light:text-neutral-600 rounded-lg transition-all"
            >
              {cat}
            </a>
          ))}
        </div>
      </section>

      {/* Help CTA */}
      <div className="relative rounded-2xl overflow-hidden h-48 flex flex-col justify-end"
        style={{ background: 'linear-gradient(160deg, #1B4D2E 0%, #0d2e1a 100%)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative z-10 p-6">
          <h5 className="text-lg font-bold dark:text-white light:text-neutral-900 mb-1">Cần hỗ trợ tra cứu?</h5>
          <p className="text-xs dark:text-neutral-400 light:text-neutral-500 mb-4 leading-relaxed">
            Đội ngũ hỗ trợ pháp lý luôn sẵn sàng giải đáp thắc mắc của bạn.
          </p>
          <button className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
            Gửi yêu cầu ngay <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
