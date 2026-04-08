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
import { useSettings } from '@/components/settings/SettingsProvider'
import { useAuth } from '@/hooks/useAuth'
import { DashboardContent } from '@/lib/content'

interface NavItem {
  icon: LucideIcon
  label: string
  href: string
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Bảng điều khiển', href: '/admin/dashboard' },
  { icon: Users, label: 'Quản lý người dùng', href: '/admin/users' },
  { icon: GraduationCap, label: 'Khóa học', href: '/admin/courses' },
  { icon: BarChart3, label: 'Báo cáo', href: '/admin/reports' },
  { icon: Settings, label: 'Cài đặt hệ thống', href: '/admin/settings' },
  { icon: HelpCircle, label: 'Hỗ trợ', href: '/support' },
]

interface SidebarProps {
  content: DashboardContent['sidebar']
}

export const Sidebar: React.FC<SidebarProps> = React.memo(({ content }) => {
  const pathname = usePathname()
  const { config } = useSettings()
  const { profile } = useAuth()

  const roleLabelVN = {
    admin: 'Quản trị viên',
    instructor: 'Giảng viên',
    learner: 'Học viên'
  }

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
          // RBAC logic for Instructor
          if (profile?.role === 'instructor') {
            if (item.href === '/admin/reports' || item.href === '/admin/settings') {
              return null
            }
          }

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

      {/* Admin User Card (Dynamic) */}
      <div className="px-4 mt-auto mb-2 pt-4 border-t border-[var(--border)]">
        <div className="dark:bg-[#1a1a1a] light:bg-neutral-100 p-3 rounded-2xl flex items-center gap-3 transition-all hover:bg-[var(--input-bg)] group cursor-pointer border border-[var(--border)]">
          <div className="relative flex-shrink-0">
            {profile?.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.fullName}
                className="w-10 h-10 rounded-full object-cover border border-[var(--border)] shadow-sm group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B4D2E] to-[#0A2F1A] border border-[var(--border)] flex items-center justify-center font-bold text-white shadow-sm group-hover:scale-105 transition-transform uppercase tracking-tighter text-xs">
                {profile?.fullName?.split(' ').pop()?.charAt(0) || 'A'}
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-sidebar-bg rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </div>
          
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate dark:text-white light:text-neutral-900 leading-tight">
              {profile?.fullName || 'Người dùng'}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#F9A825] bg-[#F9A825]/10 px-1 py-0.5 rounded leading-none">
                    {profile ? roleLabelVN[profile.role as keyof typeof roleLabelVN] : 'Admin'}
                </span>
            </div>
            <p className="text-[10px] dark:text-neutral-500 light:text-neutral-400 truncate mt-1">
                {profile?.email || 'admin@inspiringhr.vn'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
})
