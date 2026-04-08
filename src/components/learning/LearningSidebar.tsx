import React, { useState } from 'react'
import { GraduationCap, ChevronDown, ChevronUp, CheckCircle, PlayCircle, Lock } from 'lucide-react'
import { CourseData, Lesson } from './types'

interface LearningSidebarProps {
  course: CourseData
  currentLessonId: string
  onSelectLesson: (lessonId: string) => void
}

export const LearningSidebar: React.FC<LearningSidebarProps> = ({ course, currentLessonId, onSelectLesson }) => {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    // Expand the first module by default
    if (course.modules.length > 0) {
      return { [course.modules[0].id]: true }
    }
    return {}
  })

  const toggleModule = (id: string) => {
    if (course.modules.find(m => m.id === id)?.isLocked) return
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const progressPercent = Math.round((course.completedLessons / course.totalLessons) * 100) || 0

  return (
    <aside className="w-80 h-full bg-[#111111] flex flex-col border-r border-[#c1c9bf]/10 z-40 flex-shrink-0 text-[#f9faf5]">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <GraduationCap className="h-8 w-8 text-[#1B4D2E] dark:text-[#9ed3aa]" />
          <div>
            <h1 className="text-xs font-bold tracking-widest text-[#1B4D2E] dark:text-[#9ed3aa] uppercase">
              INSPIRING HR
            </h1>
            <p className="text-[10px] opacity-50 font-medium">HỆ THỐNG LMS CAO CẤP</p>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-sm font-semibold mb-2">{course.title}</h2>
          <div className="h-1 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#ffb957] transition-all duration-1000 ease-out" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-[10px] mt-2 opacity-60 uppercase tracking-wider font-bold text-[#ffb957]">
            TIẾN ĐỘ: {progressPercent}% HOÀN THÀNH
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-2 no-scrollbar pb-8">
        {course.modules.map(module => {
          const isExpanded = expandedModules[module.id]
          const isLocked = module.isLocked

          return (
            <div key={module.id} className="space-y-1">
              <button 
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center justify-between p-3 bg-[#1A1A1A] rounded-xl text-left hover:bg-[#222]"
              >
                <span className={`text-xs font-bold uppercase tracking-wider ${isLocked ? 'text-[#f9faf5] opacity-50' : 'text-[#f9faf5]'}`}>
                  {module.title}
                </span>
                {isLocked ? (
                  <Lock className="w-4 h-4 text-[#717971]" />
                ) : isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              
              {isExpanded && !isLocked && (
                <div className="pl-2 space-y-1 mt-1">
                  {module.lessons.map(lesson => {
                    const isCurrent = currentLessonId === lesson.id
                    return (
                      <div 
                        key={lesson.id}
                        onClick={() => !lesson.isLocked && onSelectLesson(lesson.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          lesson.isLocked 
                            ? 'text-[#f9faf5] opacity-40 cursor-not-allowed' 
                            : isCurrent 
                              ? 'bg-[#1B4D2E] text-white font-semibold cursor-default border-l-2 border-[#ffb957]' 
                              : 'text-[#f9faf5] opacity-80 hover:bg-[#1A1A1A] cursor-pointer'
                        }`}
                      >
                        {lesson.isLocked ? (
                          <Lock className="w-4 h-4 flex-shrink-0 text-[#717971]" />
                        ) : lesson.isCompleted ? (
                          <CheckCircle className={`w-4 h-4 flex-shrink-0 ${isCurrent ? 'text-white' : 'text-[#9ed3aa]'}`} strokeWidth={3} />
                        ) : (
                          <PlayCircle className="w-4 h-4 flex-shrink-0" />
                        )}
                        <span className="text-sm leading-tight flex-1">{lesson.title}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
