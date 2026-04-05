"use client"

import React from 'react'
import { Rocket, CreditCard, ShieldCheck, Puzzle } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface Category {
  icon: LucideIcon
  iconColor: string
  title: string
  description: string
}

const categories: Category[] = [
  {
    icon: Rocket,
    iconColor: 'text-emerald-400',
    title: 'Bắt đầu nhanh',
    description: 'Hướng dẫn cơ bản cho người mới bắt đầu sử dụng LMS.',
  },
  {
    icon: CreditCard,
    iconColor: 'text-amber-400',
    title: 'Thanh toán',
    description: 'Quản lý hóa đơn, gói cước và phương thức thanh toán.',
  },
  {
    icon: ShieldCheck,
    iconColor: 'text-emerald-300',
    title: 'Bảo mật',
    description: 'Thiết lập quyền truy cập và bảo vệ dữ liệu học viên.',
  },
  {
    icon: Puzzle,
    iconColor: 'text-amber-500',
    title: 'Tích hợp',
    description: 'Kết nối với Zoom, MS Teams và các công cụ khác.',
  },
]

export const KnowledgeBase: React.FC = () => (
  <section className="mt-16">
    <h3 className="text-xl font-bold dark:text-white light:text-neutral-900 mb-8">Danh mục kiến thức</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((cat, i) => (
        <div
          key={i}
          className="dark:bg-[#1A1A1A] light:bg-white p-6 rounded-2xl border border-[var(--border)] hover:border-emerald-500/20 transition-all group cursor-pointer"
        >
          <cat.icon
            size={32}
            className={`${cat.iconColor} mb-4 group-hover:scale-110 transition-transform`}
          />
          <h4 className="font-bold dark:text-white light:text-neutral-900 mb-2">{cat.title}</h4>
          <p className="text-xs text-neutral-500 leading-relaxed">{cat.description}</p>
        </div>
      ))}
    </div>
  </section>
)
