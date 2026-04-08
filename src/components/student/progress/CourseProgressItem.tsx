import React from 'react'
import Link from 'next/link'
import { Clock, Star } from 'lucide-react'

export interface CourseProgressItemProps {
  id: string
  title: string
  category: string
  progress: number
  hoursLearned: string
  avgScore: number
  imageUrl: string
}

export const CourseProgressItem: React.FC<CourseProgressItemProps> = ({
  id, title, category, progress, hoursLearned, avgScore, imageUrl
}) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="bg-white dark:bg-[#1a1a1a] border border-[#c1c9bf]/20 dark:border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8 transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-[#00361a]/5 dark:hover:shadow-white/5 cursor-pointer">
        <div className="w-full md:w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
          <img 
            alt={title} 
            className="w-full h-full object-cover" 
            src={imageUrl} 
          />
        </div>
        
        <div className="flex-1 w-full">
          <span className="text-[10px] text-[#422800] dark:text-[#ffb957] font-bold tracking-widest uppercase">
            {category}
          </span>
          <h4 className="text-xl font-bold mt-1 text-[#191c19] dark:text-white leading-tight">
            {title}
          </h4>
          <div className="mt-4 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#f3f4ef] dark:bg-[#2a2a2a] rounded-full">
              <Clock className="w-4 h-4 text-[#717971] dark:text-[#9ca3af]" />
              <span className="text-xs font-semibold text-[#414942] dark:text-[#d1d5db]">
                {hoursLearned} đã học
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-[#f3f4ef] dark:bg-[#2a2a2a] rounded-full">
              <Star className="w-4 h-4 text-[#717971] dark:text-[#9ca3af]" />
              <span className="text-xs font-semibold text-[#414942] dark:text-[#d1d5db]">
                Điểm trung bình: {avgScore.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-64 pt-4 md:pt-0">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[#717971] dark:text-[#9ca3af] tracking-widest uppercase">
              TIẾN ĐỘ
            </span>
            <span className="text-xs font-extrabold text-[#00361a] dark:text-[#9ed3aa]">
              {progress}%
            </span>
          </div>
          <div className="h-2 w-full bg-[#cfe5d1] dark:bg-[#2a2a2a] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#ffb957] rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  )
}
