import React, { useState, useEffect } from 'react'
import { ArrowLeft, Moon, Sun, Bell, Award } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

interface LearningTopNavProps {
  lessonTitle: string
}

export const LearningTopNav: React.FC<LearningTopNavProps> = ({ lessonTitle }) => {
  const [isDark, setIsDark] = useState(true)
  const { profile } = useAuth()
  
  const userName = profile?.fullName || "KHÁI NGUYỄN HOÀNG"
  
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      setIsDark(true)
    }
  }

  return (
    <header className="flex justify-between items-center w-full px-8 py-4 bg-[#111111]/90 backdrop-blur-xl sticky top-0 z-30 border-b border-[#c1c9bf]/10">
      <div className="flex items-center gap-4">
        <Link href="/student/courses">
          <button className="p-2 hover:bg-[#1A1A1A] rounded-full transition-colors text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div className="h-6 w-[1px] bg-[#c1c9bf]/20 mx-2"></div>
        <h3 className="text-sm font-medium tracking-tight text-white line-clamp-1">{lessonTitle}</h3>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-[#1A1A1A] rounded-full transition-colors text-white/70 hover:text-white"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button className="p-2 hover:bg-[#1A1A1A] rounded-full transition-colors relative text-white/70 hover:text-white">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#ffb957] rounded-full animate-pulse"></span>
          </button>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1 bg-[#422800]/50 rounded-full">
          <Award className="w-4 h-4 text-[#ffb957]" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#ffb957]">1200 XP</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-white uppercase">{userName}</p>
            <p className="text-[9px] text-white/50 uppercase">HỌC VIÊN PREMIUM</p>
          </div>
          {profile?.avatar ? (
            <img 
              alt={userName} 
              className="w-8 h-8 rounded-full object-cover" 
              src={profile.avatar}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#1b4d2e] flex items-center justify-center text-white text-xs font-bold">
              {userName.charAt(0)}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
