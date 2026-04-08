import React from 'react'
import { Users, Clock, BrainCircuit, Trophy, LucideIcon } from 'lucide-react'

export interface AchievementBadgeProps {
  id: string
  name: string
  date?: string // if provided, it's unlocked
  iconStr: 'groups' | 'schedule' | 'psychology' | 'leaderboard'
  unlocked: boolean
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  name, date, iconStr, unlocked
}) => {
  const getIcon = () => {
    switch(iconStr) {
      case 'groups': return <Users className="w-8 h-8" />
      case 'schedule': return <Clock className="w-8 h-8" />
      case 'psychology': return <BrainCircuit className="w-8 h-8" />
      case 'leaderboard': return <Trophy className="w-8 h-8" />
      default: return <Trophy className="w-8 h-8" />
    }
  }

  if (!unlocked) {
    return (
      <div className="flex flex-col items-center text-center group opacity-40 grayscale transition-all hover:scale-105">
        <div className="w-24 h-24 rounded-full border-4 border-dashed border-[#c1c9bf] dark:border-[#444] text-[#c1c9bf] dark:text-[#555] flex items-center justify-center mb-4">
          {getIcon()}
        </div>
        <span className="font-bold text-sm text-[#191c19] dark:text-white">{name}</span>
        <span className="text-[10px] font-bold text-[#717971] dark:text-[#9ca3af] mt-1 uppercase tracking-widest">
          Chưa mở khóa
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center text-center group cursor-pointer">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00361a] to-[#1b4d2e] dark:from-[#012613] dark:to-[#0a1e12] flex items-center justify-center mb-4 text-[#f0a01b] group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(240,160,27,0.2)]">
        {getIcon()}
      </div>
      <span className="font-bold text-sm text-[#191c19] dark:text-white">{name}</span>
      <span className="text-[10px] font-bold text-[#717971] dark:text-[#9ca3af] mt-1 uppercase tracking-widest">
        Đã đạt: {date}
      </span>
    </div>
  )
}
