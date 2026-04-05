"use client"

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react'
import { User, getAllUsers, UserRole, UserStatus } from '@/lib/user-service'
import { toast } from 'sonner'

export type FilterType = 'Tất cả' | 'Học viên' | 'Giảng viên' | 'Admin' | UserStatus

interface UserContextValue {
  users: User[]
  loading: boolean
  searchQuery: string
  activeFilter: FilterType
  activePage: number
  itemsPerPage: number
  
  filteredUsers: User[]
  paginatedUsers: User[]
  totalPages: number
  totalUsersCount: number
  studentCount: number
  teacherCount: number
  adminCount: number
  
  setSearchQuery: (query: string) => void
  setActiveFilter: (filter: FilterType) => void
  setActivePage: (page: number) => void
  refreshUsers: () => Promise<void>
}

const UserContext = createContext<UserContextValue | null>(null)

export const useUsers = () => {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUsers must be used within a UserProvider')
  return ctx
}

const ROLE_MAP: Record<string, string> = {
  'Học viên': 'learner',
  'Giảng viên': 'instructor',
  'Admin': 'admin',
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('Tất cả')
  const [activePage, setActivePage] = useState(1)
  const itemsPerPage = 8

  const refreshUsers = useCallback(async () => {
    setLoading(true)
    const data = await getAllUsers()
    setUsers(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refreshUsers()
  }, [refreshUsers])

  // Compute derived state
  const { 
    filteredUsers, 
    totalUsersCount, 
    studentCount, 
    teacherCount, 
    adminCount 
  } = useMemo(() => {
    const studentCount = users.filter((u) => u.role === 'learner').length
    const teacherCount = users.filter((u) => u.role === 'instructor').length
    const adminCount = users.filter((u) => u.role === 'admin').length
    const totalUsersCount = users.length

    // Filter logic
    let temp = users
    if (activeFilter !== 'Tất cả') {
      const dbRole = ROLE_MAP[activeFilter]
      if (dbRole) {
        temp = temp.filter((u) => u.role === dbRole)
      } else {
        temp = temp.filter((u) => u.status === activeFilter)
      }
    }

    // Search logic
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      temp = temp.filter(
        (u) =>
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q)
      )
    }

    return { filteredUsers: temp, totalUsersCount, studentCount, teacherCount, adminCount }
  }, [users, activeFilter, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage))
  const paginatedUsers = useMemo(() => {
    const start = (activePage - 1) * itemsPerPage
    return filteredUsers.slice(start, start + itemsPerPage)
  }, [filteredUsers, activePage, itemsPerPage])

  useEffect(() => {
    if (activePage > totalPages) {
      setActivePage(totalPages)
    }
  }, [totalPages, activePage])

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        searchQuery,
        activeFilter,
        activePage,
        itemsPerPage,
        filteredUsers,
        paginatedUsers,
        totalPages,
        totalUsersCount,
        studentCount,
        teacherCount,
        adminCount,
        setSearchQuery,
        setActiveFilter,
        setActivePage,
        refreshUsers
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
