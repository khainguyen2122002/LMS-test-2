"use client"

import { useQuery } from '@tanstack/react-query'
import { getCurrentUser, User } from '@/lib/user-service'

export function useProfile() {
  return useQuery<User | null>({
    queryKey: ['profile'],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 10, // 10 minutes cache for profile
  })
}
