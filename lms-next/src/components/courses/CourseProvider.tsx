"use client"

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react'
import { Course, getAllCourses } from '@/lib/course-service'
import { toast } from 'sonner'

export type CourseCategory = 'Tất cả' | 'Quản trị nhân sự' | 'Tuyển dụng' | 'Đào tạo & Phát triển' | 'Văn hóa doanh nghiệp' | 'Kỹ năng mềm'

interface CourseContextValue {
  courses: Course[]
  loading: boolean
  searchQuery: string
  activeCategory: CourseCategory
  filteredCourses: Course[]
  
  setSearchQuery: (query: string) => void
  setActiveCategory: (category: CourseCategory) => void
  refreshCourses: () => Promise<void>
}

const CourseContext = createContext<CourseContextValue | null>(null)

export const useCourses = () => {
  const ctx = useContext(CourseContext)
  if (!ctx) throw new Error('useCourses must be used within CourseProvider')
  return ctx
}

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<CourseCategory>('Tất cả')

  const refreshCourses = useCallback(async () => {
    setLoading(true)
    const data = await getAllCourses()
    setCourses(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refreshCourses()
  }, [refreshCourses])

  // Real-time computation of filtered courses
  const filteredCourses = useMemo(() => {
    let temp = courses

    // 1. Filter by category
    if (activeCategory !== 'Tất cả') {
      temp = temp.filter(c => c.category === activeCategory)
    }

    // 2. Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      temp = temp.filter(c => 
        c.title.toLowerCase().includes(q) || 
        (c.instructor && c.instructor.toLowerCase().includes(q))
      )
    }

    return temp
  }, [courses, activeCategory, searchQuery])

  return (
    <CourseContext.Provider
      value={{
        courses,
        loading,
        searchQuery,
        activeCategory,
        filteredCourses,
        setSearchQuery,
        setActiveCategory,
        refreshCourses
      }}
    >
      {children}
    </CourseContext.Provider>
  )
}
