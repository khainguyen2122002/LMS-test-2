"use client"

import React from 'react'
import Link from 'next/link'
import { GraduationCap, ArrowRight, BookOpen, Users, Trophy } from 'lucide-react'

export default function PublicLandingPage() {
  return (
    <div className="min-h-screen bg-[#111111] text-[#f9faf5] flex flex-col font-['Inter']">
      {/* Top Navigation */}
      <header className="flex justify-between items-center px-8 lg:px-16 py-6 bg-[#111111]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-[#c1c9bf]/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ffb957] flex items-center justify-center">
            <GraduationCap className="text-[#1B4D2E] w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-[#ffb957] leading-none">INSPIRING HR</h1>
            <p className="text-[10px] tracking-widest uppercase opacity-70 mt-0.5">Hệ thống LMS Cao cấp</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-bold text-white hover:text-[#ffb957] transition-colors">
            Trang chủ
          </Link>
          <Link href="/courses" className="text-sm font-medium text-white/70 hover:text-[#ffb957] transition-colors">
            Khóa học
          </Link>
        </nav>

        <Link href="/login">
          <button className="px-6 py-2.5 bg-[#1B4D2E] hover:bg-[#205e38] text-white text-sm font-bold rounded-full transition-colors shadow-lg shadow-[#1B4D2E]/20">
            Đăng nhập
          </button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative px-8 lg:px-16 py-24 lg:py-32 flex flex-col items-center text-center overflow-hidden">
          {/* Decorative gradients */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1B4D2E] opacity-20 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-[#ffb957] opacity-10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ffb957]/30 bg-[#ffb957]/10 text-[#ffb957] text-xs font-bold tracking-widest uppercase mb-4">
              <span className="w-2 h-2 rounded-full bg-[#ffb957] animate-pulse"></span>
              Nền tảng quản trị nhân sự 4.0
            </div>
            
            <h2 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Khởi nguồn tăng trưởng,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9ed3aa] to-[#ffb957]">
                Mỗi ngày.
              </span>
            </h2>
            
            <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Nền tảng đào tạo mở rộng giúp tối ưu hóa hiệu suất làm việc, phát triển kỹ năng và thúc đẩy sự gắn kết của nhân sự toàn diện.
            </p>
            
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <button className="px-8 py-4 bg-[#ffb957] hover:opacity-90 text-[#422800] text-base font-bold rounded-full transition-all flex items-center gap-2 group shadow-[0_0_30px_rgba(255,185,87,0.3)] hover:scale-105">
                  Bắt đầu học ngay
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-base font-bold rounded-full transition-colors border border-white/10">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="px-8 lg:px-16 py-24 bg-[#1A1A1A] border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1B4D2E]/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-[#9ed3aa]" />
                </div>
                <h3 className="text-xl font-bold">Chương trình chuẩn hóa</h3>
                <p className="text-white/60 leading-relaxed">
                  Lộ trình học tập được thiết kế bởi các chuyên gia nhân sự hàng đầu, bám sát thực tiễn doanh nghiệp.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#ffb957]/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#ffb957]" />
                </div>
                <h3 className="text-xl font-bold">Cộng đồng tương tác</h3>
                <p className="text-white/60 leading-relaxed">
                  Trực tiếp học hỏi, chia sẻ và thảo luận cùng các giảng viên và học viên khác trong cùng mảng quản lý.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#9ed3aa]/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-[#9ed3aa]" />
                </div>
                <h3 className="text-xl font-bold">Chứng nhận uy tín</h3>
                <p className="text-white/60 leading-relaxed">
                  Nhận chứng chỉ chính quy sau mỗi khóa học, nâng cao giá trị hồ sơ năng lực của riêng bạn.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-8 lg:px-16 py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
        <p>© 2026 Inspiring HR. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a>
          <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
        </div>
      </footer>
    </div>
  )
}
