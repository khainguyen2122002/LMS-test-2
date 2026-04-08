"use client"

import React from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['learner']}>
      <div className="min-h-screen bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  )
}
