import { supabase } from './supabase'

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  enrolled_at: string
  progress_percentage: number
  completed_lessons: number
  // Joined fields
  course?: {
    id: string
    title: string
    description: string
    image_url: string
    category: string
    is_published: boolean
    youtube_url?: string
    profiles?: { full_name: string; avatar_url?: string }
    lessons?: { id: string }[]
  }
  user?: {
    id: string
    full_name: string
    email: string
    avatar_url?: string
    role: string
  }
}

/**
 * Lấy danh sách khóa học mà user hiện tại đã được enroll
 * Dùng ở Student Portal
 */
export async function getMyEnrollments(): Promise<Enrollment[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      course:course_id (
        id,
        title,
        description,
        image_url,
        category,
        is_published,
        youtube_url,
        profiles:instructor_id (full_name, avatar_url),
        lessons (id)
      )
    `)
    .eq('user_id', user.id)
    .order('enrolled_at', { ascending: false })

  if (error) {
    console.error('Lỗi lấy enrollments:', error)
    return []
  }

  return (data || []) as Enrollment[]
}

/**
 * Kiểm tra xem user hiện tại có enrollment cho khóa học không
 */
export async function checkEnrollment(courseId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data, error } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .maybeSingle()

  return !!data && !error
}

/**
 * Lấy danh sách học viên đã được enroll vào một khóa học
 * Dùng ở Admin Portal
 */
export async function getCourseEnrollees(courseId: string): Promise<Enrollment[]> {
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      user:user_id (
        id,
        full_name,
        email,
        avatar_url,
        role
      )
    `)
    .eq('course_id', courseId)
    .order('enrolled_at', { ascending: false })

  if (error) {
    console.error('Lỗi lấy enrollees:', error)
    return []
  }

  // Note: Supabase returns the joined table as an array even with single ref
  return (data || []).map(e => ({
    ...e,
    user: Array.isArray(e.user) ? e.user[0] : e.user
  })) as Enrollment[]
}

/**
 * Tìm kiếm học viên theo email/tên để cấp quyền
 * Dùng ở Admin Portal
 */
export async function searchLearners(query: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, avatar_url, role')
    .eq('role', 'learner')
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(10)

  if (error) {
    console.error('Lỗi tìm kiếm học viên:', error)
    return []
  }

  return data || []
}

/**
 * Admin cấp quyền truy cập khóa học cho học viên
 */
export async function enrollStudent(userId: string, courseId: string): Promise<void> {
  const { error } = await supabase
    .from('enrollments')
    .insert({
      user_id: userId,
      course_id: courseId,
      progress_percentage: 0,
      completed_lessons: 0,
    })

  if (error) {
    if (error.code === '23505') {
      throw new Error('Học viên đã được cấp quyền vào khóa học này rồi.')
    }
    throw error
  }
}

/**
 * Admin thu hồi quyền truy cập
 */
export async function unenrollStudent(enrollmentId: string): Promise<void> {
  const { error } = await supabase
    .from('enrollments')
    .delete()
    .eq('id', enrollmentId)

  if (error) throw error
}

/**
 * Cập nhật tiến độ học tập của student
 */
export async function updateProgress(
  courseId: string,
  completedLessons: number,
  totalLessons: number
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const progress = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0

  const { error } = await supabase
    .from('enrollments')
    .update({ progress_percentage: progress, completed_lessons: completedLessons })
    .eq('user_id', user.id)
    .eq('course_id', courseId)

  if (error) console.error('Lỗi cập nhật tiến độ:', error)
}
