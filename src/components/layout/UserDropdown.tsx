"use client"

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { User, CreditCard, HelpCircle, LogOut, LogIn, GraduationCap } from 'lucide-react'

export const UserDropdown: React.FC = () => {
  const { user, profile, signOut, loading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-neutral-800 animate-pulse" />
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-[#1b4d2e] flex items-center justify-center text-sm font-bold text-[#b9efc5] border-2 border-[#1b4d2e]/20 hover:border-[#1b4d2e]/40 transition-all overflow-hidden"
      >
        {profile?.avatar ? (
          <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span>{profile?.fullName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || '?'}</span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-[#e7e9e4] dark:bg-[#2a2a2a] rounded-xl shadow-2xl border border-white/10 dark:border-white/5 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
          {user && (
            <div className="px-4 py-3 border-b border-neutral-500/10 mb-2">
              <p className="text-sm font-bold text-on-surface truncate">{profile?.fullName || 'Người dùng'}</p>
              <p className="text-xs text-neutral-500 truncate">{user.email}</p>
            </div>
          )}

          <div className="space-y-1 px-2">
            <Link 
              href="/profile" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface hover:bg-white/10 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <GraduationCap size={18} className="text-neutral-500" />
              Hồ sơ & Học tập
            </Link>
            <button 
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface hover:bg-white/10 transition-colors"
              disabled
            >
              <CreditCard size={18} className="text-neutral-500" />
              Tài khoản & Thanh toán
            </button>
            <button 
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface hover:bg-white/10 transition-colors"
              disabled
            >
              <HelpCircle size={18} className="text-neutral-500" />
              Hỗ trợ
            </button>

            <div className="h-px bg-neutral-500/10 my-2 mx-1" />

            {user ? (
              <button
                onClick={() => {
                  signOut()
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-[#ba1a1a] hover:bg-[#ba1a1a]/5 transition-colors"
              >
                <LogOut size={18} />
                Đăng xuất
              </button>
            ) : (
              <Link
                href="/login"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-[#00361a] dark:text-[#b9efc5] hover:bg-emerald-500/5 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <LogIn size={18} />
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
