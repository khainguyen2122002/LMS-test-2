"use client"

import React from 'react'
import { DashboardContent } from '@/lib/content'

interface HeroBannerProps {
    content: DashboardContent['hero']
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ content }) => {
    return (
        <div className="hero-gradient rounded-xl p-10 relative overflow-hidden h-[340px] flex flex-col justify-center border border-[var(--border)] shadow-2xl">
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxe138vAZERkIg-n7LuWaVBotfcHb_3llc6vUb3QxLyALXfm-t_YzfEJtDjrbidNAOqaIHHN5gFsOxLOjpeOcZfzQe0yGEc6YvZzkvhSBGk0qnb41dEwurtEwpMC2SkPMYNQrlQWg727g_Pr4XwHLStf5VwZ1p4PH84Dtg67EUcsO41azoz9sZDpSd9_EPZoyuNOQRCZuW7LXYsQM6hcjwtdDE55stK5m-y6BgtjOzd2CDwDiFCSN4hmakMl1v0sOPWMIO8n1tats" 
                    alt="Background Texture" 
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-[#F9A825] text-emerald-950 text-[10px] font-black tracking-widest rounded-sm mb-6">
                    {content.badge}
                </span>
                <h2 className="text-4xl lg:text-5xl font-extrabold dark:text-white light:text-neutral-900 leading-tight mb-4 max-w-lg">
                    {content.title}
                </h2>
                <p className="text-emerald-100/70 text-lg max-w-md font-light leading-relaxed">
                    {content.subtitle}
                </p>
                <div className="mt-8 flex gap-4">
                    <button className="bg-primary hover:bg-emerald-300 text-on-primary px-6 py-3 rounded-lg font-bold text-sm transition-all shadow-xl shadow-black/20">
                        {content.primaryBtn}
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 dark:text-white light:text-neutral-900 backdrop-blur-md px-6 py-3 rounded-lg font-bold text-sm transition-all">
                        {content.secondaryBtn}
                    </button>
                </div>
            </div>
        </div>
    )
}
