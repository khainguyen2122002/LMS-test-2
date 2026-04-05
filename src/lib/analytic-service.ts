import { supabase } from './supabase'

export interface GrowthDataPoint {
  label: string
  newUsers: number
  completed: number
}

export interface RoleData {
  name: string
  value: number // percentage
  count: number 
  color: string
}

export interface PopularCourseData {
  id: string
  title: string
  category: string
  students: number
  rating: number
}

export interface ActivityData {
  id: string
  user: string
  action: string
  course?: string
  time: string
  avatar?: string
}

export interface AnalyticsState {
  totalUsers: number
  totalCompletedUsers: number
  completionRate: number
  averageStudyTime: number
  courseViews: number
  growthData: GrowthDataPoint[]
  roleDistribution: RoleData[]
  popularCourses: PopularCourseData[]
  recentActivities: ActivityData[]
}

/**
 * Lấy dữ liệu tổng quan cho Dashboard
 */
export async function getDashboardStats(): Promise<Partial<AnalyticsState>> {
  // 1. Tổng số người dùng
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // 2. Tổng số khóa học
  const { count: totalCourses } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true })

  // 3. Phân bổ vai trò
  const { data: roles } = await supabase.rpc('get_role_distribution') 
  // (Lưu ý: Bạn có thể cần tạo hàm RPC get_role_distribution trong SQL hoặc select count group by)

  return {
    totalUsers: totalUsers || 0,
    courseViews: totalCourses || 0, // Tạm thời dùng tổng số khóa học
  }
}

export const initialAnalytics: AnalyticsState = {
  totalUsers: 0,
  totalCompletedUsers: 0,
  completionRate: 0,
  averageStudyTime: 0,
  courseViews: 0,
  growthData: [],
  roleDistribution: [
    { name: 'Học viên', value: 70, count: 0, color: '#34d399' },
    { name: 'Giảng viên', value: 20, count: 0, color: '#fbbf24' },
    { name: 'Admin', value: 10, count: 0, color: '#525252' },
  ],
  popularCourses: [],
  recentActivities: []
}
