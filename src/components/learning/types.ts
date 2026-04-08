export interface Note {
  id: string
  timeLabel: string
  content: string
}

export interface Lesson {
  id: string
  title: string
  isCompleted: boolean
  isLocked: boolean
  videoUrl?: string
  durationStr: string
}

export interface Module {
  id: string
  title: string
  isLocked?: boolean
  lessons: Lesson[]
}

export interface CourseData {
  id: string
  title: string
  modules: Module[]
  totalLessons: number
  completedLessons: number
  totalHoursStr: string
}
