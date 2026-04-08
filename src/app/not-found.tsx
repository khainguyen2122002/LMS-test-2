"use client"

import React from 'react'
import Link from 'next/link'
import { GraduationCap, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#111111] text-[#f9faf5] flex flex-col items-center justify-center font-['Inter'] relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1B4D2E] opacity-10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-20 right-20 w-[300px] h-[300px] bg-[#ffb957] opacity-5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 text-center px-8 max-w-lg mx-auto">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-[#ffb957] flex items-center justify-center">
            <GraduationCap className="text-[#1B4D2E] w-6 h-6" />
          </div>
          <span className="text-lg font-bold tracking-tighter text-[#ffb957]">INSPIRING HR</span>
        </div>

        {/* 404 */}
        <h1 className="text-[120px] lg:text-[160px] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/5 mb-6 select-none">
          404
        </h1>

        <h2 className="text-2xl font-bold mb-4">Trang không tồn tại</h2>
        <p className="text-white/60 text-base leading-relaxed mb-10">
          Trang bạn đang tìm kiếm đã bị di chuyển, xóa hoặc chưa bao giờ tồn tại. Hãy kiểm tra lại đường dẫn hoặc quay về trang chủ.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <button className="px-8 py-3 bg-[#1B4D2E] hover:bg-[#205e38] text-white font-bold rounded-full flex items-center gap-2 transition-colors">
              <Home className="w-4 h-4" /> Về trang chủ
            </button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-full flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
        </div>
      </div>
    </div>
  )
}
