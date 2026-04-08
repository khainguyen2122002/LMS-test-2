"use client"

import React from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Sidebar } from "@/components/layout/Sidebar"
import { TopNavbar } from "@/components/layout/TopNavbar"
import { dashboardContent } from "@/lib/content"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['admin', 'instructor']}>
      <div className="flex min-h-screen bg-[var(--background)]">
        {/* Fixed Sidebar - 260px */}
        <Sidebar content={dashboardContent.sidebar} />

        {/* Main area - shifts right by sidebar width */}
        <div className="flex-1 ml-[260px]">
          {/* Fixed Top Navbar */}
          <TopNavbar content={dashboardContent.topNav} />

          {/* Scrollable Main Content */}
          <main className="pt-16 pb-12">
            <div className="max-w-[1400px] mx-auto px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
