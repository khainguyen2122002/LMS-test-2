"use client"

import React from 'react'
import { DashboardContent } from '@/lib/content'
import { useSettings } from '@/components/settings/SettingsProvider'

interface HeroBannerProps {
    content: DashboardContent['hero']
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ content }) => {
    const { config } = useSettings()

    // Determine background style
    // If heroBgColor is a hex/rgb, we can wrap it in a gradient or just use it
    const bgStyle = config.heroBgColor.includes('gradient') 
        ? { background: config.heroBgColor }
        : { backgroundColor: config.heroBgColor }

    return (
        <div 
            className="rounded-xl p-10 relative overflow-hidden h-[340px] flex flex-col justify-center border border-[var(--border)] shadow-2xl transition-all duration-500"
            style={bgStyle}
        >
            {/* Background Texture Overlay */}
            <div className={`absolute top-0 right-0 w-full h-full ${config.heroImageUrl ? 'opacity-20' : 'opacity-10'} pointer-events-none`}>
                <img 
                    src={config.heroImageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDxe138vAZERkIg-n7LuWaVBotfcHb_3llc6vUb3QxLyALXfm-t_YzfEJtDjrbidNAOqaIHHN5gFsOxLOjpeOcZfzQe0yGEc6YvZzkvhSBGk0qnb41dEwurtEwpMC2SkPMYNQrlQWg727g_Pr4XwHLStf5VwZ1p4PH84Dtg67EUcsO41azoz9sZDpSd9_EPZoyuNOQRCZuW7LXYsQM6hcjwtdDE55stK5m-y6BgtjOzd2CDwDiFCSN4hmakMl1v0sOPWMIO8n1tats"} 
                    alt="Background Texture" 
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-[#F9A825] text-emerald-950 text-[10px] font-black tracking-widest rounded-sm mb-6 uppercase">
                    {config.heroTag || content.badge}
                </span>
                <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 max-w-xl drop-shadow-md">
                    {config.heroHeadline || content.title}
                </h2>
                <p className="text-neutral-100 text-lg max-w-lg font-light leading-relaxed drop-shadow-sm opacity-90">
                    {config.heroSubtitle || content.subtitle}
                </p>
                <div className="mt-8 flex gap-4">
                    <button className="bg-[#F9A825] hover:bg-amber-400 text-neutral-950 px-6 py-3 rounded-lg font-bold text-sm transition-all shadow-xl shadow-black/20 hover:scale-105 active:scale-95">
                        {content.primaryBtn}
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-6 py-3 rounded-lg font-bold text-sm transition-all border border-white/10">
                        {content.secondaryBtn}
                    </button>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mb-32 -mr-32 pointer-events-none" />
        </div>
    )
}
