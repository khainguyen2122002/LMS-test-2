"use client"

import React, { useEffect, useState } from 'react'
import { useAuth } from './AuthProvider'
import { useRouter, usePathname } from 'next/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ('admin' | 'instructor' | 'learner')[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { profile, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (loading) return

    if (!profile) {
      // Not logged in -> Redirect to login
      // Add a returnUrl so they can come back after login
      router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`)
      return
    }

    if (allowedRoles && allowedRoles.length > 0) {
      const role = profile.role as 'admin' | 'instructor' | 'learner'
      if (!allowedRoles.includes(role)) {
        // Logged in but insufficient permissions
        if (role === 'learner') {
          router.replace('/student/dashboard')
        } else {
          router.replace('/admin/dashboard')
        }
        return
      }
    }

    setIsAuthorized(true)
  }, [profile, loading, allowedRoles, router, pathname])

  // Show a blank/loading screen while checking auth to prevent flashing unauthorized content
  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111111]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffb957]"></div>
      </div>
    )
  }

  return <>{children}</>
}
