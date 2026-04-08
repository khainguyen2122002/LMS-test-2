"use client"

import React from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from "@/components/layout/Sidebar"
import { TopNavbar } from "@/components/layout/TopNavbar"
import { DashboardContent } from "@/lib/content"

interface LayoutWrapperProps {
  children: React.ReactNode
  sidebarContent: DashboardContent['sidebar']
  topNavContent: DashboardContent['topNav']
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ 
  children, 
  sidebarContent, 
  topNavContent 
}) => {
  const pathname = usePathname()
  
  // Routes where sidebar/navbar should be hidden
  const isAuthPage = pathname === '/login'
  const isStudentPage = pathname.startsWith('/student')
  const isLearnPage = pathname.startsWith('/learn')
  const isPublicHome = pathname === '/'

  if (isAuthPage || isStudentPage || isLearnPage || isPublicHome) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        {children}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Fixed Sidebar - 260px */}
      <Sidebar content={sidebarContent} />

      {/* Main area - shifts right by sidebar width */}
      <div className="flex-1 ml-[260px]">
        {/* Fixed Top Navbar */}
        <TopNavbar content={topNavContent} />

        {/* Scrollable Main Content */}
        <main className="pt-16 pb-12">
          <div className="max-w-[1400px] mx-auto px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
