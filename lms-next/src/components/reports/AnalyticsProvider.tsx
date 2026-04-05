"use client"

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react'
import { AnalyticsState, initialAnalytics, GrowthDataPoint, RoleData, PopularCourseData, ActivityData } from '@/lib/analytic-service'
import { toast } from 'sonner'

interface AnalyticsContextValue extends AnalyticsState {
  simulateCourseCompletion: () => void
  simulateNewUser: () => void
  simulateCourseEnroll: () => void
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null)

export const useAnalytics = () => {
  const ctx = useContext(AnalyticsContext)
  if (!ctx) throw new Error('useAnalytics must be used within AnalyticsProvider')
  return ctx
}

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AnalyticsState>(initialAnalytics)

  // Simulation Actions
  const simulateCourseCompletion = useCallback(() => {
    setState(prev => {
      // Pick the last month to increment
      const updatedGrowth = [...prev.growthData]
      const lastIndex = updatedGrowth.length - 1
      updatedGrowth[lastIndex] = {
        ...updatedGrowth[lastIndex],
        completed: updatedGrowth[lastIndex].completed + 1
      }
      
      const newTotalCompleted = prev.totalCompletedUsers + 1
      const newRate = Math.min(100, Math.round((newTotalCompleted / prev.totalUsers) * 100))

      const newActivity: ActivityData = {
        id: Math.random().toString(36).substr(2, 6),
        user: 'Học viên ẩn danh',
        action: 'vừa hoàn thành khóa học',
        course: 'Mô phỏng tự động',
        time: 'Vừa xong'
      }

      toast.success('Học viên vừa hoàn thành một khóa học!')

      return {
        ...prev,
        totalCompletedUsers: newTotalCompleted,
        completionRate: newRate,
        growthData: updatedGrowth,
        recentActivities: [newActivity, ...prev.recentActivities.slice(0, 4)]
      }
    })
  }, [])

  const simulateNewUser = useCallback(() => {
    setState(prev => {
      const updatedGrowth = [...prev.growthData]
      const lastIndex = updatedGrowth.length - 1
      updatedGrowth[lastIndex] = {
        ...updatedGrowth[lastIndex],
        newUsers: updatedGrowth[lastIndex].newUsers + 1
      }
      
      const newTotalUsers = prev.totalUsers + 1
      
      // Update role distribution
      const updatedRoles = [...prev.roleDistribution]
      updatedRoles[0] = { ...updatedRoles[0], count: updatedRoles[0].count + 1 } // add to "Học viên"

      const newActivity: ActivityData = {
        id: Math.random().toString(36).substr(2, 6),
        user: 'Người dùng mới',
        action: 'vừa tham gia hệ thống',
        time: 'Vừa xong'
      }

      toast.success('Có người dùng mới vừa đăng ký!')

      return {
        ...prev,
        totalUsers: newTotalUsers,
        growthData: updatedGrowth,
        roleDistribution: updatedRoles,
        recentActivities: [newActivity, ...prev.recentActivities.slice(0, 4)]
      }
    })
  }, [])

  const simulateCourseEnroll = useCallback(() => {
    setState(prev => {
      const updatedPopular = [...prev.popularCourses]
      // Pick the first course to boost
      updatedPopular[0] = {
        ...updatedPopular[0],
        students: updatedPopular[0].students + 5
      }

      const newActivity: ActivityData = {
        id: Math.random().toString(36).substr(2, 6),
        user: 'Nhiều người',
        action: 'đã đăng ký khóa học',
        course: updatedPopular[0].title,
        time: 'Vừa xong'
      }

      toast.success(`Khóa học ${updatedPopular[0].title} vừa được đăng ký!`)

      return {
        ...prev,
        courseViews: prev.courseViews + 12,
        popularCourses: updatedPopular,
        recentActivities: [newActivity, ...prev.recentActivities.slice(0, 4)]
      }
    })
  }, [])

  return (
    <AnalyticsContext.Provider
      value={{
        ...state,
        simulateCourseCompletion,
        simulateNewUser,
        simulateCourseEnroll,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  )
}
