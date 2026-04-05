"use client"

import React from 'react'
import { Rocket, PlusCircle, Upload, Share2 } from 'lucide-react'
import { DashboardContent } from '@/lib/content'

interface QuickActionCardProps {
    content: DashboardContent['quickActions']
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({ content }) => {
    return (
        <div className="translate-y-2">
            <h3 className="text-xl font-bold dark:text-white light:text-neutral-900 tracking-tight mb-6 uppercase tracking-widest text-[10px]">
                {content.sectionTitle}
            </h3>
            <div className="dark:bg-[#1A1A1A] light:bg-white p-8 rounded-xl border border-[var(--border)] flex flex-col items-center text-center shadow-lg relative overflow-hidden group">
                <div className="w-20 h-20 bg-emerald-900/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-emerald-500/5 group-hover:ring-emerald-500/10 transition-all">
                    <Rocket className="text-emerald-400" size={32} />
                </div>
                <h4 className="dark:text-white light:text-neutral-900 font-bold mb-2 text-lg">{content.mainAction.title}</h4>
                <p className="text-neutral-500 text-sm mb-8 max-w-[200px] leading-relaxed">
                    {content.mainAction.description}
                </p>
                <button className="w-full bg-secondary hover:bg-amber-400 text-on-secondary-container py-4 rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-orange-900/10 transition-all active:scale-95 group-hover:shadow-amber-500/10">
                    <PlusCircle size={20} />
                    {content.mainAction.btnText}
                </button>
                <div className="mt-10 grid grid-cols-2 gap-4 w-full">
                    <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors group/btn">
                        <Upload className="text-neutral-500 group-hover/btn:dark:text-neutral-300 light:text-neutral-600" size={16} />
                        <span className="text-[10px] font-bold dark:text-neutral-400 light:text-neutral-500 uppercase tracking-tighter">
                            {content.secondaryActions.import}
                        </span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors group/btn">
                        <Share2 className="text-neutral-500 group-hover/btn:dark:text-neutral-300 light:text-neutral-600" size={16} />
                        <span className="text-[10px] font-bold dark:text-neutral-400 light:text-neutral-500 uppercase tracking-tighter">
                            {content.secondaryActions.connect}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}
