"use client"

import React, { useState } from 'react'
import { MyCourseCard, MyCourseCardProps } from '@/components/student/MyCourseCard'

type TabValue = 'all' | 'learning' | 'finished' | 'not_started'

export default function MyCoursesPage() {
  const [activeTab, setActiveTab] = useState<TabValue>('all')

  const courses: MyCourseCardProps[] = [
    {
      id: "course-1",
      title: "Tuyển dụng chuyên sâu",
      category: "CHUYÊN SÂU",
      categoryColors: { bg: "bg-[#ffddb5] dark:bg-[#603c00]", text: "text-[#2a1800] dark:text-[#ffddb5]" },
      instructor: "GV. Nguyễn Minh Anh",
      progress: 75,
      lessonsLeft: 6,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYFCCx-l1X-2W6BtF43Twvwa-Nms604jiYlZJdutCAlOwjAK1XQG1iaPUS-ngFu799WiMRGBQPVTxV_l7B6qgdT8fTEVUmncf9zFcdayD1f5_op1O9COE6YW3SVPOQz1aCL5qb2qepRvZ_TXcyIGPsfz7o8PmOtow_-791LAozIPwtHnB6R4in4ttV-rv95StRF0GDdZm8Sc6bjhO-c9vSgOTL9ESwXnWNxCJPTR4ulD4OPF8lZjaToWt_BX3eNTY2tEdTwmQ0kWw",
      state: "learning"
    },
    {
      id: "course-2",
      title: "Kỹ năng Phỏng vấn",
      category: "KỸ NĂNG",
      categoryColors: { bg: "bg-[#1b4d2e] dark:bg-[#9ed3aa]", text: "text-white dark:text-[#01391c]" },
      instructor: "GV. Trần Thế Bảo",
      progress: 30,
      lessonsLeft: 12,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOZosZSuHdefcPn-ngaGtCo4qiGRFFjO0i1F7-bbu_6bHcUtB6OtQXwmBwiAIgDsBBaKA6zqtoUyHyevvzdve_Mi78pu0r41eNyn3XTwtxUxwFfkPmb8LJW2ihBm6FdW7PzFUeBeqKNH5TpRh9UpYRQc9NMp5pmpjw5BA9FiCsUGERF578IDz53cQQrHgaDDugCOg5-AEQ02Oq1vleT5BDdwtM8ntgi-RS0kg9EL6YAxtUDxkdvjk6EyPR7p7awzbxmllgvdk0Jng",
      state: "learning"
    },
    {
      id: "course-3",
      title: "Quản trị Nhân sự 4.0",
      category: "QUẢN TRỊ",
      categoryColors: { bg: "bg-[#cfe5d1] dark:bg-[#384b3c]", text: "text-[#546757] dark:text-[#cfe5d1]" },
      instructor: "GV. Lê Thị Hồng Hạnh",
      progress: 10,
      lessonsLeft: 24,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuClUc2TXtSpAM1kDHYnJG-YJmrKWi6Q6rPPraP45XG5ZKr5ENQVBmL-ix-v0DjsHPhk4RLJIkk4l3a9bh2X2S9KmHPd3M6nc-1k55egFg_7vSu-RPvl7GCz9E5FrekFKxy5cauMLlrWow42caHXjpMj-xMAdToEfPJP2HY3UCSR0KXzNqI7kYs4HaFcCmgBKb70iov3DyBnDMOCGSxFs3FdDrviyYRfldUR6aDgWHMdYzaGYsK8fTiORuLzbbMZ0Lqf7RM-DhNvAFM",
      state: "learning"
    },
    {
      id: "course-4",
      title: "Văn hóa Doanh nghiệp",
      category: "", // Finished
      categoryColors: { bg: "", text: "" },
      instructor: "GV. Phạm Quang Vinh",
      progress: 100,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6J9JrUmrTxKF_1di1dwGWOmnPyQ_mr_Y3iNi1Shd5xj06_QpnG6CDsj7z6OYY3bl4-pfXRzivFtqO6SBHTmDYA2b0YaZvTfbEh9Gd5BPC3l16GspR6aIT1qN5cIMYQ4tOAb8_jjizpg8Kk9a4Z1LLpJufDbzkx2wJG3Xw0sIYvmjiLFqtxYNKNtshOY4rkk5ump6q9gd5v9OxOx5pSDVioP5T8PVYUXtD-q69BAjKPi45mcJsgXW2d9wtCJDezxr8lSVFWNtU4Ys",
      state: "finished"
    }
  ]

  // Filter logic
  const filteredCourses = courses.filter(c => {
    if (activeTab === 'all') return true
    if (activeTab === 'learning') return c.state === 'learning'
    if (activeTab === 'finished') return c.state === 'finished'
    if (activeTab === 'not_started') return c.state === 'not_started'
    return true
  })

  // Add empty state mapping for UI
  const displayItems = [...filteredCourses]
  if (activeTab === 'all' || activeTab === 'not_started') {
    displayItems.push({
      id: "empty-slot",
      title: "",
      category: "",
      categoryColors: { bg: "", text: "" },
      instructor: "",
      progress: 0,
      imageUrl: "",
      state: "empty"
    })
  }

  return (
    <div className="w-full pb-12">
      {/* Editorial Header */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[#f0a01b] font-medium tracking-widest text-xs uppercase mb-2 block font-['Inter']">
              QUẢN LÝ HỌC TẬP
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#191c19] dark:text-white leading-tight font-['Inter']">
              Khóa học của tôi
            </h1>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#f3f4ef] dark:bg-[#1C1B1B] rounded-full overflow-x-auto no-scrollbar border border-[var(--border)]">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'learning', label: 'Đang học' },
              { id: 'finished', label: 'Hoàn thành' },
              { id: 'not_started', label: 'Chưa bắt đầu' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabValue)}
                className={`px-6 py-2 text-sm whitespace-nowrap rounded-full transition-colors flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-[#1b4d2e] dark:bg-[#9ed3aa] text-white dark:text-[#01391c] shadow-sm font-semibold'
                    : 'font-medium text-[#414942] dark:text-[#9ca3af] hover:bg-[#e7e9e4] dark:hover:bg-[#2a2a2a]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {displayItems.map((item, index) => (
          <MyCourseCard key={item.id || index} {...item} />
        ))}
      </div>

      {/* Footer Summary Card */}
      <div className="mt-12 bg-gradient-to-r from-[#1b4d2e] to-[#01391c] dark:from-[#012613] dark:to-[#0a1e12] rounded-3xl md:rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/10 to-transparent skew-x-12 hidden md:block"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-white text-3xl font-extrabold tracking-tight mb-2">Thống kê học tập tuần này</h2>
            <p className="text-[#9ed3aa] font-medium opacity-90">Bạn đã học được 12.5 giờ trong 7 ngày qua. Tuyệt vời!</p>
          </div>
          <div className="flex gap-4 flex-wrap justify-center">
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-[2rem] border border-white/20 min-w-[120px] text-center">
              <span className="block text-white font-black text-3xl tracking-tighter">04</span>
              <span className="block text-[#9ed3aa] text-[10px] uppercase font-bold tracking-widest mt-1">Khóa học</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-[2rem] border border-white/20 min-w-[120px] text-center">
              <span className="block text-white font-black text-3xl tracking-tighter">82%</span>
              <span className="block text-[#9ed3aa] text-[10px] uppercase font-bold tracking-widest mt-1">Tỉ lệ đạt</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
