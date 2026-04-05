"use client"

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer?: string
}

const faqs: FAQItem[] = [
  {
    question: 'Làm cách nào để cấp chứng chỉ cho học viên?',
    answer: "Bạn có thể thiết lập cấp chứng chỉ tự động trong phần 'Cài đặt khóa học'. Sau khi học viên hoàn thành 100% nội dung và vượt qua bài kiểm tra cuối khóa, hệ thống sẽ tự động tạo và gửi chứng chỉ qua email.",
  },
  {
    question: 'Cách tích hợp video từ nền tảng bên thứ ba?',
    answer: 'Vào mục Tích hợp > Bên thứ ba trong Cài đặt hệ thống. Nhập API key từ YouTube, Vimeo hoặc Zoom rồi nhấn Xác nhận kết nối.',
  },
  {
    question: 'Gói Pro khác gì so với gói Enterprise?',
    answer: 'Gói Enterprise cung cấp không giới hạn học viên, SSO, API riêng, SLA 99.9% và đội ngũ hỗ trợ chuyên biệt 24/7. Gói Pro giới hạn ở 500 học viên và hỗ trợ trong giờ hành chính.',
  },
]

export const FAQAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold dark:text-white light:text-neutral-900">Câu hỏi thường gặp</h3>
        <a href="#" className="text-emerald-400 text-sm font-medium hover:underline">Xem tất cả</a>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="dark:bg-[#1A1A1A] light:bg-white rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group"
            >
              <span className="font-medium dark:text-white light:text-neutral-900 pr-4">{faq.question}</span>
              <ChevronDown
                size={20}
                className={`text-neutral-500 group-hover:text-emerald-400 transition-all flex-shrink-0 ${openIndex === i ? 'rotate-180 text-emerald-400' : ''}`}
              />
            </button>
            {openIndex === i && faq.answer && (
              <div className="px-6 pb-5 pt-2 dark:text-neutral-400 light:text-neutral-500 text-sm border-t border-[var(--border)] leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
