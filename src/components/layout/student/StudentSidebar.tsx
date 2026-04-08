"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  GraduationCap,
  TrendingUp,
  Calendar,
  BookMarked,
  Award,
  HelpCircle,
  LucideIcon
} from 'lucide-react'

// Use exactly the requested side navigation
interface NavItem {
  icon: LucideIcon
  label: string
  href: string
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Trang chủ', href: '/student/dashboard' },
  { icon: GraduationCap, label: 'Khóa học của tôi', href: '/student/courses' },
  { icon: TrendingUp, label: 'Tiến độ học tập', href: '/student/progress' },
  { icon: Calendar, label: 'Lịch học', href: '/student/schedule' },
  { icon: BookMarked, label: 'Thư viện tài liệu', href: '/student/library' },
  { icon: Award, label: 'Thành tích & Chứng chỉ', href: '/student/certificates' },
]

export const StudentSidebar: React.FC = () => {
  const pathname = usePathname()

  return (
    <aside className="w-[280px] h-screen fixed left-0 top-0 flex flex-col py-8 px-6 border-r border-[var(--border)] dark:bg-[#111111] bg-[#f3f4ef] z-40">
      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-xl font-bold tracking-tighter text-[#1B4D2E] dark:text-[#1B4D2E]">
          INSPIRING HR
        </h1>
        <p className="font-['Inter'] tracking-widest uppercase text-xs opacity-60 font-medium mt-1 text-[#1B4D2E] dark:text-[#1B4D2E]">
          HỆ THỐNG LMS CAO CẤP
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/student')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-transform duration-200 ${
                isActive
                  ? 'bg-[#1B4D2E] text-white font-semibold scale-[0.98]'
                  : 'text-[#191c19] dark:text-[#e7e9e4] opacity-80 hover:bg-[#e7e9e4] dark:hover:bg-[#1A1A1A] hover:opacity-100 transition-colors'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-white' : ''} />
              <span className="font-['Inter'] text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Navigation */}
      <div className="mt-auto pt-8">
        <Link
          href="/student/support"
          className="flex items-center gap-4 px-4 py-3 rounded-lg text-[#191c19] dark:text-[#e7e9e4] opacity-80 hover:bg-[#e7e9e4] dark:hover:bg-[#1A1A1A] hover:opacity-100 transition-colors"
        >
          <HelpCircle size={20} />
          <span className="font-['Inter'] text-sm">Hỗ trợ</span>
        </Link>
      </div>
    </aside>
  )
}
