"use client"

import React from 'react'
import { Mail, Phone, Send } from 'lucide-react'

export const ContactPanel: React.FC = () => (
  <div className="space-y-6">
    {/* Contact Form Card */}
    <section className="dark:bg-[#1A1A1A] light:bg-white rounded-3xl p-8 sticky top-24 border border-[var(--border)] shadow-xl">
      <h3 className="text-xl font-bold dark:text-white light:text-neutral-900 mb-1">Gửi yêu cầu mới</h3>
      <p className="text-sm text-neutral-500 mb-8">Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.</p>

      <form className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Chủ đề</label>
          <input
            type="text"
            placeholder="Ví dụ: Lỗi thanh toán"
            className="w-full dark:bg-[#0e0e0e] light:bg-neutral-100 border-none rounded-xl py-3 px-4 text-sm dark:text-white light:text-neutral-900 focus:ring-1 focus:ring-emerald-500/40 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Phân loại</label>
          <select className="w-full dark:bg-[#0e0e0e] light:bg-neutral-100 border-none rounded-xl py-3 px-4 text-sm dark:text-white light:text-neutral-900 focus:ring-1 focus:ring-emerald-500/40 outline-none appearance-none">
            <option>Kỹ thuật</option>
            <option>Thanh toán &amp; Gói cước</option>
            <option>Góp ý tính năng</option>
            <option>Khác</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Nội dung chi tiết</label>
          <textarea
            rows={4}
            placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
            className="w-full dark:bg-[#0e0e0e] light:bg-neutral-100 border-none rounded-xl py-3 px-4 text-sm dark:text-white light:text-neutral-900 focus:ring-1 focus:ring-emerald-500/40 outline-none resize-none"
          />
        </div>
        <button
          type="submit"
          className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-emerald-900/20 dark:text-white light:text-neutral-900"
          style={{ background: 'linear-gradient(135deg, #9ed3aa 0%, #1b4d2e 100%)' }}
        >
          <Send size={16} />
          Gửi yêu cầu ngay
        </button>
      </form>
    </section>

    {/* Direct Support Info */}
    <section className="dark:bg-[#1c1b1b] light:bg-white rounded-3xl p-8 border border-[var(--border)]">
      <h4 className="text-xs font-bold dark:text-white light:text-neutral-900 mb-6 uppercase tracking-wider">Hỗ trợ trực tiếp</h4>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
            <Mail size={18} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-neutral-500 font-medium">Email kỹ thuật</p>
            <p className="text-sm dark:text-white light:text-neutral-900">tech@inspiringhr.vn</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-900/20 flex items-center justify-center flex-shrink-0">
            <Phone size={18} className="text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-neutral-500 font-medium">Hotline 24/7</p>
            <p className="text-sm dark:text-white light:text-neutral-900">1900 6789 (Ext 2)</p>
          </div>
        </div>
      </div>
    </section>
  </div>
)
