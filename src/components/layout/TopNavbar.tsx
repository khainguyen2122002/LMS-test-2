"use client"

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Bell } from 'lucide-react'
import { DashboardContent } from '@/lib/content'
import { useNotifications } from '@/components/notifications/NotificationProvider'
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

interface TopNavbarProps {
  content: DashboardContent['topNav']
}

const NAV_LINKS = [
  { label: 'Trang chủ', href: '/',        activeOn: ['/'] },
  { label: 'Khóa học',  href: '/courses', activeOn: ['/courses'] },
  { label: 'Thư viện',  href: '/library', activeOn: ['/library'] },
]

export const TopNavbar: React.FC<TopNavbarProps> = ({ content }) => {
  const pathname = usePathname()
  const { unreadCount } = useNotifications()
  const [notifOpen, setNotifOpen] = useState(false)
  const toggleNotif = useCallback(() => setNotifOpen((v) => !v), [])
  const closeNotif = useCallback(() => setNotifOpen(false), [])

  return (
    <header className="fixed top-0 right-0 left-[260px] h-16 bg-[#111111]/80 dark:bg-[#111111]/80 light:bg-white/80 backdrop-blur-xl flex justify-between items-center px-8 z-40 shadow-2xl shadow-black/20 dark:shadow-black/20 light:shadow-black/5 transition-colors duration-300">
      {/* Left: Navigation links */}
      <div className="flex items-center gap-8">
        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isActive = link.activeOn.includes(pathname)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`pb-1 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-emerald-400 dark:text-emerald-400 border-b-2 border-emerald-400'
                    : 'dark:text-neutral-400 light:text-neutral-500 dark:dark:text-neutral-400 light:text-neutral-500 light:text-neutral-500 hover:text-neutral-100 dark:hover:text-neutral-100 light:hover:text-neutral-800'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Right: Search + Theme + Notifications + Avatar */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <input
            type="text"
            placeholder={content.searchPlaceholder}
            className="dark:bg-[#1c1b1b] light:bg-white dark:dark:bg-[#1c1b1b] light:bg-white light:bg-neutral-100 border-none rounded-full py-2 pl-10 pr-4 text-sm dark:dark:text-white light:text-neutral-900 light:text-neutral-900 w-64 focus:ring-1 focus:ring-emerald-500/50 transition-all dark:placeholder:text-neutral-600 light:placeholder:dark:text-neutral-400 light:text-neutral-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* 🎨 Theme Toggle */}
          <ThemeToggle />

          {/* 🔔 Notification Bell */}
          <div className="relative">
            <button
              onClick={toggleNotif}
              className={`relative p-1.5 rounded-lg transition-all ${
                notifOpen
                  ? 'text-emerald-400 bg-white/5 dark:bg-white/5 light:bg-black/5'
                  : 'dark:text-neutral-400 light:text-neutral-500 hover:text-emerald-300 opacity-80 hover:opacity-100 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5'
              }`}
              aria-label="Thông báo"
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold rounded-full bg-[#F9A825] text-[#2a1800] px-1 shadow-lg shadow-amber-500/30 animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <NotificationDropdown open={notifOpen} onClose={closeNotif} />
          </div>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center text-xs font-bold text-emerald-400 border border-emerald-400/20 cursor-pointer hover:border-emerald-400/40 transition-colors">
            K
          </div>
        </div>
      </div>
    </header>
  )
}
