"use client"

import React from 'react'

interface LayoutWrapperProps {
  children: React.ReactNode
  sidebarContent: any
  topNavContent: any
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
      {children}
    </div>
  )
}
