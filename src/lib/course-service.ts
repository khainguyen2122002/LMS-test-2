import { supabase } from './supabase'

export interface Video {
  id: string
  lesson_id: string
  playback_id?: string
  video_url?: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  description: string
  position: number
  is_published: boolean
  is_free: boolean
  video_url?: string
  video_id?: string
}

export interface Course {
  id: string
  title: string
  description: string
  instructor?: string
  instructorAvatar?: string
  instructor_id?: string
  thumbnail: string // Sẽ ánh xạ từ image_url trong DB
  category: string
  is_published: boolean
  is_free: boolean
  level?: string
  hours?: number
  students?: number
  certified?: boolean
  certLabel?: string // Sẽ ánh xạ từ cert_label trong DB
  price?: number

  // Computed client-side fields representing relations
  total_lessons?: number
  completed_lessons?: number
}

/**
 * Lấy danh sách toàn bộ khóa học
 */
export async function getAllCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      profiles:instructor_id (full_name, avatar_url),
      lessons (id)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Lỗi khi lấy danh sách khóa học:', error)
    return []
  }

  return (data || []).map(course => ({
    id: course.id,
    title: course.title,
    description: course.description,
    instructor: course.profiles?.full_name || 'Giảng viên',
    instructorAvatar: course.profiles?.avatar_url,
    thumbnail: course.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
    category: course.category || 'Chưa phân loại',
    is_published: course.is_published,
    is_free: course.price === 0,
    level: course.level,
    hours: course.hours,
    certified: course.certified,
    certLabel: course.cert_label,
    price: course.price,
    total_lessons: course.lessons?.length || 0,
    completed_lessons: 0,
  }))
}

/**
 * Lấy chi tiết một khóa học và các bài học đi kèm
 */
export async function getCourseDetails(courseId: string) {
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select(`
      *,
      profiles:instructor_id (full_name, avatar_url)
    `)
    .eq('id', courseId)
    .single()

  if (courseError) return null

  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('position', { ascending: true })

  return {
    ...course,
    instructor: course.profiles?.full_name,
    instructorAvatar: course.profiles?.avatar_url,
    thumbnail: course.image_url,
    lessons: lessons || []
  }
}

/**
 * Tạo một khóa học mới
 */
export async function createCourse(courseData: Partial<Course>) {
  // Lấy ID người dùng hiện tại để làm instructor_id
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Bạn cần đăng nhập để tạo khóa học')

  const { data, error } = await supabase
    .from('courses')
    .insert({
      title: courseData.title,
      description: courseData.description,
      image_url: courseData.thumbnail,
      price: courseData.is_free ? 0 : (courseData.price || 0),
      instructor_id: user.id,
      category: courseData.category,
      is_published: courseData.is_published,
    })
    .select()

  if (error) {
    console.error('Lỗi khi tạo khóa học:', error)
    throw error
  }

  return data[0]
}
