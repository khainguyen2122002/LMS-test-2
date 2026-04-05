"use client"

import React from 'react'

interface Ticket {
  id: string
  issue: string
  status: 'resolved' | 'pending'
  date: string
}

const tickets: Ticket[] = [
  { id: '#SR-9921', issue: 'Lỗi hiển thị SCORM trên mobile', status: 'resolved', date: '12/10/2023' },
  { id: '#SR-9985', issue: 'Yêu cầu nâng cấp băng thông', status: 'pending', date: 'Hôm qua' },
]

const statusConfig = {
  resolved: { label: 'Đã giải quyết', className: 'bg-emerald-500/10 text-emerald-400' },
  pending:  { label: 'Đang xử lý',   className: 'bg-amber-500/10 text-amber-400' },
}

export const TicketList: React.FC = () => (
  <section>
    <h3 className="text-xl font-bold dark:text-white light:text-neutral-900 mb-6">Yêu cầu hỗ trợ của bạn</h3>
    <div className="dark:bg-[#1A1A1A] light:bg-white rounded-3xl overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="dark:bg-[#353534] light:bg-neutral-200/30">
            {['Mã yêu cầu', 'Vấn đề', 'Trạng thái', 'Ngày gửi'].map((h) => (
              <th key={h} className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {tickets.map((t) => (
            <tr key={t.id} className="hover:bg-white/5 transition-colors cursor-pointer">
              <td className="px-6 py-5 font-mono text-xs text-emerald-400">{t.id}</td>
              <td className="px-6 py-5">
                <p className="text-sm font-medium dark:text-white light:text-neutral-900">{t.issue}</p>
              </td>
              <td className="px-6 py-5">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusConfig[t.status].className}`}>
                  {statusConfig[t.status].label}
                </span>
              </td>
              <td className="px-6 py-5 text-sm text-neutral-500">{t.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
)
