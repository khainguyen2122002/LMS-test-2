"use client"

import React from 'react'
import { Clock, BookOpen, ArrowRight } from 'lucide-react'
import { DashboardContent } from '@/lib/content'

interface CourseCardProps {
    content: DashboardContent['currentCourse']
}

export const CourseCard: React.FC<CourseCardProps> = ({ content }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h3 className="text-xl font-bold dark:text-white light:text-neutral-900 tracking-tight">{content.sectionTitle}</h3>
                    <p className="text-neutral-500 text-sm mt-1">{content.sectionSub}</p>
                </div>
                <a className="text-emerald-400 text-sm font-medium hover:underline" href="#">Xem tất cả</a>
            </div>
            
            <div className="dark:bg-[#1A1A1A] light:bg-white rounded-xl overflow-hidden group cursor-pointer border border-[var(--border)] hover:border-emerald-500/30 transition-all duration-300 shadow-xl">
                <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-2/5 relative h-48 md:h-auto overflow-hidden">
                        <img 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBz3mH3uWtGD_WnJyboC0OPMY9OLwVdTIzAYrlY4IKMn3Z4-n2AkfAYCumboDRNxOuzskKmZWaDE2p4raCiCZ6Tqa6HxiajYZUUXFyTmcrpQgInH_YM8bllJ03tFDwIUWTEm_HYTYimiWvB_7w8JBA8VQ0obTsvbIljCgVKc6ZW9UADs5JWh-Tjsg7HH9LwvQD5smmDvwiEp9fWKsRx2ZZataghysp2p0t4SLZw6x1514PSDy2rhGN8OwMjVfHgPAD-tAr6iG_R_0" 
                            alt={content.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4">
                            <span className="bg-emerald-500 dark:text-white light:text-neutral-900 text-[10px] font-bold px-2 py-1 rounded">
                                {content.badge}
                            </span>
                        </div>
                    </div>
                    <div className="md:w-3/5 p-8 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="text-2xl font-bold dark:text-white light:text-neutral-900 leading-tight">{content.title}</h4>
                            <span className="text-emerald-400 font-bold">{content.progress}%</span>
                        </div>
                        <p className="dark:text-neutral-400 light:text-neutral-500 text-sm mb-8 line-clamp-2 leading-relaxed">
                            {content.description}
                        </p>
                        <div className="mt-auto">
                            <div className="w-full h-1 bg-surface-container-low rounded-full mb-6 relative overflow-hidden">
                                <div 
                                    className="h-full bg-emerald-500 rounded-full" 
                                    style={{ width: `${content.progress}%` }}
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-neutral-500 text-xs">
                                        <Clock size={16} />
                                        <span>{content.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-neutral-500 text-xs">
                                        <BookOpen size={16} />
                                        <span>{content.lessons} Bài học</span>
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 dark:text-white light:text-neutral-900 font-bold text-sm bg-emerald-900/50 hover:bg-emerald-800 px-4 py-2 rounded-lg transition-colors">
                                    {content.actionBtn} <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
