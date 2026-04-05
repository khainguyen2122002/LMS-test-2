import { supabase } from './supabase'

export type UserRole = 'learner' | 'instructor' | 'admin'
export type UserStatus = 'Hoạt động' | 'Ngừng hoạt động'

export interface User {
  id: string
  fullName: string
  email: string
  role: UserRole
  coursesCount: number
  joinDate: string
  status: UserStatus
  avatar?: string
}

/**
 * Lấy danh sách toàn bộ người dùng từ bảng profiles
 */
export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error)
    return []
  }

  return (data || []).map(profile => ({
    id: profile.id,
    fullName: profile.full_name || 'Người dùng mới',
    email: profile.email,
    role: profile.role as UserRole,
    coursesCount: 0, // Sẽ cần join với bảng enrollments sau này
    joinDate: new Date(profile.created_at).toLocaleDateString('vi-VN'),
    status: profile.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động',
    avatar: profile.avatar_url,
  }))
}

/**
 * Lấy thông tin người dùng hiện tại (Session)
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) return null

  return {
    id: profile.id,
    fullName: profile.full_name || 'Người dùng',
    email: profile.email,
    role: profile.role as UserRole,
    coursesCount: 0,
    joinDate: new Date(profile.created_at).toLocaleDateString('vi-VN'),
    status: profile.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động',
    avatar: profile.avatar_url,
  }
}
