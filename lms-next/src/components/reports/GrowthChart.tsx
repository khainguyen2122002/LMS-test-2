"use client"

import React from 'react'
import { useAnalytics } from '@/components/reports/AnalyticsProvider'

export const GrowthChart: React.FC = () => {
  const { growthData } = useAnalytics()

  // Calculate dynamic heights based on highest data point
  const maxNewUsers = Math.max(...growthData.map(m => m.newUsers), 1)

  return (
    <div className="dark:bg-[#201f1f] light:bg-white border border-[var(--border)] rounded-xl p-6 min-w-0">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h4 className="font-bold dark:text-white light:text-neutral-900 flex items-center gap-2">
          <span className="w-1 h-4 bg-emerald-400 rounded-full" />
          Tăng trưởng người dùng
        </h4>
        <div className="flex gap-4 text-[10px] text-neutral-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Học viên mới
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neutral-600" />
            Hoàn thành
          </span>
        </div>
      </div>

      {/* SVG line & Bars */}
      <div className="relative h-56 mb-4 px-8">
        {/* Aesthetic Background Line */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="growthGradDynamic" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(52,211,153)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="rgb(52,211,153)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 180 Q 100 160 200 120 T 400 140 T 600 80 T 800 100"
            fill="none"
            stroke="rgba(52,211,153,0.3)"
            strokeWidth="2"
          />
          <path
            d="M0,180 Q100,160 200,120 T400,140 T600,80 T800,100 L800,224 L0,224 Z"
            fill="url(#growthGradDynamic)"
          />
        </svg>

        {/* Y-axis labels based on dynamic max */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-neutral-500 pointer-events-none">
          {[
            Math.round(maxNewUsers * 1.5).toString(),
            Math.round(maxNewUsers).toString(),
            Math.round(maxNewUsers * 0.5).toString(),
            '0'
          ].map(v => <span key={v}>{v}</span>)}
        </div>

        {/* Dynamic Bars */}
        <div className="absolute inset-0 left-8 flex items-end justify-between">
          {growthData.map((m, index) => {
            const isLast = index === growthData.length - 1
            const heightPct = Math.min((m.newUsers / maxNewUsers) * 60, 100) // max ~60% height to leave room for top label visually
            
            return (
              <div key={m.label} className="flex flex-col items-center gap-2 group relative">
                {/* Custom tooltip simulation */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10 text-center shadow-xl">
                  {m.newUsers} người mới<br />
                  <span className="text-emerald-400">{m.completed} hoàn thành</span>
                </div>

                <div
                  className={`w-2 lg:w-4 rounded-t-full transition-all duration-700 ${
                    isLast
                      ? 'bg-emerald-400 shadow-[0_-4px_12px_rgba(52,211,153,0.3)]'
                      : 'dark:bg-[#353534] light:bg-neutral-200 group-hover:bg-[#1B4D2E]'
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
                <span className={`text-[10px] ${isLast ? 'dark:text-white light:text-neutral-900 font-bold' : 'text-neutral-500'}`}>
                  {m.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
