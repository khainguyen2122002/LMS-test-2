"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BarChart3,
  Settings,
  HelpCircle,
  LucideIcon
} from 'lucide-react'
import { DashboardContent } from '@/lib/content'
import { useSettings } from '@/components/settings/SettingsProvider'

interface NavItem {
  icon: LucideIcon
  label: string
  href: string
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Bảng điều khiển', href: '/' },
  { icon: Users, label: 'Quản lý người dùng', href: '/users' },
  { icon: GraduationCap, label: 'Khóa học', href: '/courses' },
  { icon: BarChart3, label: 'Báo cáo', href: '/reports' },
  { icon: Settings, label: 'Cài đặt hệ thống', href: '/settings' },
  { icon: HelpCircle, label: 'Hỗ trợ', href: '/support' },
]

interface SidebarProps {
  content: DashboardContent['sidebar']
}

export const Sidebar: React.FC<SidebarProps> = ({ content }) => {
  const pathname = usePathname()
  const { config } = useSettings()

  return (
    <aside
      className="w-[260px] h-screen fixed left-0 top-0 flex flex-col py-6 z-50 transition-colors duration-300"
      style={{ background: 'var(--sidebar-bg)' }}
    >
      {/* Logo */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          {config.logoUrl ? (
            <img src={config.logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded-lg flex-shrink-0 bg-white" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-[#F9A825] flex items-center justify-center flex-shrink-0">
              <GraduationCap size={20} className="text-black" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-[#F9A825] uppercase tracking-tight leading-none truncate" title={config.platformName}>
              {config.platformName}
            </h1>
            <p className="text-[10px] dark:text-neutral-500 light:text-neutral-500 font-medium tracking-widest uppercase mt-0.5 line-clamp-2" title={config.slogan}>
              {config.slogan}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 ${
                isActive
                  ? 'bg-[#1B4D2E] dark:text-white light:text-neutral-900 font-semibold shadow-lg shadow-emerald-900/20'
                  : 'dark:dark:text-neutral-400 light:text-neutral-500 dark:hover:dark:text-white light:text-neutral-900 dark:hover:bg-neutral-800 light:text-neutral-500 light:hover:text-neutral-900 light:hover:bg-neutral-100'
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Admin User Card */}
      <div className="px-4 mt-4">
        <div className="dark:bg-neutral-800/50 light:bg-neutral-100 p-4 rounded-xl flex items-center gap-3 transition-colors">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeagBNV8w8jJ6UB6Bdyc_N6TqVGoIgDnKaFYbdg_TUjjM3gTOCMLZqj8y_E9rMd90Ife-XH-3r35BMZkrGMFUhdCU8aMm8FONLwmZ4-bFzAGVX6CYrCias7ydqxdKA7xCP5nVQSmrD7Kdg1j_5JzMAm4IieUGnEfM9ZhwcbpsR_Hv8iGfZv6ZbI09DlLj2T3C88mw0l69sQiqIfCnIvOegbFqWWFV9VvtkHg2xP4oFXXPXGJGGGs5X3hSRfReSt2dWhw2QCzfVm80"
            alt="Admin Avatar"
            className="w-10 h-10 rounded-full dark:border-neutral-700 light:border-neutral-200 border flex-shrink-0"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate dark:dark:text-white light:text-neutral-900 light:text-neutral-900">{content.user.role}</p>
            <p className="text-[10px] dark:text-neutral-500 light:dark:text-neutral-400 light:text-neutral-500 truncate">admin@inspiringhr.vn</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
