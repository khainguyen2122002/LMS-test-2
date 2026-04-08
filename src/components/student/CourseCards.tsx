import React from 'react'
import { PlayCircle, Clock, Bookmark, Star } from 'lucide-react'
import Link from 'next/link'

interface ContinuingCourseCardProps {
  id: string
  title: string
  subtitle: string
  imageUrl: string
  progress: number // 0 to 100
  lessonsCompleted: number
  lessonsTotal: number
  timeLeftStr: string
  nextLessonTitle: string
}

export const ContinuingCourseCard: React.FC<ContinuingCourseCardProps> = ({
  id,
  title,
  subtitle,
  imageUrl,
  progress,
  lessonsCompleted,
  lessonsTotal,
  timeLeftStr,
  nextLessonTitle
}) => {
  // SVG Circle calculation
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="dark:bg-[#1a1a1a] bg-white rounded-[2rem] overflow-hidden flex flex-col md:flex-row group transition-all duration-300 hover:shadow-xl hover:shadow-[#191c19]/5 border border-[var(--border)]">
      <div className="md:w-2/5 relative overflow-hidden h-64 md:h-auto">
        <img 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          src={imageUrl} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 md:hidden">
          <h4 className="text-white font-bold text-xl">{title}</h4>
        </div>
      </div>
      
      <div className="md:w-3/5 p-8 flex flex-col justify-between space-y-6">
        <div className="flex justify-between items-start gap-4">
          <div className="hidden md:block">
            <span className="text-[10px] font-bold text-[#00361a] dark:text-[#9ed3aa] uppercase tracking-[0.2em] mb-2 block">
              {subtitle}
            </span>
            <h4 className="text-2xl font-extrabold text-[#191c19] dark:text-white leading-tight">
              {title}
            </h4>
          </div>
          
          {/* Circular Progress */}
          <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full -rotate-90 transform origin-center">
              <circle 
                className="text-[#edeee9] dark:text-[#2a2a2a] stroke-current" 
                cx="32" cy="32" r={radius} 
                fill="transparent" strokeWidth="4" 
              />
              <circle 
                className="text-[#f0a01b] stroke-current transition-all duration-500 ease-out" 
                cx="32" cy="32" r={radius} 
                fill="transparent" strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round" 
              />
            </svg>
            <span className="absolute text-xs font-bold dark:text-white">{progress}%</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-6 text-sm text-[#717971] dark:text-[#9ca3af]">
            <span className="flex items-center gap-1.5 font-medium">
              <PlayCircle className="w-4 h-4" /> {lessonsCompleted}/{lessonsTotal} Bài học
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4" /> {timeLeftStr} còn lại
            </span>
          </div>
          <p className="text-[#414942] dark:text-[#d1d5db] text-sm leading-relaxed">
            Bài học tiếp theo:{' '}
            <span className="font-bold text-[#191c19] dark:text-white">
              {nextLessonTitle}
            </span>
          </p>
        </div>

        <div className="flex gap-4">
          <Link href={`/courses/${id}`} className="flex-1">
            <button className="w-full bg-[#00361a] dark:bg-[#9ed3aa] text-white dark:text-[#01391c] py-3 rounded-xl font-bold text-sm tracking-wide shadow-md hover:opacity-90 transition-opacity">
              TIẾP TỤC HỌC
            </button>
          </Link>
          <button className="px-4 bg-[#e7e9e4] dark:bg-[#2a2a2a] rounded-xl text-[#00361a] dark:text-[#9ed3aa] hover:bg-[#d9dbd6] dark:hover:bg-[#333] transition-colors">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

interface SuggestedCourseCardProps {
  id: string
  title: string
  category: string
  imageUrl: string
  instructor: string
  rating: number
}

export const SuggestedCourseCard: React.FC<SuggestedCourseCardProps> = ({
  id,
  title,
  category,
  imageUrl,
  instructor,
  rating
}) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="dark:bg-[#1a1a1a] bg-white p-4 rounded-3xl space-y-4 group cursor-pointer border border-[#c1c9bf]/30 dark:border-white/10 hover:border-[#00361a]/30 dark:hover:border-[#9ed3aa]/50 transition-all">
        <div className="relative h-40 overflow-hidden rounded-2xl">
          <img 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            src={imageUrl} 
          />
          <span className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-bold text-[#00361a] dark:text-[#9ed3aa] tracking-widest">
            {category}
          </span>
        </div>
        <div className="space-y-2 px-1">
          <h5 className="font-bold text-[#191c19] dark:text-white group-hover:text-[#00361a] dark:group-hover:text-[#9ed3aa] transition-colors line-clamp-2 leading-tight">
            {title}
          </h5>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-[#717971] dark:text-[#9ca3af] font-medium truncate pr-2">
              {instructor}
            </span>
            <span className="text-xs font-bold text-[#f0a01b] flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" /> {rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
