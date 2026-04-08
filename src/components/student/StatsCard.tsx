import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle: string
  icon?: LucideIcon
  subtitleColor?: string
  valueColor?: string
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  subtitleColor = "text-[#00361a] dark:text-[#9ed3aa]",
  valueColor = "text-[#191c19] dark:text-white"
}) => {
  return (
    <div className="dark:bg-[#1a1a1a] bg-white p-6 rounded-2xl flex flex-col gap-1 hover:bg-[#edeee9] dark:hover:bg-[#222222] transition-colors border border-[var(--border)] group">
      <span className="text-[#717971] text-[10px] font-bold uppercase tracking-widest">
        {title}
      </span>
      <div className="flex items-baseline gap-2 mt-1">
        <span className={`text-3xl font-extrabold ${valueColor}`}>{value}</span>
        <span className={`text-xs font-medium flex items-center gap-1 ${subtitleColor}`}>
          {Icon && <Icon className="w-3 h-3" />}
          {subtitle}
        </span>
      </div>
    </div>
  )
}
