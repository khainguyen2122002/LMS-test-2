"use client"

import { useAuth as useAuthFromProvider } from '@/components/auth/AuthProvider'

/**
 * Hook to access the authentication context.
 * Provides user, session, profile, and auth methods.
 */
export const useAuth = () => {
  return useAuthFromProvider()
}
