"use client"

import React from 'react'
import { TrendingUp, Users2, LucideIcon } from 'lucide-react'

interface StatCardProps {
    label: string;
    value: string;
    trend?: string;
    trendValue?: string;
    progress?: number;
    icon: LucideIcon;
    variant?: 'emerald' | 'amber';
}

export const StatCard: React.FC<StatCardProps> = ({ 
    label, value, trend, trendValue, progress, icon: Icon, variant = 'emerald' 
}) => {
    return (
        <div className="dark:bg-[#1A1A1A] light:bg-white p-6 rounded-xl flex flex-col justify-between h-[160px] border border-[var(--border)] shadow-lg group hover:dark:border-white/10 light:border-black/10 transition-all">
            <div className="flex justify-between items-start">
                <p className="text-neutral-500 text-[10px] font-bold tracking-widest uppercase">{label}</p>
                <Icon className={variant === 'amber' ? 'text-secondary' : 'text-emerald-400'} size={20} />
            </div>
            <div>
                <h3 className="text-4xl font-bold dark:text-white light:text-neutral-900 mb-2">{value}</h3>
                {progress !== undefined && (
                    <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-secondary rounded-full shadow-[0_0_12px_rgba(255,185,87,0.3)]" 
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
                {trendValue && (
                    <div className="flex items-center gap-2">
                        <span className="text-emerald-400 text-xs font-bold">{trendValue}</span>
                        <span className="text-neutral-500 text-xs">{trend}</span>
                    </div>
                )}
            </div>
            {trend && !trendValue && (
                <p className="text-[10px] dark:text-neutral-400 light:text-neutral-500 mt-2 italic">{trend}</p>
            )}
        </div>
    )
}
