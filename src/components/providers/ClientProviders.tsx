"use client"

import React from 'react'
import QueryProvider from './QueryProvider'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { SettingsProvider } from '@/components/settings/SettingsProvider'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { UserProvider } from '@/components/users/UserProvider'
import { NotificationProvider } from '@/components/notifications/NotificationProvider'
import { MaintenanceBanner } from '@/components/settings/MaintenanceBanner'
import { Toaster } from 'sonner'
import { LayoutWrapper } from '@/components/layout/LayoutWrapper'
import { dashboardContent } from '@/lib/content'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <SettingsProvider>
        <AuthProvider>
          <ThemeProvider>
            <UserProvider>
              <NotificationProvider>
                <MaintenanceBanner />
                <LayoutWrapper 
                  sidebarContent={dashboardContent.sidebar} 
                  topNavContent={dashboardContent.topNav}
                >
                  {children}
                </LayoutWrapper>
                <Toaster position="bottom-right" richColors theme="system" />
              </NotificationProvider>
            </UserProvider>
          </ThemeProvider>
        </AuthProvider>
      </SettingsProvider>
    </QueryProvider>
  )
}
