"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { GraduationCap, Search, Clock, Star, Lock, ArrowRight, BookOpen } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

interface PublicCourse {
  id: string
  title: string
  description: string
  category: string
  instructor: string
  duration: string
  lessons: number
  rating: number
  imageUrl: string
}

// Dữ liệu mẫu - sau sẽ kết nối Supabase
const MOCK_COURSES: PublicCourse[] = [
  {
    id: 'course-1',
    title: 'Tuyển dụng & Giữ chân Nhân tài 2024',
    description: 'Chiến lược sourcing đa kênh, phỏng vấn hành vi và các công cụ đánh giá ứng viên hiện đại.',
    category: 'QUẢN TRỊ CHIẾN LƯỢC',
    instructor: 'GV. Nguyễn Minh Anh',
    duration: '12h 45m',
    lessons: 24,
    rating: 4.9,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUy1iBHRlPnGLdFbDrFIhwnPS2B2bhNjB0yH9YuFV-Lof6MFZZDgJn5P3x5oxhDjDnqWDfpJC_ohBlb0ShqG-n3_0SEsn3R80hUW7jj2DtWb9iC7E3CV7X-NwsI4eku9Nc3cUAzagauUIOB-FgWUZ-QOHjRtWUT1P9jiXb1g5V4TUDbwYU1dATvkEnh47QtCtdGOFAGdQ1zYtR6oA8tQlXFH6ILVrku4XvKJmKCBlHPddj6diVqh2zbbqQJ4CPFZg1W6DS8D9oE7U',
  },
  {
    id: 'course-2',
    title: 'Luật Lao động & Tuân thủ Doanh nghiệp',
    description: 'Nắm vững các quy định pháp luật lao động Việt Nam, hợp đồng lao động, xử lý kỷ luật.',
    category: 'PHÁP LUẬT LAO ĐỘNG',
    instructor: 'GV. Trần Thế Bảo',
    duration: '8h 20m',
    lessons: 16,
    rating: 4.8,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSAPYxBeUwq7zSMfOPSRo5BxFN4jWJVp_OD5JASzq09Oi9CTxGGDvDmqSJ93M4L48nsr90T9GGAzitxXXohdfTRJEb7Il8094hXIsAU-jl4R9UAhy6lDpJfWIpTcdCX1tlsvFF7q37naNNKLGMVT6vdH5mzRNbprL1HrjzBSPAPz7hEW5pa0Q_SIEAilqId8NLnC4mvwQqKWR_MtSuRQtxbhLHHhsEUTSK7-EsZnfKlN5z4auU-1Ay4mcU_SYeaQCSpZoC1Gz4k',
  },
  {
    id: 'course-3',
    title: 'Xây dựng Văn hóa Doanh nghiệp Vững mạnh',
    description: 'Thiết kế hệ thống giá trị cốt lõi, xây dựng môi trường làm việc tích cực và gắn kết nhân viên.',
    category: 'PHÁT TRIỂN TỔ CHỨC',
    instructor: 'GV. Lê Thị Hồng Hạnh',
    duration: '10h 00m',
    lessons: 20,
    rating: 4.7,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM7cdJM5w0N5D-1aHQqhcYFJQ5QlFv_vrgJWdAjAbu-dOu1-m64YaK7-d08FxYAHqSMwdnuWmiSr7FVl2Sywoiq8RpUNUHW_PUV0pSgOt39L94uMpx7wIMCVztBCfY7NhhRYkCEsYMNNEo3Ee_nahW0wGWvLTo6_qdaK4T7H9qip1Nud8wBZOJqL2ygAdb8dDo2X13CSXd_nTmymo8pDETKhE-ADfSsyUWS8_J8Dnrg3GJaCu4IiaqD8Xg2UIoYYWMKE8nRnlZjJ0',
  },
  {
    id: 'course-4',
    title: 'Thiết lập Hệ thống KPI & OKR Hiệu quả',
    description: 'Phương pháp đo lường hiệu suất, thiết kế KPI theo BSC và triển khai OKR trong thực tế.',
    category: 'QUẢN TRỊ HIỆU SUẤT',
    instructor: 'GV. Phạm Quang Vinh',
    duration: '9h 30m',
    lessons: 18,
    rating: 4.9,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYi3kN7BRQtwLXIZVVI4WjyCgm4vvaAh69IFn0iTCco-bdTEybctODvTLoehG6B7zsA_tx5xSFTYedYtTcn63jQxibH88ggaFIFY2a8Q-VpvrKZU2zRU0Iyrb0sXJh8pWl9LD5Jeyb9INk7spHE3g9Dv7SnTYjzv7K0EAIKxt7JjBi7edeib4b16amULqjO_a_403RUdBhxxmTw4mbPsfwzlig-raR3TI3hzrcxZ0BrDT5AUC_Yl8Ew-cCG5wd6Mbz-cFzEFwOx8c',
  },
  {
    id: 'course-5',
    title: 'Kỹ năng Lãnh đạo & Quản lý Đội nhóm',
    description: 'Mô hình lãnh đạo tình huống, kỹ năng coaching, xây dựng đội nhóm hiệu suất cao.',
    category: 'KỸ NĂNG LÃNH ĐẠO',
    instructor: 'GV. Nguyễn Văn Hùng',
    duration: '11h 15m',
    lessons: 22,
    rating: 4.8,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDO0lsrbIHn4efNlL3TG40KHVFxKPJ7Vm6gMe-6WUhwZHRfiq9igUvi9WxMTkW7WSwwFB0qJ2beTpPckzsVofIeZTNjrbjXQ5zmKmbyyyi8r3sazQZOB9YWYX-k5jyI1_fz6aOPkDWZn_9QsiGLp9jpbcOK3WM-6iybcSKQomBExkIy-ouNlld0yVZZQDDc9mDXgZVxKs3GDThPdhjbK9LXDVoH2VgLHUVwDOhKza4IFtkOc8YQzvGvPjRU6M50h5sNj5lKRn479LU',
  },
  {
    id: 'course-6',
    title: 'Quản trị Nhân sự trong Kỷ nguyên Số 4.0',
    description: 'Ứng dụng HR Tech, AI trong tuyển dụng, quản lý nhân sự lai (hybrid workforce).',
    category: 'HR CÔNG NGHỆ',
    instructor: 'GV. Trần Minh Khoa',
    duration: '14h 00m',
    lessons: 28,
    rating: 5.0,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClUc2TXtSpAM1kDHYnJG-YJmrKWi6Q6rPPraP45XG5ZKr5ENQVBmL-ix-v0DjsHPhk4RLJIkk4l3a9bh2X2S9KmHPd3M6nc-1k55egFg_7vSu-RPvl7GCz9E5FrekFKxy5cauMLlrWow42caHXjpMj-xMAdToEfPJP2HY3UCSR0KXzNqI7kYs4HaFcCmgBKb70iov3DyBnDMOCGSxFs3FdDrviyYRfldUR6aDgWHMdYzaGYsK8fTiORuLzbbMZ0Lqf7RM-DhNvAFM',
  },
]

export default function PublicCoursesPage() {
  const { profile, loading } = useAuth()
  const [search, setSearch] = useState('')
  const [showLoginGate, setShowLoginGate] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<PublicCourse | null>(null)

  // TODO: Replace with Supabase fetch:
  // useEffect(() => {
  //   const fetchCourses = async () => {
  //     const { data } = await supabase.from('courses').select('*').eq('published', true)
  //     setCourses(data || [])
  //   }
  //   fetchCourses()
  // }, [])

  const filtered = MOCK_COURSES.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  )

  const handleCourseClick = (course: PublicCourse) => {
    if (!loading && profile) {
      // Logged in → navigate to learn page
      window.location.href = `/learn/${course.id}`
    } else {
      // Not logged in → show login gate
      setSelectedCourse(course)
      setShowLoginGate(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#f9faf5] dark:bg-[#111111] text-[#191c19] dark:text-[#f9faf5] font-['Inter']">
      {/* Minimal Top Nav for Public */}
      <header className="flex justify-between items-center px-8 lg:px-16 py-5 bg-[#f9faf5]/90 dark:bg-[#111111]/90 backdrop-blur-xl sticky top-0 z-50 border-b border-[#c1c9bf]/20 dark:border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#ffb957] flex items-center justify-center">
            <GraduationCap className="text-[#1B4D2E] w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tighter text-[#1B4D2E] dark:text-[#ffb957]">INSPIRING HR</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-[#191c19]/70 dark:text-white/70 hover:text-[#1B4D2E] dark:hover:text-[#ffb957] transition-colors">
            Trang chủ
          </Link>
          <Link href="/courses" className="text-sm font-bold text-[#1B4D2E] dark:text-[#ffb957] border-b-2 border-[#1B4D2E] dark:border-[#ffb957] pb-0.5">
            Khóa học
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {profile ? (
            <Link href={profile.role === 'learner' ? '/student/dashboard' : '/admin'}>
              <button className="px-5 py-2 bg-[#1B4D2E] text-white text-sm font-bold rounded-full hover:bg-[#205e38] transition-colors">
                Vào hệ thống
              </button>
            </Link>
          ) : (
            <Link href="/login">
              <button className="px-5 py-2 bg-[#1B4D2E] text-white text-sm font-bold rounded-full hover:bg-[#205e38] transition-colors">
                Đăng nhập
              </button>
            </Link>
          )}
        </div>
      </header>

      {/* Page Hero */}
      <section className="px-8 lg:px-16 py-16 bg-gradient-to-b from-[#f3f4ef] to-[#f9faf5] dark:from-[#1A1A1A] dark:to-[#111111] border-b border-[#c1c9bf]/20 dark:border-white/5">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#f0a01b] font-bold tracking-widest uppercase text-xs mb-3">THƯ VIỆN KHÓA HỌC</p>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Nâng tầm kỹ năng <span className="text-[#1B4D2E] dark:text-[#9ed3aa]">nhân sự</span>
          </h1>
          <p className="text-[#414942] dark:text-[#9ca3af] text-lg max-w-2xl mb-8">
            {filtered.length} khóa học được thiết kế bởi các chuyên gia hàng đầu, cập nhật theo xu hướng thị trường nhân sự Việt Nam và quốc tế.
          </p>

          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717971]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm kiếm khóa học..."
              className="w-full pl-12 pr-6 py-4 bg-white dark:bg-[#1A1A1A] border border-[#c1c9bf]/30 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D2E]/30 dark:focus:ring-[#9ed3aa]/30 placeholder:text-[#717971]"
            />
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="px-8 lg:px-16 py-16 max-w-7xl mx-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <BookOpen className="w-16 h-16 text-[#c1c9bf] mb-4" />
            <p className="text-lg font-bold text-[#414942] dark:text-[#9ca3af]">Không tìm thấy khóa học phù hợp</p>
            <p className="text-sm text-[#717971] mt-2">Thử tìm kiếm với từ khóa khác</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filtered.map(course => (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course)}
                className="bg-white dark:bg-[#1A1A1A] rounded-3xl overflow-hidden border border-[#c1c9bf]/20 dark:border-white/5 hover:shadow-2xl hover:shadow-[#1B4D2E]/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-[#ffb957] text-[#2a1800] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {course.category}
                    </span>
                  </div>
                  {/* Lock overlay for non-logged in */}
                  {!profile && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 dark:bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                        <Lock className="w-4 h-4 text-[#1B4D2E]" />
                        <span className="text-xs font-bold text-[#1B4D2E]">Đăng nhập để xem</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#191c19] dark:text-white mb-2 leading-tight line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-[#414942] dark:text-[#9ca3af] line-clamp-2 mb-4">
                    {course.description}
                  </p>
                  <p className="text-xs text-[#717971] mb-4">👨‍🏫 {course.instructor}</p>

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#c1c9bf]/20 dark:border-white/5">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-xs text-[#414942] dark:text-[#9ca3af]">
                        <Clock className="w-3.5 h-3.5" /> {course.duration}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[#414942] dark:text-[#9ca3af]">
                        <BookOpen className="w-3.5 h-3.5" /> {course.lessons} bài
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-[#f0a01b]">
                      <Star className="w-3.5 h-3.5 fill-[#f0a01b]" /> {course.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Login Gate Modal */}
      {showLoginGate && selectedCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowLoginGate(false)}
        >
          <div
            className="bg-white dark:bg-[#1A1A1A] rounded-3xl p-8 max-w-md w-full shadow-2xl border border-[#c1c9bf]/20 dark:border-white/10"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#1B4D2E]/10 dark:bg-[#9ed3aa]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-[#1B4D2E] dark:text-[#9ed3aa]" />
              </div>
              <h3 className="text-xl font-bold text-[#191c19] dark:text-white mb-2">
                Đăng nhập để học
              </h3>
              <p className="text-sm text-[#414942] dark:text-[#9ca3af]">
                Bạn cần đăng nhập để truy cập khóa học<br />
                <strong>"{selectedCourse.title}"</strong>
              </p>
            </div>
            <div className="space-y-3">
              <Link href="/login" className="block">
                <button className="w-full py-3 bg-gradient-to-r from-[#00361a] to-[#1B4D2E] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  Đăng nhập ngay <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <button
                onClick={() => setShowLoginGate(false)}
                className="w-full py-3 text-sm text-[#717971] hover:text-[#191c19] dark:hover:text-white transition-colors"
              >
                Để sau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
