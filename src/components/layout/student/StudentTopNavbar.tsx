"use client"

import React from 'react'
import { Search, Moon, Sun, Bell } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAuth } from '@/hooks/useAuth'

export const StudentTopNavbar: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const { profile } = useAuth()
  
  // Use user name or fallback
  const userName = profile?.fullName || "KHÁI NGUYỄN HOÀNG"
  // Provide initial K or first letter
  const userInitials = userName.charAt(0).toUpperCase()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="flex justify-between items-center w-full px-8 py-4 bg-[#f9faf5]/80 dark:bg-[#111111]/80 backdrop-blur-xl sticky top-0 z-30 transition-colors duration-300">
      {/* Search Input */}
      <div className="flex items-center flex-1 max-w-xl dark:bg-[#2a2a2a] bg-[#e7e9e4] rounded-full px-4 py-2">
        <Search className="w-4 h-4 text-[#717971] mr-2 flex-shrink-0" />
        <input 
          className="bg-transparent border-none outline-none focus:ring-0 text-sm w-full placeholder:text-[#717971] dark:text-white" 
          placeholder="Tìm kiếm khóa học, tài liệu..." 
          type="text" 
        />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-[#edeee9] dark:hover:bg-[#2a2a2a] rounded-full transition-colors text-neutral-600 dark:text-neutral-300"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button className="p-2 hover:bg-[#edeee9] dark:hover:bg-[#2a2a2a] rounded-full transition-colors relative text-neutral-600 dark:text-neutral-300">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#f0a01b] rounded-full animate-pulse"></span>
          </button>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-[#c1c9bf]/30"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold font-['Inter'] tracking-tight dark:text-white text-[#191c19] uppercase">
              {userName}
            </p>
            <p className="text-[10px] text-[#717971] uppercase tracking-widest mt-0.5">
              Premium Member
            </p>
          </div>
          
          {profile?.avatar ? (
            <img 
              alt={userName} 
              className="w-10 h-10 rounded-full object-cover border-2 border-[#1b4d2e]" 
              src={profile.avatar}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1b4d2e] to-[#01391c] flex items-center justify-center text-white font-bold border-2 border-[#1b4d2e]">
              {userInitials}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
