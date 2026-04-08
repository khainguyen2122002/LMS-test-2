import React from 'react'
import { User, ArrowRight, CheckCircle, Award, Plus } from 'lucide-react'
import Link from 'next/link'

export interface MyCourseCardProps {
  id: string
  title: string
  category: string
  categoryColors: { bg: string, text: string }
  instructor: string
  progress: number
  lessonsLeft?: number
  totalLessons?: number
  imageUrl: string
  state: 'learning' | 'finished' | 'empty' | 'not_started'
}

export const MyCourseCard: React.FC<MyCourseCardProps> = ({
  id, title, category, categoryColors, instructor, progress, lessonsLeft, imageUrl, state
}) => {
  if (state === 'empty') {
    return (
      <div className="border-2 border-dashed border-[#c1c9bf]/40 dark:border-white/20 rounded-3xl md:rounded-[2rem] flex flex-col items-center justify-center p-8 text-center group cursor-pointer hover:border-[#1b4d2e]/40 dark:hover:border-[#9ed3aa]/40 transition-colors h-full min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-[#e7e9e4] dark:bg-[#2a2a2a] flex items-center justify-center mb-4 group-hover:bg-[#1b4d2e]/10 dark:group-hover:bg-[#9ed3aa]/10 transition-colors">
          <Plus className="w-8 h-8 text-[#414942] dark:text-[#9ca3af]" />
        </div>
        <h4 className="font-bold text-[#191c19] dark:text-white text-lg">Khám phá khóa học mới</h4>
        <p className="text-[#414942] dark:text-[#9ca3af] text-sm mt-2 max-w-[200px]">
          Tìm kiếm những kiến thức HR mới nhất dành cho bạn.
        </p>
      </div>
    )
  }

  if (state === 'finished') {
    return (
      <div className="bg-[#f3f4ef]/50 dark:bg-[#1C1B1B]/50 border border-[#c1c9bf]/20 dark:border-white/10 rounded-3xl md:rounded-[2rem] overflow-hidden flex flex-col group opacity-90 grayscale-[0.3]">
        <div className="relative aspect-video overflow-hidden">
          <img 
            alt={title} 
            className="w-full h-full object-cover" 
            src={imageUrl} 
          />
          <div className="absolute inset-0 bg-[#00361a]/20 dark:bg-black/40 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-[#00361a] dark:bg-[#9ed3aa] text-white dark:text-[#01391c] font-bold px-6 py-2 rounded-full text-sm uppercase tracking-widest shadow-xl flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Đã hoàn thành
            </span>
          </div>
        </div>
        <div className="p-8 flex flex-col flex-1 dark:bg-[#1a1a1a] bg-white">
          <h3 className="text-xl font-bold text-[#191c19] dark:text-white mb-2 leading-tight">
            {title}
          </h3>
          <p className="text-[#414942] dark:text-[#9ca3af] text-sm mb-6 flex items-center gap-2">
             <User className="w-4 h-4" /> {instructor}
          </p>
          <div className="mt-auto">
            <button className="w-full py-3 border-2 border-[#1b4d2e] dark:border-[#9ed3aa] text-[#1b4d2e] dark:text-[#9ed3aa] font-bold rounded-full flex items-center justify-center gap-2 hover:bg-[#1b4d2e] hover:text-white dark:hover:bg-[#9ed3aa] dark:hover:text-[#01391c] transition-all">
              <Award className="w-5 h-5" /> Xem chứng chỉ
            </button>
          </div>
        </div>
      </div>
    )
  }

  // learning state
  return (
    <div className="dark:bg-[#1a1a1a] bg-white rounded-3xl md:rounded-[2rem] overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-[#191c19]/5 border border-[var(--border)] transition-all duration-300">
      <div className="relative aspect-video overflow-hidden">
        <img 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          src={imageUrl} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-6">
          <span className={`${categoryColors.bg} ${categoryColors.text} text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider`}>
            {category}
          </span>
        </div>
      </div>
      <div className="p-8 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-[#191c19] dark:text-white mb-2 leading-tight">
          {title}
        </h3>
        <p className="text-[#414942] dark:text-[#9ca3af] text-sm mb-6 flex items-center gap-2">
          <User className="w-4 h-4" /> {instructor}
        </p>
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[#414942] dark:text-[#d1d5db] uppercase tracking-tighter">
              TIẾN ĐỘ: {progress}%
            </span>
            <span className="text-xs font-medium text-[#414942] dark:text-[#9ca3af]">
              {lessonsLeft} bài còn lại
            </span>
          </div>
          <div className="w-full h-2 bg-[#cfe5d1] dark:bg-[#2a2a2a] rounded-full overflow-hidden mb-8">
            <div 
              className="h-full bg-[#f0a01b] rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <Link href={`/courses/${id}`}>
            <button className="w-full py-4 bg-[#f0a01b] hover:bg-[#e09015] text-[#191c19] font-bold rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#f0a01b]/20">
              Tiếp tục học
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
