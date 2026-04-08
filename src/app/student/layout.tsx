import React from 'react'
import { StudentSidebar } from '@/components/layout/student/StudentSidebar'
import { StudentTopNavbar } from '@/components/layout/student/StudentTopNavbar'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['learner']}>
      <div className="flex min-h-screen text-[var(--foreground)]" style={{ background: 'var(--background)' }}>
      {/* Fixed Sidebar - 280px */}
      <StudentSidebar />

      {/* Main area - shifts right by sidebar width */}
      <div className="flex-1 lg:ml-[280px] flex flex-col min-h-screen">
        <StudentTopNavbar />
        <main className="flex-1 px-4 lg:px-8 py-6 w-full max-w-[1440px] mx-auto">
          {children}
        </main>
      </div>
    </div>
    </ProtectedRoute>
  )
}
