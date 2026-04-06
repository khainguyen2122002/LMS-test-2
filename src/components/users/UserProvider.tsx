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
  addManyUsers: (newUsers: User[]) => Promise<void>
  addUser: (userData: Partial<User>) => Promise<void>
  updateUser: (id: string, userData: Partial<User>) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  resetToDefault: () => Promise<void>
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
    localStorage.setItem('inspiring_hr_users', JSON.stringify(data))
    setLoading(false)
  }, [])

  // 1. Initial Load: Try localStorage first
  useEffect(() => {
    const saved = localStorage.getItem('inspiring_hr_users')
    if (saved) {
      try {
        setUsers(JSON.parse(saved))
        setLoading(false)
      } catch (e) {
        refreshUsers()
      }
    } else {
      refreshUsers()
    }
  }, [refreshUsers])

  // 2. Persistence: Save state on every change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('inspiring_hr_users', JSON.stringify(users))
    }
  }, [users])

  // Compute derived state
  const { 
    filteredUsers, 
    totalUsersCount, 
    studentCount, 
    teacherCount, 
    adminCount 
  } = useMemo(() => {
    const studentCount = users.filter((u) => u.role === 'learner' && u.status === 'Hoạt động').length
    const teacherCount = users.filter((u) => u.role === 'instructor' && u.status === 'Hoạt động').length
    const adminCount = users.filter((u) => u.role === 'admin' && u.status === 'Hoạt động').length
    const totalUsersCount = users.filter((u) => u.status === 'Hoạt động').length

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

  const addManyUsers = useCallback(async (newUsers: User[]) => {
    // In a real app, this would call a backend service to create auth users.
    // For now, we update local state to satisfy the UI and build.
    setUsers(prev => [...newUsers, ...prev])
    toast.success(`Đã nhập ${newUsers.length} người dùng vào danh sách hiển thị.`)
  }, [])

  const addUser = async (userData: Partial<User>) => {
    // Mock implementation
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: userData.fullName || 'Người dùng mới',
      email: userData.email || '',
      role: userData.role || 'learner',
      coursesCount: 0,
      joinDate: new Date().toLocaleDateString('vi-VN'),
      status: userData.status || 'Hoạt động',
    }
    setUsers(prev => [newUser, ...prev])
    toast.success('Thêm người dùng thành công!')
  }

  const updateUser = async (id: string, userData: Partial<User>) => {
    // Mock implementation
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...userData } : u))
    toast.success('Cập nhật người dùng thành công!')
  }

  const deleteUser = async (id: string) => {
    // Mock implementation
    setUsers(prev => prev.filter(u => u.id !== id))
    toast.success('Đã xóa người dùng!')
  }

  const resetToDefault = async () => {
    localStorage.removeItem('inspiring_hr_users')
    await refreshUsers()
    toast.info('Đã khôi phục dữ liệu gốc từ hệ thống.')
  }

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
        refreshUsers,
        addManyUsers,
        addUser,
        updateUser,
        deleteUser,
        resetToDefault
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
