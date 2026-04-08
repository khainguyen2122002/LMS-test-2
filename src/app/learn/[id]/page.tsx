"use client"

import React, { useState, useMemo, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { LearningSidebar } from '@/components/learning/LearningSidebar'
import { LearningTopNav } from '@/components/learning/LearningTopNav'
import { LearningVideoPlayer } from '@/components/learning/LearningVideoPlayer'
import { LearningRightPanel } from '@/components/learning/LearningRightPanel'
import { CourseData, Note } from '@/components/learning/types'
import { checkEnrollment } from '@/lib/enrollment-service'
import { Lock, Home, Loader2 } from 'lucide-react'

export default function LearningViewPage() {
  const params = useParams()
  const courseId = params.id as string

  const [enrollmentChecked, setEnrollmentChecked] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    const verify = async () => {
      const enrolled = await checkEnrollment(courseId)
      setHasAccess(enrolled)
      setEnrollmentChecked(true)
    }
    verify()
  }, [courseId])

  // Realistic mock data matching HTML
  const [course, setCourse] = useState<CourseData>({
    id: "course-1",
    title: "Quản trị Nhân sự Hiện đại",
    totalLessons: 16,
    completedLessons: 12,
    totalHoursStr: "4.5 Giờ",
    modules: [
      {
        id: "mod-1",
        title: "Phần 1: Tổng quan",
        lessons: [
          { id: "les-1-1", title: "Giới thiệu khóa học", isCompleted: true, isLocked: false, durationStr: "05:30" },
          { id: "les-1-2", title: "Tầm nhìn HR 2024", isCompleted: true, isLocked: false, durationStr: "15:40" },
        ]
      },
      {
        id: "mod-2",
        title: "Phần 2: Tuyển dụng",
        lessons: [
          { id: "les-2-1", title: "Chiến lược sourcing", isCompleted: true, isLocked: false, durationStr: "10:15" },
          { id: "les-2-2", title: "Phỏng vấn hành vi", isCompleted: false, isLocked: false, durationStr: "12:45" },
          { id: "les-2-3", title: "Đánh giá ứng viên", isCompleted: false, isLocked: true, durationStr: "08:20" },
        ]
      },
      {
        id: "mod-3",
        title: "Phần 3: Đào tạo",
        isLocked: true,
        lessons: [
          { id: "les-3-1", title: "Lập kế hoạch đào tạo", isCompleted: false, isLocked: true, durationStr: "20:00" },
        ]
      }
    ]
  })

  // Start with "Phỏng vấn hành vi" (les-2-2) as in the HTML
  const [currentLessonId, setCurrentLessonId] = useState("les-2-2")

  const [notes, setNotes] = useState<Note[]>([
    { id: "note-1", timeLabel: "02:15", content: "Lưu ý về cách quan sát ngôn ngữ cơ thể của ứng viên khi họ trả lời về các thất bại trong quá khứ." },
    { id: "note-2", timeLabel: "08:45", content: "Các câu hỏi xoáy sâu vào 'Action' để xác minh tính trung thực." },
  ])

  // Helpers
  const flattenLessons = useMemo(() => {
    return course.modules.flatMap(m => m.lessons)
  }, [course])

  const currentLesson = flattenLessons.find(l => l.id === currentLessonId) || flattenLessons[0]

  const handleSelectLesson = (id: string) => {
    setCurrentLessonId(id)
  }

  const handleMarkComplete = () => {
    setCourse(prev => {
      const newCourse = { ...prev }
      let justCompleted = false

      newCourse.modules = newCourse.modules.map(mod => ({
        ...mod,
        lessons: mod.lessons.map(les => {
          if (les.id === currentLessonId && !les.isCompleted) {
            justCompleted = true
            return { ...les, isCompleted: true }
          }
          return les
        })
      }))

      if (justCompleted) {
        newCourse.completedLessons += 1
      }
      return newCourse
    })
  }

  const handleAddNote = (content: string) => {
    // Ideally we would grab actual video player time here
    const mockTime = "04:22"
    setNotes(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      timeLabel: mockTime,
      content
    }])
  }

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  if (!enrollmentChecked) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#ffb957]" />
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center text-white text-center px-4">
        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6">
          <Lock className="w-10 h-10 text-[#ffb957]" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Bạn chưa được cấp quyền truy cập</h1>
        <p className="text-white/60 text-sm max-w-sm mb-8">
          Vui lòng liên hệ Quản trị viên để được cấp quyền vào khóa học này.
        </p>
        <div className="flex gap-4">
          <Link href="/student/courses">
            <button className="px-6 py-3 bg-[#1B4D2E] hover:bg-[#205e38] text-white font-bold rounded-full transition-colors">
              Khóa học của tôi
            </button>
          </Link>
          <Link href="/courses">
            <button className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-full flex items-center gap-2 transition-colors">
              <Home className="w-4 h-4" /> Trang khóa học
            </button>
          </Link>
        </div>
      </div>
    )
  }

  if (!course) return <div className="p-8 text-white">Loading...</div>

  return (
    <div className="flex h-screen w-full bg-[#111111] overflow-hidden">
      {/* Left Sidebar Curriculum */}
      <LearningSidebar 
        course={course} 
        currentLessonId={currentLessonId} 
        onSelectLesson={handleSelectLesson} 
      />

      {/* Main Learning Content Area */}
      <main className="flex-1 flex flex-col bg-[#111111] relative">
        <LearningTopNav lessonTitle={`Bài học: ${currentLesson.title}`} />
        
        <LearningVideoPlayer 
          currentLesson={currentLesson} 
          onMarkComplete={handleMarkComplete}
        />
      </main>

      {/* Right Panel Utilities */}
      <LearningRightPanel 
        notes={notes}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
        onCompleteCourse={() => { alert('Quiz sẽ được mở ở giai đoạn tiếp theo!') }}
        totalLessons={course.totalLessons}
        completedLessons={course.completedLessons}
        totalHoursStr={course.totalHoursStr}
      />
    </div>
  )
}
