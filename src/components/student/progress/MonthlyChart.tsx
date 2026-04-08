import React from 'react'

export interface MonthlyActivityData {
  month: string
  hours: number
  isCurrent: boolean
}

interface MonthlyChartProps {
  data: MonthlyActivityData[]
  maxHours: number // For scaling the chart
}

export const MonthlyChart: React.FC<MonthlyChartProps> = ({ data, maxHours }) => {
  return (
    <div className="flex-1 flex items-end justify-between gap-2 px-4 h-48 w-full mt-8">
      {data.map((item, idx) => {
        const heightPercent = Math.min(100, Math.max(5, (item.hours / maxHours) * 100))
        const barContainerClasses = item.hours > 0 
          ? "w-full bg-[#1b4d2e]/20 dark:bg-[#9ed3aa]/10 rounded-full relative overflow-hidden flex flex-col justify-end" 
          : "w-full bg-[#e7e9e4]/40 dark:bg-[#333]/40 rounded-full"
        
        let fillClasses = ""
        if (item.isCurrent) {
          fillClasses = "bg-gradient-to-t from-[#1b4d2e] to-[#00361a] dark:from-[#0a1e12] dark:to-[#012613]"
        } else if (item.hours > 0) {
          fillClasses = "bg-[#1b4d2e] dark:bg-[#9ed3aa]"
        }

        // The exact UI has varying max heights for container itself maybe?
        // Let's just fix the container height to 100% of parent flex and fill internal height.
        return (
          <div key={idx} className="w-full h-full flex flex-col items-center justify-end gap-3 group relative cursor-pointer">
            {/* Tooltip on hover */}
            <div className="absolute -top-8 bg-[#191c19] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {item.hours} giờ
            </div>

            <div className={`${barContainerClasses} transition-all duration-300 hover:opacity-80`} style={{ height: '80%' }}>
              {item.hours > 0 && (
                <div 
                  className={`w-full rounded-b-full transition-all duration-1000 ease-out ${fillClasses}`} 
                  style={{ height: `${heightPercent}%` }}
                ></div>
              )}
            </div>
            
            <span className={`text-[10px] uppercase tracking-widest ${item.isCurrent ? 'font-bold text-[#00361a] dark:text-[#9ed3aa]' : 'font-medium text-[#717971] dark:text-[#9ca3af]'}`}>
              {item.month}
            </span>
          </div>
        )
      })}
    </div>
  )
}
