"use client"

import React from 'react'
import { GraduationCap } from 'lucide-react'

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center">
      <div className="relative">
        {/* Glowing background */}
        <div className="absolute inset-0 bg-[#ffb957] opacity-20 blur-[60px] rounded-full animate-pulse" />
        
        {/* Logo Container */}
        <div className="relative w-20 h-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center animate-bounce duration-1000">
          <GraduationCap className="w-10 h-10 text-[#ffb957]" />
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 bg-[#ffb957] rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-[#ffb957] rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-[#ffb957] rounded-full animate-bounce" />
        </div>
        <span className="text-white/40 text-[10px] uppercase font-bold tracking-[0.3em] mt-4">Inspiring HR LMS</span>
      </div>
    </div>
  )
}
