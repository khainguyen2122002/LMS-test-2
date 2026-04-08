import React from 'react'
import { LucideIcon } from 'lucide-react'

export interface ActivityItemProps {
  icon: LucideIcon
  title: string
  subtitle: string
  timeStr: string
  iconColorClass: string
  iconBgClass: string
  isLast?: boolean
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  icon: Icon,
  title,
  subtitle,
  timeStr,
  iconColorClass,
  iconBgClass,
  isLast = false
}) => {
  return (
    <div className="flex gap-4 relative">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-4 top-10 bottom-[-24px] w-px bg-[#c1c9bf]/30 dark:bg-white/10"></div>
      )}
      
      {/* Icon */}
      <div className={`w-8 h-8 rounded-full ${iconBgClass} flex items-center justify-center flex-shrink-0 relative z-10`}>
        <Icon className={`w-4 h-4 ${iconColorClass}`} />
      </div>
      
      {/* Content */}
      <div className="space-y-1 pb-2">
        <p className="text-sm font-semibold text-[#191c19] dark:text-white leading-tight">
          {title}
        </p>
        <p className="text-xs text-[#414942] dark:text-[#9ca3af]">
          {subtitle}
        </p>
        <p className="text-[10px] text-[#717971] uppercase tracking-wider mt-1">
          {timeStr}
        </p>
      </div>
    </div>
  )
}
